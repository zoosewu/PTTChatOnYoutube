// ==UserScript==
// @name         PttChatOnYt
// @name:zh-TW   Youtube聊天室顯示PTT推文
// @namespace    https://github.com/zoosewu/PTTChatOnYoutube
// @version      1.0.35
// @description  connect ptt pushes to youtube chatroom
// @description:zh-tw 連結PTT推文到Youtube聊天室 讓你簡單追實況搭配推文
// @author       Zoosewu
// @match        https://www.youtube.com/watch?v=*
// @match        https://youtu.be/*
// @match        https://term.ptt.cc/*
// @grant        GM_xmlhttpRequest 
// @grant        GM_info
// @grant        unsafeWindow
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @require      https://cdn.jsdelivr.net/npm/vue
// @connect      www.ptt.cc
// @homepageURL  https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage
// @license      MIT
// ==/UserScript==
'use strict';
//user log
const reportmode = false;
//all log
const showalllog = false;
//dev log
const showPTTscreen = (false || reportmode || showalllog);
const showcommand = (false || reportmode || showalllog);
const showPostMessage = (false || reportmode || showalllog);
const showonMessage = (false || reportmode || showalllog);
const showalertmsg = false || showalllog;
//dev use 
let devmode = false;
const defaultopen = false;
const disablepttframe = false;
const simulateisstreaming = false;
// add listener to get msg
let cryptkey;
const msg = {
  targetorigin: "",
  ownorigin: "",
  targetWindow: null,
  PostMessage: function (msg, data) {
    if (this.targetWindow !== null) {
      const d = { m: msg, d: data };
      this.targetWindow.postMessage(d, this.targetorigin);
      if (showPostMessage) console.log(this.ownorigin + " message posted", d);
    }
  },
  onMessage: function (event) {
    // Check sender origin to be trusted
    if (event.origin !== msg.targetorigin) return;
    const data = event.data;
    if (showonMessage) console.log(msg.ownorigin + " onMessage", data);
    if (typeof (msg[data.m]) == "function") {
      msg[data.m].call(null, data.d);
    }
  },
}
if (window.addEventListener) {
  window.addEventListener("message", msg.onMessage, false);
}
else if (window.attachEvent) {
  window.attachEvent("onmessage", msg.onMessage, false);
}


