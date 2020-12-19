import { InitApp } from '../app/appindex.js';
import { BootStrap } from '../BootStrap.js';
import { AddStyle, GenerateCryptKey, paddingLeft, paddingRight, dateReviver } from '../library.js';
import { AddCss } from '../AddCss.js';
'use strict';

export function InitYT(messageposter) {
  const msg = messageposter;
  let WhiteTheme;
  //generate crypt key everytime;
  cryptkey = GenerateCryptKey();
  //add bootstrap to use
  BootStrap(document);
  //PTTApp global css
  setTimeout(() => {
    const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
    const colorlight = "rgb(249, 249, 249)";
    const colordark = "rgb(24, 24, 24)"
    WhiteTheme = !(YTbgcolor === colordark);
    AddCss(WhiteTheme, colorlight, colordark);
  }, 100);
  //避免bootstrap汙染YT
  const PTTcss2 = `pttdiv{ 
        font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";
        font-size: 1rem;
        font-weight: 400;
        line-height: 1.5;
        color: #212529;
        text-align: left;
        background-color: #fff;        
        -webkit-tap-highlight-color: transparent;
      }
      body {
        font-family: Roboto, Arial, sans-serif;
        font-size: 1rem;
        font-weight: 400;
        line-height: normal;
        color: rgb(0, 0, 0);
        text-align: start;
        background-color: rgba(0, 0, 0, 0);
      }
      #primary,#secondary{  box-sizing: content-box;}
      html {
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0.18);
      }`;
  AddStyle(PTTcss2);
  //run app instance loop
  setTimeout(ChechChatInstanced, 3000);
  function ChechChatInstanced() {
    if (/www\.youtube\.com\/watch\?v=/.exec(window.location.href) === null) {
      if (showalllog) console.log("not watch video.");
      setTimeout(ChechChatInstanced, 2000);
      return;
    }
    const ChatContainer = $(`ytd-live-chat-frame`);
    const defaultChat = $(`iframe`, ChatContainer);
    const PTTApp = $(`#PTTChat`, ChatContainer);
    if (PTTApp.length > 0) {
      if (showalllog) console.log("PTTApp already instanced.");
      setTimeout(ChechChatInstanced, 5000);
      return;
    }
    else if (defaultChat.length > 0) {
      if (showalllog) console.log("PTTApp frame instance!");
      ChatContainer.css({ "position": "relative" });

      //生出插件
      let isstream = checkvideotype();
      InitApp(ChatContainer, WhiteTheme, isstream, msg);

      setTimeout(ChechChatInstanced, 5000);
    }
    else {
      if (showalllog) console.log("watching video without chatroom.");
      setTimeout(ChechChatInstanced, 5000);
    }
  }
  function checkvideotype() {
    const streambtncss = $('.ytp-live-badge').css("display");
    const logstr = [`$('.ytp-live-badge').css("display")`, streambtncss];
    if (simulateisstreaming) {
    } else if (streambtncss === "inline-block") {
      console.log("This video is streaming.", logstr);
      return true;
      //$(`#PTTConnect-Time-Setting`).addClass('d-none');
    }
    else if (streambtncss === "none") {
      console.log("This video is not streaming.", logstr);
      return false;
    }
  }
}