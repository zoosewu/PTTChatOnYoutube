import { InitApp } from '../../app/appindex.js';
import { BootStrap } from '../../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver, clone, ThemeCheck } from '../../library.js';

export function InitlineTV(messageposter) {
  const msg = messageposter;
  let WhiteTheme = true;
  //Check Theme
  //setTimeout(() => { WhiteTheme = ThemeCheck('mat-drawer-container', 'rgb(250, 250, 250)'); }, 100);

  let tryinsholotools = 20;
  setTimeout(ChechChatInstanced, 1000);
  function ChechChatInstanced() {
    if (tryinsholotools >= 0) {
      TryInsChat3();
      setTimeout(ChechChatInstanced, 1000);
    }
  }
  function TryInsChat() {
    const defaultVideo = $(".__video_screen");
    if (defaultVideo.length > 0) {
      const parent = defaultVideo[0].parentElement;
      if (reportmode) console.log("parent", parent, "defaultVideo", defaultVideo);
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);
      const defaultVideoHandler = $(`<div id="videohandler" style="flex:1 1 auto;"></div>`);
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ` + pluginwidth + `px;position:relative;"></div>`);
      defaultVideo.append(PTTChatHandler);
      InitApp(PTTChatHandler, WhiteTheme, true, msg, true);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
  function TryInsChat2() {
    const parent = $('body');
    const defaultVideo = $('#article_video.wrap.video.with-gnb.article.with-hubHeader');
    if (reportmode) console.log("parent", parent, "defaultVideo", defaultVideo);
    if (parent.length > 0 && defaultVideo.length > 0) {
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const headerspace = $(".hubHeader.miniHub")[0].clientHeight;
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0" style="width: ` + pluginwidth + `px;position:fixed;right:0px;top:` + headerspace + `px;"></div>`);
      parent.append(PTTChatHandler);
      InitApp(PTTChatHandler, WhiteTheme, true, msg, true);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
  function TryInsChat3() {
    const parent = $('body');
    const defaultVideo = $('#article_video.wrap.video.with-gnb.article.with-hubHeader');
    if (reportmode) console.log("parent", parent, "defaultVideo", defaultVideo);
    if (parent.length > 0 && defaultVideo.length > 0) {
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const container = $(`<div id="container" class="container-fluid"></div>`);
      const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);
      const defaultVideoHandler = $(`<div id="videohandler" style="flex:1 1 auto;"></div>`);
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ` + pluginwidth + `px;position:relative;"></div>`);
      parent.append(container);
      container.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      InitApp(PTTChatHandler, WhiteTheme, true, msg, true);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
}