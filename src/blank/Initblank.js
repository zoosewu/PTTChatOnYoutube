import { InitApp } from '../app/appindex.js';
import { BootStrap } from '../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver } from '../library.js';

export function Initblank(messageposter) {
  const msg = messageposter;
  let WhiteTheme = true;
  //generate crypt key everytime;
  cryptkey = GenerateCryptKey();
  //add bootstrap to use
  BootStrap(document);
  //PTTApp global css
  setTimeout(() => {
    const colorlight = "rgb(249, 249, 249)";
    const colordark = "rgb(24, 24, 24)"
  }, 100);
  //run app instance loop

  //const blankcontainer = $(`<div id="container" class="position-relative" style="width:400px;height:800px;"></div>`)[0];
  const Body = $("body", document)[0];
  Body.innerHTML = `<div id="container" class="position-relative" style="width:400px;height:800px;"></div>`;
  const blankcontainer = $(`#container`);
  InitApp(blankcontainer, WhiteTheme, true, msg);

}