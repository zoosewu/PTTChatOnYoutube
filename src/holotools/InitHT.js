
import { InitApp } from '../app/appindex.js';
import { BootStrap } from '../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver } from '../library.js';

export function InitHT(messageposter) {
  const msg = messageposter;
  let WhiteTheme;
  //generate crypt key everytime;
  cryptkey = GenerateCryptKey();
  //add bootstrap to use
  BootStrap(document);
  //AddPTTAppcss(whitetheme, colorlight, colordark)
  AddStyle(true, "rgb(249, 249, 249)", "rgb(24, 24, 24)")
  //PTTApp global css
  setTimeout(() => {
    const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
    const colorlight = "rgb(249, 249, 249)";
    const colordark = "rgb(24, 24, 24)";
    WhiteTheme = !(YTbgcolor === colordark);
  }, 100);
  //run app instance loop
  setTimeout(ChechChatInstanced, 3000);
  function ChechChatInstanced() {
    const parent = $(`.container-watch`);
    const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);

    const defaultVideoHandler = $(`<div id="holotoolsvideohandler" class="flex-grow-1"></div>`);
    const defaultVideo = $(`.player-container.hasControls`);

    const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="width:500px;position:relative;"></div>`);
    parent.append(fakeparent);

    fakeparent.append(defaultVideoHandler);
    defaultVideoHandler.append(defaultVideo);

    fakeparent.append(PTTChatHandler);
    $(`.reopen-toolbar`).css({ "z-index": "302" });

    InitApp(PTTChatHandler, WhiteTheme, true, msg);
  }
}