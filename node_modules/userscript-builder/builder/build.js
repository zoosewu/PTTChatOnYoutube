'use strict';
const fs = require('fs');
const path = require('path');
const os = require('os');
const minimist = require('minimist');

const inlineCss = require('./inline-css');
const prepareJs = require('./prepare-js');
const fileHelper = require('./file-helper');
const getMeta = require('./get-meta');
const config = require('./config');
const version = require('./version');

const files = {
  js: [],
  css: [],
  visited: []
};

function createFolderAndFile(isRelease) {
  const outFolder = path.join(process.cwd(), isRelease ? config.release : config.dev);
  const outFileName = path.join(outFolder, `${config.fileName}.user.js`);

  if (!fs.existsSync(outFolder)) {
    fs.mkdirSync(outFolder);
  }

  if (fs.existsSync(outFileName)) {
    fs.unlinkSync(outFileName);
  }

  return outFileName;
}

function build() {
  const argv = minimist(process.argv.slice(2));
  const newversion = version.increase(config.meta.version, argv['mode']);
  const isRelease = newversion !== config.meta.version;

  console.log(`Build in ${isRelease ? 'release-' : ''}${argv['mode']} mode`);

  config.meta.version = newversion;
  buildTree(config.entry);
  fs.writeFileSync(createFolderAndFile(isRelease), getOutFile(!isRelease));

  if (isRelease) {
    version.save(newversion);
    console.log(`Build finished${os.EOL}Version: \x1b[36m${newversion}\x1b[0m`);
  } else {
    console.log('Build finished');
  }
}

function getExistingFilePath(filePath, normalizedFilePath, parentPath) {
  if (fs.existsSync(filePath)) {
    return filePath;
  }

  if (fs.existsSync(normalizedFilePath)) {
    return normalizedFilePath;
  }

  throw new Error(`${parentPath} tries to import unreachable file ${filePath}`);
}

function buildTree(filePath, parentPath) {
  // Get full file name
  if (parentPath) {
    filePath = path.join(parentPath, '..', filePath);
  }

  const normalizedFilePath = fileHelper.normalizeFileName(filePath);

  if (isFileProcessed(filePath, normalizedFilePath)) {
    return;
  }

  filePath = getExistingFilePath(filePath, normalizedFilePath, parentPath);

  const file = fs.readFileSync(filePath).toString();
  // Mark file as processed
  files.visited.push(filePath);
  getImports(file).forEach(imprt => buildTree(imprt, filePath));

  if (/\.css$/g.test(filePath)) {
    files.css.push({file, filePath: fileHelper.revertSlashes(filePath)});
  } else {
    files.js.push({file: prepareJs(file), filePath: fileHelper.revertSlashes(filePath)});
  }
}

function isFileProcessed(filePath, normalizedFilePath) {
  return files.visited.includes(filePath) || files.visited.includes(normalizedFilePath);
}

function getImports(file) {
  const importRegex = /^[\t\r ]*import.+['"];$/gm;
  const imports = [];
  let matches;

  while ((matches = importRegex.exec(file)) !== null) {
    imports.push(getImportPath(matches[0]));
  }

  return imports;
}

function getImportPath(imprt) {
  return imprt.split(/['"]/g)[1];
}

function getOutFile(addFilePathComments) {
  let out = getMeta();

  console.log('\x1b[33m%s\x1b[0m', 'Concat js files');

  files.js.forEach(file => {
    const filePath = file.filePath.replace(/^\.\//g, '');

    console.log(`${filePath}`);
    out += os.EOL + os.EOL;

    if (addFilePathComments) {
      out += `// ${filePath}${os.EOL}`;
    }

    out += file.file;
  });

  if (files.css.length) {
    console.log('\x1b[33m%s\x1b[0m', 'Concat css files');
    out += inlineCss(files.css, addFilePathComments, filePath => console.log(filePath));
  }

  return out;
}

module.exports = build;