let isTopframe = (window.top == window.self);
if (/www\.youtube\.com\/watch\?v=/.exec(window.location.href) !== null) {
  //check script work in right frame
  if (!isTopframe) throw new Error("Script Stopped when Youtube is not top frame");
  //init postmessage
  msg.targetorigin = "https://term.ptt.cc";
  msg.ownorigin = "https://www.youtube.com";
  msg["test"] = data => { console.log("test parent onmessage", data); };
  //-----
  console.log("Script started at " + window.location.href);
  runYoutubeScript();
  console.log("Youtube Script initialize finish.");
  //-----
}
else if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
  //check script work in right frame
  if (isTopframe) throw new Error("Script Stopped when PTT is top frame");
  //init postmessage
  msg.ownorigin = "https://term.ptt.cc";
  msg.targetorigin = "https://www.youtube.com";
  msg.targetWindow = top;
  msg["test"] = data => { console.log("test child onmessage", data); };
  //-----
  console.log("Script started at " + window.location.href);
  runPTTScript();
  console.log("PTT Script initialize finish.");
  //-----
}
//Youtube---------------------------------------------------------------------------------------------------------------------
function runYoutubeScript() {
  //generate crypt key everytime;
  cryptkey = makeid(20 + Math.random() * 10);
  GM_setValue("cryptkey", cryptkey);
  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
  const testPTTurl = "https://www.ptt.cc/bbs/C_Chat/M.1606557604.A.904.html";

  let player;
  let isinitPTT = false;
  let ConnectAlertDiv;
  let AutoScrolling = true;
  let isstreaming;
  let streamtime = new Date();
  let streamtimeinput;
  //let urlPushData = {};
  let PTTpostdata = {};
  let gotomainchat = false;
  let autogetpush = false;
  let lastgetpushtime = Date.now();
  let isstreambeforepost = false;
  let pushdata = {
    AID: "",
    board: "",
    posttime: new Date(),
    lastpushtime: new Date(),
    lastendline: 0,
    pushes: [],
    pushcount: 0,
    nowpush: 0,
  };
  ChechChatInstanced();
  setTimeout(AddBootstrap, 100, document);
  setTimeout(Setcss, 1000);
  function AddBootstrap(frame) {
    const frameHead = $("head", frame);
    const frameBody = $("body", frame);
    frameHead.append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">`));

    frameBody.append($(`<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>`));
    frameBody.append($(`<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>`));
    frameBody.append($(`<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>`));
  }
  function Setcss() {
    const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
    let bdcolor, ptp, pid, ptm, pmsg, ptxt;
    const colorlight = "rgb(120, 120, 120)";
    const colordark = "rgb(24, 24, 24)"
    if (YTbgcolor === colordark) {
      bdcolor = colorlight;
      ptp = "#fff"; pid = "#ff6"; ptm = "#bbb"; pmsg = "#990"; ptxt = "#f8f9fa";
      //PTTApp.addClass("border-white");
    }
    else {
      bdcolor = colordark;
      ptp = "#000"; pid = "#990"; ptm = "#bbb"; pmsg = "#550"; ptxt = "#343a40";
      //PTTApp.addClass("border-dark");
    }
    const PTTcss =
      //PTTmaincss
      `.ptttext { color: ` + ptxt + `; }
      .pttbg {background-color: ` + YTbgcolor + `; }` +
      //border
      `.border{
      border-color: ` + bdcolor + `!important;
      border-top-color: `+ bdcolor + ` !important;
      border-right-color: `+ bdcolor + ` !important;
      border-bottom-color: `+ bdcolor + ` !important;
      border-left-color: `+ bdcolor + ` !important;}` +
      //PTTpushcss
      `.pid { color: ` + pid + `; }
      .ptime { color: ` + ptm + `; }
      .pmsg { color: `+ pmsg + `; }
      .ptype { color: ` + ptp + `}
      pttdiv{ 
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
    const style = document.createElement('style');
    if (style.styleSheet) {
      style.styleSheet.cssText = PTTcss;
    } else {
      style.appendChild(document.createTextNode(PTTcss));
    }
    $('head')[0].appendChild(style);
  }
  function ChechChatInstanced() {
    const ChatContainer = $(`ytd-live-chat-frame`);
    const defaultChat = $(`iframe`, ChatContainer);
    if (defaultChat.length > 0) {
      console.log("chat frame instanced");
      ChatContainer.css({ "position": "relative" });
      player = document.getElementsByTagName("video")[0];
      if (simulateisstreaming) {
        isstreaming = true;
        updatelog("videotype", "實況");
      }
      InitChatApp(defaultChat);
    }
    else {
      setTimeout(ChechChatInstanced, 1000);
    }
  }

  function InitChatApp(defaultChatApp) {
    //console.log(defaultChatApp);
    const PTTAppCollapse = $(`<pttdiv id="PTTChat" class="pttchat rounded-right rounded-bottom w-100 collapse" style="z-index: 301; position: absolute;"></pttdiv>`);
    const PTTApp = $(`<div id="PTTChat-app" class=" pttbg border rounded w-100 d-flex flex-column"></div>`);
    const PTTChatnavbar = $(`<ul id="PTTChat-navbar" class="nav nav-tabs justify-content-center" role="tablist"><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-Chat" data-toggle="tab" href="#PTTChat-contents-Chat" role="tab" aria-controls="PTTChat-contents-Chat" aria-selected="false">聊天室</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent active" id="nav-item-Connect" data-toggle="tab" href="#PTTChat-contents-Connect" role="tab" aria-controls="PTTChat-contents-Connect" aria-selected="true">連線設定</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-other" data-toggle="tab" href="#PTTChat-contents-other" role="tab" aria-controls="PTTChat-contents-other" aria-selected="false">說明</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-PTT" data-toggle="tab" href="#PTTChat-contents-PTT" role="tab" aria-controls="PTTChat-contents-PTT" aria-selected="false">PTT畫面</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-log" data-toggle="tab" href="#PTTChat-contents-log" role="tab" aria-controls="PTTChat-contents-log" aria-selected="false">log</a></li><li class="nav-item"><button class="nav-link ptttext bg-transparent d-none" id="nav-item-TimeSet" type="button" data-toggle="collapse" data-target="#PTTChat-Time" aria-controls="PTTChat-Time" aria-expanded="false">時間</button></li></ul>
    `);
    const PTTChatContents = $(`<div id="PTTChat-contents" class="tab-content container d-flex flex-column ptttext"><!-------- 聊天室 --------><div class="tab-pane mh-100 fade" id="PTTChat-contents-Chat" role="tabpanel" aria-labelledby="nav-item-Chat"><!-------- 開台時間 --------><div id="PTTChat-Time" class="ptttext pttbg p-2 position-absolute w-75 d-none" style="z-index:400"><div id="PTTChat-Time-Setting"><form class="form-inline d-flex justify-content-between w-100"><label for="dis" class="mr-1">實況重播時間微調:</label> <button id="minus-time" class="btn ptttext border btn-outline-secondary" type="button">-1分鐘</button> <button id="add-time" class="btn ptttext border btn-outline-secondary" type="button">+1分鐘</button></form></div></div><!-------- 聊天室 --------><div class="flex-grow-1 overflow-auto mh-100 row" id="PTTChat-contents-Chat-main" style="overscroll-behavior:contain"><ul id="PTTChat-contents-Chat-pushes" class="col mb-0"></ul><div id="PTTChat-contents-Chat-btn" class="position-absolute d-none" style="z-index:400;bottom:5%;left:50%;-ms-transform:translateX(-50%);transform:translateX(-50%)"><button id="AutoScroll" class="btn btn-primary" type="button">自動滾動</button></div></div></div><!-------- 連線設定 --------><div class="tab-pane h-100 row fade show active" id="PTTChat-contents-Connect" role="tabpanel" aria-labelledby="nav-item-Connect"><div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0"></div><div id="PTTChat-contents-Connect-alert" class="position-relative container" style="top:-100%;z-index:400"></div></div><!-------- 其他 --------><div class="tab-pane h-100 card bg-transparent overflow-auto row fade" id="PTTChat-contents-other" role="tabpanel" aria-labelledby="nav-item-other"><div id="PTTChat-contents-other-main" class="card-body"></div></div><!-------- PTT畫面 --------><div class="tab-pane h-100 row fade" id="PTTChat-contents-PTT" role="tabpanel" aria-labelledby="nav-item-PTT"><div id="PTTChat-contents-PTT-main" class="h-100 d-flex justify-content-center px-0"></div></div><!-------- Log --------><div class="tab-pane mh-100 fade" id="PTTChat-contents-log" role="tabpanel" aria-labelledby="nav-item-log" style="overscroll-behavior:contain"><div class="flex-grow-1 overflow-auto mh-100 row" id="PTTChat-contents-log-main" style="overscroll-behavior:contain"><!--<ul id="PTTChat-contents-log-table" class="col mb-0"> </ul>--></div></div></div>
    `);
    const MainBtn = $(`<a id="PTTMainBtn" class="btn btn-lg border" type="button" data-toggle="collapse" data-target="#PTTChat" aria-expanded="false" aria-controls="PTTChat">P</a>`)

    PTTAppCollapse.insertBefore(defaultChatApp);
    PTTAppCollapse.append(PTTApp);
    MainBtn.insertBefore(defaultChatApp);
    MainBtn.css({ "z-index": "450", "position": "absolute" });

    if (defaultopen) {
      $(`#PTTMainBtn`)[0].click();
    }

    PTTApp.append(PTTChatnavbar);
    PTTApp.append(PTTChatContents);

    //180 to 600
    //let PTTAppHeight = defaultChatApp[0].clientHeight * 0.6;
    ///

    player.addEventListener('timeupdate', PlayerUpdate);

    //add globalcss
    setTimeout(() => {
      const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
      const colordark = "rgb(24, 24, 24)"
      if (YTbgcolor === colordark) {
        updatelog("ytcolor", "深色");
        MainBtn.addClass("btn-outline-light");
      }
      else {
        updatelog("ytcolor", "淺色");
        MainBtn.addClass("btn-outline-dark");
      }
    }, 100);


    /*------------------------------------CHAT------------------------------------*/

    PTTChat_Chat_Main = $(`#PTTChat-contents-Chat-pushes`, PTTChatContents);
    PTTChat_Chat = $(`#PTTChat-contents-Chat-main`, PTTChatContents);;
    const PTTChat_Chat_btn = $(`#PTTChat-contents-Chat-btn`, PTTChatContents);

    const streamtimecollapse = $(`#PTTChat-Time`, PTTChatContents);
    const lbtn = $(`#minus-time`, streamtimecollapse);
    const rbtn = $(`#add-time`, streamtimecollapse);


    PTTChat_Chat[0].addEventListener("scroll", function () {
      const scrollnowpos = PTTChat_Chat[0].scrollTop;
      const t = Date.now() - scriptscrolltime;
      let scrolltype = "";
      scriptscrolltime = Date.now();
      //if (t < 0) {
      if ((scrolllastpos + 5 > scrollnowpos && scrollnowpos > scrolltargetpos - 5) || (scrolllastpos - 5 < scrollnowpos && scrollnowpos < scrolltargetpos + 5)) {
        scrolltype = "auto scrolling";
        //script scrolling
      }
      else {
        scrolltype = "user scrolling";
        //user scrolling
        AutoScrolling = false;
        //PTTChat_Chat_btn.css({ "z-index": "450" });
        // PTTChat_Chat_btn.css({ "z-index": "450" });
        PTTChat_Chat_btn.removeClass('d-none');
        if (!isstreaming) streamtimecollapse.removeClass('d-none');
      }
      updatelog("targetscroll", scrolltargetpos);
      updatelog("nowscroll", scrollnowpos);
      updatelog("lastscroll", scrolllastpos);
      if (reportmode) console.log(scrolltype + ", (targetpos, lastpos, nowpos): (" + scrolltargetpos + ", " + scrolllastpos + ", " + scrollnowpos + "), scroll time step:" + t + " ms.");
      scrolllastpos = scrollnowpos;
    });
    const autoscrollbtn = $(`#AutoScroll`, PTTChatContents);
    autoscrollbtn[0].addEventListener("click", function (event) {
      event.preventDefault();
      AutoScrolling = true;
      ScrollToTime(true);
      // PTTChat_Chat_btn.css({ "z-index": "0" });
      // PTTChat_Chat_btn.css({ "z-index": "0" });

      PTTChat_Chat_btn.addClass('d-none');
      streamtimecollapse.addClass('d-none');
    });

    lbtn[0].addEventListener('click', () => {
      const result = /(\d\d)\:(\d\d)/.exec(streamtimeinput[0].value);
      var tmpdate = new Date();
      tmpdate.setHours(+result[1]);
      tmpdate.setMinutes(+result[2] - 1);
      const newtime = paddingLeft(tmpdate.getHours(), 2) + ":" + paddingLeft(tmpdate.getMinutes(), 2);
      console.log(newtime);
      streamtimeinput[0].value = newtime;
      autoscrollbtn[0].click();
      UpdateStreamTime();
    });
    rbtn[0].addEventListener('click', () => {
      const result = /(\d\d)\:(\d\d)/.exec(streamtimeinput[0].value);
      var tmpdate = new Date();
      tmpdate.setHours(+result[1]);
      tmpdate.setMinutes(+result[2] + 1);
      const newtime = paddingLeft(tmpdate.getHours(), 2) + ":" + paddingLeft(tmpdate.getMinutes(), 2);
      console.log(newtime);
      streamtimeinput[0].value = newtime;
      autoscrollbtn[0].click();
      UpdateStreamTime();
    });
    /*------------------------------------Connect------------------------------------*/
    const PTTChat_Connect = $(`#PTTChat-contents-Connect-main`, PTTChatContents);
    ConnectAlertDiv = $(`#PTTChat-contents-Connect-alert`, PTTChatContents);
    const PTTChat_ConnectContent = $(`<!-------- 連線 --------><!-- stream time input field--><div id="PTTConnect-Time-Setting" class="form-row mb-2 d-none"><div class="form-group col-7"><label for="appt-time">實況重播開台時間:</label> <input id="stream-time" type="time" name="stream-time"></div><div class="form-check col-4 pl-4"><input type="checkbox" class="form-check-input" id="streambeforepost"> <label class="form-check-label ml-2" for="streambeforepost">發文前已開台</label></div></div><!-- login input field--><div class="form-row mb-2"><div class="col-5"><label for="PTTid">PTT ID</label> <input id="PTTid" type="text" class="form-control" placeholder="PTT ID" autocomplete="off"></div><div class="col-5"><label for="PTTpw">PTT密碼</label> <input id="PTTpw" type="password" class="form-control" placeholder="PTT密碼" autocomplete="off"></div><div class="col-2"><label for="PTTlogin" class="col-2">　</label> <button id="PTTlogin" type="button" class="btn ptttext border btn-outline-secondary">登入</button></div></div><!-- Post AID input field --><div class="my-3 form-row"><label for="post0" class="col-3 col-form-label">輸入文章AID</label> <input id="post0" class="form-control col mr-3" type="text" placeholder="#1VobIvqC (C_Chat)" autocomplete="off"> <button id="post0btn" class="btn ptttext border btn-outline-secondary" type="button">讀取推文</button></div><div class="my-3 form-row"><label for="setH" class="col-3 col-form-label">設定插件長度</label> <input id="setHeight" class="form-control col mr-3" type="text" placeholder="600" autocomplete="off"> <button id="setHeightbtn" class="btn ptttext border btn-outline-secondary" type="button">確認</button></div><!-- test push button --> <button id="fakebtn" class="btn ptttext border btn-outline-secondary m-2 d-none" type="button">讀取測試用假推文</button><!-- New version button --> <a id="updatebtn" class="btn ptttext border btn-outline-secondary m-2 d-none" href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer" role="button">檢測到新版本</a>
    `);

    const fakedata = '{"board":"Test","AID":"1VpKTOfx","title":"","posttime":"2020-12-06T21:04:22.000Z","pushes":[{"type":"→ ","id":"ZooseWu","content":"推文1","date":"2020-12-06T21:04:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文2","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文3","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文5","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文678","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文100","date":"2020-12-06T21:06:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文101","date":"2020-12-06T21:06:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文102Y","date":"2020-12-06T21:10:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"123","date":"2020-12-06T21:11:00.000Z"},{"type":"推 ","id":"hu7592","content":"☂","date":"2020-12-06T22:24:00.000Z"},{"type":"→ ","id":"ss15669659","content":"☂","date":"2020-12-06T23:56:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"hey","date":"2020-12-07T00:31:00.000Z"}],"startline":"127","endline":"149","percent":"100"}';
    const fakedata1push = '{"board":"Test","AID":"1VpKTOfx","title":"","posttime":"2020-12-06T21:04:22.000Z","pushes":[{"type":"→ ","id":"ZooseWu","content":"hey","date":"2020-12-07T00:31:00.000Z"}],"startline":"127","endline":"149","percent":"100"}';

    PTTChat_Connect.append(PTTChat_ConnectContent);

    const loginbtn = $(`#PTTlogin`, PTTChat_Connect);
    const fakebtn = $(`#fakebtn`, PTTChat_Connect);
    const pttid = $(`#PTTid`, PTTChat_Connect);
    const pttpw = $(`#PTTpw`, PTTChat_Connect);
    const postinput = $(`#post0`, PTTChat_Connect);
    const postbtn = $(`#post0btn`, PTTChat_Connect);
    const seth = $(`#setHeight`, PTTChat_Connect);
    const sethbtn = $(`#setHeightbtn`, PTTChat_Connect);
    const streambeforepost = $(`#streambeforepost`, PTTChat_Connect);
    streamtimeinput = $(`#stream-time`, PTTChatContents);
    streamtimeinput[0].addEventListener("input", function () {
      UpdateStreamTime();
      PlayerUpdate();
    }, false);

    streambeforepost[0].addEventListener("click", () => {
      isstreambeforepost = streambeforepost[0].checked;
      UpdateStreamTime();
    });

    loginbtn[0].addEventListener("click", () => {
      GM_setValue("PTTID", pttid[0].value);
      //const i = pttid[0].value;
      //const p = pttpw[0].value;
      const i = CryptoJS.AES.encrypt(pttid[0].value, cryptkey).toString();
      const p = CryptoJS.AES.encrypt(pttpw[0].value, cryptkey).toString();
      //console.log("login", pttid[0].value, pttpw[0].value, cryptkey);
      //console.log("login", i, p);
      msg.PostMessage("login", { id: i, pw: p });
      //GetChatData(posturl, AlertMsg, postindex);
    });

    pttid[0].value = GM_getValue("PTTID", "");
    pttid[0].addEventListener("keyup", loginenter);
    pttpw[0].addEventListener("keyup", loginenter);
    function loginenter(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        loginbtn[0].click();
      }
    }

    postbtn[0].addEventListener("click", function () {
      const postAID = postinput[0].value;
      const result = /#(.+) \((.+)\)/.exec(postAID);
      if (!result || result.length <= 2) {
        AlertMsg(false, "文章AID格式錯誤，請重新輸入。");
      }
      else {
        GM_setValue("LastPostUID", postinput[0].value);
        gotomainchat = true;
        if (pushdata.AID === result[1] && pushdata.board === result[2]) {
          msg.PostMessage("getpost", { AID: pushdata.AID, board: pushdata.board, startline: pushdata.lastendline });
        }
        else {
          PTTChat_Chat_Main.html("");
          pushdata = {
            AID: "",
            board: "",
            posttime: new Date(),
            lastpushtime: new Date(),
            lastendline: 0,
            pushes: [],
            pushcount: 0,
            nowpush: 0,
          };
          msg.PostMessage("getpost", { AID: result[1], board: result[2], startline: 0 });
        }
      }
    });

    postinput[0].value = GM_getValue("LastPostUID", "");
    postinput[0].addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        postbtn[0].click();
      }
    });

    sethbtn[0].addEventListener("click", function () {
      let h = seth[0].value;
      console.log("H = " + h);
      if (+h < 180) h = 180;
      else if (+h > 800) h = 800;
      GM_setValue("PluginHeight", h);
      seth[0].value = h;
      PTTChatContents.css({ "height": h + "px" });
    });
    seth[0].value = GM_getValue("PluginHeight", 450);
    PTTChatContents.css({ "height": seth[0].value + "px" });
    seth[0].addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        sethbtn[0].click();
      }
    });

    fakebtn[0].addEventListener("click", getfakedata);
    function getfakedata(e, f) {
      f = f || fakedata;
      console.log("分析假推文", f);
      const obj = JSON.parse(f, dateReviver);
      ParsePostData(obj);
      if (simulateisstreaming) setTimeout(getfakedata, 5000, null, fakedata1push);
    }


    /*-------------------------------------Other-------------------------------------*/
    const other = `<div>使用教學:<p></p>1.設定紀錄檔開始的時間<p></p>(實況無須設定)<p></p>2.輸入帳號與密碼登入PTT<p></p>3.在你自己的PTT找到想要同步的文章<p></p>4.鍵入大寫Q複製文章完整AID<p></p>5.將複製的AID貼上並讀取文章<p></p>　<p></p>　<p></p></div><div>如果需要回報或有任何問題請打開除錯模式以檢視PTT畫面及Log<p></p>目前測試版運行中 除錯模式已開啟<p></p></div><button id="opendevmode" class="btn ptttext border btn-outline-secondary m-2" type="button">除錯模式</button><div>　<p></p>　<p></p>　<p></p>　<p></p>　<p></p>　<p></p>　<p></p>聲明:<p></p>　<p></p>我的程式碼都公開在網路上了，如果覺得我會到帳號請不要使用。<p></p>　<p></p>請保證瀏覽Youtube時沒有其他PTT腳本同時執行，這很重要。<p></p>　<p></p>我盡量確保你的帳號不會因為我的插件被盜了。<p></p>　<p></p>但是如果你被盜了我不負責。<p></p>　<p></p>如果你用了插件導致被水桶或被退註或封IP與我無關。<p></p>　<p></p>完整聲明請點網站說明進入<p></p>　<p></p>Zoosewu<p></p>　<p></p></div><a id="gfbtn" class="btn ptttext border btn-outline-secondary m-2" href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage" target="_blank" rel="noopener noreferrer" role="button">腳本介紹</a> <a id="gfbtn" class="btn ptttext border btn-outline-secondary m-2" href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer" role="button">greasyfork</a> <a id="gfbtn" class="btn ptttext border btn-outline-secondary m-2" href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master" target="_blank" rel="noopener noreferrer" role="button">github</a>
    `;
    $(`#PTTChat-contents-other-main`, PTTChatContents).html(other);
    $(`#opendevmode`, PTTChatContents)[0].addEventListener('click', () => {
      if (!devmode) {
        devmode = true;
        DevMode();
      }
    });
    /*------------------------------------PTT畫面------------------------------------*/
    MainBtn[0].addEventListener("click", () => {
      checkScriptEvent();

      if (!isinitPTT && !disablepttframe) {
        isinitPTT = true;
        //PTTChat - contents - PTT
        const PTTChat_PTT = $(`#PTTChat-contents-PTT-main`, PTTChatContents);
        const PTTFrame = $(`<iframe id="PTTframe" src="//term.ptt.cc/" class="h-100 flex-grow-1" style="zoom: 1.65; z-index: 351; -moz-transform: scale(1);">你的瀏覽器不支援 iframe</iframe>`);
        $(window).on('beforeunload', function () {
          PTTFrame.remove();
        });
        PTTChat_PTT.append(PTTFrame);
        msg.targetWindow = PTTFrame[0].contentWindow;
        //PTTCHAT_PTTTab.css({ "display": "none" });
      }
    });

    /*--------------------------------------Log--------------------------------------*/

    PTTChat_Log = $(`<table class="table"><tbody class="ptttext"><tr><th scope="row">PTT狀態</th><td id="log-PTTstate">--</td><td colspan="2">更多的詳細資訊請參考PTT畫面</td></tr><th class="text-center bg-secondary text-white" colspan="4">文章資訊</th><tr><th scope="row">文章標題</th><td id="log-posttitle" colspan="3">--</td></tr><tr><th scope="row">文章看板</th><td id="log-postboard">--</td><th scope="row">文章代碼</th><td id="log-postaid">--</td></tr><tr><th scope="row">推文數</th><td id="log-postpushcount">--</td><th scope="row">結尾行數</th><td id="log-postendline">--</td></tr><tr><th scope="row">發文時間</th><td id="log-posttime" colspan="3">--</td></tr><tr><th scope="row">最後推文時間</th><td id="log-postlastpushtime" colspan="3">--</td></tr><th class="text-center bg-secondary text-white" colspan="4">詳細資訊</th><tr><th scope="row">影片類型</th><td id="log-videotype">--</td><th scope="row">自動獲得推文</th><td id="log-isautogetpush">--</td></tr><tr><th scope="row">YT主題顏色</th><td id="log-ytcolor">--</td><th scope="row"></th><td></td></tr><tr><th scope="row">預估開台時間</th><td id="log-streamstarttime" colspan="3">--</td></tr><tr><th scope="row">影片當下時間</th><td id="log-streamnowtime" colspan="3">--</td></tr><th class="text-center bg-secondary text-white" colspan="4">滾動狀態</th><tr><th scope="row">目標推文樓數</th><td id="log-pushindex">--</td><th scope="row">目標捲動高度</th><td id="log-targetscroll">--</td></tr><tr><th scope="row">現在捲動高度</th><td id="log-nowscroll">--</td><th scope="row">上次捲動高度</th><td id="log-lastscroll">--</td></tr></tbody></table>
    `);
    $(`#PTTChat-contents-log-main`, PTTChatContents).append(PTTChat_Log);
    /*--------------------------------------END--------------------------------------*/
    if (devmode) {
      DevMode();
    }
    function DevMode() {
      fakebtn.removeClass('d-none');
      $(`#nav-item-PTT`, PTTChatnavbar).removeClass('d-none');
      //$(`#nav-item-TimeSet`, PTTChatnavbar).removeClass('d-none');
      $(`#nav-item-log`, PTTChatnavbar).removeClass('d-none');
    }
    UpdateStreamTime();
  }
  /*------------------------------------Update Log------------------------------------*/
  let logs = {};
  function updatelog(logtype, msg) {
    if (!logs[logtype]) {
      logs[logtype] = $("#log-" + logtype, PTTChat_Log);
    }
    const log = logs[logtype];
    log.html(msg);
  }
  /*--------------------------------------Alert--------------------------------------*/
  function AlertMsg(type, msg) {
    if (showalertmsg) console.log("Alert,type: " + type + ", msg: " + msg);

    const alerttype = type === true ? "alert-success" : "alert-danger";
    const Alart = $(`<div class="alert mt-3 fade show ` + alerttype + `" role="alert">  ` + msg + `</div>`);
    if (ConnectAlertDiv) {
      ConnectAlertDiv.append(Alart);
      setTimeout(() => { Alart.alert('close'); }, 2000);
    }
  }
  msg["alert"] = data => { AlertMsg(data.type, data.msg); };
  /*------------------------------------Chat Scroll------------------------------------*/
  let AotoScroller;
  let PTTChat_Chat_Main;
  let PTTChat_Chat;
  let PTTChat_Log;
  let scriptscrolltime = Date.now();
  let scrolltargetpos = 0;
  let scrolllastpos = 0;
  function PlayerUpdate(forceScroll) {
    /*console.log((scriptscrolltime + 100) + " + " + Date.now());
    console.log((scriptscrolltime - Date.now()));
    console.log((scriptscrolltime + 100 > Date.now()));*/
    if (isstreaming === undefined) {
      if ($('.ytp-live-badge.ytp-button')[0].getAttribute('disabled') === "") {
        console.log("This video is streaming.");
        isstreaming = true;
        //$(`#PTTConnect-Time-Setting`).addClass('d-none');
        updatelog("videotype", "實況");
      }
      else if ($('.ytp-live-badge.ytp-button[disabled=true]').length > 0) {
        console.log("This video is not streaming.");
        isstreaming = false;
        updatelog("videotype", "紀錄檔");
        $(`#PTTConnect-Time-Setting`).removeClass('d-none');

      }
    }
    else if (isstreaming && autogetpush && (Date.now() > lastgetpushtime + 2500)) {
      console.log("PlayerUpdate autogetpush", autogetpush, lastgetpushtime, Date.now());
      autogetpush = false;
      lastgetpushtime = Date.now();
      msg.PostMessage("getpost", { AID: pushdata.AID, board: pushdata.board, startline: pushdata.lastendline });
    }
    const t = new Date(streamtime.getTime() + player.currentTime * 1000);
    updatelog("streamnowtime", t.toLocaleDateString() + " " + t.toLocaleTimeString());
    ScrollToTime(false);
  }
  let scrolloffset = 0;
  function _scroll() {
    const target = pushdata.pushes[pushdata.nowpush].div;
    scrolloffset = (PTTChat_Chat[0].clientHeight - target[0].clientHeight) / 2;
    let offset = target[0].offsetTop - scrolloffset;

    const lastscreen = PTTChat_Chat_Main[0].clientHeight - PTTChat_Chat[0].clientHeight + 10
    //console.log("offset " + offset);
    //console.log("lastscreen: " + lastscreen);
    if (offset > lastscreen)
      offset = lastscreen;
    else if (offset < 0)
      offset = 0;
    //console.log("target: ", target);
    //console.log("PTTChat_Chat[0].scrollTop: " + PTTChat_Chat[0].scrollTop);
    //console.log("PTTChat_Chat[0].clientHeight: " + PTTChat_Chat[0].clientHeight);
    //console.log("PTTChat_Chat_Main[0].clientHeight: " + PTTChat_Chat_Main[0].clientHeight);
    //console.log("target[0].offsetTop: " + target[0].offsetTop);
    //console.log("offset: " + offset);
    //console.log("scrolloffset: " + scrolloffset);
    if (PTTChat_Chat[0].scrollTop - offset > 15 || PTTChat_Chat[0].scrollTop - offset < -15) {
      scriptscrolltime = Date.now();
      //scrolltargetpos = offset;

      if (PTTChat_Chat[0].scrollTop - offset > 300) {
        //console.log("scroll to 1000 first");
        PTTChat_Chat[0].scrollTo({ top: offset + 1000, }); scrolllastpos = offset + 1001;
      }
      else if (offset - PTTChat_Chat[0].scrollTop > 3000) {
        //console.log("scroll to -1000 first");
        PTTChat_Chat[0].scrollTo({ top: offset - 1000, }); scrolllastpos = offset - 1001;
      }
      if (showalllog) console.log("go to push: " + pushdata.nowpush);
      updatelog("pushindex", pushdata.nowpush);
      //setTimeout(() => {
      scrolltargetpos = offset;
      PTTChat_Chat[0].scrollTo({
        top: offset,
        behavior: "smooth"
      });
      //}, 10);
    }
  }
  function ScrollToTime(forceScroll) {
    forceScroll = (typeof forceScroll !== 'undefined') ? forceScroll : true;
    if (pushdata.pushes.length < 1) return;
    if (scriptscrolltime + 100 > Date.now()) return;
    if (!forceScroll && !AutoScrolling) return;
    if (isstreaming) {
      pushdata.nowpush = pushdata.pushes.length - 1;
    }
    else {
      const playedtime = player.currentTime;
      let nowtime = new Date(streamtime.getTime());
      nowtime.setSeconds(nowtime.getSeconds() + playedtime);
      const prenowpush = pushdata.nowpush;
      /*console.log(nowtime + "-<-" + pushdata.posttime);
      console.log(nowtime.valueOf() + "-<-" + pushdata.posttime.valueOf());
      console.log(nowtime.valueOf() < pushdata.posttime.valueOf());
      console.log(nowtime + "->-" + pushdata.lastpushtime);
      console.log(nowtime.valueOf() + "->-" + pushdata.lastpushtime.valueOf());
      console.log(nowtime.valueOf() > pushdata.lastpushtime.valueOf());*/

      if (nowtime.valueOf() < pushdata.posttime.valueOf()) {
        if (showalllog) console.log("before post:" + nowtime + "<" + pushdata.posttime);
        pushdata.nowpush = 0;
      }
      else if (nowtime.valueOf() > pushdata.lastpushtime.valueOf()) {
        if (showalllog) console.log("after post:" + nowtime + ">" + pushdata.lastpushtime);
        pushdata.nowpush = pushdata.pushcount - 1;
      }
      else {
        let newnewpush = pushdata.nowpush;
        while (pushdata.pushes[newnewpush].date.valueOf() > nowtime.valueOf() && newnewpush > 1) {
          newnewpush--;
        }
        while (pushdata.pushes[newnewpush].date.valueOf() < nowtime.valueOf() && newnewpush < pushdata.pushes.length - 1) {
          newnewpush++;
        }
        pushdata.nowpush = newnewpush;
      }
    }
    if (pushdata.pushes[pushdata.nowpush]) {
      _scroll();
    }
  }
  /*--------------------------------------Parse Post Data--------------------------------------*/
  function PushGenerator(ID, pushtype, pushid, pushmsg, pushtimeH, pushtimem) {
    const ptype = `<h5 class="ptype mr-2 mb-0">` + pushtype + ` </h5>`;
    const pid = `<h5 class="pid mr-2 mb-0 flex-grow-1">` + pushid + `</h5>`;
    const ptime = `<h5 class="ptime mb-0">` + paddingLeft(pushtimeH, +2) + `:` + paddingLeft(pushtimem, +2) + `</h6>`;

    const pmsg = `<h4 class="pmsg mb-0 ml-2 mr-2" style="word-break: break-all;">` + pushmsg + `</h4>`;

    const firstline = `<div class="d-flex flex-row">` + ptype + pid + ptime + `</div>`;
    const secondline = `<div>` + pmsg + `</div>`

    const mainpush = `<li id="` + ID + `"class="media mb-4"><div class="media-body mw-100">` + firstline + secondline + `</div></li>`;
    return $(mainpush);
  }


  msg["postdata"] = data => {
    ParsePostData(data);
    /*console.log(JSON.stringify(data));*/
    lastgetpushtime = Date.now();
    if (isstreaming) {
      autogetpush = true;
      updatelog("isautogetpush", "true");
    }
    if (gotomainchat) {
      gotomainchat = false;
      $(`#nav-item-Chat`)[0].click();
      ScrollToTime();
    }
  }
  function ParsePostData(data) {
    PTTpostdata = $.extend(true, {}, data);
    if (PTTpostdata.AID === pushdata.AID && PTTpostdata.board === pushdata.board) {
      pushdata.lastendline = PTTpostdata.endline;
      console.log("pushdata.lastendline , PTTpostdata.endline: " + pushdata.lastendline + ", " + PTTpostdata.endline);
    }
    else {
      pushdata = {
        AID: PTTpostdata.AID,
        board: PTTpostdata.board,
        title: PTTpostdata.title,
        posttime: PTTpostdata.posttime,
        lastendline: PTTpostdata.endline,
        lastpushtime: new Date(),
        pushes: [],
        pushcount: 0,
        nowpush: 0,
      };
      updatelog("postaid", pushdata.AID);
      updatelog("postboard", pushdata.board);
      updatelog("posttitle", pushdata.title);
      const t = pushdata.posttime;
      updatelog("posttime", t.toLocaleDateString() + " " + t.toLocaleTimeString());

      updatelog("postendline", pushdata.lastendline);

    }
    const pdata = PTTpostdata.pushes;
    let sametime = PTTpostdata.posttime;
    let sametimeIndex = pushdata.pushcount;
    for (let index = 0; index < pdata.length; index++) {
      let newpush = pdata[index];
      newpush.pushid = pushdata.pushcount;
      pushdata.pushcount++;
      if (newpush.date.valueOf() > sametime.valueOf()) {
        //補秒
        const sametimecount = index - sametimeIndex;
        for (let i = sametimeIndex; i < index; i++) {
          const thispart = i - sametimeIndex;
          pushdata.pushes[i].date.setSeconds(thispart * 60 / sametimecount);
        }
        sametime = newpush.date;
        sametimeIndex = index;
      }
      //if (isstream && AutoScrolling){
      const div = PushGenerator(`scroll-targer-` + newpush.pushid, newpush.type, newpush.id, newpush.content, newpush.date.getHours(), newpush.date.getMinutes());
      PTTChat_Chat_Main.append(div);
      newpush.div = div;
      //}
      pushdata.pushes.push(newpush);
    }
    if (pdata.length > 0) pushdata.lastpushtime = pdata[pdata.length - 1].date;
    updatelog("postpushcount", pushdata.pushcount);
    const t = pushdata.lastpushtime;
    updatelog("postlastpushtime", t.toLocaleDateString() + " " + t.toLocaleTimeString());

    UpdateStreamTime();

    /*console.log(PTTpostdata);
    for (let index = 0; index < 90; index++) {
      PTTChat_Chat.append(PushGenerator(`scroll-targer-` + index, "推", "Zoosewu", "太神啦太神啦太神啦太神啦太神啦太神啦太神啦太神啦太神", 0, 0));
    }*/
  };
  /*--------------------------------------Update Stream Time--------------------------------------*/
  function UpdateStreamTime() {
    let result = /(\d\d)\:(\d\d)/.exec(streamtimeinput[0].value);
    if (!result) result = ["0", "18", "00"];
    streamtime = new Date(pushdata.posttime.getTime());
    streamtime.setHours(+result[1]);
    streamtime.setMinutes(+result[2]);
    if (streamtime.valueOf() < pushdata.posttime.valueOf()) {
      streamtime.setHours(streamtime.getHours() + 24);
      if (isstreambeforepost) {
        streamtime.setHours(streamtime.getHours() - 24);
      }
    }
    const t = streamtime;
    updatelog("streamstarttime", t.toLocaleDateString() + " " + t.toLocaleTimeString());
    if (showalllog) console.log("UpdateStreamTime()");
  }

  /*--------------------------------------New Version--------------------------------------*/
  function checkScriptEvent() {
    const oReq = new XMLHttpRequest();
    oReq.addEventListener("load", checkScriptVersion);
    oReq.open("GET", "https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt.json");
    oReq.send();
  }
  function checkScriptVersion() {
    const obj = JSON.parse(this.responseText);
    const webver = obj.version;
    const wv = /(\d+)\.(\d+)\.(\d+)/.exec(webver);
    const myver = GM_info.script.version;
    const mv = /(\d+)\.(\d+)\.(\d+)/.exec(myver);
    console.log("version check: web version " + webver + ", my version " + myver + ".", wv, mv);
    if (wv[1] > mv[1] || wv[2] > mv[2])
      $(`#updatebtn`).removeClass('d-none');
  }
  /*
  //page push parse
  function GetChatData(ChatUrl, alertfunc, loadpostindex, callback) {
    if (ChatUrl === "") {
      alertfunc(false, "推文讀取失敗：空網址。");
      callback();
      return;
    }
    if (isLoadingPost[loadpostindex] == true) {
      alertfunc(false, "推文讀取中。");
      return;
    }        isLoadingPost[loadpostindex] = true;
    GM_xmlhttpRequest({
      method: "GET",
      url: ChatUrl,
      headers: {
        "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
        "Accept": "text/xml"            // If not specified, browser defaults will be used.
      },
      onload: function (response) {
        //console.log(response.responseText);
        if ($(".push", response.responseText).length <= 1) {
          alertfunc(false, "推文讀取失敗：錯誤網址。");
          isLoadingPost[loadpostindex] = false;
          return;
        }
        alertfunc(true, "推文讀取成功。");
        isLoadingPost[loadpostindex] = false;
        GeturlPushData(loadpostindex, response.responseText);
        console.log("推文讀取 2");
      },
      abort: function (response) {
        alertfunc(false, "推文讀取失敗：無法連線。");
        isLoadingPost[loadpostindex] = false;
        console.log(response.responseText);
      }      });    }
  function GeturlPushData(loadpostindex, responseText) {
    urlPushData[loadpostindex] = [];
    //urlPushData = 
    console.log("GeturlPushData");
    //get post year
    const postMetadata = $(".article-metaline", responseText);
    const postdateText = $(".article-meta-value", postMetadata[2])[0].innerText;
    const postdate = new Date(postdateText);
    const yyyy = postdate.getFullYear();
    //get push
    const pushes = $(".push", responseText);
    console.log(pushes);
    setTimeout(parsePushData, 10, loadpostindex, yyyy, pushes, 0);
  }
  function parsePushData(loadpostindex, yyyy, pushes, Index) {
    let parseFinished = false;
    for (let index = 0; index < Index + 100 && index < pushes.length; index++) {
      const push = pushes[index];
      //get content
      const pcontent = $(".push-content", push)[0].innerText;
      const contentReg = /[^: ].* /;
      const content = contentReg.exec(pcontent);
      //get time
      const ptime = $(".push-ipdatetime", push)[0].innerText;
      const ptimeReg = / ?(\d+)\/?(\d+) ?(\d+):?(\d+)/;
      const ptimeResult = ptimeReg.exec(ptime);
      const MM = ptimeResult[1];
      const dd = ptimeResult[2];
      const hh = ptimeResult[3];
      const mm = ptimeResult[4];
      const date = new Date(yyyy, (MM - 1), dd, hh, mm);
 
      const pushdata = new Object();
      pushdata.type = $(".push-tag", push)[0].innerText;
      pushdata.id = $(".push-userid", push)[0].innerText;
      pushdata.content = content[0];
      pushdata.date = date;
      urlPushData[loadpostindex].push(pushdata);
      if (index == pushes.length - 1) parseFinished = true;
      PTTChat_Chat_Global.append(PushGenerator(`scroll-targer-` + index, pushdata.type, pushdata.id, pushdata.content, pushdata.date.getHours() + ":" + pushdata.date.getMinutes()));
    }
    if (parseFinished) {
      //console.log("parse finished, total " + pushes.length + " messages.");
      //console.log(urlPushData[loadpostindex]);
    }
    else {
      //console.log("parse " + Index + " to " + (Index + 100));
      setTimeout(parsePushData, 10, loadpostindex, yyyy, pushes, Index + 100);
    }
  }
*/
}
//PTT---------------------------------------------------------------------------------------------------------------------
function runPTTScript() {
  //get crypt key;
  cryptkey = GM_getValue("cryptkey", Math.random());
  //start script
  'use strict'
  let PTT = {
    connect: true,//自動 連線狀態
    login: false,//自動
    controlstate: 0,
    lastviewupdate: 0,
    lock: function () {
      PTT.controlstate = 1;
    },
    unlock: function () {
      PTT.controlstate = 0;
      PTT.commands.list = [];
    },
    //0 free,1 lock 手動更新 每次操作都要打開 用完關閉
    pagestate: 0,//PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
    screen: [],//自動 畫面資料
    screenstate: 0,//0 clear, 1 full 自動 畫面是否已更新
    wind: null,//自動
    screenHaveText: function (reg) {
      let result = null;
      //debug用
      if (this.screenstate === 0) {
        const sElement = $("[type='bbsrow']", this.wind.document);
        for (let i = 0; i < sElement.length; i++) {
          const txt = sElement[i].textContent;
          if (result == null) result = new RegExp(reg).exec(txt);
          this.screen.push(txt);
        }
        this.screenstate = 1;
        if (showalllog) console.log("screenHaveText", reg, result);
        return result;
      }
      else {
        for (let i = 0; i < this.screen.length; i++) {
          const txt = this.screen[i];
          result = new RegExp(reg).exec(txt);
          if (result != null) {
            if (showalllog) console.log("screenHaveText", reg, result);
            return result;
          }
        }
        if (showalllog) console.log("screenHaveText", reg, result);
        return null;
      }
    },
    screenclear: function () {
      this.screenstate = 0;
      this.screen = [];
    },
    commands: {
      list: [],
      add: function (reg, input, callback, ...args) {
        const com = { reg, input, callback, args };
        if (showcommand) console.log("Add command ", com);
        this.list.push(com);
      },
      getfirst: function () {
        return this.list[0];
      },
      removefirst: function () {
        this.list.shift();
      }
    },
    pagestatefilter: [
      { reg: /請輸入代號，或以 guest 參觀，或以 new 註冊/, state: 0 },
      { reg: /上方為使用者心情點播留言區|【 精華公佈欄 】/, state: 1 },
      { reg: /^\[←\]離開 \[→\]閱讀/, state: 2 },
      { reg: /目前顯示\: 第 01/, state: 3 },
      { reg: /目前顯示\: 第/, state: 4 },
    ],
    autocom: [
      { reg: /您想刪除其他重複登入的連線嗎|您要刪除以上錯誤嘗試的記錄嗎/, input: 'n\n' },
      { reg: /您要刪除以上錯誤嘗試的記錄嗎/, input: 'n\n' },
      { reg: /按任意鍵繼續/, input: '\n' },
      {
        reg: /系統過載, 請稍後再來\.\.\./, input: '', callback: () => {
          serverfull = true;
          if (PTT.controlstate === 1) {
            PTT.unlock();
            msg.PostMessage("alert", { type: false, msg: "系統過載, 請稍後再來..." });
            PTT.unlock();
          }
        }, args: []
      },
      { reg: /大富翁 排行榜|發表次數排行榜/, input: 'q' },
      { reg: /本日十大熱門話題/, input: 'q' },
      { reg: /本週五十大熱門話題/, input: 'q' },
      { reg: /每小時上站人次統計/, input: 'q' },
      { reg: /本站歷史 \.\.\.\.\.\.\./, input: 'q' },
      { reg: /看 板  目錄數   檔案數     byte數   總 分     板   主/, input: 'q' },
      { reg: /名次──────範本───────────次數/, input: 'q' },

    ]
  }
  PTT.wind = window;
  let PTTPost = {
    board: "",
    AID: "",
    title: "",
    posttime: "",
    pushes: [],
    startline: 0,
    endline: 3,
    percent: 0,
    samepost: false,
    isgotopost: false

  }
  let serverfull = false;
  const insertText = (() => {
    let t = PTT.wind.document.querySelector('#t')
    return str => {
      if (!t) t = PTT.wind.document.querySelector('#t')
      const e = new CustomEvent('paste')
      //debug用
      //console.log(`insertText : \"` + str + `\"`);
      e.clipboardData = { getData: () => str }
      t.dispatchEvent(e)
    }
  })()
  function ComLog(cmd) {
    if (showcommand) console.log("execute command:", [cmd]);
  }
  function updatePagestate() {
    for (let i = 0; i < PTT.pagestatefilter.length; i++) {
      const filter = PTT.pagestatefilter[i];
      const result = PTT.screenHaveText(filter.reg);
      if (result != null) {
        PTT.pagestate = filter.state;
        console.log("page state = " + PTT.pagestate);
        return;
      }
    }
  }
  function chechAutoCommand() {
    let commands = PTT.autocom;
    for (let autoi = 0; autoi < commands.length; autoi++) {
      const cmd = commands[autoi];
      const result = PTT.screenHaveText(cmd.reg);
      //if (showcommand) console.log("auto command", cmd, result);
      if (result != null) {
        ComLog(cmd);
        insertText(cmd.input);
        if (typeof cmd.callback !== "undefined") {
          cmd.callback(...cmd.args);
        }
        return true;
      }
    }
    return false;
  }

  function command() {
    const cmd = PTT.commands.getfirst();
    if (typeof cmd !== 'undefined' && PTT.screenHaveText(cmd.reg) != null) {
      PTT.commands.removefirst();
      ComLog(cmd);
      insertText(cmd.input);
      if (typeof cmd.callback == "function") {
        cmd.callback(...cmd.args);
      }
    }
  }
  function OnUpdate() {
    if (showalllog) console.log("OnUpdate start");
    PTT.screenclear();
    if (showalllog) console.log("set pagestate.");
    updatePagestate();
    if (showalllog) console.log("check autocommand.");
    if (!chechAutoCommand()) {
      if (showalllog) console.log("check command.");
      command();
    }
    if (showPTTscreen) console.log("PTT screen shot:", PTT.screen);
    let nextcom = PTT.commands.getfirst();
    if (showcommand && typeof nextcom !== 'undefined') console.log("next command : reg:" + nextcom.reg + "input:" + nextcom.input, [nextcom.callback]);
    else if (showcommand) console.log("next command : none.");
    if (showalllog) console.log("OnUpdate end");
  }
  //hook start
  function hook(obj, key, cb) {
    const fn = obj[key].bind(obj)
    obj[key] = function (...args) {
      fn.apply(this, args)
      cb.apply(this, args)
    }
  }
  hook(unsafeWindow.console, 'log', t => {
    if (typeof t === 'string') {
      if (t.indexOf('page state:') >= 0) {
        /*const newstate = /->(\d)/.exec(t)[1];*/
      }
      else if (t === 'view update') {
        PTT.lastviewupdate = Date.now();
        serverfull = false;
        OnUpdate();
      }
    }
  });
  //hook end
  function reconnect() {
    const disbtn = $(`.btn.btn-danger[type=button]`);
    if (disbtn && disbtn.length > 0) {
      msg.PostMessage("alert", { type: false, msg: "PTT已斷線，重新嘗試連線。" });
      PTT.login = false;
      disbtn[0].click();
      serverfull = false;
      PTT.screenstate = -1;
      PTT.unlock;
      setTimeout(reconnect(), 1000);
    }
  }
  function checkscreenupdate() {
    if (PTT.controlstate === 0) return;
    const now = Date.now();
    if (now > PTT.lastviewupdate + 10000) {
      msg.PostMessage("alert", { type: false, msg: "PTT無回應，請稍後再試，或重新整理頁面。" });
      PTT.unlock();
    }
    else {
      msg.PostMessage("alert", { type: true, msg: "指令執行中......" });
      setTimeout(checkscreenupdate, 3500);
    }
  }

  // -----------------------task getpost --------------------
  function gotoBoard() { insertText("s" + PTTPost.board + "\n"); }
  function boardcheck() {
    const res = { pass: false, callback: gotoBoard }
    let reg = "";
    if (PTT.pagestate === 4) {
      res.pass = true;
      return res;
    }
    else if (PTT.pagestate === 1) return res;
    else if (PTT.pagestate === 2) reg = "看板《" + PTTPost.board + "》";
    else if (PTT.pagestate === 3) reg = "看板  " + PTTPost.board + " *";
    const currect = PTT.screenHaveText(reg);
    if (currect) res.pass = true;
    return res;
  }

  function gotoPost() { insertText("NN#" + PTTPost.AID + "\n\n"); PTTPost.isgotopost = true; }
  function PostCheck() {
    const res = { pass: true, callback: gotoPost }
    if (PTT.pagestate === 2) res.pass = false;
    else if (PTT.pagestate === 1) console.log("PostCheck error, PTT.pagestate == 1.");
    return res;
  }

  function backtoboard() { insertText("q"); }
  function PotsTitleCheck() {
    const res = { pass: true, callback: backtoboard }
    if (PTT.pagestate === 3) {
      const reg = / 標題 +(.+)/;
      const posttitle = PTT.screenHaveText(reg);
      if (posttitle) {
        PTTPost.isgotopost = false;
        var spacereg = /\s+$/g;
        const title = posttitle[1].replace(spacereg, "");
        if (PTTPost.samepost) {
          if (title === PTTPost.title) {
          }
          else { res.pass = false; }
        }
        else {
          PTTPost.title = title;
          let result = PTT.screenHaveText(/時間  (\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/);
          PTTPost.posttime = new Date(result[1]);
        }
      }
      else { res.pass = false; console.log("PotsTitleCheck error, Reg Parse Error."); }
    }
    else if (PTT.pagestate === 1) console.log("PotsTitleCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("PotsTitleCheck error, PTT.pagestate == 2.");
    return res;
  }

  function gotoline() { insertText(PTTPost.endline + ".\n"); }
  function PostLineCheck() {
    const res = { pass: true, callback: gotoline }
    if (PTT.pagestate === 4 || PTT.pagestate === 3) {
      const lineresult = PTT.screenHaveText(/目前顯示: 第 (\d+)~(\d+) 行/);
      const startline = lineresult[1];
      let targetline = PTTPost.endline - startline + 1;
      if (startline < 5) targetline += 1;
      if ((targetline < 1 || targetline > 23) && PTT.screenHaveText(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) === null) res.pass = false;
      else getpush();
    }
    else if (PTT.pagestate === 1) console.log("PistLineCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("PistLineCheck error, PTT.pagestate == 2.");
    return res;
  }

  function savepush(content, result) {
    const pushdata = {};
    pushdata.type = result[1];
    pushdata.id = result[2];
    pushdata.content = content;
    pushdata.date = new Date(PTTPost.posttime.getFullYear(), result[4] - 1, result[5], result[6], result[7]);
    PTTPost.pushes.push(pushdata);
    //console.log(result);
  }
  function getpush() {
    const lineresult = PTT.screenHaveText(/目前顯示: 第 (\d+)~(\d+) 行/);
    const startline = lineresult[1];
    const endline = lineresult[2];
    let targetline = PTTPost.endline - startline + 1;
    if (startline < 5) targetline += 1;
    //console.log("GetPush from " + targetline + "to " + (PTT.screen.length - 1));
    //console.log("(pttstartline, pttendline, startline, endline, targetline): (" + PTTPost.startline + ", " + PTTPost.endline + ", " + startline + ", " + endline + ", " + targetline + ")");
    for (let i = targetline; i < PTT.screen.length; i++) {
      const line = PTT.screen[i];
      //console.log(i + "," + line);
      const result = /^(→ |推 |噓 )(.+?): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(line);
      if (result != null) {
        let content = result[3];
        var reg = /\s+$/g;
        content = content.replace(reg, "");
        savepush(content, result);
      }
    }
    let percentresult = PTT.screenHaveText(/瀏覽 第 .+ 頁 \( *(\d+)%\)/);
    PTTPost.percent = percentresult[1];
    PTTPost.startline = startline;
    PTTPost.endline = endline;

  }

  function gotonextpage() { insertText(' '); }
  function PostPercentCheck() {
    const res = { pass: false, callback: gotonextpage }
    if ((PTT.pagestate === 3 || PTT.pagestate === 4) && PTT.screenHaveText(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) !== null) {
      res.pass = true;
    }
    else if (PTT.pagestate === 1) console.log("PostPercentCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("PostPercentCheck error, PTT.pagestate == 2.");
    return res;
  }
  //------------------------tasks--------------------------------
  const task = {};
  task.GetPost = [boardcheck, PostCheck, PotsTitleCheck, PostLineCheck, PostPercentCheck];
  function GetPushTask() {
    if (PTTPost.isgotopost && PTT.pagestate === 2) {
      msg.PostMessage("alert", { type: false, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
      PTT.unlock();
    }
    //console.log("(startline, endline): ( " + PTTPost.startline + ", " + PTTPost.endline + ")");
    for (let i = 0; i < task.GetPost.length; i++) {
      const element = task.GetPost[i];
      const result = element();
      //console.log("Run task", { element, result });
      if (result.pass === false) {
        result.callback();
        PTT.commands.add(/.*/, "", GetPushTask);
        return;
      }
    }
    //end
    PTT.unlock();
    msg.PostMessage("alert", { type: true, msg: "文章讀取完成。" });
    msg.PostMessage("postdata", PTTPost);
    if (showalllog) console.log(PTTPost);
  }
  function GetPostPush(pAID, bname, startline, forceget = false) {
    if (PTT.pagestate > 0 || forceget) {
      startline = startline || 3;
      msg.PostMessage("alert", { type: true, msg: "文章讀取中。" });
      const samepost = (bname === PTTPost.board) && (pAID === PTTPost.AID);
      if (samepost) {
        PTTPost.pushes = [];
        PTTPost.samepost = true;
        PTTPost.endline = startline;
        PTTPost.isgotopost = false;
        //console.log("Get Same Post Push from PTTPost.endline, startline: " + PTTPost.endline + ", " + startline);
      }
      else {
        PTTPost = {
          board: bname,
          AID: pAID,
          title: "",
          posttime: "",
          pushes: [],
          startline: 0,
          endline: startline,
          percent: 0,
          samepost: false,
          isgotopost: false
        }
      }
      if (PTT.pagestate === 1) insertText("m");
      else insertText("q");
      PTT.commands.add(/.*/, "", GetPushTask);
    }
    else if (PTT.screenstate === -1) {
      msg.PostMessage("alert", { type: false, msg: "PTT已斷線，請重新登入。" });
      PTT.unlock();
    }
    else if (PTT.screenstate === 0) {
      msg.PostMessage("alert", { type: false, msg: "PTT尚未登入，請先登入。" });
      PTT.unlock();
    }
  }
  function login(id, pw) {
    msg.PostMessage("alert", { type: true, msg: "登入中" });
    if (!PTT.login) {
      const logincheck = () => {
        if (PTT.screenHaveText(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
          msg.PostMessage("alert", { type: false, msg: "登入失敗，帳號或密碼有誤。" });
          PTT.unlock();
        }
        else if (PTT.screenHaveText(/上方為使用者心情點播留言區|【 精華公佈欄 】/)) {
          msg.PostMessage("alert", { type: true, msg: "登入成功。" });
          PTT.login = true;
          PTT.unlock();
          //testcode
          /*(() => {
            PTTLockCheck(GetPostPush, `#1VobIvqM (C_Chat)`);
            insertText("x");
          })();*/
        }
        else if (PTT.screenHaveText(/登入中，請稍候\.\.\.|正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久|密碼正確！ 開始登入系統/)) {
          PTT.commands.add(/.*/, "", logincheck);
        }
        else {
          msg.PostMessage("alert", { type: false, msg: "發生了未知錯誤。" });
          console.log(PTT.screen);
        }
      }

      let result = PTT.screenHaveText(/請輸入代號，或以 guest 參觀，或以 new 註冊/);
      if (result) {
        insertText(id + "\n" + pw + "\n");
        PTT.commands.add(/.*/, "", logincheck);
      }
      else {
        PTT.commands.add(/.*/, "", login, id, pw);
      }
    }
    else {
      msg.PostMessage("alert", { type: false, msg: "已經登入，請勿重複登入。" });
      PTT.unlock();
    }
  }
  function PTTLockCheck(callback, ...args) {
    const disbtn = $(`.btn.btn-danger[type=button]`);
    if (disbtn.length > 0) reconnect();
    else if (PTT.controlstate === 1) {
      msg.PostMessage("alert", { type: false, msg: "指令執行中，請稍後再試。" });
      return;
    }
    else if (serverfull) {
      msg.PostMessage("alert", { type: false, msg: "系統過載, 請稍後再來..." });
      PTT.unlock();
    } else if (!serverfull) {
      PTT.lastviewupdate = Date.now();
      PTT.lock();
      callback(...args);
      setTimeout(checkscreenupdate, 3500);
    }
  }
  //end
  msg["login"] = data => {
    const i = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8);
    const p = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8);
    //console.log(data );
    //console.log([i, p],cryptkey);
    PTTLockCheck(login, i, p);
  };
  msg["getpost"] = data => { PTTLockCheck(GetPostPush, data.AID, data.board, data.startline); };
}


//function
function paddingLeft(str, lenght) {
  str = str + "";
  if (str.length >= lenght)
    return str;
  else
    return paddingLeft("0" + str, lenght);
}

function paddingRight(str, lenght) {
  str = str + "";
  if (str.length >= lenght)
    return str;
  else
    return paddingRight(str + "0", lenght);
}

var dateReviver = function (key, value) {
  if (typeof value === 'string') {
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
      return new Date(+a[1], +a[2] - 1, +a[3], +a[4] + 8, +a[5], +a[6]);
    }
  }
  return value;
};
