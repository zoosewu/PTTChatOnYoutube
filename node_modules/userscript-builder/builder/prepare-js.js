'use strict';

function prepareJs(file, isRemoveComments) {
  const regexps = [
    '^[\\t\\r ]*import.+[\'"];$', // imports
    '^export +(?:default +)*'     // exports
  ];

  if (isRemoveComments) {
    regexps.push(' *\\/\\*[\\s\\S]*?\\*\\/ *\\r?\\n'); // Multyline comments
    regexps.push('^ *\\/\\/[\\s\\S]*?$\\r?\\n'); // Single line comments full line
    regexps.push(' *\\/\\/[\\s\\S]*?$'); // Single line comments not full line
  }

  return file.split(new RegExp(regexps.join('|'), 'gm')).join('').trim();
}

module.exports = prepareJs;
