const fs = require('fs');
let content = fs.readFileSync('scripts/data.js', 'utf8');
content = content.replace(/"level":\s*"Procedures"/g, '"level": "C1"');
fs.writeFileSync('scripts/data.js', content);
console.log('Fixed level: Procedures -> level: C1');
