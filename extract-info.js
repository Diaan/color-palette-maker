import fg from 'fast-glob';
import fs from 'fs';
import { resolve } from 'path';
import Jimp from 'jimp';

const cwd = new URL('.', import.meta.url).pathname;

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

const getYarnInfo = async yarn => {
  const fullPath = resolve(yarn, 'info.json');
  const images = await fg(resolve(`${yarn}/images/*`), { cwd });
  const colors = await Promise.all(images.map(img => readColor(img, yarn.replace('public/yarns/',''))));
  fs.writeFileSync(`${yarn}/colors.json`, `${JSON.stringify({ colors}, null, 2)}\n`);

  try {
    const source = fs.readFileSync(fullPath).toString();
    const {company, name, weight, palette} = JSON.parse(source)
    return {
      company, 
      name: name || yarn.replace('public/yarns/',''), 
      weight, 
      folder: yarn.replace('public/yarns/',''),
      color:palette.length
    }
  } catch (error) {
    console.error(`😳 Error: File ${fullPath} not found`); 
    
  }
}

const readColor = (image, yarn) => {
  return Jimp.read(image).then(img => {
    const pxs = 4
    const w = img.bitmap.width;
    const h = img.bitmap.height;
    img.pixelate(w/pxs);
    
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

  const extracted = await Promise.all(yarns.map(yarn => getYarnInfo(yarn)).filter(p => !!p));
  console.log(`Extracted info for ${extracted.length} yarns`);
  fs.writeFileSync('public/yarns.json', `${JSON.stringify({ yarns:extracted}, null, 2)}\n`);

};

buildPatterns();
buildYarns();
// await getYarnInfo('public/yarns/rosarios4-terra');


// to read colors from images:
// https://www.npmjs.com/package/jimp
