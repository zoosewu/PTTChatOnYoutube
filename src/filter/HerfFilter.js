
import { InitPTT } from '../ptt/pttindex.js';
export function HerfFilter(msg, filters) {
  const isTopframe = (window.top == window.self);
  if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
    if (isTopframe) throw throwstring("PTT");//check script work in right frame
    //init msg
    msg.ownerorigin = "https://term.ptt.cc";
    msg.targetorigin = /\?url=(.+?)\/?$/.exec(window.location.href)[1];// \?url=(https\:\/\/|http\:\/\/)(.+)
    msg.targetWindow = top;
    //-----
    console.log("Script started at " + window.location.href);
    InitPTT(msg);
    console.log("PTT Script initialize finish.");
    //-----
  }
  else {
    for (let i = 0; i < filters.length; i++) {
      const f = filters[i];
      if (f.Reg.exec(window.location.href) !== null) {
        if (!isTopframe) throw throwstring(f.Fullname);//check script work in right frame
        //init postmessage
        msg.targetorigin = "https://term.ptt.cc";
        msg.ownerorigin = f.ownerorigin;
        //-----
        console.log("Script started at " + window.location.href);
        setTimeout(m => {
          //generate crypt key everytime;
          cryptkey = GenerateCryptKey();
          //add bootstrap to use
          BootStrap(document);
          f.callback(m)
        }, 100, msg);
        console.log(f.Fullname + " Script initialize finish.");
        //-----
        break;
      }
    }
  }
  function throwstring(site) {
    return "PTTonYT Script Stopped: " + site + " should run in top frame";
  }
}