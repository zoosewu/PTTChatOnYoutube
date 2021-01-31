
import { InitApp } from '../../app/appindex.js';
import { BootStrap } from '../../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver, clone, ThemeCheck } from '../../library.js';

export function InitTwitch(messageposter) {
  const msg = messageposter;
  //Check Theme
  let WhiteTheme = ThemeCheck('body', 'rgb(247, 247, 248)');

  //run app instance loop
  (function ChechChatInstanced() {
    setTimeout(ChechChatInstanced, 1000);
    TryInsChat();
  })();
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