
import { InitApp } from '../app/index.js';
export function InitHolotoolsScript() {
  let WhiteTheme;
  //generate crypt key everytime;
  cryptkey = GenerateCryptKey();
  //add bootstrap to use
  AddBootstrap(document);
  //AddPTTAppcss(whitetheme, colorlight, colordark)
  AddPTTAppcss(true, "rgb(249, 249, 249)", "rgb(24, 24, 24)")
  //PTTApp global css
  setTimeout(() => {
    const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
    const colorlight = "rgb(249, 249, 249)";
    const colordark = "rgb(24, 24, 24)";
    WhiteTheme = !(YTbgcolor === colordark);
    AddPTTAppcss(WhiteTheme, colorlight, colordark);
  }, 100);

  const PTTcss = `pttdiv{
      font-size: 12px;
    }
    .form-control,.btn{ 
      font-size: 1em;
    }
    .btn{ 
      padding-top: 0.375em;
      padding-right: 0.75em;
      padding-bottom: 0.375em;
      padding-left: 0.75em;
    }
    .p-4{ 
      padding: 15px;
    }`
    ;
  AddStyle(PTTcss);
  //run app instance loop
  setTimeout(ChechChatInstanced, 3000);
  function ChechChatInstanced() {
    const parent = $(`.container-watch`);
    const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);

    const defaultVideoHandler = $(`<div id="holotoolsvideohandler" class="flex-grow-1"></div>`);
    const defaultVideo = $(`.player-container.hasControls`);

    const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="width:400px;position:relative;"></div>`);
    parent.append(fakeparent);

    fakeparent.append(defaultVideoHandler);
    defaultVideoHandler.append(defaultVideo);

    fakeparent.append(PTTChatHandler);
    $(`.reopen-toolbar`).css({ "z-index": "302" });

    InitApp(PTTChatHandler, WhiteTheme, true);
  }
}