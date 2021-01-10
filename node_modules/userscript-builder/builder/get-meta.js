'use strict';
const os = require('os');

const config = require('./config');

function getMeta() {
  let length = 0;
  let result = '';

  for (let key of Object.keys(config.meta)) {
    length = key.length > length ? key.length : length;
  }

  result += '// ==UserScript==' + os.EOL;

  for (let [key, value] of Object.entries(config.meta)) {
    if (Array.isArray(value)) {
      value.forEach(val => result += `${formatCommentString(key, val, length)}${os.EOL}`);
    } else if (value !== '') {
      if (key === 'source') {
        value = value.replace(/^git\+https/, 'https');
      }

      result += `${formatCommentString(key, value, length)}${os.EOL}`;
    }
  }

  result += '// ==/UserScript==';

  return result;
}

function formatCommentString(prop, val, length) {
  if (prop.length < length) {
    const spacer = new Array(length - prop.length).fill(' ');
    prop += spacer.join('');
  }

  return `// @${prop}  ${val}`;
}

module.exports = getMeta;
