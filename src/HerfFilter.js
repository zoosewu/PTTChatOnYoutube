import { InitYT } from './youtube/ytindex.js';
import { InitHT } from './holotools/htindex.js';
import { InitPTT } from './ptt/pttindex.js';
'use strict';

export function HerfFilter(msg) {
  const isTopframe = (window.top == window.self);
  if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
    if (isTopframe) throw "PTTonYT Script Stopped: PTT should not run in top frame";//check script work in right frame
    //init msg
    msg.ownorigin = "https://term.ptt.cc";
    msg.targetorigin = /\?url=(.+)/.exec(window.location.href)[1];
    msg.targetWindow = top;
    //-----
    console.log("Script started at " + window.location.href);
    InitPTT(msg);
    console.log("PTT Script initialize finish.");
    //-----
  }
  else if (/www\.youtube\.com/.exec(window.location.href) !== null) {
    if (!isTopframe) throw "PTTonYT Script Stopped: Youtube should run in top frame";//check script work in right frame
    //init postmessage
    msg.targetorigin = "https://term.ptt.cc";
    msg.ownorigin = "https://www.youtube.com";
    //-----
    console.log("Script started at " + window.location.href);
    setTimeout(InitYT, 10, msg);
    console.log("Youtube Script initialize finish.");
    //-----
  }
  else if (/hololive\.jetri\.co/.exec(window.location.href) !== null) {
    if (!isTopframe) throw "PTTonYT Script Stopped: Holotools should run in top frame";//check script work in right frame
    //init postmessage
    msg.ownorigin = "https://hololive.jetri.co";
    msg.targetorigin = "https://term.ptt.cc";
    //-----
    console.log("Script started at " + window.location.href);
    setTimeout(InitHT, 10, msg);
    console.log("Hololive Script initialize finish.");
    //-----
  }
}