const fs = require('fs');
const path = require('path');

const locales = ['en', 'ko', 'ja', 'fr'];
const localeDir = path.join(process.cwd(), 'public', 'locales');

// 영어 파일을 기준으로 키 추출
const enPath = path.join(localeDir, 'en', 'common.json');
const enKeys = getAllKeys(JSON.parse(fs.readFileSync(enPath, 'utf8')));

console.log('Checking translation files...\n');

locales.forEach(locale => {
  const filePath = path.join(localeDir, locale, 'common.json');
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const keys = getAllKeys(content);
  
  const missing = enKeys.filter(key => !keys.includes(key));
  const extra = keys.filter(key => !enKeys.includes(key));
  
  console.log(`\n${locale.toUpperCase()}:`);
  if (missing.length === 0 && extra.length === 0) {
    console.log('  ✅ All keys match');
  } else {
    if (missing.length > 0) {
      console.log(`  ❌ Missing keys (${missing.length}):`, missing.slice(0, 5));
      if (missing.length > 5) console.log(`     ... and ${missing.length - 5} more`);
    }
    if (extra.length > 0) {
      console.log(`  ⚠️  Extra keys (${extra.length}):`, extra.slice(0, 5));
    }
  }
});

function getAllKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      keys.push(...getAllKeys(obj[key], fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}







