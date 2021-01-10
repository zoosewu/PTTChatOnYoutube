'use strict';
const fs = require('fs');
const path = require('path');

function increase(version, position) {
  if (!Number.isInteger(position)) {
    switch (position.toLowerCase()) {
      case 'major':
      case 'maj':
        position = 0;
        break;

      case 'minor':
      case 'min':
        position = 1;
        break;

      case 'bugfix':
      case 'bug':
        position = 2;
        break;

      default:
        return version;
    }
  }

  return version
    .split('.')
    .map((value, index) => {
      if (index === position) {
        value = parseInt(value);
        value++;
      } else if (index > position) {
        value = 0;
      }

      return value;
    })
    .join('.');
}

function save(version) {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = require(packageJsonPath);

  packageJson.version = version;

  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

module.exports = {increase, save};
