'use strict';

const extensions = [
  'js',
  'css'
];

function isContainsExtension(filename, ext) {
  // we need check if extension with dot are last characters in filename
  // not sure if it is a good solution but it doesn't create any regexp
  const dotExt = '.' + ext;
  const extLength = dotExt.length;
  const offset = filename.length - extLength;

  return filename.indexOf(dotExt, offset) !== -1;
}

function isContainsExtensions(filename, extArr) {
  const filenameLowCase = filename.toLowerCase();
  let result = false;

  if (Array.isArray(extArr)) {
    extArr.forEach(ext => {
      // if result true - we already found extension
      if (!result) {
        result = isContainsExtension(filenameLowCase, ext);
      }
    });
  } else {
    result = isContainsExtension(filenameLowCase, extArr.toString());
  }

  return result;
}

function normalizeFileName(filePath) {
  if (isContainsExtensions(filePath, extensions)) {
    return filePath;
  }

  return filePath + '.js';
}

function revertSlashes(filePath) {
  return filePath.split('\\').join('/');
}

module.exports = {normalizeFileName, revertSlashes};
