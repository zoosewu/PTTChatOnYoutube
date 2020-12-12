// ==UserScript==
// @name         YoutubeChatOnPTT
// @name:zh-TW   Youtube聊天使顯示PTT推文
// @namespace    https://github.com/zoosewu/PTTChatOnYoutube
// @version      1.0.0
// @description  connect ptt pushes to youtube chatroom
// @description:zh-tw 連結PTT推文到Youtube聊天室
// @author       Zoosewu
// @match        https://www.youtube.com/watch?v=*
// @match        https://term.ptt.cc/*
// @grant        GM_xmlhttpRequest 
// @grant        GM_info
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require      https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js
// @require      https://cdn.jsdelivr.net/npm/vue
// @require      file://E:\Project\PTTChatOnYoutube\Main.user.js
// @connect      www.ptt.cc
// @homepageURL  https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage
// @license      MIT
// ==/UserScript==
'use strict';
//user log
const reportmode = true;
//all log
const showalllog = false;
//dev log
const showPTTscreen = (false || reportmode || showalllog);
const showcommand = (false || reportmode || showalllog);
const showPostMessage = (false || reportmode || showalllog);
const showonMessage = (false || reportmode || showalllog);
const showalertmsg = false || showalllog;
//dev use 
const devmode = true;
const defaultopen = false;
const disablepttframe = false;
const simulateisstreaming = false;
// add listener to get msg
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
  (function () {
    (function AddBootstrap(frame) {
      const frameHead = $("head", frame);
      const frameBody = $("body", frame);
      frameHead.append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">`));

      frameBody.append($(`<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>`));
      frameBody.append($(`<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>`));
      frameBody.append($(`<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>`));

    })(document)
  })();
  function ChechChatInstanced() {
    const ChatContainer = $(`ytd-live-chat-frame`);
    const defaultChat = $(`iframe`, ChatContainer);
    if (defaultChat.length > 0) {
      console.log("chat frame instanced");
      ChatContainer.css({ "position": "relative" });
      player = document.getElementsByTagName("video")[0];
      if (simulateisstreaming) isstreaming = true;
      InitChatApp(defaultChat);
    }
    else {
      setTimeout(ChechChatInstanced, 1000);
    }
  }

  function InitChatApp(defaultChatApp) {
    //console.log(defaultChatApp);
    const PTTAppCollapse = $(`<div id="PTTChat" class="collapse w-100 rounded-right rounded-bottom" style="z-index: 301; position: absolute;"></div>`);
    const PTTApp = $(`<div id="PTTChat-app" class="pttbg border rounded w-100 d-flex flex-column"></div>`);
    const PTTChatnavbar = $(`<ul id="PTTChat-navbar" class="nav nav-tabs justify-content-center" role="tablist"><li class="nav-item"><a class="nav-link text-light bg-transparent" id="nav-item-Chat" data-toggle="tab" href="#PTTChat-contents-Chat" role="tab" aria-controls="PTTChat-contents-Chat" aria-selected="false">聊天室</a></li><li class="nav-item"><a class="nav-link text-light bg-transparent active" id="nav-item-Connect" data-toggle="tab" href="#PTTChat-contents-Connect" role="tab" aria-controls="PTTChat-contents-Connect" aria-selected="true">連線設定</a></li><li class="nav-item"><a class="nav-link text-light bg-transparent" id="nav-item-Setting" data-toggle="tab" href="#PTTChat-contents-Setting" role="tab" aria-controls="PTTChat-contents-Setting" aria-selected="false">說明</a></li><li class="nav-item"><a class="nav-link text-light bg-transparent" id="nav-item-PTT" data-toggle="tab" href="#PTTChat-contents-PTT" role="tab" aria-controls="PTTChat-contents-PTT" aria-selected="false">PTT畫面</a></li><li class="nav-item"><button class="nav-link text-light bg-transparent" id="nav-item-TimeSet" type="button" data-toggle="collapse" data-target="#PTTChat-Time" aria-controls="PTTChat-Time" aria-expanded="false">時間</button></li></ul>
    `);
    const PTTChatContents = $(`<div id="PTTChat-contents" class="tab-content container d-flex flex-column ptttext"><div id="PTTChat-Time" class="w-100 ptttext collapse position-absolute"><div id="PTTChat-Time-Setting"><form class="form-inline d-flex justify-content-between w-100"><button id="minus-time" class="btn btn-outline-secondary" type="button">-1分鐘</button><div class="form-group mb-2"><label for="appt-time">實況VOD開台時間　:　</label> <input id="stream-time" type="time" name="stream-time" value="18:00"></div><button id="add-time" class="btn btn-outline-secondary" type="button">+1分鐘</button></form></div></div><div class="tab-pane flex-grow-1 overflow-auto row fade" id="PTTChat-contents-Chat" role="tabpanel" aria-labelledby="nav-item-Chat" style="overscroll-behavior:contain"><ul id="PTTChat-contents-Chat-main" class="col mb-0"></ul><div id="PTTChat-contents-Chat-btn" class="collapse position-absolute" style="z-index:400;bottom:5%;left:50%;-ms-transform:translateX(-50%);transform:translateX(-50%)"><button id="AutoScroll" class="btn btn-primary" type="button" data-toggle="collapse" data-target="#PTTChat-contents-Chat-btn" aria-controls="PTTChat-contents-Chat-btn" aria-expanded="false">自動滾動</button></div></div><div class="tab-pane h-100 row fade show active" id="PTTChat-contents-Connect" role="tabpanel" aria-labelledby="nav-item-Connect"><div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0"></div><div id="PTTChat-contents-Connect-alert" class="position-relative container" style="top:-100%;z-index:400"></div></div><div class="tab-pane h-100 row fade" id="PTTChat-contents-Setting" role="tabpanel" aria-labelledby="nav-item-Setting"><ul id="PTTChat-contents-Setting-main" class="col overflow-auto h-100" data-spy="scroll" data-offset="0"></ul></div><div class="tab-pane h-100 row fade" id="PTTChat-contents-PTT" role="tabpanel" aria-labelledby="nav-item-PTT"><ul id="PTTChat-contents-PTT-main" class="col h-100 d-flex justify-content-center pr-0 pl-0" data-spy="scroll" data-offset="0"></ul></div></div>
    `);
    const MainBtn = $(`<a id="PTTMainBtn" class="btn btn-lg" type="button" data-toggle="collapse" data-target="#PTTChat" aria-expanded="false" aria-controls="PTTChat">P</a>`)

    PTTAppCollapse.insertBefore(defaultChatApp);
    PTTAppCollapse.append(PTTApp);
    setTimeout(() => {
      const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
      let ptp, pid, ptm, pmsg, ptxt;
      if (YTbgcolor === "rgb(24, 24, 24)") {
        ptp = "#fff"; pid = "#ff6"; ptm = "#bbb"; pmsg = "#990"; ptxt = "#f8f9fa";
        PTTApp.addClass("border-white");
        MainBtn.addClass("btn-outline-light");
      }
      else {
        ptp = "#000"; pid = "#990"; ptm = "#bbb"; pmsg = "#550"; ptxt = "#343a40";
        PTTApp.addClass("border-dark");
        MainBtn.addClass("btn-outline-dark");
      }
      const PTTcss = `
      .ptype { color: ` + ptp + `; }
      .pid { color: ` + pid + `; }
      .ptime { color: ` + ptm + `; }

      .pmsg { color: `+ pmsg + `; }
      .ptttext { color: `+ ptxt + `; }
      .pttbg {background-color: ` + YTbgcolor + `}`;
      const style = document.createElement('style');
      if (style.styleSheet) {
        style.styleSheet.cssText = PTTcss;
      } else {
        style.appendChild(document.createTextNode(PTTcss));
      }
      $('head')[0].appendChild(style);

      //PTTApp.css({ "background-color": YTbgcolor });
    }, 100);
    MainBtn.insertBefore(defaultChatApp);
    MainBtn.css({ "z-index": "350", "position": "absolute" });

    if (defaultopen) {
      $(`#PTTMainBtn`)[0].click();
    }

    PTTApp.append(PTTChatnavbar);
    PTTApp.append(PTTChatContents);

    PTTChatContents.css({ "height": defaultChatApp[0].clientHeight * 0.6 + "px" });
    player.addEventListener('timeupdate', ScrollToTime);
    if (!devmode) {
      $(`#nav-item-PTT`, PTTChatnavbar).remove();
      $(`#nav-item-TimeSet`, PTTChatnavbar).remove();
    }

    /*------------------------------------CHAT------------------------------------*/

    PTTChat_Chat_Main = $(`#PTTChat-contents-Chat-main`, PTTChatContents);
    PTTChat_Chat = $(`#PTTChat-contents-Chat`, PTTChatContents);;
    const PTTChat_Chat_btn = $(`#PTTChat-contents-Chat-btn`, PTTChatContents);

    /*for (let index = 0; index < 90; index++) {
      PTTChat_Chat.append(PushGenerator(`scroll-targer-` + index, "推", "Zoosewu", "太神啦太神啦太神啦太神啦太神啦太神啦太神啦太神啦太神", "00:00"));
    }*/
    const streamtimecollapse = $(`#PTTChat-Time`, PTTChatContents);
    const lbtn = $(`#minus-time`, streamtimecollapse);
    const rbtn = $(`#add-time`, streamtimecollapse);


    streamtimeinput = $(`#stream-time`, PTTChatContents);
    streamtimeinput[0].addEventListener("input", function () {
      UpdateStreamTime();
      ScrollToTime();
    }, false);

    PTTChat_Chat[0].addEventListener("scroll", function () {
      const scrollnowpos = PTTChat_Chat[0].scrollTop;
      //const t = Date.now() - scriptscrolltime;
      //if (t < 0) {
      if ((scrolllastpos + 5 > scrollnowpos && scrollnowpos > scrolltargetpos - 5) || (scrolllastpos - 5 < scrollnowpos && scrollnowpos < scrolltargetpos + 5)) {
        console.log("auto scrolling, (targetpos, lastpos, nowpos): (" + scrolltargetpos + ", " + scrolllastpos + ", " + scrollnowpos + ")");
        //script scrolling
        //scriptscrolltime = Date.now() + 250;
        scrolllastpos = scrollnowpos;
      }
      else {
        //user scrolling
        console.log("user scrolling, (targetpos, lastpos, nowpos): (" + scrolltargetpos + ", " + scrolllastpos + ", " + scrollnowpos + ")");
        AutoScrolling = false;
        PTTChat_Chat_btn.collapse('show');
        streamtimecollapse.collapse('show');
      }
    });
    $(`#AutoScroll`, PTTChatContents)[0].addEventListener("click", function (event) {
      event.preventDefault();
      AutoScrolling = true;
      ForceScrollToTime(true);
      streamtimecollapse.collapse('hide');
    });
    /*------------------------------------Connect------------------------------------*/
    const PTTChat_Connect = $(`#PTTChat-contents-Connect-main`, PTTChatContents);
    ConnectAlertDiv = $(`#PTTChat-contents-Connect-alert`, PTTChatContents);

    const login = `<form>
    <div class="form-row mb-2">
      <div class="col-6">
        <label for="PTTid">PTT ID</label>
        <input id="PTTid" type="text" class="form-control" placeholder="PTT ID" autocomplete="off">
      </div>
      <div class="col-6">
        <label for="PTTpw">PTT密碼</label>
        <input id="PTTpw" type="password" class="form-control" placeholder="PTT密碼" autocomplete="off">
      </div>
    </div>
    <button id="PTTlogin" type="button" class="btn btn-outline-secondary">Login</button>
  </form>`;
    const post = `<div class="input-group mb-3 mt-3">
    <label for="PTTpostaid">輸入文章AID</label>
    <input id="post0" type="text" class="form-control" placeholder="#1VobIvqD (C_Chat)" aria-label="post0"
      aria-describedby="basic-addon2" autocomplete="off">
    <div class="input-group-append">
      <button id="post0btn" class="btn btn-outline-secondary" type="button">讀取推文</button>
    </div>
  </div>`;
    const fakedata = '{"board":"Test","AID":"1VpKTOfx","title":"","posttime":"2020-12-06T21:04:22.000Z","pushes":[{"type":"→ ","id":"ZooseWu","content":"推文1","date":"2020-12-06T21:04:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文2","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文3","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文5","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文678","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文100","date":"2020-12-06T21:06:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文101","date":"2020-12-06T21:06:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文102Y","date":"2020-12-06T21:10:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"123","date":"2020-12-06T21:11:00.000Z"},{"type":"推 ","id":"hu7592","content":"☂","date":"2020-12-06T22:24:00.000Z"},{"type":"→ ","id":"ss15669659","content":"☂","date":"2020-12-06T23:56:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"hey","date":"2020-12-07T00:31:00.000Z"}],"startline":"127","endline":"149","percent":"100"}';
    const fakedata1 = '{"board":"Test","AID":"1VpKTOfx","title":"","posttime":"2020-12-06T21:04:22.000Z","pushes":[{"type":"→ ","id":"ZooseWu","content":"hey","date":"2020-12-07T00:31:00.000Z"}],"startline":"127","endline":"149","percent":"100"}';

    const fakebtn = $(`<button id="fakebtn" class="btn btn-outline-secondary" type="button">獲得假推文</button>`);
    const updatebtn = $(`<a id="updatebtn" class="btn btn-outline-secondary d-none" href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer" role="button">檢測到新版本</a>`);

    PTTChat_Connect.append(login);
    const pptid = $(`#PTTid`, PTTChatContents);
    const pttpw = $(`#PTTpw`, PTTChatContents);
    const loginbtn = $(`#PTTlogin`, PTTChatContents);
    loginbtn[0].addEventListener("click", function () {
      const i = pptid[0].value;
      const p = pttpw[0].value;
      msg.PostMessage("login", { id: i, pw: p });
      //GetChatData(posturl, AlertMsg, postindex);
    });
    pptid[0].addEventListener("keyup", loginenter);
    pttpw[0].addEventListener("keyup", loginenter);
    function loginenter(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        loginbtn[0].click();
      }
    }
    PTTChat_Connect.append(post);

    const postinput = $(`#post0`, PTTChatContents);
    const postbtn = $(`#post0btn`, PTTChatContents);

    postinput[0].addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        event.preventDefault();
        postbtn[0].click();
      }
    });

    postbtn[0].addEventListener("click", function () {
      const postAID = postinput[0].value;
      const result = /#(.+) \((.+)\)/.exec(postAID);
      if (!result || result.length <= 2) {
        ///
        AlertMsg(false, "文章AID格式錯誤，請重新輸入。");
      }
      else {
        gotomainchat = true;
        if (isstreaming) autogetpush = true;
        if (pushdata.AID === result[1] && pushdata.board === result[2]) {
          msg.PostMessage("getpost", { AID: pushdata.AID, board: pushdata.board, startline: pushdata.lastendline });
        }
        else {
          msg.PostMessage("getpost", { AID: result[1], board: result[2], startline: 0 });
        }
      }
    });

    PTTChat_Connect.append(updatebtn);
    if (devmode) {
      PTTChat_Connect.append(fakebtn);
      $(`#fakebtn`)[0].addEventListener("click", getfakedata);

      function getfakedata(e, f) {
        f = f || fakedata;
        console.log("分析假推文", f);
        const obj = JSON.parse(f, dateReviver);
        ParsePostData(obj);
        if (simulateisstreaming) setTimeout(getfakedata, 5000, null, fakedata1);
      }
    }

    /*-------------------------------------Other-------------------------------------*/

    /*------------------------------------PTT畫面------------------------------------*/
    MainBtn[0].addEventListener("click", () => {
      if (!isinitPTT) {
        isinitPTT = true;
        const PTTChat_PTT = $(`#PTTChat-contents-PTT-main`, PTTChatContents);
        //const PTTCHAT_PTTTab = $(`#nav-item-PTT`, PTTChatnavbar);
        const PTTFrame = $(`<iframe id="PTTframe" src="//term.ptt.cc/" style="zoom: 1.5">你的瀏覽器不支援 iframe</iframe>`);
        $(window).on('beforeunload', function () {
          PTTFrame.remove();
          return;
        });
        PTTChat_PTT.append(PTTFrame);
        if (disablepttframe) PTTFrame.remove();
        msg.targetWindow = PTTFrame[0].contentWindow;
        //PTTCHAT_PTTTab.css({ "display": "none" });
        checkScriptEvent();
      }
    });
    /*--------------------------------------END--------------------------------------*/
  }
  function AlertMsg(type, msg) {
    if (showalertmsg) console.log("Alert,type: " + type + ", msg: " + msg);
    let alerttype = type === true ? "alert-success" : "alert-danger";
    const Alart = `<div class="alert mt-3 fade show ` + alerttype + `" role="alert">  ` + msg + `</div>`;
    if (ConnectAlertDiv) ConnectAlertDiv.append(Alart);
    const al = $('.alert');
    setTimeout(() => { al.alert('close'); }, 2000);
  }
  msg["alert"] = data => { AlertMsg(data.type, data.msg); };

  let AotoScroller;
  let PTTChat_Chat_Main;
  let PTTChat_Chat;
  let scriptscrolltime = Date.now();
  let scrolltargetpos = 0;
  let scrolllastpos = 0;
  function ScrollToTime(forceScroll) {
    //console.log("isstreaming state", isstreaming);
    if (isstreaming === undefined) {
      //console.log("try isstreaming", $('.ytp-live-badge.ytp-button[aria-label="直接跳至現場活動直播頻道。"]'), $('.ytp-live-badge.ytp-button[disabled=true]'));
      if ($('.ytp-live-badge.ytp-button')[0].getAttribute('disabled') === "") {
        console.log("This video is streaming.");
        isstreaming = true;
      }
      else if ($('.ytp-live-badge.ytp-button[disabled=true]').length > 0) {
        console.log("This video is not streaming.");
        isstreaming = false;
      }
    }
    ForceScrollToTime(false);
  }
  let scrolloffset = 0;
  function _scroll() {
    const target = pushdata.pushes[pushdata.nowpush].div;
    if (scrolloffset === 0) scrolloffset = (PTTChat_Chat[0].clientHeight - target[0].clientHeight) / 2;
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
      //scriptscrolltime = Date.now() + 3000;
      //scrolltargetpos = offset;

      if (PTTChat_Chat[0].scrollTop - offset > 1000) {
        PTTChat_Chat[0].scrollTo({ top: offset + 1000, }); scrolllastpos = offset + 1001;
      }
      else if (offset - PTTChat_Chat[0].scrollTop > 1000) {
        PTTChat_Chat[0].scrollTo({ top: offset - 1000, }); scrolllastpos = offset - 1001;
      }
      if (showalllog) console.log("go to push: " + pushdata.nowpush);
      console.log("go to push: " + pushdata.nowpush);
      setTimeout(() => {
        //scriptscrolltime = Date.now() + 3000;
        scrolltargetpos = offset;
        PTTChat_Chat[0].scrollTo({
          top: offset,
          behavior: "smooth"
        });
      }, 10);
    }
  }
  function ForceScrollToTime(forceScroll) {
    forceScroll = (typeof forceScroll !== 'undefined') ? forceScroll : true;
    if (pushdata.pushes.length < 1) return;
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
          //console.log(pushdata.pushes[newnewpush].date + "->-" + nowtime);
          newnewpush--;
        }
        while (pushdata.pushes[newnewpush].date.valueOf() < nowtime.valueOf() && newnewpush < pushdata.pushes.length - 1) {
          //console.log(pushdata.pushes[newnewpush].date + "-<-" + nowtime);
          newnewpush++;
        }
        pushdata.nowpush = newnewpush;
      }
    }
    if (pushdata.pushes[pushdata.nowpush]) {
      _scroll();
    }
  }
  function PushGenerator(ID, pushtype, pushid, pushmsg, pushtimeH, pushtimem) {
    const ptype = `<h5 class="ptype mr-2 mb-0">` + pushtype + ` </h5>`;
    const pid = `<h5 class="pid mr-2 mb-0 flex-grow-1">` + pushid + `</h5>`;
    const ptime = `<h5 class="ptime mb-0">` + paddingLeft(pushtimeH, +2) + `:` + paddingLeft(pushtimem, +2) + `</h6>`;

    //var pmsg = `<h4 class="f3 mb-0 ml-2 mr-2" style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">` + pushmsg + `</h4>`;
    const pmsg = `<h4 class="pmsg mb-0 ml-2 mr-2" style="word-break: break-all;">` + pushmsg + `</h4>`;

    const firstline = `<div class="d-flex flex-row">` + ptype + pid + ptime + `</div>`;
    //var secondline = `<div class="d-flex flex-row">` + pmsg + `</div>`
    const secondline = `<div>` + pmsg + `</div>`

    const mainpush = `<li id="` + ID + `"class="media mb-4"><div class="media-body mw-100">` + firstline + secondline + `</div></li>`;
    return $(mainpush);
  }
  msg["postdata"] = data => {
    if (gotomainchat) {
      gotomainchat = false;
      $(`#nav-item-Chat`)[0].click(); ///
    }
    ParsePostData(data);
    /*console.log(JSON.stringify(data));*/
    if (isstreaming) {
      setTimeout(RegetNewPush, 2500, data.AID, data.board);
    }
  }
  function RegetNewPush(AID, board) {
    if (PTTpostdata.AID === AID && PTTpostdata.board === board && autogetpush) {
      msg.PostMessage("getpost", { AID: AID, board: board, startline: pushdata.lastendline });
    }
  }
  function ParsePostData(data) {
    PTTpostdata = $.extend(true, {}, data);
    if (PTTpostdata.AID === pushdata.AID && PTTpostdata.board === pushdata.board) { }
    else {
      pushdata = {
        AID: PTTpostdata.AID,
        board: PTTpostdata.board,
        posttime: PTTpostdata.posttime,
        lastendline: PTTpostdata.endline,
        lastpushtime: new Date(),
        pushes: [],
        pushcount: 0,
        nowpush: 0,
      };
    }
    console.log(pushdata);
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
    console.log("pushdata", pushdata);
    UpdateStreamTime();

    /*console.log(PTTpostdata);
    for (let index = 0; index < 90; index++) {
      PTTChat_Chat.append(PushGenerator(`scroll-targer-` + index, "推", "Zoosewu", "太神啦太神啦太神啦太神啦太神啦太神啦太神啦太神啦太神", 0, 0));
    }*/
  };
  function UpdateStreamTime() {
    const result = /(\d\d)\:(\d\d)/.exec(streamtimeinput[0].value);
    streamtime = new Date(pushdata.posttime.getTime());
    streamtime.setHours(+result[1]);
    streamtime.setMinutes(+result[2]);
    if (showalllog) console.log("UpdateStreamTime()");
  }
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
    console.log("version check", webver, wv, myver, mv);
    if (wv[1] > mv[1] || wv[2] > mv[2] || wv[3] > mv[3])
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
    ///get post year
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
    pagestate: 0,//自動 ptt的訊息 暫時沒什麼用
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
          if (result == null) result = reg.exec(txt);
          this.screen.push(txt);
        }
        this.screenstate = 1;
        if (showalllog) console.log("screenHaveText", reg, result);
        return result;
      }
      else {
        for (let i = 0; i < this.screen.length; i++) {
          const txt = this.screen[i];
          result = reg.exec(txt);
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
    autocom: [
      { reg: /您想刪除其他重複登入的連線嗎|您要刪除以上錯誤嘗試的記錄嗎/, input: 'n\n' },
      { reg: /您要刪除以上錯誤嘗試的記錄嗎/, input: 'n\n' },
      { reg: /請按任意鍵繼續/, input: '\n' },
      {
        reg: /系統過載, 請稍後再來\.\.\./, input: '', callback: () => {
          serverfull = true;
          if (PTT.controlstate === 1) {
            PTT.unlock();
            msg.PostMessage("alert", { type: false, msg: "系統過載, 請稍後再來..." });
            PTT.unlock();
          }
        }, args: []
      }
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
        const newstate = /->(\d)/.exec(t)[1];
        PTT.pagestate = newstate;
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
    if (disbtn.length > 0) {
      disbtn[0].click();
      PTT.unlock();
      serverfull = false;
      setTimeout(reconnect(), 100);
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
      msg.PostMessage("alert", { type: true, msg: "指令執行中..." });
      setTimeout(checkscreenupdate, 3500);
    }
  }
  //-----------------tasks----------------------
  function gotoBoard(boardname) {
    const input = boardname + "\n";
    PTT.commands.add(/輸入看板名稱\(按空白鍵自動搜尋\)\:/, input, () => {
      PTTPost.board = boardname;
    });
    insertText("s");
  }
  function gotoPost(postcode) {
    const gotopost = "#" + postcode + "\n\n";
    PTT.commands.add(/文章選讀/, gotopost, () => {
      PTTPost.AID = postcode;
    });
    PTT.commands.add(/.*/, "", () => {
      let nopost = PTT.screenHaveText(/文章選讀/);
      let posttitle = PTT.screenHaveText(/ 標題 +(.+)/);
      if (nopost) {
        msg.PostMessage("alert", { type: false, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
        PTT.unlock();
      }
      else if (posttitle) {
        var reg = /\s+$/g;
        let title = posttitle[1].replace(reg, "");
        PTTPost.title = title;
        _getpush();
      }
    });
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
  function _getpush() {
    const posttitle = PTT.screenHaveText(/ 標題 +(.+)/);
    if (posttitle) {
      const reg = /\s+$/g;
      const title = posttitle[1].replace(reg, "");
      if (PTTPost.title !== title) {
        gotoPost(PTTPost.AID);
        insertText("q");
        return;
      }
    }
    const lineresult = PTT.screenHaveText(/目前顯示: 第 (\d+)~(\d+) 行/);
    const startline = lineresult[1];
    const endline = lineresult[2];
    const targetline = PTTPost.endline - startline + 1;
    if (PTTPost.posttime === "") {
      let result = PTT.screenHaveText(/時間  (\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/);
      PTTPost.posttime = new Date(result[1]);
    }
    //console.log("targetline =" + targetline);
    if (targetline < 1 || targetline > 23) {
      //console.log("lastendline: " + PTTPost.endline + ", startline: " + startline + ", endline: " + endline);
      const gotoline = PTTPost.endline + ".\n";
      insertText(gotoline);
      PTT.commands.add(/目前顯示: 第/, "", _getpush);
      return;
    }
    for (let i = targetline; i < PTT.screen.length; i++) {
      const line = PTT.screen[i];
      const result = /^(→ |推 |噓 )(.+): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(line);
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
    if (PTT.screenHaveText(/(100%)/) == null) {
      PTT.commands.add(/目前顯示: 第/, "", _getpush);
      insertText(' ');
    }
    else {
      PTT.unlock();
      msg.PostMessage("alert", { type: true, msg: "文章讀取完成。" });
      msg.PostMessage("postdata", PTTPost);
      if (showalllog)
        console.log(PTTPost);
    }
  }
  //------------------------tasks--------------------------------
  function GetPostPush(pAID, bname, startline, forceget = false) {
    if ((PTT.connect && PTT.login) || forceget) {
      let searchboard = bname !== PTTPost.board;
      let searchpost = pAID !== PTTPost.AID;
      startline = startline | 3;
      msg.PostMessage("alert", { type: true, msg: "文章讀取中。" });
      if (searchpost) PTTPost = {
        board: "",
        AID: "",
        title: "",
        posttime: "",
        pushes: [],
        startline: 0,
        endline: startline,
        percent: 0,
      }
      PTT.endline = startline;
      if (searchboard) {
        if (showalllog) console.log("新看板 新文章");
        gotoBoard(bname);
        gotoPost(pAID);
      }
      else if (searchpost) {
        if (showalllog) console.log("同看板 新文章");
        gotoPost(pAID);
      }
      else {
        if (showalllog) console.log("同看板 同文章");
        PTTPost.pushes = [];
        insertText("q");
        PTT.commands.add(/文章選讀/, "\n");
        PTT.commands.add(/目前顯示: 第/, "", _getpush);
      }
    }
    else if (!PTT.connect) {
      msg.PostMessage("alert", { type: false, msg: "PTT已斷線，請重新登入。" });
      PTT.unlock();
    }
    else if (!PTT.login) {
      msg.PostMessage("alert", { type: false, msg: "PTT尚未登入，請先登入。" });
      PTT.unlock();
    }
  }
  function login(id, pw) {
    if (!PTT.login) {
      const logincheck = () => {
        if (PTT.screenHaveText(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
          msg.PostMessage("alert", { type: false, msg: "登入失敗，帳號或密碼有誤。" });
          PTT.unlock();
        }
        else if (PTT.screenHaveText(/上方為使用者心情點播留言區/)) {
          msg.PostMessage("alert", { type: true, msg: "登入成功。" });
          PTT.login = true;
          PTT.unlock();
          //testcode
          /*(() => {
            PTTLockCheck(GetPostPush, `#1VobIvqM (C_Chat)`);
            insertText("x");
          })();*/
        }
        else if (PTT.screenHaveText(/登入中，請稍候\.\.\./)) {
          PTT.commands.add(/.*/, "", logincheck);
        }
        else {
          msg.PostMessage("alert", { type: false, msg: "發生了未知錯誤。" });
          console.log(PTT.screen);
        }
      }

      let result = PTT.screenHaveText(/請輸入代號，或以 guest 參觀，或以 new 註冊/);
      if (result) {
        msg.PostMessage("alert", { type: true, msg: "登入中。" });
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
    if (disbtn.length > 0) setTimeout(reconnect(), 100);
    if (PTT.controlstate === 1) {
      msg.PostMessage("alert", { type: false, msg: "指令執行中，請稍後再試。" });
      return;
    }
    else if (serverfull) {
      msg.PostMessage("alert", { type: false, msg: "系統過載, 請稍後再來..." });
      PTT.unlock();
    }

    if (!serverfull) {
      PTT.lastviewupdate = Date.now();
      PTT.lock();
      callback(...args);
      setTimeout(checkscreenupdate, 3500);
    }
  }
  //end
  msg["login"] = data => { PTTLockCheck(login, data.id, data.pw); };
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
