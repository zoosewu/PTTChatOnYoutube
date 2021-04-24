
import { InitApp } from '../../app/appindex.js';
import { BootStrap } from '../../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver, clone, ThemeCheck } from '../../library.js';

export function InitHT(messageposter) {
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
    const theme = $('html:eq(0)').hasClass("md-theme-hololight") ? "hololight" : "holodark";
    if (reportmode) console.log("parent", parent);
    if (parent.length > 0 && iswatch) {
      const iconParent = $('.live-control-button:eq(0)');
      const icon = $('<i data-v-2989253e="" class="md-icon md-icon-font md-theme-' + theme + '" data-toggle="collapse" data-target="#PTTMain">local_parking</i>');
      iconParent.append(icon);
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const pluginwidth0 = "0";
      let now = pluginwidth0;
      iconParent.on('click', function () {
        now = (now === pluginwidth0 ? pluginwidth : pluginwidth0);
        $('#pttchatparent').css("flex", "0 0 " + now + "px");
        const defaultTypesettingBtn = $(`.md-icon.md-icon-font:eq(${$('.md-icon.md-icon-font').length - 6})`);
        defaultTypesettingBtn.trigger("click");
      })
      const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);
      const defaultVideoHandler = $(`<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>`);
      const defaultVideo = $(`.player-container.hasControls`);
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>`);
      parent.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      $(`.reopen-toolbar`).css({ "z-index": "302" });
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, true);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
}
