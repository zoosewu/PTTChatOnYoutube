import { InitApp } from '../../app/appindex.js';
import { BootStrap } from '../../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver, clone, ThemeCheck } from '../../library.js';

export function Initblank(messageposter) {
  const msg = messageposter;
  let WhiteTheme = true;
  //Check Theme

  const Body = document.getElementsByTagName("BODY")[0];
  const container = document.createElement("div");
  container.id = "container";
  container.classList.add("position-relative");
  container.setAttribute("style", "width:400px;height:800px;");
  Body.prepend(container);
  //const blankcontainer = document.getElementById(`container`);
  InitApp([container], WhiteTheme, true, msg);
}