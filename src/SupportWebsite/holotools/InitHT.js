
import { InitApp } from '../../app/appindex.js';
import { BootStrap } from '../../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver, clone, ThemeCheck } from '../../library.js';

export function InitHT(messageposter) {
  const msg = messageposter;
  //Check Theme
  let WhiteTheme = ThemeCheck('html', '250, 250, 250');

  //run app instance loop
  let waswatch;
  let iswatch;
  let tryinsholotools = 20;

  (function ChechChatInstanced() {
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
  })();
  function TryInsChat() {
    const parent = $(`.container-watch`);
    if (reportmode) console.log("parent", parent);
    if (parent.length > 0 && iswatch) {
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);
      const defaultVideoHandler = $(`<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>`);
      const defaultVideo = $(`.player-container.hasControls`);
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ` + pluginwidth + `px;position:relative;"></div>`);
      parent.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      $(`.reopen-toolbar`).css({ "z-index": "302" });
      InitApp(PTTChatHandler, WhiteTheme, true, msg, true);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
}