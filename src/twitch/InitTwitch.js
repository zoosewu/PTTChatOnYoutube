
import { InitApp } from '../app/appindex.js';
import { BootStrap } from '../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver } from '../library.js';

export function InitTwitch(messageposter) {
  const msg = messageposter;
  let WhiteTheme;
  //Check Theme
  setTimeout(() => {
    const YTbgcolor = getComputedStyle($('body')[0]).backgroundColor;
    console.log(YTbgcolor);
    const colorlight = "rgb(247, 247, 248)";
    console.log(YTbgcolor, colorlight, YTbgcolor === colorlight);
    WhiteTheme = YTbgcolor === colorlight;
  }, 100);
  //run app instance loop
  setTimeout(ChechChatInstanced, 1000);
  function ChechChatInstanced() {
    setTimeout(ChechChatInstanced, 1000);
    TryInsChat();
  }
  function TryInsChat() {
    const parent = $("section.chat-room");
    if (reportmode) console.log("parent", parent);
    if (parent.length > 0) {
      const PTTApp = $(`#PTTChat`, parent);
      if (PTTApp.length > 0) { }
      else {
        if (reportmode) console.log("InitApp");
        InitApp(parent, WhiteTheme, true, msg);
      }
    }
  }
}