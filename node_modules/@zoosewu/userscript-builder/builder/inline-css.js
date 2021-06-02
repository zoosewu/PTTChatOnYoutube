'use strict';
const os = require('os');

function inlineCss(cssArray, addFilePathComments, onFileProgress) {
  let css = '';

  cssArray.forEach((element, index) => {
    index && (css += os.EOL);

    if (addFilePathComments) {
      css += `/* ${element.filePath} */${os.EOL}`;
    }
    let e = element.file.replace(/\\([a-f]|[A-F]|[0-9]){2,4}/g, '\\$&')
    css += e;
    onFileProgress(element.filePath);
  });

  return `

${ addFilePathComments ? '// CSS injection' + os.EOL : ''}(function(){
  const $style = document.createElement('style');

  $style.innerHTML = \`${css}\`;
  switch (document.readyState) {
    case "complete": case "interactive":
      document.body.appendChild($style);
      break;
    default:
      window.addEventListener("DOMContentLoaded", () => { document.body.appendChild($style); });
      break;
  }
})();`;
}

module.exports = inlineCss;
