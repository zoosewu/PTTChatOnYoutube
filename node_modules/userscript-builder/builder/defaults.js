'use strict';

const config = {
  entry: './src/index.js',
  dev: './dist',
  release: './release',
  fileName: 'new-userscript'
};

const meta = {
  name: 'New Userscript',
  namespace: 'http://tampermonkey.net/',
  version: '0.0.0',
  description: 'try to take over the world!',
  author: 'You',
  match: 'http://*/*',
  grant: 'none'
};

module.exports.config = config;
module.exports.meta = meta;
