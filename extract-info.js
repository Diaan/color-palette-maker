import fg from 'fast-glob';
import fs from 'fs';
import { resolve } from 'path';

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

const getYarnInfo = yarn => {
  const fullPath = resolve(yarn, 'info.json');
  
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

const buildYarns = async () => {
  const yarns = await fg('public/yarns/*', { cwd, onlyDirectories: true });

  const extracted = yarns.map(yarn => getYarnInfo(yarn)).filter(p => !!p);
  console.log(`Extracted info for ${extracted.length} yarns`);
  fs.writeFileSync('public/yarns.json', `${JSON.stringify({ yarns:extracted}, null, 2)}\n`);

};

buildPatterns();
buildYarns();
