const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'translations');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));

const getKeys = (obj, prefix = '') => {
  return Object.keys(obj).reduce((res, el) => {
    if (typeof obj[el] === 'object' && obj[el] !== null) {
      return [...res, ...getKeys(obj[el], `${prefix}${el}.`)];
    }
    return [...res, `${prefix}${el}`];
  }, []);
};

const enFile = files.find(f => f === 'en.json');
const enData = JSON.parse(fs.readFileSync(path.join(dir, enFile), 'utf8'));
const enKeys = getKeys(enData);

const report = {};

files.forEach(file => {
  if (file === 'en.json' || !file.match(/^[a-z]{2}\.json$/)) return;
  const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
  const keys = getKeys(data);
  const missing = enKeys.filter(k => !keys.includes(k));
  report[file] = missing.length;
});

console.log("Missing main keys compared to en.json:", report);

// Check properties files
const propFiles = files.filter(f => f.startsWith('properties-'));
const propEn = propFiles.find(f => f === 'properties-en.json');
if (propEn) {
    const propEnData = JSON.parse(fs.readFileSync(path.join(dir, propEn), 'utf8'));
    const propEnKeys = getKeys(propEnData);
    propFiles.forEach(file => {
        if(file === 'properties-en.json') return;
        try {
            const data = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8'));
            const keys = getKeys(data);
            const missing = propEnKeys.filter(k => !keys.includes(k));
            console.log(`Missing keys in ${file}:`, missing.length);
        } catch(e) {
            console.log(`Error parsing ${file}`);
        }
    });
} else {
    console.log("No properties-en.json found. Comparing other properties files against each other is harder, let's just show file sizes.");
}
