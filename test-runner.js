const fs = require('fs');
const path = require('path');
const assert = require('assert');

// CHANGE THIS VALUE IF YOUR TESTS LIVE SOMEWHERE ELSE
const TEST_DIR = 'test';

const results = [];

const checkFile = (file) => {
  const lines = fs.readFileSync(file).toString().split('\n');
  const sets = [];
  const regexD = /describe\('(.*)',/;
  const regexI = /it\('(.*)',/;
  lines.forEach((line) => {
    if (line.includes('describe(')) {
      const match = line.match(regexD);
      if (match) {
        sets.push([match[1]]);
      }
    } else if(line.includes('it(')) {
      const match = line.match(regexI);
      if (match && sets[sets.length -1]) {
        sets[sets.length - 1].push(match[1]);
      }
    }
  });
  sets.forEach((group) => {
    results.push(group);
  })
}

const checkDir = (dir) => {
  const names = fs.readdirSync(dir);
  names.forEach((name) => {
    const fullPath = path.join(dir, name);
    if (fs.statSync(fullPath).isFile() && fullPath.endsWith('test.ts')) {
      return checkFile(fullPath);
    }
    if (fs.statSync(fullPath).isDirectory()) {
      return checkDir(fullPath);
    }
    return undefined;
  });
}

checkDir(TEST_DIR);

for (let i = 0; i < results.length; i++) {
  const group = results[i];
  if (group && group.length > 1) {
    describe(group[0], () => {
      for (let k = 1; k < group.length; k++) {
        it(group[k], () => {
          assert.equal(1, 1);
        })
      }
    })
  }
}
