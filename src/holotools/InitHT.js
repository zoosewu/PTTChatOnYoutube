
import { InitApp } from '../app/appindex.js';
import { BootStrap } from '../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver } from '../library.js';

export function InitHT(messageposter) {
  const msg = messageposter;
  let WhiteTheme;
  //PTTApp global css
  setTimeout(() => {
    const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
    const colorlight = "rgba(250, 250, 250, 0.824)";
    console.log(YTbgcolor, colorlight, YTbgcolor === colorlight);
    WhiteTheme = YTbgcolor === colorlight;
  }, 100);
  //run app instance loop
  let waswatch;
  let iswatch;
  let tryinsholotools = 20;
  setTimeout(ChechChatInstanced, 1000);
  function ChechChatInstanced() {
    setTimeout(ChechChatInstanced, 1000);
    const watchcheck = /https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(window.location.href) || /https:\/\/hololive\.jetri\.co\/#\/watch/.exec(window.location.href);
    if (watchcheck) iswatch = watchcheck[0];
    else iswatch = false;
    if (waswatch !== iswatch && iswatch) {
      tryinsholotools = 20;
    }
    if (tryinsholotools >= 0) {
      TryInsChat();
    }
    waswatch = iswatch;
  }
  function TryInsChat() {
    const parent = $(`.container-watch`);
    if (reportmode) console.log("parent", parent);
    if (parent.length > 0 && iswatch) {
      const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);
      const defaultVideoHandler = $(`<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>`);
      const defaultVideo = $(`.player-container.hasControls`);
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 405px;position:relative;"></div>`);
      parent.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      $(`.reopen-toolbar`).css({ "z-index": "302" });
      InitApp(PTTChatHandler, WhiteTheme, true, msg);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
}