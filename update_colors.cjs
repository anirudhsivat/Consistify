const fs = require('fs');
const path = require('path');

const directory = './src';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  // Replace slate with zinc
  content = content.replace(/slate/g, 'zinc');
  // Replace blue with indigo for a more professional look
  content = content.replace(/blue/g, 'indigo');
  fs.writeFileSync(filePath, content, 'utf8');
}

function traverseDir(dir) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
       traverseDir(fullPath);
    } else {
       if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.css')) {
         replaceInFile(fullPath);
       }
    }
  });
}

traverseDir(directory);
console.log('UI Colors updated successfully.');
