'use strict';
const defaults = require('./defaults');
const path = require('path');

function init() {
  let packageJson;
  let config = null;

  try {
    packageJson = require(path.join(process.cwd(), 'package'));
  } catch (e) {
    console.log('package.json wasn\'t found. Default parameters will be used.');
    console.error(e);
  }

  // default -> package -> userscript
  if (packageJson) {
    const meta = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description,
      author: packageJson.author,
      source: packageJson.repository ? (packageJson.repository.url ? packageJson.repository.url : packageJson.repository) : '',
      license: packageJson.license
    };

    if (packageJson.userscript) {
      config = {...defaults.config, ...packageJson.userscript};
      config.meta = {...defaults.meta, ...meta, ...(packageJson.userscript.meta || {})};
    } else {
      config = {...defaults.config};
      config.meta = {...defaults.meta, ...meta};
    }
  } else {
    config = {...defaults.config, meta: defaults.meta};
  }

  module.exports = config;
}

init();
