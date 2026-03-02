import fg from 'fast-glob';
import fs from 'fs';
import { resolve } from 'path';
let JimpModule;
let Jimp;
try {
  JimpModule = await import('jimp/es');
  Jimp = JimpModule.default || JimpModule;
} catch (e) {
  JimpModule = await import('jimp');
  Jimp = JimpModule.default || JimpModule;
}
const readFn = (Jimp.read && Jimp.read.bind(Jimp)) || (Jimp.Jimp && Jimp.Jimp.read && Jimp.Jimp.read.bind(Jimp.Jimp));

const cwd = new URL('.', import.meta.url).pathname;
const QUICK = process.argv.includes('--quick');
if (QUICK) console.log('Running in QUICK mode: skipping image color extraction');

const getPatternInfo = pattern => {
  const fullPath = resolve(pattern, 'info.json');
  
  try {
    const source = fs.readFileSync(fullPath).toString();
    const {name, designer, colors, thumbnail} = JSON.parse(source)
    return {
      name, 
      designer, 
      thumbnail,
      folder: pattern.replace('public/patterns/',''),
      colorAmount:colors.length
    }
  } catch (error) {
    console.error(`😳 Error: File ${fullPath} not found`); 
    
  }
}

const buildPatterns = async () => {
  const patterns = await fg('public/patterns/*', { cwd, onlyDirectories: true });

  const extracted = patterns.map(pattern => getPatternInfo(pattern)).filter(p => !!p);
  console.log(`Extracted info for ${extracted.length} patterns`);
  fs.writeFileSync('public/patterns.json', `${JSON.stringify({ patterns:extracted}, null, 2)}\n`);

};

const getYarnInfo = async (yarn, quick = false) => {
  const fullPath = resolve(yarn, 'info.json');
  if (quick) {
    try {
      const source = fs.readFileSync(fullPath).toString();
      const parsed = JSON.parse(source);
      const company = parsed.company;
      const name = parsed.name || yarn.replace('public/yarns/','');
      const weight = parsed.weight;
      // Prefer an existing colors.json if present (generated earlier), otherwise fall back to `palette` in info.json
      let paletteLen = 0;
      try {
        const colorsPath = resolve(`${yarn}/colors.json`);
        if (fs.existsSync(colorsPath)) {
          const csrc = fs.readFileSync(colorsPath).toString();
          const cjson = JSON.parse(csrc);
          paletteLen = Array.isArray(cjson.colors) ? cjson.colors.length : 0;
        } else if (Array.isArray(parsed.palette)) {
          paletteLen = parsed.palette.length;
        } else {
          paletteLen = parsed.colorAmount || 0;
        }
      } catch (e) {
        paletteLen = Array.isArray(parsed.palette) ? parsed.palette.length : (parsed.colorAmount || 0);
      }
      return {
        company,
        name,
        weight,
        folder: yarn.replace('public/yarns/',''),
        colorAmount: paletteLen
      };
    } catch (error) {
      console.error(`😳 Error: File ${fullPath} not found`);
      return;
    }
  }

  const images = await fg(resolve(`${yarn}/images/*`), { cwd });
  const colors = await Promise.all(images.map(img => readColor(img, yarn.replace('public/yarns/',''))));
  fs.writeFileSync(`${yarn}/colors.json`, `${JSON.stringify({ colors}, null, 2)}\n`);

  try {
    const source = fs.readFileSync(fullPath).toString();
    const {company, name, weight} = JSON.parse(source)
    return {
      company, 
      name: name || yarn.replace('public/yarns/',''), 
      weight, 
      folder: yarn.replace('public/yarns/',''),
      colorAmount:colors.length
    }
  } catch (error) {
    console.error(`😳 Error: File ${fullPath} not found`); 
  }
}

const readColor = (image, yarn) => {
  return readFn(image).then(img => {
    const pxs = 4
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    img.crop({ x: 3, y: 3, w: w - 6, h: h - 6 });
    img.pixelate(Math.floor(w/pxs));
    
    const nrOfPixels = pxs*(h/(w/pxs));
    const values = [];
    for (let index = 1; index < nrOfPixels; index++) {
      const x = Math.floor(index/pxs)*(w/pxs);
      const y = index%pxs*(w/pxs);
      values.push(Jimp.intToRGBA(img.getPixelColor(x, y)));
    }
    const r = Math.floor(values.reduce((n, {r}) => n + r, 0)/nrOfPixels);
    const g = Math.floor(values.reduce((n, {g}) => n + g, 0)/nrOfPixels);
    const b = Math.floor(values.reduce((n, {b}) => n + b, 0)/nrOfPixels);
    // console.log(yarn);
    return {
      image: getFilePath(image),
      name: getPrettyName(image),
      color: `rgb(${r},${g},${b})`,
      yarn: yarn
    };
  });
}


const getFilePath = path => {
  const parts = path.split('/');
  const start = parts.indexOf('yarns');
  return '/'+parts.slice(start).join('/');
}
const getPrettyName = path => {
  const parts = path.split('/');
  return parts[parts.length-1].split('.')[0].replace('-',' ').replace('_',' ');
}

const buildYarns = async () => {
  const yarns = await fg('public/yarns/*', { cwd, onlyDirectories: true });

  const extracted = (await Promise.all(yarns.map(yarn => getYarnInfo(yarn, QUICK)).filter(p => !!p))).filter(p => p.colorAmount > 0);
  console.log(`Extracted info for ${extracted.length} yarns`);
  fs.writeFileSync('public/yarns.json', `${JSON.stringify({ yarns:extracted}, null, 2)}\n`);

};

buildPatterns();
buildYarns();
// await getYarnInfo('public/yarns/rosarios4-terra');


// to read colors from images:
// https://www.npmjs.com/package/jimp
