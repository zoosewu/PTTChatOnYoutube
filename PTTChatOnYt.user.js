// ==UserScript==
// @name               pttchatonyoutube
// @namespace          https://github.com/zoosewu/PTTChatOnYoutube
// @version            2.0.2696
// @description        Connect ptt pushes to youtube chatroom
// @author             Zoosewu
// @match              https://www.youtube.com/*
// @match              https://youtu.be/*
// @match              https://term.ptt.cc/*
// @match              https://hololive.jetri.co/*
// @match              http://blank.org/
// @grant              GM_xmlhttpRequest 
// @grant              GM_info
// @grant              unsafeWindow
// @grant              GM_getValue
// @grant              GM_setValue
// @grant              GM_deleteValue
// @license            MIT
// @name:zh-TW         Youtube聊天室顯示PTT推文
// @description:zh-tw  連結PTT推文到Youtube聊天室  讓你簡單追實況搭配推文
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require            https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require            https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @require            https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.min.js
// @require            https://cdn.jsdelivr.net/npm/vuex@3.6.0/dist/vuex.min.js
// @require            https://cdn.jsdelivr.net/npm/vue-scrollto@2.20.0/vue-scrollto.min.js
// @homepageURL        https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage
// @//downloadURL      https://greasyfork.org/scripts/418469-pttchatonyt/code/PttChatOnYt.user.js
// ==/UserScript==

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

function MessagePoster() {
  this.targetorigin = "";
  this.ownerorigin = "";
  this.targetWindow = null;
  this.PostMessage = function (msg, data) {
    if (this.targetWindow === null) return;

    const d = { m: msg, d: data };
    this.targetWindow.postMessage(d, this.targetorigin);
    if (showPostMessage && msg !== "PlayerUpdate") { console.log(this.ownerorigin + " message posted to " + this.targetorigin, d); }
  };
  this.onMessage = function (event) {
    // Check sender origin to be trusted
    if (event.origin !== this.targetorigin) return;

    const data = event.data;
    if (typeof (this[data.m]) == "function") {
      this[data.m].call(null, data.d);
    }
    if (showonMessage && data.m !== "PlayerUpdate") console.log(this.ownerorigin + " get message from " + this.targetorigin, data);
  };
  if (window.addEventListener) {
    console.log("addEventListener message");
    window.addEventListener("message", event => { this.onMessage.call(this, event); }, false);
  }
  else if (window.attachEvent) {
    console.log("addEventListener onmessage");
    window.attachEvent("onmessage", event => { this.onMessage.call(this, event); }, false);
  }
}

function InitPTT(messageposter) {
  const msg = messageposter;
  //get crypt key;
  cryptkey = GM_getValue("cryptkey", Math.random());
  //start script
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
        if (showalllog) console.log("==screenHaveText", reg, result);
        return result;
      }
      else {
        for (let i = 0; i < this.screen.length; i++) {
          const txt = this.screen[i];
          result = new RegExp(reg).exec(txt);
          if (result != null) {
            if (showalllog) console.log("==screenHaveText", reg, result);
            return result;
          }
        }
        if (showalllog) console.log("==screenHaveText", reg, result);
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
        if (showcommand) console.log("==Add command ", com);
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
            msg.PostMessage("alert", { type: 0, msg: "系統過載, 請稍後再來..." });
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
      { reg: /鴻雁往返  \(R\/y\)回信 \(x\)站內轉寄 \(d\/D\)刪信 \(\^P\)寄發新信/, input: 'q' }
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
      if (reportmode) console.log(`insertText : \"` + str + `\"`);
      e.clipboardData = { getData: () => str }
      t.dispatchEvent(e)
    }
  })()
  function ComLog(cmd) {
    if (showcommand) console.log("==execute command:", [cmd]);
  }
  function updatePagestate() {
    for (let i = 0; i < PTT.pagestatefilter.length; i++) {
      const filter = PTT.pagestatefilter[i];
      const result = PTT.screenHaveText(filter.reg);
      if (result != null) {
        if (reportmode) console.log("==page state:" + PTT.pagestate + "->" + filter.state, result);
        PTT.pagestate = filter.state;
        if (PTT.pagestate > 1) reconnecttrytimes = 10;
        msg.PostMessage("PTTState", PTT.pagestate);
        return;
      }
    }
  }
  function chechAutoCommand() {
    let commands = PTT.autocom;
    for (let autoi = 0; autoi < commands.length; autoi++) {
      const cmd = commands[autoi];
      const result = PTT.screenHaveText(cmd.reg);
      //if (showcommand) console.log("==auto command", cmd, result);
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
    if (showalllog) console.log("==OnUpdate start");
    PTT.screenclear();
    if (showalllog) console.log("==set pagestate.");
    updatePagestate();
    if (showalllog) console.log("==check autocommand.");
    if (!chechAutoCommand()) {
      if (showalllog) console.log("==check command.");
      command();
    }
    if (showPTTscreen) console.log("==PTT screen shot:", PTT.screen);
    let nextcom = PTT.commands.getfirst();
    if (showcommand && typeof nextcom !== 'undefined') console.log("==next command : reg:" + nextcom.reg + "input:" + nextcom.input, [nextcom.callback]);
    else if (showcommand) console.log("==next command : none.");
    if (showalllog) console.log("==OnUpdate end");
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
  function Reconnect() {
    const disbtn = $(`.btn.btn-danger[type=button]`);
    if (disbtn && disbtn.length > 0) {
      msg.PostMessage("alert", { type: 0, msg: "PTT已斷線，請重新登入。" });
      PTT.login = false;
      disbtn[0].click();
      serverfull = false;
      PTT.screenstate = -1;
      PTT.unlock;
      reconnecttrytimes--;
      return true;
    }
    return false;
  }
  function checkscreenupdate() {
    if (PTT.controlstate === 0) return;
    const now = Date.now();
    if (now > PTT.lastviewupdate + 10000) {
      msg.PostMessage("alert", { type: 0, msg: "PTT無回應，請稍後再試，或重新整理頁面。" });
      PTT.unlock();
    }
    else {
      msg.PostMessage("alert", { type: 1, msg: "指令執行中......" });
      setTimeout(checkscreenupdate, 3500);
    }
  }

  // -----------------------task getpostbyline --------------------
  function gotoBoard() { insertText("s" + PTTPost.board + "\n"); }
  function boardcheck() {
    console.log("Issue #9 trace, pagestate:", PTT.pagestate);
    const res = { pass: false, callback: gotoBoard }
    let reg = "";
    if (PTT.pagestate === 4) {
      res.pass = true;
      return res;
    }
    else if (PTT.pagestate === 1) return res;
    else if (PTT.pagestate === 2) reg = "看板《" + PTTPost.board + "》";
    else if (PTT.pagestate === 3) reg = "看板 *" + PTTPost.board;
    const currect = PTT.screenHaveText(reg);
    if (currect) res.pass = true;
    console.log("Issue #9 trace, pass:", res.pass, ", currect:", currect);
    return res;
  }

  function gotoPost() { insertText("NPP#" + PTTPost.AID + "\n\n"); PTTPost.isgotopost = true; }
  function PostCheck() {
    const res = { pass: true, callback: gotoPost }
    if (PTT.pagestate === 2) res.pass = false;
    else if (PTT.pagestate === 1) console.log("==PostCheck error, PTT.pagestate == 1.");
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
          if (title === PTTPost.title) { }
          else { res.pass = false; }
        }
        else {
          PTTPost.title = title;
          let result = PTT.screenHaveText(/時間  (\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/);
          PTTPost.posttime = new Date(result[1]);
        }
      }
      else { res.pass = false; console.log("==PotsTitleCheck error, Reg Parse Error."); }
    }
    else if (PTT.pagestate === 1) console.log("==PotsTitleCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==PotsTitleCheck error, PTT.pagestate == 2.");
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
    else if (PTT.pagestate === 1) console.log("==PistLineCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==PistLineCheck error, PTT.pagestate == 2.");
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
    const checkedline = [];
    //console.log("==GetPush from " + targetline + "to " + (PTT.screen.length - 1));
    //console.log("==(pttstartline, pttendline, startline, endline, targetline): (" + PTTPost.startline + ", " + PTTPost.endline + ", " + startline + ", " + endline + ", " + targetline + ")");
    for (let i = targetline; i < PTT.screen.length; i++) {
      const line = PTT.screen[i];
      const result = /^(→ |推 |噓 )(.+?): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(line);
      if (result != null) {
        let content = result[3];
        var reg = /\s+$/g;
        content = content.replace(reg, "");
        savepush(content, result);
        if (reportmode) checkedline.push(i);
      }
    }
    if (reportmode) console.log("startline,endline, checked line", startline, PTTPost.endline, checkedline);
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
    else if (PTT.pagestate === 1) console.log("==PostPercentCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==PostPercentCheck error, PTT.pagestate == 2.");
    return res;
  }
  // -----------------------task getpostbyrecent --------------------
  function gotoend() { insertText('G'); }
  function GetRecentLine() {
    const res = { pass: false, callback: gotoend }
    if (PTT.pagestate === 4 || PTT.pagestate === 3) {
      const line = PTT.screenHaveText(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~(\d+) 行/);
      if (line) {
        let targetline = +line[1] - PTTPost.endline - 1;
        if (targetline < 3) targetline = 3;
        //console.log("==GetRecentLine, TotalLine, GotoLline", line[1], targetline);
        PTTPost.endline = targetline;
        if (PTT.pagestate === 4) insertText(PTTPost.endline + ".\n");
        else if (PTT.pagestate === 3) insertText("q");
        res.pass = true;
      }
    }
    else if (PTT.pagestate === 1) console.log("==GetPushTask error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==GetPushTask error, PTT.pagestate == 2.");
    return res;
  }
  //
  // -----------------------task setNewPush --------------------
  let SetNewPushtrytime = 5;
  function SetNewPush() {
    const res = { pass: false, callback: () => { } }
    SetNewPushtrytime--;
    if (SetNewPushtrytime < 0) { res.pass = true; return res; }
    if (PTT.pagestate === 4 || PTT.pagestate === 3) {
      const pushcd = PTT.screenHaveText(/◆ 本文已過長, 禁止快速連續推文/);
      if (pushcd) {
        msg.PostMessage("alert", { type: 0, msg: "本文已過長, 禁止快速連續推文。" });
        res.pass = true
        return res;
      }
      const pushtext = PTTPost.setpush + "\n";
      const pushcheck = PTT.screenHaveText(/(.+?): (.+?) +確定\[y\/N]:/);
      if (pushcheck) {
        console.log("pushcheck");
        PTTPost.setpush = "";
        PTTPost.pushedtext = pushcheck[2];
        insertText("y\n\nG");
        res.pass = true
        return res;
      }
      const pushtype = PTT.screenHaveText(/您覺得這篇文章/);
      if (pushtype) {
        console.log("pushtype");
        insertText("\n" + pushtext);
        return res;
      }
      const pushdirect = PTT.screenHaveText(/時間太近, 使用|作者本人, 使用/);
      if (pushdirect) {
        console.log("pushdirect", pushdirect);
        insertText(pushtext);
        return res;
      }
      const unpush = PTT.screenHaveText(/瀏覽 第 .+ 頁 \( *(\d+)%\)/);
      if (unpush) {
        console.log("unpush");
        insertText("%");
        return res;
      }
    }
    else if (PTT.pagestate === 1) console.log("==GetPushTask error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==GetPushTask error, PTT.pagestate == 2.");
    return res;
  }
  //------------------------task--------------------------------
  function RunTask(tasklist, finishBehavior) {
    if (PTTPost.isgotopost && PTT.pagestate === 2) {
      msg.PostMessage("alert", { type: 0, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
      PTT.unlock();
    }
    for (let i = 0; i < tasklist.length; i++) {
      const result = tasklist[i]();
      if (result.pass === false) {
        if (reportmode) console.log("RunTask pass failed, pagestate:", PTT.pagestate, ", task name:", tasklist[i].name);
        result.callback();
        PTT.commands.add(/.*/, "", RunTask, tasklist, finishBehavior);
        return;
      }
    }
    finishBehavior();
  }
  //------------------------tasks--------------------------------

  const task = {};
  task.GetPostByLine = [boardcheck, PostCheck, PotsTitleCheck, PostLineCheck, PostPercentCheck];
  task.GetPostRecentLine = [boardcheck, PostCheck, PotsTitleCheck, GetRecentLine];
  task.SetPostNewPush = [boardcheck, PostCheck, PotsTitleCheck, SetNewPush];
  function SetNewPushTask(pushtext) {
    let allowedchar = 24;
    let addedtext = "";
    let trytime = 7;
    while (trytime >= 0 && allowedchar > 0 && pushtext.length > 0) {
      const addtextreg = "(.{0," + allowedchar + "})(.*)";// (.{0,24})(.*)
      const result = new RegExp(addtextreg).exec(pushtext);
      addedtext += result[1];
      const halfchar = addedtext.match(/[A-Za-z0-9_ :\/\\.?=%]/g);
      const halfcount = halfchar ? halfchar.length : 0;
      allowedchar = parseInt((48 - addedtext.length * 2 + halfcount) / 2);
      pushtext = result[2];
      if (reportmode) {
        console.log("SetNewPushTask Text Reg==", addedtext.length * 2, "==", halfcount, "==", halfchar);
        console.log("SetNewPushTask Text Reg==", addedtext, "==", pushtext, "==", allowedchar, "==", result);
      }
      trytime--;
    }
    SetNewPushtrytime = 5;
    PTTPost.setpush = addedtext;
    RunTask(task.SetPostNewPush, recieveNewPush);
  }

  function recieveNewPush() {
    msg.PostMessage("alert", { type: 2, msg: "推文成功。" });
    msg.PostMessage("pushedText", PTTPost.pushedtext);
    PTTPost.pushedtext = "";
    if (showalllog) console.log(PTTPost);
    GetPush(PTTPost.AID, PTTPost.board, PTTPost.endline, GetPushTask);
  }
  function GetRecentLineTask() { RunTask(task.GetPostRecentLine, () => PTT.commands.add(/.*/, "", GetPushTask)); }
  function GetPushTask() { RunTask(task.GetPostByLine, recievePushes); }
  function recievePushes() {
    PTT.unlock();
    msg.PostMessage("alert", { type: 2, msg: "文章讀取完成。" });
    msg.PostMessage("newPush", PTTPost);
    if (showalllog) console.log(PTTPost);
  }
  //------------------------Main Command--------------------------------
  function GetPush(pAID, bname, startline, task) {
    if (PTT.pagestate > 0) {
      startline = startline || 3;
      msg.PostMessage("alert", { type: 2, msg: "文章讀取中。" });
      const samepost = (bname === PTTPost.board) && (pAID === PTTPost.AID);
      if (samepost) {
        PTTPost.pushes = [];
        PTTPost.samepost = true;
        PTTPost.endline = startline;
        PTTPost.isgotopost = true;
        if (reportmode) console.log("Get same post's push.", bname, PTTPost.board, pAID, PTTPost.AID);
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
          isgotopost: false,
        }
        if (reportmode) console.log("Get new post's push.", bname, PTTPost.board, pAID, PTTPost.AID);
      }
      if (PTT.pagestate === 1) insertText("m");
      if (PTT.pagestate === 2) insertText("P");
      else if (PTT.pagestate === 3 || !PTTPost.isgotopost) insertText("q");
      else insertText("q\n");
      PTT.commands.add(/.*/, "", task);
    }
    else if (PTT.screenstate === -1) {
      msg.PostMessage("alert", { type: 0, msg: "PTT已斷線，請重新登入。" });
      PTT.unlock();
    }
    else if (PTT.screenstate === 0) {
      msg.PostMessage("alert", { type: 0, msg: "PTT尚未登入，請先登入。" });
      PTT.unlock();
    }
  }

  function Login(id, pw) {
    msg.PostMessage("alert", { type: 2, msg: "登入中" });
    if (!PTT.login) {
      const logincheck = () => {
        if (PTT.screenHaveText(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
          msg.PostMessage("alert", { type: 0, msg: "登入失敗，帳號或密碼有誤。" });
          PTT.unlock();
        }
        else if (PTT.screenHaveText(/上方為使用者心情點播留言區|【 精華公佈欄 】/)) {
          msg.PostMessage("alert", { type: 2, msg: "登入成功。" });
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
          msg.PostMessage("alert", { type: 0, msg: "發生了未知錯誤，可能是因為保留連線導致被踢掉。" });
          console.log(PTT.screen);
          PTT.unlock();
        }
      }

      let result = PTT.screenHaveText(/請輸入代號，或以 guest 參觀，或以 new 註冊/);
      if (result) {
        insertText(id + "\n" + pw + "\n");
        PTT.commands.add(/.*/, "", logincheck);
      }
      else {
        PTT.commands.add(/.*/, "", Login, id, pw);
      }
    }
    else {
      msg.PostMessage("alert", { type: 0, msg: "已經登入，請勿重複登入。" });
      PTT.unlock();
    }
  }
  //------------------------Lock Check--------------------------------
  function PTTLockCheck(callback, ...args) {
    if (Reconnect()) { }
    else if (PTT.controlstate === 1) {
      msg.PostMessage("alert", { type: 0, msg: "指令執行中，請稍後再試。" });
      return;
    }
    else if (serverfull) {
      msg.PostMessage("alert", { type: 0, msg: "系統過載, 請稍後再來..." });
      PTT.unlock();
    } else if (!serverfull) {
      PTT.lastviewupdate = Date.now();
      PTT.lock();
      if (reportmode) console.log("PTTLockCheck", ...args);
      callback(...args);
      setTimeout(checkscreenupdate, 3500);
    }
  }
  //end
  let reconnecttrytimes = 10;
  const ReconnectInterval = window.setInterval((() => {
    if (reconnecttrytimes >= 0) { Reconnect(); }
  }), 1500);

  msg["login"] = data => {
    const i = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8);
    const p = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8);
    //console.log(data );
    //console.log([i, p],cryptkey);
    PTTLockCheck(Login, i, p);
  };
  msg["getPushByLine"] = data => { if (reportmode) console.log("getPushByLine", data); PTTLockCheck(GetPush, data.AID, data.board, data.startline, GetPushTask); };
  msg["getPushByRecent"] = data => { if (reportmode) console.log("getPushByRecent", data); PTTLockCheck(GetPush, data.AID, data.board, data.recent, GetRecentLineTask); };
  msg["setNewPush"] = data => { if (reportmode) console.log("setNewPush", data); PTTLockCheck(SetNewPushTask, data); };
}

function HerfFilter(msg, filters) {
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
        setTimeout(f.callback, 10, msg);
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

function InsFilter(fullname, reg, ownerorigin, Initcallback) {
  return {
    Fullname: fullname,
    Reg: reg,
    ownerorigin: ownerorigin,
    callback: Initcallback
  }
}

let PTTAppNav = {
  computed: {
    isGotoChat: function () {
      const go = this.gotoChat;
      if (reportmode) console.log("isGotoChat", go);
      if (go) {
        this.$store.dispatch('gotoChat', false);
        this.$refs.chatbtn.click();
        if (reportmode) console.log("gotoChat");
      }
      return go;
    },
    ...Vuex.mapGetters([
      'gotoChat',
    ])
  },
  template: `<ul id="PTTChat-navbar" class="nav nav-tabs justify-content-center" role="tablist">
  <li class="nav-item" :go="isGotoChat">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-Chat" data-toggle="tab" href="#PTTChat-contents-Chat"
      role="tab" aria-controls="PTTChat-contents-Chat" aria-selected="false" ref="chatbtn">聊天室</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent active" id="nav-item-Connect" data-toggle="tab"
      href="#PTTChat-contents-Connect" role="tab" aria-controls="PTTChat-contents-Connect" aria-selected="true">連線設定</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-other" data-toggle="tab" href="#PTTChat-contents-other"
      role="tab" aria-controls="PTTChat-contents-other" aria-selected="false">說明</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-PTT" data-toggle="tab" href="#PTTChat-contents-PTT"
      role="tab" aria-controls="PTTChat-contents-PTT" aria-selected="false">PTT畫面</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-log" data-toggle="tab" href="#PTTChat-contents-log"
      role="tab" aria-controls="PTTChat-contents-log" aria-selected="false">log</a>
  </li>
  <li class="nav-item">
    <button class="nav-link ptt-text bg-transparent d-none" id="nav-item-TimeSet" type="button" data-toggle="collapse"
      data-target="#PTTChat-Time" aria-controls="PTTChat-Time" aria-expanded="false">時間</a>
  </li>
</ul>`,
}

const types = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  PLUGINHEIGHT: 'PluginHeight',
  PTTID: "PTTID",
  POSTAID: "LastPostAID",
  ALERT: "Alert",
  PUSHDATA: "PushData",
  UPDATEPOST: "UpdatePost",
  UPDATECHAT: "Updatechatlist",
  UPDATELOG: "UpdateLog",
  VIDEOSTARTTIME: "VIDEOSTARTTIME",
  VIDEOSTARTDATE: "VIDEOSTARTDATE",
  VIDEOPLAYEDTIME: "VIDEOPLAYEDTIME",
  VIDEOCURRENTRIME: "VIDEOCURRENTRIME",
  PAGECHANGE: "PAGECHANGE",
  GOTOCHAT: "GOTOCHAT",
  PTTSTATE: "PTTSTATE",
  ENABLESETNEWPUSH: "EnableSetNewPush",
  DISABLEPUSHGRAY: "DisablePushGray",
  ISSTREAM: "ISSTREAM",
  CHATFONTSIZE: "Fontsize",
  CHATSPACE: "ChatSpace",
  PUSHINTERVAL: "PushInterval",
}

// state
const state = {
  count: 0,
  alert: { type: 0, msg: "" },
  msg: {},
  post: { AID: "", board: "", title: "", date: (() => { const t = new Date(); t.setHours(0); t.setMinutes(0); t.setSeconds(0); return t; })(), lastendline: 0, lastpushtime: new Date(), pushcount: 0, nowpush: 0, gettedpost: false, },
  chatlist: [],
  log: {},
  firstChatTime: {},
  lastChatTime: {},
  VStartTime: ["18", "00", "00", false],
  VStartDate: (() => { const t = new Date(); t.setHours(0); t.setMinutes(0); t.setSeconds(0); return t; })(),
  VPlayedTime: 0,
  VCurrentTime: new Date(),
  pageChange: false,
  gotoChat: false,
  PTTState: 0,
  isStream: true,
  enablesetnewpush: GM_getValue(types.ENABLESETNEWPUSH, false),
  disablepushgray: GM_getValue(types.DISABLEPUSHGRAY, false),
  pluginHeight: GM_getValue(types.PLUGINHEIGHT, -1),
  pushInterval: GM_getValue(types.PUSHINTERVAL, -1),
  chatFontsize: GM_getValue(types.CHATFONTSIZE, -1),
  chatSpace: GM_getValue(types.CHATSPACE, -1),
}
// mutations
const mutations = {
  // action 發出 commit 會對應到 mutation 使用的是 Object key 方式
  [types.INCREASE](state) {
    // 在 mutation 改變 state（只有 mutation 可以改變！）
    state.count += 1;
  },
  [types.DECREASE](state) {
    state.count -= 1;
  },
  [types.ALERT](state, alert) {
    state.alert = alert;
  },
  [types.UPDATEPOST](state, post) {
    state.post = post;
  },
  [types.UPDATECHAT](state, chatlist) {
    state.chatlist = chatlist;
  },
  [types.UPDATELOG](state, log) {
    state.log = log;
  },
  [types.VIDEOSTARTTIME](state, videostarttime) {
    state.VStartTime = videostarttime;
  },
  [types.VIDEOSTARTDATE](state, videostartdate) {
    state.VStartDate = videostartdate;
  },
  [types.VIDEOPLAYEDTIME](state, videoplayedtime) {
    state.VPlayedTime = videoplayedtime;
  },
  [types.VIDEOCURRENTRIME](state, vcurrentime) {
    state.VCurrentTime = vcurrentime;
  },
  [types.PAGECHANGE](state, pageChange) {
    state.pageChange = pageChange;
  },
  [types.GOTOCHAT](state, gotoChat) {
    state.gotoChat = gotoChat;
  },
  [types.PTTSTATE](state, pttstate) {
    //console.log("PTTState mutations", pttstate);
    state.PTTState = pttstate;
  },
  [types.ISSTREAM](state, isStream) {
    state.isStream = isStream;
  },
  [types.ENABLESETNEWPUSH](state, isenable) {
    //console.log("PTTState mutations", pttstate);
    GM_setValue(types.ENABLESETNEWPUSH, isenable);
    state.enablesetnewpush = isenable;
  },
  [types.DISABLEPUSHGRAY](state, disable) {
    //console.log("PTTState mutations", pttstate);
    GM_setValue(types.DISABLEPUSHGRAY, disable);
    state.disablepushgray = disable;
  },
  [types.PLUGINHEIGHT](state, height) {
    state.pluginHeight = height;
    GM_setValue(types.PLUGINHEIGHT, height);
  },
  [types.PUSHINTERVAL](state, interval) {
    GM_setValue(types.PUSHINTERVAL, interval);
    state.pushInterval = interval;
  },
  [types.CHATFONTSIZE](state, size) {
    GM_setValue(types.CHATFONTSIZE, size);
    state.chatFontsize = size;
  },
  [types.CHATSPACE](state, space) {
    GM_setValue(types.CHATSPACE, space);
    state.chatSpace = space;
  },

}

const getters = {
  getCount: state => { return state.count },
  newAlert: state => { return state.alert },
  log: state => { return state.log },
  post: state => { return state.post },
  newChatList: state => { return state.chatlist },
  videoCurrentTime: state => { return state.VCurrentTime; },
  gotoChat: state => { return state.gotoChat; },
  PTTState: state => { return state.PTTState; },//PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
  //checkbox
  getEnableSetNewPush: state => { return state.enablesetnewpush; },
  getDisablePushGray: state => { return state.disablepushgray; },
  //input value
  getPluginHeight: state => { return state.pluginHeight },
  getFontsize: state => { return state.chatFontsize; },
  getChatSpace: state => { return state.chatSpace; },
  getPushInterval: state => { return state.pushInterval; },
}

const actions = {
  actionIncrease: ({ commit }) => { console.log('actionIncrease'); commit(types.INCREASE); },
  actionDecrease: ({ commit }) => { console.log('actionDecrease'); commit(types.DECREASE); },
  Alert: (context, alertobject) => { context.commit(types.ALERT, alertobject); },
  updateLog: (context, log) => {
    if (!Array.isArray(log)) context.commit(types.UPDATELOG, log);
    else for (let i = 0; i < log.length; i++) {
      const el = array[i];
      context.commit(types.UPDATELOG, el);
    }
  },
  updatePost: ({ dispatch, commit, state }, postdata) => {
    let newpost;
    if (postdata.AID === state.post.AID && postdata.board === state.post.board) {
      newpost = state.post;
      newpost.lastendline = postdata.endline;
    }
    else {
      newpost = {
        AID: postdata.AID,
        board: postdata.board,
        title: postdata.title,
        date: postdata.posttime,
        lastendline: postdata.endline,
        lastpushtime: new Date(),
        pushcount: 0,
        nowpush: 0,
        gettedpost: true,
      };
      const t = newpost.date;
      commit(types.UPDATELOG, { type: "postaid", data: newpost.AID });
      commit(types.UPDATELOG, [{ type: "postboard", data: newpost.board },
      { type: "posttitle", data: newpost.title },
      { type: "postdate", data: t.toLocaleDateString() + " " + t.toLocaleTimeString() },
      { type: "postendline", data: newpost.lastendline }]);
    }
    if (postdata.pushes.length > 0) {
      newpost.pushcount += postdata.pushes.length;
      commit(types.UPDATEPOST, newpost);
      dispatch('updateChat', postdata.pushes);
      dispatch('updateVideoStartDate');
    }
    //console.log("state.pageChange", state.pageChange);
    if (state.pageChange) {
      dispatch('gotoChat', true);
      dispatch('pageChange', false);
    }
  },
  updateChat: ({ commit, state }, pushes) => {
    const existpush = state.post.pushcount - pushes.length;
    const chatlist = [];
    let sametimecount = 0;
    let sametimeIndex = 0;
    for (let index = 0; index < pushes.length; index++) {
      const currpush = pushes[index];//抓出來的推文
      const chat = {};
      if (!state.isStream) {
        if (index >= sametimeIndex) {//獲得同時間點的推文數量
          for (let nextpointer = index + 1; nextpointer < pushes.length; nextpointer++) {
            const element = pushes[nextpointer];
            //console.log("currpush.date.getTime(), element.date.getTime()", currpush.date.getTime(), element.date.getTime());
            if ((currpush.date.getTime() < element.date.getTime()) || (nextpointer >= pushes.length - 1)) {
              sametimeIndex = nextpointer
              sametimecount = nextpointer - index;
              //console.log("sametimeIndex, sametimecount", sametimeIndex, sametimecount);
              break;
            }
          }
        }
      }
      chat.time = new Date(currpush.date.getTime());
      //console.log("sametimeIndex, index, sametimecount", sametimeIndex, index, sametimecount);
      if (!state.isStream && sametimecount > 0) chat.time.setSeconds((sametimecount + index - sametimeIndex) * 60 / sametimecount);
      chat.id = currpush.id;
      chat.type = currpush.type;
      chat.msg = currpush.content;
      chat.index = existpush + index;
      chat.gray = !state.disablepushgray;
      chatlist.push(chat);
      //console.log("new Chat", chat);
    }
    //console.log("chatlist actions", chatlist);
    commit(types.UPDATECHAT, chatlist);
  },
  updateVideoStartTime: ({ dispatch, commit, state }, time) => {
    commit(types.VIDEOSTARTTIME, time);
    dispatch('updateVideoStartDate');
  },
  updateVideoStartDate: ({ dispatch, commit, state }) => {
    const postdate = state.post.date || new Date();
    const time = state.VStartTime;
    const date = new Date(postdate);
    date.setHours(+time[0]);
    date.setMinutes(+time[1]);
    date.setSeconds(+time[2]);
    commit(types.UPDATELOG, { type: "videostarttime", data: date.toLocaleDateString() + " " + date.toLocaleTimeString() });
    commit(types.VIDEOSTARTDATE, date);
    dispatch('updateVideoCurrentTime');
  },
  updateVideoPlayedTime: ({ dispatch, commit, state }, time) => {
    // console.log("updateVideoPlayedTime", time);
    commit(types.VIDEOPLAYEDTIME, time);
    commit(types.UPDATELOG, { type: "videoplayedtime", data: time });
    dispatch('updateVideoCurrentTime');
  },
  updateVideoCurrentTime: ({ dispatch, commit, state }) => {
    const vstart = state.VStartDate;
    const time = state.VPlayedTime;//[H,m,s,isVideoVeforePost]
    let currtime = new Date(vstart.valueOf());
    currtime.setSeconds(vstart.getSeconds() + time);
    if (reportmode) console.log("updateVideoCurrentTime check, currtime.valueOf() < state.post.date.valueOf()", currtime.valueOf() < state.post.date.valueOf(), state.VStartTime, state.VStartTime[3], currtime.valueOf(), state.post.date.valueOf());

    if (currtime.valueOf() < state.post.date.valueOf()) {
      if (reportmode) console.log("updateVideoCurrentTime + 24");
      currtime.setHours(currtime.getHours() + 24);
      if (state.VStartTime[3]) {
        if (reportmode) console.log("updateVideoCurrentTime brfore - 24");
        currtime.setHours(currtime.getHours() - 24);
      }
    }
    //console.log("updateVideoCurrentTime vstart, time, currtime", vstart, time, currtime);
    commit(types.UPDATELOG, { type: "videocurrenttime", data: currtime.toLocaleDateString() + " " + currtime.toLocaleTimeString() });
    commit(types.VIDEOCURRENTRIME, currtime);
  },
  pageChange: ({ commit }, Change) => { commit(types.PAGECHANGE, Change); },
  gotoChat: ({ commit }, gtChat) => { commit(types.GOTOCHAT, gtChat); },
  PTTState: ({ commit }, pttstate) => { commit(types.PTTSTATE, pttstate); },
  isStream: ({ commit }, isStream) => { commit(types.ISSTREAM, isStream); },
  //checkbox
  setEnableSetNewPush: ({ commit }, isenable) => { commit(types.ENABLESETNEWPUSH, isenable); },
  setDisablePushGray: ({ commit }, disablepushgray) => { commit(types.DISABLEPUSHGRAY, disablepushgray); },
  //input value
  setPluginHeight: (context, height) => { context.commit(types.PLUGINHEIGHT, height); },
  setFontsize: ({ commit }, size) => { commit(types.CHATFONTSIZE, size); },
  setChatSpace: ({ commit }, space) => { commit(types.CHATSPACE, space); },
  setPushInterval: ({ commit }, pushInterval) => { commit(types.PUSHINTERVAL, pushInterval); },
}

Vue.use(Vuex);

let store = new Vuex.Store({
  state,
  mutations,
  getters,
  actions,

  // 嚴格模式，禁止直接修改 state
  strict: true
});

let ChatScrollBtn = {
  props: ['isAutoScroll'],
  methods: {
    click: function () {
      this.$emit("autoscrollclick");
    }
  },
  computed: {
    className: function () {
      let classes = ["position-absolute"];
      if (this.isAutoScroll) { classes.push("d-none"); }
      return classes.join(' ');
      /*
      const disable = this.isAutoScroll ? "d-none" : "";
      return "position-absolute " + disable;*/
    }
  },
  template: `<div id="PTTChat-contents-Chat-btn" :class="className"
  style="z-index:400; bottom:10%; left: 50%; -ms-transform: translateX(-50%); transform: translateX(-50%);">
  <button id="AutoScroll" class="btn btn-primary" type="button" v-on:click="click">自動滾動</button>
</div>`,
}

Vue.component('chat-item', {
  props: ['index', 'chat', 'gray'],
  data: function () {
    return {
      uid: this.index,
      timeH: paddingLeft(this.chat.time.getHours(), +2),
      timem: paddingLeft(this.chat.time.getMinutes(), +2),
    }
  },
  computed: {
    msg: function () {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");
    },
    typeclass: function () {
      const typecolor = this.chat.type === "推 " ? "ptt-chat-type" : "ptt-chat-type-n";
      return typecolor + " mr-2 mb-0";
    },
    bgc: function () {
      if (this.getDisablePushGray) return "";

      // console.log("bgc", this.index, this.chat, this.chat.gray);
      const isUnchat = this.gray ? "0.25" : "0";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      return { backgroundColor: color, transition: "2s" };
    },
    msgFontsize: function () {
      return { 'font-size': this.getFontsize + 'px', "line-height": this.getFontsize * 1.2 + 'px' };
    },
    infoFontsize: function () {
      return { 'font-size': this.getFontsize * 0.8334 + 'px', "line-height": this.getFontsize + 'px' };
    },
    space: function () {
      return { 'margin-bottom': this.getChatSpace * 18 + 'px' };
    },
    ...Vuex.mapGetters([
      'getDisablePushGray',
      'getFontsize',
      'getChatSpace',
    ])
  },
  // mounted() { console.log("mounted", this.index, this.chat); },
  updated: function () { if (reportmode) console.log('updated, uid, listIndex, chatIndex, msg', this.uid, this.index, this.chat.index, this.chat.msg); },
  template: `<li :id="chat.index" class="ptt-chat media px-3" v-bind:style="bgc">
  <div class="media-body mw-100">
    <div class="ptt-chat-info d-flex flex-row" :style="infoFontsize">
      <p :class="typeclass">{{ this.chat.type }}</p>
      <p class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.chat.id }}</p>
      <p class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</p>
    </div>
    <div>
      <p class="ptt-chat-msg mb-0 mx-2" :style="msgFontsize" v-html="msg"></p>
    </div>
    <div :style="space"> </div>
  </div>
</li>`,
});

let chatSetNewPush = {
  data: function () {
    return {
      pushtext: "",
    }
  },
  inject: ['msg', 'isStream'],
  methods: {
    setPush: function () {
      const result = /.+/.exec(this.pushtext);
      if (!result) this.$store.dispatch('Alert', { type: 0, msg: "請輸入文字。" });
      else if (this.PTTState < 1) this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
      else if (!this.post.gettedpost) this.$store.dispatch('Alert', { type: 0, msg: "尚未獲取文章，請先獲取文章。" });
      else this.msg.PostMessage("setNewPush", this.pushtext);
    },
    removePushedText(text) {
      if (this.pushtext.indexOf(text) === 0) this.pushtext = this.pushtext.substring(text.length, this.pushtext.length);
      console.log(this.pushtext);
      /*const reg = "(" + text + ")(.*)";
      const result = new RegExp(reg).exec(this.pushtext);
      if (reportmode) console.log("removePushedText", text, this.pushtext, result);
      this.pushtext = result[2];*/
    }
  },
  computed: {
    placeholder: function () {
      if (this.getEnableSetNewPush) return "輸入文字以推文...";
      else return "請到連線設定開啟測試版推文功能";
    },
    className: function () {
      let classes = ["form-row", "my-2"];
      if (!this.isStream) { classes.push("d-none"); }
      return classes.join(' ');
    },
    ...Vuex.mapGetters([
      'post',
      'PTTState',
      'getEnableSetNewPush',
    ])
  },
  mounted() {
    this.msg["pushedText"] = data => this.removePushedText(data);
  },
  template: `<div :class="className">
  <div class="col">
    <input id="setnewpush" class="form-control" type="text" style="font-size:14px" :placeholder="placeholder" autocomplete="off"
      v-model.lazy="pushtext" v-on:keyup.13="setPush" :disabled="!getEnableSetNewPush">
  </div>
  <div class="col-2 px-0">
    <button id="setnewpushbtn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="setPush()">推文</button>
  </div>
</div>`,
}

let Chat = {
  inject: ['msg', 'isStream'],
  data: function () {
    return {
      _allchats: [],
      chatList: [],
      lastChat: [],
      instancedChat: [],
      acChat: 0,
      lastactiveChat: -1,
      activeRange: 200,
      activeChatStart: 0,
      activeChatEnd: 0,
      intervalChat: null,
      intervalScroll: null,
      nextUpdateTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
      isAutoScroll: true,
    }
  },
  methods: {
    scrollToChat: function () {
      if (this.lastactiveChat != this.activeChat) {
        this.lastactiveChat = this.activeChat;
        //console.log("gray task, start, end, activeChat", this.chatList[0].index, this.chatList[this.chatList.length - 1].index, this.activeChat);
        if (!this.getDisablePushGray) {
          for (let i = 0; i < this.chatList.length; i++) {
            chat = this.chatList[i];
            const isgray = chat.index > this.activeChat;
            //console.log("gray check, uid, activeChat, color, lastColor", chat.index, this.activeChat, isgray, chat.gray);
            if (isgray != chat.gray) chat.gray = isgray;//console.log("gray change, graychange, chatuid", chat.gray, '=>', isgray, chat.index);
          }
        }
      }
      if (this.isAutoScroll) {
        const scrollPos = this.getScrollPos();
        const p = this.$refs.chatmain.scrollTop - scrollPos;
        if (reportmode) console.log("scrollToChat, scrollTop, scrollPos", this.$refs.chatmain.scrollTop, scrollPos);
        if (p > 20 || p < -20) { this.$refs.chatmain.scrollTo({ top: scrollPos, behavior: "smooth" }); }
      }
    },
    getScrollPos: function () {
      const clientHeight = this.$refs.chatmain ? this.$refs.chatmain.clientHeight : 0;
      const current = this.activeChat + 1 - this.activeChatStart;
      const chatnode = this.$children.find(ele => { return ele.chat && ele.chat.index === this.activeChat; });
      //console.log("getScrollPos, chatnode, chatnode - 1", current, [chatnode], this.$children[current - 1]);
      if (!chatnode) return 0;
      const chat = chatnode.$el;
      const chatHeight = chat.clientHeight;

      const scrolloffset = (clientHeight - chatHeight) / 2;
      const scrollmin = 0;
      const scrollmax = this.$refs.chats.clientHeight - clientHeight;
      let scrollPos = chat.offsetTop - scrolloffset;
      if (scrollPos < scrollmin) scrollPos = scrollmin;
      else if (scrollPos > scrollmax) scrollPos = scrollmax;
      return scrollPos;
    },
    updateChat: function () {
      this.getCurrentChat();
      if (this.lastactiveChat != this.activeChat) {
        const list = this.allchats;
        const start = this.activeChatStart > 0 ? this.activeChatStart : 0;
        const end = this.activeChatEnd;
        //if (this.chatList.length > 0) console.log("beforeupdate chat", this.chatList[0].msg, this.chatList[this.chatList.length - 1].msg);
        // if (this.chatList.length > 2000) {
        //   for (let i = this.chatList.length - 1; i >= 0; i--) {
        //     const chat = this.chatList[i];
        //     //console.log("remove check", chat.index, chat.msg, chat);
        //     if (chat.index < start || chat.index > end) {
        //       this.chatList.splice(i, 1);
        //       console.log("remove chat", chat.index, chat.msg, chat);
        //     }
        //   }
        // }
        const tmpchat = [];
        let addchat = false;
        for (let i = start; i < list.length && i <= end; i++) {
          const chat = list[i];
          //console.log("add check, i, chat.index, chat.msg, chat", i, chat.index, chat.msg, chat);
          if (!this.instancedChat.includes(i)) {
            if (!addchat) addchat = true;
            const ins = { time: chat.time, id: chat.id, type: chat.type, msg: chat.msg, index: chat.index, gray: chat.gray, };
            tmpchat.push(ins);
            this.instancedChat.push(i);
            //chat.ins = ins;
            //console.log("add chat", i, chat.msg, chat);
          }
        }
        console.log(this.instancedChat);
        if (addchat) this.chatList = this.chatList.concat(tmpchat);
        //if (this.chatList.length > 0) console.log("after chat", this.chatList[0].msg, this.chatList[this.chatList.length - 1].msg);
        this.chatList.sort(function (a, b) { return a.index - b.index; });
        if (reportmode) console.log("activeChat, start, end, allList, chatList", this.activeChat, start, this.activeChatEnd, list, this.chatList);
      }
    },
    getCurrentChat: function () {
      const chats = this.allchats;
      if (this.isStream) {
        this.activeChat = chats.length - 1;
      }
      else {
        if (this.activeChat && chats && reportmode) {
          console.log("current time: " + this.videoCurrentTime.toString(), ", activeChat", this.activeChat);
          if (chats[this.activeChat - 1]) {
            console.log("activeChat-1", chats[this.activeChat - 1].time.toString());
          }
          if (chats[this.activeChat]) {
            console.log("activeChat+0", chats[this.activeChat].time.toString(), ", activeChat > CurrentTime", chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf());
          }
          if (chats[this.activeChat + 1]) {
            console.log("activeChat+1", chats[this.activeChat + 1].time.toString(), ", activeChat < CurrentTime", chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf());
          }
        }
        for (move = 128; move > 0; move = move / 2) {
          while (this.activeChat > 0 && chats[this.activeChat] && chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
            this.activeChat -= move;
            //console.log("move activeChat to ", this.activeChat);
          }
          while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
            this.activeChat += move;
            //console.log("move activeChat to ", this.activeChat);
          }
          if (move === 1) break;
        }
      }

      const visibleEnd = this.activeChat + this.activeRange / 2;
      this.activeChatEnd = visibleEnd < chats.length - 1 ? visibleEnd : chats.length - 1;
      this.activeChatStart = this.activeChatEnd - this.activeRange;
      setTimeout(() => this.scrollToChat(), 10);
      if (reportmode) console.log("getCurrentChat, chats.length-1", chats.length - 1, ", activeChat,", this.activeChat, " start,", this.activeChatStart, " end,", this.activeChatEnd, " isStream", this.isStream, "chats[this.activeChat].msg", chats[this.activeChat].msg);
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false;
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true;
      this.scrollToChat();
    },
  },
  computed: {
    allchats: function () {
      //console.log("allchats");
      if (this.newChatList !== this.lastChat) {

        this._allchats = this._allchats.concat(this.newChatList);
        this.lastChat = this.newChatList;
        //console.log("add chat, newChatList", this.newChatList);
      }
      return this._allchats;
    },
    postAID: function () {
      if (reportmode) console.log("new post:", this.post.AID);
      this._allchats = [];
      this.chatList = [];
      this.instancedChat = [];
      return this.post.AID;
    },
    activeChat: {
      get() {
        return this.acChat;
      },
      set(value) {
        if (value > this.allchats.length - 1) this.acChat = this.allchats.length - 1;
        else if (value < 0) this.acChat = 0;
        else this.acChat = value;
      }
    },
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
      'PTTState',
      'getDisablePushGray',
      'getPushInterval',
    ])
  },
  mounted() {
    //註冊文章事件
    this.msg["newPush"] = data => {
      this.$store.dispatch('updatePost', data);
      this.nextUpdateTime = Date.now() + this.getPushInterval * 1000;
    };

    //初始化聊天列表
    this.lastChat = this.newChatList;
    if (reportmode) this._allchats = testchat.list;//test
    else this._allchats = [];
    this.activeChat = 0;
    this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;

    //定時抓新聊天
    this.intervalChat = window.setInterval(() => {
      if (this.isStream && this.PTTState > 0 && Date.now() > this.nextUpdateTime) {
        this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;
        //console.log("updateChat", this.isStream, Date.now(), this.nextUpdateTime);
        this.msg.PostMessage("getPushByLine", { AID: this.post.AID, board: this.post.board, startline: this.post.lastendline });
      }
    }, 340);

    //定時滾動
    this.intervalScroll = window.setInterval(() => { this.updateChat(); }, 500);

    //使用者滾輪事件
    if (this.$refs.chatmain.addEventListener) {
      this.$refs.chatmain.addEventListener("mousewheel", this.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera
      this.$refs.chatmain.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);// Firefox
    }
    else {// IE 6/7/8
      this.$refs.chatmain.attachEvent("onmousewheel", this.MouseWheelHandler);
    }
  },
  updated: function () { },
  beforeDestroy() {
    clearInterval(this.intervalChat);
    clearInterval(this.intervalScroll);
  },
  components: {
    "chat-scroll-btn": ChatScrollBtn,
    "chat-set-new-push": chatSetNewPush,
  },
  template: `<div id="PTTChat-contents-Chat-main" class="h-100" style="display: flex;flex-direction: column;">
  <div ref="chatmain" class="h-100 row" style="overscroll-behavior: none;overflow-y: scroll;">
    <ul id="PTTChat-contents-Chat-pushes" class="col mb-0 px-0" v-bind:post-aid="postAID" ref="chats">
      <chat-item :index="index" :chat="item" :gray="item.gray" :key="item.index" v-for="(item, index) in chatList">
      </chat-item>
    </ul>
    <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
  </div>
  <chat-set-new-push></chat-set-new-push>
</div>`,
}


let testchat = {
  l: [],
  get list() {
    for (let i = this.l.length; i < 12000; i++) {
      const el = {
        type: "推 ",
        id: "Zoosewu ",
        time: new Date(),
      };
      el.msg = i + " 太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦";
      el.time.setHours(18);
      el.time.setMinutes(0);
      el.time.setSeconds(i * 3);
      el.index = i;
      el.gray = true;
      this.l.push(el);
    }
    return this.l;
  }
}

let ChatTimeSetting = {

  template: `<div id="PTTChat-Time" class="ptt-text ptt-bg p-2 position-absolute w-100 d-none" style="z-index:400;">
  <div id="PTTChat-Time-Setting">
    <form class="form-inline mb-1">
      <label for="dis" class="col">調整實況重播時間</label>
      <div class="d-flex justify-content-between btn-group">
        <button id="minus-min" class="btn ptt-btnoutline" type="button">-1分鐘</button>
        <button id="minus-sec" class="btn ptt-btnoutline" type="button">-15秒</button>
        <button id="add-sec" class="btn ptt-btnoutline" type="button">+15秒</button>
        <button id="add-min" class="btn ptt-btnoutline" type="button">+1分鐘</button>
      </div>
    </form>
  </div>
</div>
`,
}

let ConnectStreamTimeSetting = {
  inject: ['isStream'],
  data: function () {
    return {
      VideoTime: "18:00:00",
      isbeforpost: false,
    }
  },
  methods: {
    timeChange: function () {
      let videotime = [];
      let result = /(\d\d)\:(\d\d)/.exec(this.VideoTime);
      let secresult = /\d\d\:\d\d\:(\d\d)/.exec(this.VideoTime);
      if (result) {
        videotime.push(result[1]);
        videotime.push(result[2]);
      }
      else {
        videotime.push("18");
        videotime.push("00");
      }
      if (secresult) videotime.push(secresult[1]);
      else videotime.push("00");
      videotime.push(this.isbeforpost);
      console.log("timeChange", this.VideoTime, videotime);
      this.$store.dispatch('updateVideoStartTime', videotime);
    }
  },
  computed: {
    className: function () {
      let classes = ["form-row", "mb-2"];
      if (this.isStream) { classes.push("d-none"); }
      return classes.join(' ');
    }
  },
  mounted() {
    this.$store.dispatch('updateVideoStartTime', ["18", "00", "00", false]);
  },
  template: `<div id="PTTConnect-Time-Setting" :class="className">
  <div class="form-group col-8">
    <label for="appt-time">實況重播開台時間:</label>
    <input id="stream-time" type="time" name="stream-time" step="2" v-model="VideoTime" @change="timeChange">
  </div>
  <div class="form-check col-4 pl-4">
    <input type="checkbox" class="form-check-input" id="streambeforepost" :value="isbeforpost" @change="timeChange">
    <label class="form-check-label ml-2" for="streambeforepost">發文前已開台</label>
  </div>
</div>`,
}

let ConnectLogin = {
  data: function () {
    return {
      id: GM_getValue("PTTID", ""),
      pw: ""
    }
  },
  inject: ['msg'],
  methods: {
    login: function () {
      if (this.id === "" || this.pw === "") {
        this.$store.dispatch('Alert', { type: 0, msg: "帳號或密碼不得為空。" });
        return;
      }
      else if (this.PTTState > 0) {
        this.$store.dispatch('Alert', { type: 0, msg: "已經登入，請勿重複登入。" });
        return;
      }
      GM_setValue("PTTID", this.id);
      const i = CryptoJS.AES.encrypt(this.id, cryptkey).toString();
      const p = CryptoJS.AES.encrypt(this.pw, cryptkey).toString();
      this.msg.PostMessage("login", { id: i, pw: p });
    }
  },
  template: `<div class="form-row my-3">
  <div class="col-5">
    <label for="PTTid">PTT ID</label>
    <input id="PTTid" type="text" class="form-control" placeholder="PTT ID" autocomplete="off" v-on:keyup.13="login"
      v-model.lazy="id">
  </div>
  <div class="col-5">
    <label for="PTTpw">PTT密碼</label>
    <input id="PTTpw" type="password" class="form-control" placeholder="PTT密碼" autocomplete="off" v-on:keyup.13="login"
      v-model.lazy="pw">
  </div>
  <div class="col-2 px-0">
    <label for="PTTlogin" class="col-2">&nbsp;</label>
    <button id="PTTlogin" class="btn ptt-btnoutline w-100" type="button" @click.self="login()">登入</button>
  </div>
</div>`,
}

let ConnectAID = {
  data: function () {
    return {
      aid: GM_getValue("PostAID", ""),
    }
  },
  inject: ['msg', 'isStream'],
  methods: {
    getPush: function () {
      const result = /#(.+) \((.+)\)/.exec(this.aid);
      if (!result || result.length <= 2) {
        this.$store.dispatch('Alert', { type: 0, msg: "文章AID格式錯誤，請重新輸入。" });
      }
      else if (this.PTTState < 1) {
        this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
      }
      else {
        GM_setValue("PostAID", this.aid);
        gotomainchat = true;//// 
        if (this.post.AID === result[1] && this.post.board === result[2]) {//相同文章取最新推文
          console.log("getPush same post", result[1], result[2], this.post.lastendline);
          this.msg.PostMessage("getPushByLine", { AID: result[1], board: result[2], startline: this.post.lastendline });
        }
        else if (this.isStream) {//實況取得最近的推文
          if (reportmode) console.log("getPush same recent", result[1], result[2], 200);
          this.msg.PostMessage("getPushByRecent", { AID: result[1], board: result[2], recent: 200 });
        }
        else {//實況紀錄取得所有推文
          console.log("getPush same total", result[1], result[2], 0);
          this.msg.PostMessage("getPushByLine", { AID: result[1], board: result[2], startline: 0 });
        }
        this.$store.dispatch('pageChange', true);
      }
    }
  },
  computed: {
    ...Vuex.mapGetters([
      'post',
      'PTTState',
    ])
  },
  template: `<div class="form-row my-3">
  <label for="postAID" class="col-3 col-form-label">輸入文章AID</label>
  <div class="col">
    <input id="postAID" class="form-control" type="text" placeholder="#1VobIvqC (C_Chat)" autocomplete="off" v-model.lazy="aid" v-on:keyup.13="getPush">
  </div>
  <div class="col-2 px-0">
    <button id="postAIDbtn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="getPush()">讀取</button>
  </div>
</div>`,
}

Vue.component('plugin-setting-input', {
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    defaultValue: { type: Number, required: true },
    max: { type: Number, required: true },
    min: { type: Number, required: true },
    confirmBtn: { type: Boolean, required: false },
    column: { type: Number, required: false },
  },
  data: function () {
    return {
      SettingValue: this.$store.getters["get" + this.settingName],
      ValueMax: +GM_getValue('A-custom-' + this.settingName + 'Max', -1),
      ValueMin: +GM_getValue('A-custom-' + this.settingName + 'Min', -1),
      Btn: this.confirmBtn ? this.confirmBtn : false,
      BtnID: this.settingName + '-btn',
      Col: this.column ? this.column : 12,

    }
  },
  methods: {
    $_PluginSetting_update: function () {
      console.log("$_PluginSetting_update", this.SettingValue);
      if (+this.SettingValue > this.ValueMax) { this.SettingValue = this.ValueMax; }
      else if (+this.SettingValue < this.ValueMin) { this.SettingValue = this.ValueMin; }

      this.$store.dispatch('set' + this.settingName, this.SettingValue);
    },
    $_PluginSetting_MaxCheck: function () {
      if (this.ValueMax < 0) {
        this.ValueMax = this.max;
        GM_setValue('A-custom-' + this.settingName + 'Max', this.max);
      }
    },
    $_PluginSetting_MinCheck: function () {
      if (this.ValueMin < 0) {
        this.ValueMin = this.min;
        GM_setValue('A-custom-' + this.settingName + 'Min', this.min);
      }
    },
    $_PluginSetting_ValueCheck: function () {
      if (this.SettingValue < 0) this.SettingValue = this.defaultValue;
      this.$_PluginSetting_update();
    },
  },
  computed: {
    Classes: function () {
      const classes = ["form-row", "col-" + this.Col, "px-0", "mx-0"];
      return classes.join(' ');
    },
    LabelClasses: function () {
      const w = parseInt(12 / this.Col) * 3;
      const classes = ["col-form-label", "col-" + w];
      return classes.join(' ');
    },
  },
  mounted() {
    this.$_PluginSetting_MaxCheck();
    this.$_PluginSetting_MinCheck();
    this.$_PluginSetting_ValueCheck();
  },
  template:
    `<div :class="Classes">
    <label :for="settingName" :class="LabelClasses">{{this.description}}</label>
    <div class="col px-0">
      <input :id="settingName" class="form-control" type="text" :placeholder="defaultValue" autocomplete="off"
        v-on:keyup.13="$_PluginSetting_update" v-model.lazy="SettingValue">
    </div>
    <div class="col-2 pr-0" v-if="Btn">
      <button :id="BtnID" class="btn ptt-btnoutline w-100" @click.self="$_PluginSetting_update()"
        type="button">確認</button>
    </div>
  </div>`,
});

Vue.component('plugin-setting-checkbox', {
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    defaultValue: { type: Number, required: true },
  },
  data: function () {
    return { SettingValue: this.$store.getters["get" + this.settingName], }
  },
  methods: {
    $_PluginSetting_valueChange: function () { this.$store.dispatch('set' + this.settingName, this.SettingValue); }
  },
  template: `<div class="form-check">
  <input type="checkbox" class="form-check-input" :id="settingName" v-model="SettingValue"
    @change="$_PluginSetting_valueChange($event)">
  <label class="form-check-label ml-2" :for="settingName">{{this.description}}</label>
</div>`,
});

//import { ConnectEnableSetNewChat } from './ConnectEnableSetNewChat.js';
//import { ConnectDisablePushGray } from './ConnectPluginSettingCheckboxElement.js';
let ConnectOtherSetting = {
  mounted() {
    GM_deleteValue('disablepushgray');///
    GM_deleteValue('enablesetnewpush');///
    GM_deleteValue('chatFontsize');///
    GM_deleteValue('chatSpace');///
    GM_deleteValue('LastPostUID');///
    
    //console.log("remove check: " + GM_getValue('enablesetnewpush', "removed"));
  },
  template: `<div id="PTTConnect-OtherSetting" class="form-row px-0 mx-0 col-12">
  <legend class="col-form-label col-3 pt-0">其他設定</legend>
  <div class="col px-0">
    <plugin-setting-checkbox setting-name="EnableSetNewPush" description="推文功能(使用此功能後果請自負)" defaultValue="false"></plugin-setting-checkbox>
    <plugin-setting-checkbox setting-name="DisablePushGray" description="關閉灰色漸變以提升效能" defaultValue="false"></plugin-setting-checkbox>
  </div>
</div>`,
}

let ConnectNewVersion = {
  template: `<a id="updatebtn" class="btn ptt-btnoutline m-2 d-none"
  href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer"
  role="button">檢測到新版本</a>`,
}

let ConnectPluginSetting = {
  components: {
    //"connect-plugin-height": ConnectPluginHeight,
    "connect-other-setting": ConnectOtherSetting,
    "connect-new-version": ConnectNewVersion,
  },
  template: `<div class="my-4">
  <div class="text-center mb-2">
    <h4 class="mb-1 mt-0">套件設定</h4>
    <p class="mt-1 mb-0">輸入數值之後按Enter確認</p>
  </div>
  <div class="my-3 form-row px-2">
    <plugin-setting-input setting-name="PluginHeight" description="套件長度(px)" default-value="850" max="850" min="180" column="6">
    </plugin-setting-input>
    <plugin-setting-input setting-name="PushInterval" description="推文更新(s)" default-value="2.5" max="360" min="2.5" column="6">
    </plugin-setting-input>
  </div>
  <div class="my-3 form-row px-2">
    <plugin-setting-input setting-name="Fontsize" description="字體尺寸(px)" default-value="18" max="30" min="9" column="6">
    </plugin-setting-input>
    <plugin-setting-input setting-name="ChatSpace" description="推文間隔(行)" default-value="0.8333" max="5" min="0" column="6">
    </plugin-setting-input>
  </div>
  <div class="my-3 form-row px-2">
    <connect-other-setting></connect-other-setting>
  </div>
  <div class="my-3 form-row px-2">
    <connect-new-version></connect-new-version>
  </div>
</div>`,
}

let ConnectNewVersionInfo = {
  template: `<div class="px-5">
  <h4 class="text-center my-1">近期改版</h4>
  <p class="text-center my-1">完整說明請到PTT搜尋YT聊天室顯示PTT推文</p>
  <hr class="mt-1 mb-2">
  <p class="mt-1 mb-0">新增套件長度、推文更新、字體尺寸、推文間隔</p>
  <p class="mt-1 mb-0">套件長度最大值現在可以到850</p>
</div>`,
}

let Connect = {
  components: {
    "connect-stream-sime-setting": ConnectStreamTimeSetting,
    "connect-login": ConnectLogin,
    "connect-aid": ConnectAID,
    "connect-plugin-setting": ConnectPluginSetting,
    "connect-new-version-info": ConnectNewVersionInfo,
  },
  template: `<div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0">
  <div class="my-4">
    <connect-stream-sime-setting></connect-stream-sime-setting>
    <connect-login></connect-login>
    <connect-aid></connect-aid>
  </div>
  <hr>
  <connect-plugin-setting></connect-plugin-setting>
  <hr>
  <div class="my-4">
    <connect-new-version-info></connect-new-version-info>
  </div>
</div>`,
}

let ConnectAlert = {
  inject: ['msg'],
  data: function () {
    return {
      al: [],
      lastAlert: null,
    }
  },
  methods: {
    removeAlert(item) {
      const index = this.al.indexOf(item);
      //console.log("removeAlert: this.al,item.msg,index", this.al, item.msg, index);
      this.al.splice(index, 1);
    },
  },
  computed: {
    alertlist: function () {
      if (this.lastAlert !== this.newAlert) {
        this.lastAlert = this.newAlert;
        this.al.push(this.newAlert);
      }
      return this.al;
    },
    ...Vuex.mapGetters([
      'newAlert',
    ])
  },
  mounted() {
    this.msg["alert"] = data => {
      this.$store.dispatch('Alert', { type: data.type, msg: data.msg });
      if (showalertmsg) console.log("Alert,type: " + data.type + ", msg: " + data.msg);
    };
    this.lastAlert = this.newAlert;
    this.al = [];
  },
  template: `<div id="PTTChat-contents-Connect-alert" class="position-relative container"
  style="top:-100%; z-index:400; pointer-events: none;">
  <transition-group name="list-alert" tag="div">
    <alert-item :alert="item" :key="item" :index="index" @destroyalert="removeAlert(item)" v-for="(item, index) in alertlist"> </alert-item>
  </transition-group>
</div>`,
}

Vue.component('alert-item', {
  props: ['alert', 'index'],
  data: function () {
    return {
      dismissCount: 2,
      timerInterval: null,
    }
  },
  computed: {
    className: function () {
      let classes = ["alert", "mt-3", "fade", "show"];
      if (this.alert.type === 0) { classes.push("alert-danger"); }
      else if (this.alert.type === 1) { classes.push("alert-warning"); }
      else if (this.alert.type === 2) { classes.push("alert-success"); }
      return classes.join(' ');
    },
  },
  methods: {
    CountDown: function () {
      this.dismissCount--;
      //console.log(this.alert.msg + " index ", this.index,"dismissCount",this.dismissCount, "CountDown");
      if (this.dismissCount <= 0) { this.destroy(); }
    },
    destroy: function () {
      //console.log(this.alert.msg + " index", this.index, "beforeDestroy");
      this.$emit("destroyalert");
    }
  },
  mounted() {
    //console.log(this.alert.msg + ": index", this.index, "mounted");
    //不知道為什麼會stack溢出     this.timerInterval = window.setInterval(this.CountDown, 1000);
    this.timerInterval = setTimeout(this.destroy, this.dismissCount * 1000);
  },
  beforeDestroy() {
    //clearInterval(this.timerInterval);
  },
  template: `<div :class="className" role="alert" style="pointer-events: none;" :count="this.dismissCount"> {{this.alert.msg}}</div>`,
});

let Other = {
  template: `<div id="PTTChat-contents-other-main" class="card-body">
  <h5>
    使用教學:</p>
    1.設定紀錄檔開始的時間</p>
    (實況無須設定)</p>
    2.輸入帳號與密碼登入PTT</p>
    3.在你自己的PTT找到想要同步的文章</p>
    4.鍵入大寫Q複製文章完整AID</p>
    5.將複製的AID貼上並讀取文章</p>
  </h5>
  <a id="gfbtn" class="btn ptt-btnoutline m-2 " href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage"
    target="_blank" rel="noopener noreferrer" role="button">腳本介紹</a>
  <a id="gfbtn" class="btn ptt-btnoutline m-2 " href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt"
    target="_blank" rel="noopener noreferrer" role="button">greasyfork</a>
  <a id="gfbtn" class="btn ptt-btnoutline m-2" href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master"
    target="_blank" rel="noopener noreferrer" role="button">github</a>
  <h5>
    &nbsp;</p> &nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>
    聲明:</p> &nbsp;</p>
    本套件僅做PTT與Youtube的連線</p>
    除此之外並不會連到任何伺服器</p>
    所以不會蒐集任何關於你的資訊</p>
    &nbsp;</p>
    所有程式碼都沒有做任何的壓縮或混淆</p>
    在greasyfork、github以及你的瀏覽器都可以查看完整的程式碼以供任何人檢視</p>
    &nbsp;</p>
    請確保瀏覽實況或紀錄檔時</p>
    沒有任何其他PTT的腳本同時啟用</p>
    如果有的話請參閱完整網站說明並跟著操作</p>
    &nbsp;</p>
    本套件盡可能保證套件在操作PTT時的安全性</p>
    並盡可能避免帳號資訊在傳輸過程中被第三方所竊取</p>
    &nbsp;</p>
    任何使用套件的人士</p>
    須自行承擔一切風險</p>
    本人不會負責任何因使用此套件所造成的任何形式的損失</p>
    &nbsp;</p>
    使用本套件所造成任何形式的帳號損害</p>
    包含但不限於帳號遭到竊取、推文而招致水桶或帳號註銷</p>
    本人一概不負責</p> &nbsp;</p>
    Zoosewu</p>
  </h5>
</div>`,
}

let PTTScreen = {
  inject: ['msg'],
  data: function () {
    return {
      src: "//term.ptt.cc/?url=" + this.msg.ownerorigin,
      iframe: {},
      show: true
    }
  },
  template: `<div id="PTTChat-contents-PTT-main" class="h-100 d-flex justify-content-center px-0">
  <iframe id="PTTframe" :src="src" class="h-100 flex-grow-1"
    style="zoom: 1.65; z-index: 351; -moz-transform: scale(1);" ref="ifm" v-if="show">你的瀏覽器不支援 iframe</iframe>
</div>`,
  methods: {
    removeiframe: function removeiframe(event) {
      console.log('removeiframe');
      this.$el.removeChild(this.iframe);
      //this.iframe.remove();
    }
  },
  mounted() {
    this.iframe = this.$refs.ifm;
    this.msg.targetWindow = this.iframe.contentWindow;
    window.addEventListener('beforeunload', this.removeiframe);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.removeiframe);
  }
}

let Log = {
  template: `<div class="flex-grow-1 overflow-auto mh-100 row" id="PTTChat-contents-log-main" style="overscroll-behavior: contain;">
  <table class="table ptt-bg">
    <tbody class="ptt-text">
      <tr>
        <th scope="row">PTT狀態</th>
        <td id="log-PTTstate">--</td>
        <td colspan="2">更多的詳細資訊請參考PTT畫面</td>
      </tr>
      <th class="text-center bg-secondary text-white" colspan="4">文章資訊</th>
      <tr>
        <th scope="row">文章標題</th>
        <td id="log-posttitle" colspan="3">--</td>
      </tr>
      <tr>
        <th scope="row">文章看板</th>
        <td id="log-postboard">--</td>
        <th scope="row">文章代碼</th>
        <td id="log-postaid">--</td>
      </tr>
      <tr>
        <th scope="row">推文數</th>
        <td id="log-postpushcount">--</td>
        <th scope="row">結尾行數</th>
        <td id="log-postendline">--</td>
      </tr>
      <tr>
        <th scope="row">發文時間</th>
        <td id="log-posttime" colspan="3">--</td>
      </tr>
      <tr>
        <th scope="row">最後推文時間</th>
        <td id="log-postlastpushtime" colspan="3">--</td>
      </tr>

      <th class="text-center bg-secondary text-white" colspan="4">詳細資訊</th>
      </tr>
      <tr>
        <th scope="row">影片類型</th>
        <td id="log-videotype">--</td>
        <th scope="row">自動獲得推文</th>
        <td id="log-isautogetpush">--</td>
      </tr>
      <tr>
        <th scope="row">主題顏色</th>
        <td id="log-themecolor">--</td>
        <th scope="row"></th>
        <td></td>
      </tr>
      <tr>
        <th scope="row">預估開台時間</th>
        <td id="log-streamstarttime" colspan="3">--</td>
      </tr>
      <tr>
        <th scope="row">影片當下時間</th>
        <td id="log-streamnowtime" colspan="3">--</td>
      </tr>
      <th class="text-center bg-secondary text-white" colspan="4">滾動狀態</th>
      </tr>

      <tr>
        <th scope="row">目標推文樓數</th>
        <td id="log-pushindex">--</td>
        <th scope="row">目標捲動高度</th>
        <td id="log-targetscroll">--</td>
      </tr>
      <tr>
        <th scope="row">現在捲動高度</th>
        <td id="log-nowscroll">--</td>
        <th scope="row">上次捲動高度</th>
        <td id="log-lastscroll">--</td>
      </tr>
      <th class="text-center bg-secondary text-white" colspan="4">近期訊息</th>
      </tr>
      <tr>
        <td id="log-alert0" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert1" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert2" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert3" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert4" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert5" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert6" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert7" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert8" colspan="4">--</td>
      </tr>
      <tr>
        <td id="log-alert9" colspan="4">--</td>
      </tr>
    </tbody>
  </table>
</div>
`,
}

let PTTAppContent = {
  components: {
    'PTTApp-Chat': Chat,
    "ChatTimeSetting": ChatTimeSetting,
    'PTTApp-Alert': ConnectAlert,
    'PTTApp-Connect': Connect,
    'PTTApp-Other': Other,
    'PTTApp-PTT': PTTScreen,
    'PTTApp-Log': Log
  },
  computed: {
    updateheight() {
      return {
        height: this.$store.getters.getPluginHeight + "px"
      }
    }
  },
  template: `<div id="PTTChat-contents" class="tab-content container d-flex flex-column ptt-text" v-bind:style="updateheight">
  <!-------- 聊天室 -------->
  <div class="tab-pane mh-100 position-relative fade" id="PTTChat-contents-Chat" role="tabpanel"
    aria-labelledby="nav-item-Chat">
    <ChatTimeSetting></ChatTimeSetting>
    <PTTApp-Chat></PTTApp-Chat>
  </div>
  <!-------- 連線設定 -------->
  <div class="tab-pane h-100 row fade show active" id="PTTChat-contents-Connect" role="tabpanel"
    aria-labelledby="nav-item-Connect">
    <PTTApp-Connect></PTTApp-Connect>
    <PTTApp-Alert></PTTApp-Alert>
  </div>
  <!-------- 其他 -------->
  <div class="tab-pane h-100 card bg-transparent overflow-auto row fade" id="PTTChat-contents-other" role="tabpanel"
    aria-labelledby="nav-item-other">
    <PTTApp-Other></PTTApp-Other>
  </div>
  <!-------- PTT畫面 -------->
  <div class="tab-pane h-100 row fade" id="PTTChat-contents-PTT" role="tabpanel" aria-labelledby="nav-item-PTT">
    <PTTApp-PTT></PTTApp-PTT>
  </div>
  <!-------- Log -------->
  <div class="tab-pane mh-100 fade" id="PTTChat-contents-log" role="tabpanel" aria-labelledby="nav-item-log"
    style="overscroll-behavior: contain;">
    <PTTApp-Log></PTTApp-Log>
  </div>
</div>`
}

let PTTAppMain = {
  template: `<div id="PTTChat-app" class="ptt-bg ptt-border rounded w-100 d-flex flex-column">
  <PTTAppNav></PTTAppNav>
  <PTTAppContent></PTTAppContent>
  </div>`,
  components: {
    'PTTAppNav': PTTAppNav,
    'PTTAppContent': PTTAppContent
  },
}

let PTTApp = {
  template: `<pttdiv id="PTTMain" class="pttchat rounded-right position-absolute rounded-bottom w-100 collapse" style="z-index: 301;">
  <PTTAppMain></PTTAppMain>
  </pttdiv>`,
  components: {
    'PTTAppMain': PTTAppMain
  },
}

let PTTAppBtn = {
  template: `<a id="PTTMainBtn" class="btn btn-lg ptt-btnoutline position-absolute"  style="z-index: 450;" type="button" data-toggle="collapse" data-target="#PTTMain" aria-expanded="false" aria-controls="PTTMain">P</a>`,
}

function InitApp(chatcon, whitetheme, isstreaming, messageposter) {
  InitChatApp(chatcon);
  function InitChatApp(cn) {
    /*-----------------------------------preInitApp-----------------------------------*/
    //init property
    let ele = document.createElement('div');
    ele.id = "PTTChat";
    ele.setAttribute("style", "z-index: 301;");
    if (cn) cn[0].appendChild(ele);
    //Vue.prototype.$bus = new Vue();
    let color = whitetheme ? "pttbgc-19 pttc-5" : "pttbgc-2 pttc-2";
    let PTT = new Vue({
      el: '#PTTChat',
      template: `<div id="PTTChat" class="position-absolute w-100 ` + color + `" ins="` + appinscount + `"><PTTAppBtn></PTTAppBtn><PTTApp></PTTApp></div>`,
      store,
      components: {
        'PTTAppBtn': PTTAppBtn,
        'PTTApp': PTTApp
      },
      data: function () {
        return {
          index: appinscount,
          rootmsg: messageposter,
          player: document.getElementsByTagName("video")[0],
          playertime: null,
          exist: null,
        }
      },
      provide: function () {
        return {
          msg: this.rootmsg,
          isStream: isstreaming,
        };
      },
      mounted() {
        appinscount++;
        this.playertime = window.setInterval((() => {
          if (this.player) this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime);
          else clearInterval(this.playertime);
        }), 1000);
        this.exist = window.setInterval((() => {
          const self = document.querySelector('#PTTChat[ins="' + this.index + '"');
          if (!self) {
            console.log("Instance " + this.index + " destroyed.");
            PTT.$destroy();
          }
          else { //console.log("Instance " + this.index + " alive.");
          }
        }), 1000);
        this.$store.dispatch('isStream', isstreaming);
        
        this.rootmsg["PTTState"] = data => { this.$store.dispatch('PTTState', data); };
      },
      beforeDestroy() {
        console.log("beforeDestroy", this);
        clearInterval(this.playertime);
        clearInterval(this.exist);
      },
    });
    return;
  }
}

function BootStrap(frame) {
  const frameHead = $("head", frame);
  const frameBody = $("body", frame);
  console.log("BootStrap");
  //if (reportmode) { frameHead.append($(`<link rel="stylesheet" href="http://127.0.0.1:8889/css/index.css">`)); }
  //else { frameHead.append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">`)); }
  frameBody.append($(`<script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>`));
  frameBody.append($(`<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js" integrity="sha384-9/reFTGAW83EW2RDu2S0VKaIzap3H66lZH81PoYlFhbGU+6BZp6G7niu735Sk7lN" crossorigin="anonymous"></script>`));
  frameBody.append($(`<script src="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js" integrity="sha384-w1Q4orYjBQndcko6MimVbzY0tgp4pWB4lZ7lr30WKz0vr/aWKhXdBNmNb5D92v7s" crossorigin="anonymous"></script>`));
}

//add global style
function AddStyle(css) {
  const style = document.createElement('style');
  if (style.styleSheet) {
    ///好像都沒用到
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  $('head')[0].appendChild(style);
}

//cryptkey
function GenerateCryptKey() {
  let c = makeid(20 + Math.random() * 10);
  GM_setValue("cryptkey", c);
  return c;

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

//左邊補0 右邊補0
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
//JSON轉換用
function dateReviver(key, value) {
  if (typeof value === 'string') {
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
      return new Date(+a[1], +a[2] - 1, +a[3], +a[4] + 8, +a[5], +a[6]);
    }
  }
  return value;
};

//对象深复制，不考虑循环引用的情况
function cloneObj(from) {
  return Object.keys(from).reduce((obj, key) => (obj[key] = clone(from[key]), obj), {});
}
//数组深复制，不考虑循环引用的情况
function cloneArr(from) {
  return from.map((n) => clone(n));
}
// 复制输入值
function clone(from) {
  if (from instanceof Array) {
    return cloneArr(from);
  } else if (from instanceof Object) {
    return cloneObj(from);
  } else {
    return (from);
  }
}

function InitYT(messageposter) {
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
  }, 100);
  setTimeout(CheckChatInstanced, 3000);
  function CheckChatInstanced() {
    if (/www\.youtube\.com\/watch\?v=/.exec(window.location.href) === null) {
      if (showalllog) console.log("not watch video.");
      setTimeout(CheckChatInstanced, 2000);
      return;
    }
    const ChatContainer = $(`ytd-live-chat-frame`);
    const defaultChat = $(`iframe`, ChatContainer);
    const PTTApp = $(`#PTTChat`, ChatContainer);
    if (PTTApp.length > 0) {
      if (showalllog) console.log("PTTApp already instanced.");
      setTimeout(CheckChatInstanced, 5000);
      return;
    }
    else if (defaultChat.length > 0) {
      if (showalllog) console.log("PTTApp frame instance!");
      ChatContainer.css({ "position": "relative" });

      //生出套件
      let isstream = checkvideotype();
      InitApp(ChatContainer, WhiteTheme, isstream, msg);
      setTimeout(CheckChatInstanced, 5000);
    }
    else {
      if (showalllog) console.log("watching video without chatroom.");
      setTimeout(CheckChatInstanced, 5000);
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

let ytfilter = InsFilter("Youtube", /www\.youtube\.com/, "https://www.youtube.com", InitYT);

function InitHT(messageposter) {
  const msg = messageposter;
  let WhiteTheme;
  //generate crypt key everytime;
  cryptkey = GenerateCryptKey();
  //add bootstrap to use
  BootStrap(document);
  //AddPTTAppcss(whitetheme, colorlight, colordark)
  AddStyle(true, "rgb(249, 249, 249)", "rgb(24, 24, 24)")
  //PTTApp global css
  setTimeout(() => {
    const YTbgcolor = getComputedStyle($('html')[0]).backgroundColor;
    const colorlight = "rgba(250, 250, 250, 0.824)";
    console.log(YTbgcolor, colorlight, YTbgcolor === colorlight);
    WhiteTheme = YTbgcolor === colorlight;
  }, 100);
  //run app instance loop
  let waswatch;
  let iswatch;
  let tryinsholotools = 20;
  setTimeout(ChechChatInstanced, 1000);
  function ChechChatInstanced() {
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
  }
  function TryInsChat() {
    const parent = $(`.container-watch`);
    if (reportmode) console.log("parent", parent);
    if (parent.length > 0 && iswatch) {
      const fakeparent = $(`<div id="fakeparent" class="d-flex flex-row"></div>`);
      const defaultVideoHandler = $(`<div id="holotoolsvideohandler" class="flex-grow-1"></div>`);
      const defaultVideo = $(`.player-container.hasControls`);
      const PTTChatHandler = $(`<div id="pttchatparent" class="p-0 d-flex" style="width:400px;position:relative;"></div>`);
      parent.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      $(`.reopen-toolbar`).css({ "z-index": "302" });
      InitApp(PTTChatHandler, WhiteTheme, true, msg);
      tryinsholotools = -10;
    }
    else {
      tryinsholotools--;
    }
  }
}

let htfilter = InsFilter("Holotools", /hololive\.jetri\.co/, "https://hololive.jetri.co", InitHT);

function Initblank(messageposter) {
  const msg = messageposter;
  let WhiteTheme = true;
  //generate crypt key everytime;
  cryptkey = GenerateCryptKey();
  //add bootstrap to use
  BootStrap(document);
  //PTTApp global css
  setTimeout(() => {
    const colorlight = "rgb(249, 249, 249)";
    const colordark = "rgb(24, 24, 24)"
  }, 100);
  //run app instance loop

  //const blankcontainer = $(`<div id="container" class="position-relative" style="width:400px;height:800px;"></div>`)[0];
  //`<div id="container" class="position-relative" style="width:400px;height:800px;"></div>`
  const Body = document.getElementsByTagName("BODY")[0];
  const container = document.createElement("div");
  container.id = "container";
  container.classList.add("position-relative");
  container.setAttribute("style", "width:400px;height:800px;");
  Body.prepend(container);
  //const blankcontainer = document.getElementById(`container`);
  InitApp([container], WhiteTheme, true, msg);

}

let blankfilter = InsFilter("Blank", /blank\.org/, "http://blank.org/", Initblank);

//dev use 
const defaultopen = false;
const disablepttframe = false;
const simulateisstreaming = false;
// add listener to get msg
let cryptkey;
let appinscount = 0;
/* 關閉vue-devtools */
Vue.config.devtools = reportmode;
/* 關閉錯誤警告 */
Vue.config.debug = reportmode;
(function () {
  let msg = new MessagePoster;
  let filters = [];
  filters.push(ytfilter);
  filters.push(htfilter);
  filters.push(blankfilter);
  HerfFilter(msg, filters);
})();

(function(){
  const $style = document.createElement('style');

  $style.innerHTML = `.blockquote-footer::before {
  content: ""; }

:root {
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

#PTTChat *,
#PTTChat *::before,
#PTTChat *::after {
  box-sizing: border-box; }

#PTTChat {
  font-family: sans-serif;
  line-height: 1.15;
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0); }

article,
aside,
figcaption,
figure,
footer,
header,
hgroup,
main,
nav,
section {
  display: block; }

#PTTChat,
table {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: left;
  background-color: #fff; }

[tabindex="-1"]:focus:not(:focus-visible) {
  outline: 0 !important; }

hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible; }

h1,
h2,
h3,
h4,
h5,
h6 {
  margin-top: 0;
  margin-bottom: 5px; }

p {
  margin-top: 0;
  margin-bottom: 1rem; }

abbr[title],
abbr[data-original-title] {
  text-decoration: underline;
  text-decoration: underline dotted;
  cursor: help;
  border-bottom: 0;
  text-decoration-skip-ink: none; }

address {
  margin-bottom: 1rem;
  font-style: normal;
  line-height: inherit; }

ol,
ul,
dl {
  margin-top: 0;
  margin-bottom: 1rem; }

ol ol,
ul ul,
ol ul,
ul ol {
  margin-bottom: 0; }

dt {
  font-weight: 700; }

dd {
  margin-bottom: 0.5rem;
  margin-left: 0; }

blockquote {
  margin: 0 0 1rem; }

b,
strong {
  font-weight: bolder; }

small {
  font-size: 80%; }

sub,
sup {
  position: relative;
  font-size: 75%;
  line-height: 0;
  vertical-align: baseline; }

sub {
  bottom: -0.25em; }

sup {
  top: -0.5em; }

a {
  color: #007bff;
  text-decoration: none;
  background-color: transparent; }
  a:hover {
    color: #0056b3;
    text-decoration: underline; }

a:not([href]):not([class]) {
  color: inherit;
  text-decoration: none; }
  a:not([href]):not([class]):hover {
    color: inherit;
    text-decoration: none; }

pre,
code,
kbd,
samp {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 1em; }

pre {
  margin-top: 0;
  margin-bottom: 1rem;
  overflow: auto;
  -ms-overflow-style: scrollbar; }

figure {
  margin: 0 0 1rem; }

img {
  vertical-align: middle;
  border-style: none; }

#PTTChat svg {
  overflow: hidden;
  vertical-align: middle; }

table {
  border-collapse: collapse; }

caption {
  padding-top: 7.5px;
  padding-bottom: 7.5px;
  color: #6c757d;
  text-align: left;
  caption-side: bottom; }

th {
  text-align: inherit;
  text-align: -webkit-match-parent; }

label {
  display: inline-block;
  margin-bottom: 0.5rem; }

button {
  border-radius: 0; }

button:focus {
  outline: 1px dotted;
  outline: 5px auto -webkit-focus-ring-color; }

input,
button,
select,
optgroup,
textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit; }

button,
input {
  overflow: visible; }

button,
select {
  text-transform: none; }

[role="button"] {
  cursor: pointer; }

select {
  word-wrap: normal; }

button,
[type="button"],
[type="reset"],
[type="submit"] {
  -webkit-appearance: button; }

button:not(:disabled),
[type="button"]:not(:disabled),
[type="reset"]:not(:disabled),
[type="submit"]:not(:disabled) {
  cursor: pointer; }

button::-moz-focus-inner,
[type="button"]::-moz-focus-inner,
[type="reset"]::-moz-focus-inner,
[type="submit"]::-moz-focus-inner {
  padding: 0;
  border-style: none; }

input[type="radio"],
input[type="checkbox"] {
  box-sizing: border-box;
  padding: 0; }

textarea {
  overflow: auto;
  resize: vertical; }

fieldset {
  min-width: 0;
  padding: 0;
  margin: 0;
  border: 0; }

legend {
  display: block;
  width: 100%;
  max-width: 100%;
  padding: 0;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  line-height: inherit;
  color: inherit;
  white-space: normal; }

progress {
  vertical-align: baseline; }

[type="number"]::-webkit-inner-spin-button,
[type="number"]::-webkit-outer-spin-button {
  height: auto; }

[type="search"] {
  outline-offset: -2px;
  -webkit-appearance: none; }

[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none; }

::-webkit-file-upload-button {
  font: inherit;
  -webkit-appearance: button; }

output {
  display: inline-block; }

summary {
  display: list-item;
  cursor: pointer; }

template {
  display: none; }

[hidden] {
  display: none !important; }

h1, h2, h3, h4, h5, h6,
.h1, .h2, .h3, .h4, .h5, .h6 {
  margin-bottom: 5px;
  font-weight: 500;
  line-height: 1.2; }

h1, .h1 {
  font-size: 30px; }

h2, .h2 {
  font-size: 24px; }

h3, .h3 {
  font-size: 21px; }

h4, .h4 {
  font-size: 18px; }

h5, .h5 {
  font-size: 15px; }

h6, .h6 {
  font-size: 12px; }

.lead {
  font-size: 15px;
  font-weight: 300; }

.display-1 {
  font-size: 6rem;
  font-weight: 300;
  line-height: 1.2; }

.display-2 {
  font-size: 5.5rem;
  font-weight: 300;
  line-height: 1.2; }

.display-3 {
  font-size: 4.5rem;
  font-weight: 300;
  line-height: 1.2; }

.display-4 {
  font-size: 3.5rem;
  font-weight: 300;
  line-height: 1.2; }

hr {
  margin-top: 10px;
  margin-bottom: 10px;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1); }

small,
.small {
  font-size: 80%;
  font-weight: 400; }

mark,
.mark {
  padding: 0.2em;
  background-color: #fcf8e3; }

.list-unstyled {
  padding-left: 0;
  list-style: none; }

.list-inline {
  padding-left: 0;
  list-style: none; }

.list-inline-item {
  display: inline-block; }
  .list-inline-item:not(:last-child) {
    margin-right: 0.5rem; }

.initialism {
  font-size: 90%;
  text-transform: uppercase; }

.blockquote {
  margin-bottom: 10px;
  font-size: 15px; }

.blockquote-footer {
  display: block;
  font-size: 80%;
  color: #6c757d; }
  .blockquote-footer::before {
    content: "\\2014\\00A0"; }

code {
  font-size: 87.5%;
  color: #e83e8c;
  word-wrap: break-word; }
  a > code {
    color: inherit; }

kbd {
  padding: 0.2rem 0.4rem;
  font-size: 87.5%;
  color: #fff;
  background-color: #212529;
  border-radius: 2.5px; }
  kbd kbd {
    padding: 0;
    font-size: 100%;
    font-weight: 700; }

pre {
  display: block;
  font-size: 87.5%;
  color: #212529; }
  pre code {
    font-size: inherit;
    color: inherit;
    word-break: normal; }

.pre-scrollable {
  max-height: 340px;
  overflow-y: scroll; }

.container,
.container-fluid,
.container-sm,
.container-md,
.container-lg,
.container-xl {
  width: 100%;
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto; }

@media (min-width: 576px) {
  .container, .container-sm {
    max-width: 540px; } }

@media (min-width: 768px) {
  .container, .container-sm, .container-md {
    max-width: 720px; } }

@media (min-width: 992px) {
  .container, .container-sm, .container-md, .container-lg {
    max-width: 960px; } }

@media (min-width: 1200px) {
  .container, .container-sm, .container-md, .container-lg, .container-xl {
    max-width: 1140px; } }

.row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -15px;
  margin-left: -15px; }

.no-gutters {
  margin-right: 0;
  margin-left: 0; }
  .no-gutters > .col,
  .no-gutters > [class*="col-"] {
    padding-right: 0;
    padding-left: 0; }

.col-1, .col-2, .col-3, .col-4, .col-5, .col-6, .col-7, .col-8, .col-9, .col-10, .col-11, .col-12, .col,
.col-auto, .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12, .col-sm,
.col-sm-auto, .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12, .col-md,
.col-md-auto, .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12, .col-lg,
.col-lg-auto, .col-xl-1, .col-xl-2, .col-xl-3, .col-xl-4, .col-xl-5, .col-xl-6, .col-xl-7, .col-xl-8, .col-xl-9, .col-xl-10, .col-xl-11, .col-xl-12, .col-xl,
.col-xl-auto {
  position: relative;
  width: 100%;
  padding-right: 15px;
  padding-left: 15px; }

.col {
  flex-basis: 0;
  flex-grow: 1;
  max-width: 100%; }

.row-cols-1 > * {
  flex: 0 0 100%;
  max-width: 100%; }

.row-cols-2 > * {
  flex: 0 0 50%;
  max-width: 50%; }

.row-cols-3 > * {
  flex: 0 0 33.33333%;
  max-width: 33.33333%; }

.row-cols-4 > * {
  flex: 0 0 25%;
  max-width: 25%; }

.row-cols-5 > * {
  flex: 0 0 20%;
  max-width: 20%; }

.row-cols-6 > * {
  flex: 0 0 16.66667%;
  max-width: 16.66667%; }

.col-auto {
  flex: 0 0 auto;
  width: auto;
  max-width: 100%; }

.col-1 {
  flex: 0 0 8.33333%;
  max-width: 8.33333%; }

.col-2 {
  flex: 0 0 16.66667%;
  max-width: 16.66667%; }

.col-3 {
  flex: 0 0 25%;
  max-width: 25%; }

.col-4 {
  flex: 0 0 33.33333%;
  max-width: 33.33333%; }

.col-5 {
  flex: 0 0 41.66667%;
  max-width: 41.66667%; }

.col-6 {
  flex: 0 0 50%;
  max-width: 50%; }

.col-7 {
  flex: 0 0 58.33333%;
  max-width: 58.33333%; }

.col-8 {
  flex: 0 0 66.66667%;
  max-width: 66.66667%; }

.col-9 {
  flex: 0 0 75%;
  max-width: 75%; }

.col-10 {
  flex: 0 0 83.33333%;
  max-width: 83.33333%; }

.col-11 {
  flex: 0 0 91.66667%;
  max-width: 91.66667%; }

.col-12 {
  flex: 0 0 100%;
  max-width: 100%; }

.order-first {
  order: -1; }

.order-last {
  order: 13; }

.order-0 {
  order: 0; }

.order-1 {
  order: 1; }

.order-2 {
  order: 2; }

.order-3 {
  order: 3; }

.order-4 {
  order: 4; }

.order-5 {
  order: 5; }

.order-6 {
  order: 6; }

.order-7 {
  order: 7; }

.order-8 {
  order: 8; }

.order-9 {
  order: 9; }

.order-10 {
  order: 10; }

.order-11 {
  order: 11; }

.order-12 {
  order: 12; }

.offset-1 {
  margin-left: 8.33333%; }

.offset-2 {
  margin-left: 16.66667%; }

.offset-3 {
  margin-left: 25%; }

.offset-4 {
  margin-left: 33.33333%; }

.offset-5 {
  margin-left: 41.66667%; }

.offset-6 {
  margin-left: 50%; }

.offset-7 {
  margin-left: 58.33333%; }

.offset-8 {
  margin-left: 66.66667%; }

.offset-9 {
  margin-left: 75%; }

.offset-10 {
  margin-left: 83.33333%; }

.offset-11 {
  margin-left: 91.66667%; }

@media (min-width: 576px) {
  .col-sm {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%; }
  .row-cols-sm-1 > * {
    flex: 0 0 100%;
    max-width: 100%; }
  .row-cols-sm-2 > * {
    flex: 0 0 50%;
    max-width: 50%; }
  .row-cols-sm-3 > * {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .row-cols-sm-4 > * {
    flex: 0 0 25%;
    max-width: 25%; }
  .row-cols-sm-5 > * {
    flex: 0 0 20%;
    max-width: 20%; }
  .row-cols-sm-6 > * {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-sm-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%; }
  .col-sm-1 {
    flex: 0 0 8.33333%;
    max-width: 8.33333%; }
  .col-sm-2 {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-sm-3 {
    flex: 0 0 25%;
    max-width: 25%; }
  .col-sm-4 {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .col-sm-5 {
    flex: 0 0 41.66667%;
    max-width: 41.66667%; }
  .col-sm-6 {
    flex: 0 0 50%;
    max-width: 50%; }
  .col-sm-7 {
    flex: 0 0 58.33333%;
    max-width: 58.33333%; }
  .col-sm-8 {
    flex: 0 0 66.66667%;
    max-width: 66.66667%; }
  .col-sm-9 {
    flex: 0 0 75%;
    max-width: 75%; }
  .col-sm-10 {
    flex: 0 0 83.33333%;
    max-width: 83.33333%; }
  .col-sm-11 {
    flex: 0 0 91.66667%;
    max-width: 91.66667%; }
  .col-sm-12 {
    flex: 0 0 100%;
    max-width: 100%; }
  .order-sm-first {
    order: -1; }
  .order-sm-last {
    order: 13; }
  .order-sm-0 {
    order: 0; }
  .order-sm-1 {
    order: 1; }
  .order-sm-2 {
    order: 2; }
  .order-sm-3 {
    order: 3; }
  .order-sm-4 {
    order: 4; }
  .order-sm-5 {
    order: 5; }
  .order-sm-6 {
    order: 6; }
  .order-sm-7 {
    order: 7; }
  .order-sm-8 {
    order: 8; }
  .order-sm-9 {
    order: 9; }
  .order-sm-10 {
    order: 10; }
  .order-sm-11 {
    order: 11; }
  .order-sm-12 {
    order: 12; }
  .offset-sm-0 {
    margin-left: 0; }
  .offset-sm-1 {
    margin-left: 8.33333%; }
  .offset-sm-2 {
    margin-left: 16.66667%; }
  .offset-sm-3 {
    margin-left: 25%; }
  .offset-sm-4 {
    margin-left: 33.33333%; }
  .offset-sm-5 {
    margin-left: 41.66667%; }
  .offset-sm-6 {
    margin-left: 50%; }
  .offset-sm-7 {
    margin-left: 58.33333%; }
  .offset-sm-8 {
    margin-left: 66.66667%; }
  .offset-sm-9 {
    margin-left: 75%; }
  .offset-sm-10 {
    margin-left: 83.33333%; }
  .offset-sm-11 {
    margin-left: 91.66667%; } }

@media (min-width: 768px) {
  .col-md {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%; }
  .row-cols-md-1 > * {
    flex: 0 0 100%;
    max-width: 100%; }
  .row-cols-md-2 > * {
    flex: 0 0 50%;
    max-width: 50%; }
  .row-cols-md-3 > * {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .row-cols-md-4 > * {
    flex: 0 0 25%;
    max-width: 25%; }
  .row-cols-md-5 > * {
    flex: 0 0 20%;
    max-width: 20%; }
  .row-cols-md-6 > * {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-md-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%; }
  .col-md-1 {
    flex: 0 0 8.33333%;
    max-width: 8.33333%; }
  .col-md-2 {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-md-3 {
    flex: 0 0 25%;
    max-width: 25%; }
  .col-md-4 {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .col-md-5 {
    flex: 0 0 41.66667%;
    max-width: 41.66667%; }
  .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%; }
  .col-md-7 {
    flex: 0 0 58.33333%;
    max-width: 58.33333%; }
  .col-md-8 {
    flex: 0 0 66.66667%;
    max-width: 66.66667%; }
  .col-md-9 {
    flex: 0 0 75%;
    max-width: 75%; }
  .col-md-10 {
    flex: 0 0 83.33333%;
    max-width: 83.33333%; }
  .col-md-11 {
    flex: 0 0 91.66667%;
    max-width: 91.66667%; }
  .col-md-12 {
    flex: 0 0 100%;
    max-width: 100%; }
  .order-md-first {
    order: -1; }
  .order-md-last {
    order: 13; }
  .order-md-0 {
    order: 0; }
  .order-md-1 {
    order: 1; }
  .order-md-2 {
    order: 2; }
  .order-md-3 {
    order: 3; }
  .order-md-4 {
    order: 4; }
  .order-md-5 {
    order: 5; }
  .order-md-6 {
    order: 6; }
  .order-md-7 {
    order: 7; }
  .order-md-8 {
    order: 8; }
  .order-md-9 {
    order: 9; }
  .order-md-10 {
    order: 10; }
  .order-md-11 {
    order: 11; }
  .order-md-12 {
    order: 12; }
  .offset-md-0 {
    margin-left: 0; }
  .offset-md-1 {
    margin-left: 8.33333%; }
  .offset-md-2 {
    margin-left: 16.66667%; }
  .offset-md-3 {
    margin-left: 25%; }
  .offset-md-4 {
    margin-left: 33.33333%; }
  .offset-md-5 {
    margin-left: 41.66667%; }
  .offset-md-6 {
    margin-left: 50%; }
  .offset-md-7 {
    margin-left: 58.33333%; }
  .offset-md-8 {
    margin-left: 66.66667%; }
  .offset-md-9 {
    margin-left: 75%; }
  .offset-md-10 {
    margin-left: 83.33333%; }
  .offset-md-11 {
    margin-left: 91.66667%; } }

@media (min-width: 992px) {
  .col-lg {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%; }
  .row-cols-lg-1 > * {
    flex: 0 0 100%;
    max-width: 100%; }
  .row-cols-lg-2 > * {
    flex: 0 0 50%;
    max-width: 50%; }
  .row-cols-lg-3 > * {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .row-cols-lg-4 > * {
    flex: 0 0 25%;
    max-width: 25%; }
  .row-cols-lg-5 > * {
    flex: 0 0 20%;
    max-width: 20%; }
  .row-cols-lg-6 > * {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-lg-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%; }
  .col-lg-1 {
    flex: 0 0 8.33333%;
    max-width: 8.33333%; }
  .col-lg-2 {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-lg-3 {
    flex: 0 0 25%;
    max-width: 25%; }
  .col-lg-4 {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .col-lg-5 {
    flex: 0 0 41.66667%;
    max-width: 41.66667%; }
  .col-lg-6 {
    flex: 0 0 50%;
    max-width: 50%; }
  .col-lg-7 {
    flex: 0 0 58.33333%;
    max-width: 58.33333%; }
  .col-lg-8 {
    flex: 0 0 66.66667%;
    max-width: 66.66667%; }
  .col-lg-9 {
    flex: 0 0 75%;
    max-width: 75%; }
  .col-lg-10 {
    flex: 0 0 83.33333%;
    max-width: 83.33333%; }
  .col-lg-11 {
    flex: 0 0 91.66667%;
    max-width: 91.66667%; }
  .col-lg-12 {
    flex: 0 0 100%;
    max-width: 100%; }
  .order-lg-first {
    order: -1; }
  .order-lg-last {
    order: 13; }
  .order-lg-0 {
    order: 0; }
  .order-lg-1 {
    order: 1; }
  .order-lg-2 {
    order: 2; }
  .order-lg-3 {
    order: 3; }
  .order-lg-4 {
    order: 4; }
  .order-lg-5 {
    order: 5; }
  .order-lg-6 {
    order: 6; }
  .order-lg-7 {
    order: 7; }
  .order-lg-8 {
    order: 8; }
  .order-lg-9 {
    order: 9; }
  .order-lg-10 {
    order: 10; }
  .order-lg-11 {
    order: 11; }
  .order-lg-12 {
    order: 12; }
  .offset-lg-0 {
    margin-left: 0; }
  .offset-lg-1 {
    margin-left: 8.33333%; }
  .offset-lg-2 {
    margin-left: 16.66667%; }
  .offset-lg-3 {
    margin-left: 25%; }
  .offset-lg-4 {
    margin-left: 33.33333%; }
  .offset-lg-5 {
    margin-left: 41.66667%; }
  .offset-lg-6 {
    margin-left: 50%; }
  .offset-lg-7 {
    margin-left: 58.33333%; }
  .offset-lg-8 {
    margin-left: 66.66667%; }
  .offset-lg-9 {
    margin-left: 75%; }
  .offset-lg-10 {
    margin-left: 83.33333%; }
  .offset-lg-11 {
    margin-left: 91.66667%; } }

@media (min-width: 1200px) {
  .col-xl {
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%; }
  .row-cols-xl-1 > * {
    flex: 0 0 100%;
    max-width: 100%; }
  .row-cols-xl-2 > * {
    flex: 0 0 50%;
    max-width: 50%; }
  .row-cols-xl-3 > * {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .row-cols-xl-4 > * {
    flex: 0 0 25%;
    max-width: 25%; }
  .row-cols-xl-5 > * {
    flex: 0 0 20%;
    max-width: 20%; }
  .row-cols-xl-6 > * {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-xl-auto {
    flex: 0 0 auto;
    width: auto;
    max-width: 100%; }
  .col-xl-1 {
    flex: 0 0 8.33333%;
    max-width: 8.33333%; }
  .col-xl-2 {
    flex: 0 0 16.66667%;
    max-width: 16.66667%; }
  .col-xl-3 {
    flex: 0 0 25%;
    max-width: 25%; }
  .col-xl-4 {
    flex: 0 0 33.33333%;
    max-width: 33.33333%; }
  .col-xl-5 {
    flex: 0 0 41.66667%;
    max-width: 41.66667%; }
  .col-xl-6 {
    flex: 0 0 50%;
    max-width: 50%; }
  .col-xl-7 {
    flex: 0 0 58.33333%;
    max-width: 58.33333%; }
  .col-xl-8 {
    flex: 0 0 66.66667%;
    max-width: 66.66667%; }
  .col-xl-9 {
    flex: 0 0 75%;
    max-width: 75%; }
  .col-xl-10 {
    flex: 0 0 83.33333%;
    max-width: 83.33333%; }
  .col-xl-11 {
    flex: 0 0 91.66667%;
    max-width: 91.66667%; }
  .col-xl-12 {
    flex: 0 0 100%;
    max-width: 100%; }
  .order-xl-first {
    order: -1; }
  .order-xl-last {
    order: 13; }
  .order-xl-0 {
    order: 0; }
  .order-xl-1 {
    order: 1; }
  .order-xl-2 {
    order: 2; }
  .order-xl-3 {
    order: 3; }
  .order-xl-4 {
    order: 4; }
  .order-xl-5 {
    order: 5; }
  .order-xl-6 {
    order: 6; }
  .order-xl-7 {
    order: 7; }
  .order-xl-8 {
    order: 8; }
  .order-xl-9 {
    order: 9; }
  .order-xl-10 {
    order: 10; }
  .order-xl-11 {
    order: 11; }
  .order-xl-12 {
    order: 12; }
  .offset-xl-0 {
    margin-left: 0; }
  .offset-xl-1 {
    margin-left: 8.33333%; }
  .offset-xl-2 {
    margin-left: 16.66667%; }
  .offset-xl-3 {
    margin-left: 25%; }
  .offset-xl-4 {
    margin-left: 33.33333%; }
  .offset-xl-5 {
    margin-left: 41.66667%; }
  .offset-xl-6 {
    margin-left: 50%; }
  .offset-xl-7 {
    margin-left: 58.33333%; }
  .offset-xl-8 {
    margin-left: 66.66667%; }
  .offset-xl-9 {
    margin-left: 75%; }
  .offset-xl-10 {
    margin-left: 83.33333%; }
  .offset-xl-11 {
    margin-left: 91.66667%; } }

.table {
  width: 100%;
  margin-bottom: 10px;
  color: #212529; }
  .table th,
  .table td {
    padding: 7.5px;
    vertical-align: top;
    border-top: 1px solid #dee2e6; }
  .table thead th {
    vertical-align: bottom;
    border-bottom: 2px solid #dee2e6; }
  .table tbody + tbody {
    border-top: 2px solid #dee2e6; }

.table-sm th,
.table-sm td {
  padding: 3px; }

.table-bordered {
  border: 1px solid #dee2e6; }
  .table-bordered th,
  .table-bordered td {
    border: 1px solid #dee2e6; }
  .table-bordered thead th,
  .table-bordered thead td {
    border-bottom-width: 2px; }

.table-borderless th,
.table-borderless td,
.table-borderless thead th,
.table-borderless tbody + tbody {
  border: 0; }

.table-striped tbody tr:nth-of-type(odd) {
  background-color: rgba(0, 0, 0, 0.05); }

.table-hover tbody tr:hover {
  color: #212529;
  background-color: rgba(0, 0, 0, 0.075); }

.table-primary,
.table-primary > th,
.table-primary > td {
  background-color: #b8daff; }

.table-primary th,
.table-primary td,
.table-primary thead th,
.table-primary tbody + tbody {
  border-color: #7abaff; }

.table-hover .table-primary:hover {
  background-color: #9fcdff; }
  .table-hover .table-primary:hover > td,
  .table-hover .table-primary:hover > th {
    background-color: #9fcdff; }

.table-secondary,
.table-secondary > th,
.table-secondary > td {
  background-color: #d6d8db; }

.table-secondary th,
.table-secondary td,
.table-secondary thead th,
.table-secondary tbody + tbody {
  border-color: #b3b7bb; }

.table-hover .table-secondary:hover {
  background-color: #c8cbcf; }
  .table-hover .table-secondary:hover > td,
  .table-hover .table-secondary:hover > th {
    background-color: #c8cbcf; }

.table-success,
.table-success > th,
.table-success > td {
  background-color: #c3e6cb; }

.table-success th,
.table-success td,
.table-success thead th,
.table-success tbody + tbody {
  border-color: #8fd19e; }

.table-hover .table-success:hover {
  background-color: #b1dfbb; }
  .table-hover .table-success:hover > td,
  .table-hover .table-success:hover > th {
    background-color: #b1dfbb; }

.table-info,
.table-info > th,
.table-info > td {
  background-color: #bee5eb; }

.table-info th,
.table-info td,
.table-info thead th,
.table-info tbody + tbody {
  border-color: #86cfda; }

.table-hover .table-info:hover {
  background-color: #abdde5; }
  .table-hover .table-info:hover > td,
  .table-hover .table-info:hover > th {
    background-color: #abdde5; }

.table-warning,
.table-warning > th,
.table-warning > td {
  background-color: #ffeeba; }

.table-warning th,
.table-warning td,
.table-warning thead th,
.table-warning tbody + tbody {
  border-color: #ffdf7e; }

.table-hover .table-warning:hover {
  background-color: #ffe8a1; }
  .table-hover .table-warning:hover > td,
  .table-hover .table-warning:hover > th {
    background-color: #ffe8a1; }

.table-danger,
.table-danger > th,
.table-danger > td {
  background-color: #f5c6cb; }

.table-danger th,
.table-danger td,
.table-danger thead th,
.table-danger tbody + tbody {
  border-color: #ed969e; }

.table-hover .table-danger:hover {
  background-color: #f1b0b7; }
  .table-hover .table-danger:hover > td,
  .table-hover .table-danger:hover > th {
    background-color: #f1b0b7; }

.table-light,
.table-light > th,
.table-light > td {
  background-color: #fdfdfe; }

.table-light th,
.table-light td,
.table-light thead th,
.table-light tbody + tbody {
  border-color: #fbfcfc; }

.table-hover .table-light:hover {
  background-color: #ececf6; }
  .table-hover .table-light:hover > td,
  .table-hover .table-light:hover > th {
    background-color: #ececf6; }

.table-dark,
.table-dark > th,
.table-dark > td {
  background-color: #c6c8ca; }

.table-dark th,
.table-dark td,
.table-dark thead th,
.table-dark tbody + tbody {
  border-color: #95999c; }

.table-hover .table-dark:hover {
  background-color: #b9bbbe; }
  .table-hover .table-dark:hover > td,
  .table-hover .table-dark:hover > th {
    background-color: #b9bbbe; }

.table-active,
.table-active > th,
.table-active > td {
  background-color: rgba(0, 0, 0, 0.075); }

.table-hover .table-active:hover {
  background-color: rgba(0, 0, 0, 0.075); }
  .table-hover .table-active:hover > td,
  .table-hover .table-active:hover > th {
    background-color: rgba(0, 0, 0, 0.075); }

.table .thead-dark th {
  color: #fff;
  background-color: #343a40;
  border-color: #454d55; }

.table .thead-light th {
  color: #495057;
  background-color: #e9ecef;
  border-color: #dee2e6; }

.table-dark {
  color: #fff;
  background-color: #343a40; }
  .table-dark th,
  .table-dark td,
  .table-dark thead th {
    border-color: #454d55; }
  .table-dark.table-bordered {
    border: 0; }
  .table-dark.table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(255, 255, 255, 0.05); }
  .table-dark.table-hover tbody tr:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.075); }

@media (max-width: 575.98px) {
  .table-responsive-sm {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; }
    .table-responsive-sm > .table-bordered {
      border: 0; } }

@media (max-width: 767.98px) {
  .table-responsive-md {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; }
    .table-responsive-md > .table-bordered {
      border: 0; } }

@media (max-width: 991.98px) {
  .table-responsive-lg {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; }
    .table-responsive-lg > .table-bordered {
      border: 0; } }

@media (max-width: 1199.98px) {
  .table-responsive-xl {
    display: block;
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch; }
    .table-responsive-xl > .table-bordered {
      border: 0; } }

.table-responsive {
  display: block;
  width: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; }
  .table-responsive > .table-bordered {
    border: 0; }

.form-control {
  display: block;
  width: 100%;
  height: add(1.5, add(7.5px, 2px, false));
  padding: 3.75px 7.5px;
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  color: #495057;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid #ced4da;
  border-radius: 2.5px;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
  @media (prefers-reduced-motion: reduce) {
    .form-control {
      transition: none; } }
  .form-control::-ms-expand {
    background-color: transparent;
    border: 0; }
  .form-control:-moz-focusring {
    color: transparent;
    text-shadow: 0 0 0 #495057; }
  .form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #80bdff;
    outline: 0;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }
  .form-control::placeholder {
    color: #6c757d;
    opacity: 1; }
  .form-control:disabled, .form-control[readonly] {
    background-color: #e9ecef;
    opacity: 1; }

input[type="date"].form-control,
input[type="time"].form-control,
input[type="datetime-local"].form-control,
input[type="month"].form-control {
  appearance: none; }

select.form-control:focus::-ms-value {
  color: #495057;
  background-color: #fff; }

.form-control-file,
.form-control-range {
  display: block;
  width: 100%; }

.col-form-label {
  padding-top: 4.75px;
  padding-bottom: 4.75px;
  margin-bottom: 0;
  font-size: inherit;
  line-height: 1.5; }

.col-form-label-lg {
  padding-top: 4px;
  padding-bottom: 4px;
  font-size: 15px;
  line-height: 1.5; }

.col-form-label-sm {
  padding-top: 3.5px;
  padding-bottom: 3.5px;
  font-size: 10.5px;
  line-height: 18px; }

.form-control-plaintext {
  display: block;
  width: 100%;
  padding: 3.75px 0;
  margin-bottom: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #212529;
  background-color: transparent;
  border: solid transparent;
  border-width: 1px 0; }
  .form-control-plaintext.form-control-sm, .form-control-plaintext.form-control-lg {
    padding-right: 0;
    padding-left: 0; }

.form-control-sm {
  height: add(18px, add(5px, 2px, false));
  padding: 2.5px 0.5rem;
  font-size: 10.5px;
  line-height: 18px;
  border-radius: 2.5px; }

.form-control-lg {
  height: add(1.5, add(6px, 2px, false));
  padding: 3px 10px;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 2.5px; }

select.form-control[size], select.form-control[multiple] {
  height: auto; }

textarea.form-control {
  height: auto; }

.form-group {
  margin-bottom: 1rem; }

.form-text {
  display: block;
  margin-top: 0.25rem; }

.form-row {
  display: flex;
  flex-wrap: wrap;
  margin-right: -5px;
  margin-left: -5px; }
  .form-row > .col,
  .form-row > [class*="col-"] {
    padding-right: 5px;
    padding-left: 5px; }

.form-check {
  position: relative;
  display: block;
  padding-left: 1.25rem; }

.form-check-input {
  position: absolute;
  margin-top: 0.3rem;
  margin-left: -1.25rem; }
  .form-check-input[disabled] ~ .form-check-label,
  .form-check-input:disabled ~ .form-check-label {
    color: #6c757d; }

.form-check-label {
  margin-bottom: 0; }

.form-check-inline {
  display: inline-flex;
  align-items: center;
  padding-left: 0;
  margin-right: 0.75rem; }
  .form-check-inline .form-check-input {
    position: static;
    margin-top: 0;
    margin-right: 0.3125rem;
    margin-left: 0; }

.valid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #28a745; }

.valid-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  display: none;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  margin-top: .1rem;
  font-size: 10.5px;
  line-height: 1.5;
  color: #fff;
  background-color: rgba(40, 167, 69, 0.9);
  border-radius: 2.5px; }

.was-validated :valid ~ .valid-feedback,
.was-validated :valid ~ .valid-tooltip,
.is-valid ~ .valid-feedback,
.is-valid ~ .valid-tooltip {
  display: block; }

.was-validated .form-control:valid, .form-control.is-valid {
  border-color: #28a745;
  padding-right: add(1.5, 7.5px);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right add(0.375, 1.875px) center;
  background-size: add(0.75, 3.75px) add(0.75, 3.75px); }
  .was-validated .form-control:valid:focus, .form-control.is-valid:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25); }

.was-validated textarea.form-control:valid, textarea.form-control.is-valid {
  padding-right: add(1.5, 7.5px);
  background-position: top add(0.375, 1.875px) right add(0.375, 1.875px); }

.was-validated .custom-select:valid, .custom-select.is-valid {
  border-color: #28a745;
  padding-right: add(7.5px, 23.125px);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right 7.5px center/8px 10px, url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e") #fff no-repeat center right 17.5px/add(0.75, 3.75px) add(0.75, 3.75px); }
  .was-validated .custom-select:valid:focus, .custom-select.is-valid:focus {
    border-color: #28a745;
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25); }

.was-validated .form-check-input:valid ~ .form-check-label, .form-check-input.is-valid ~ .form-check-label {
  color: #28a745; }

.was-validated .form-check-input:valid ~ .valid-feedback,
.was-validated .form-check-input:valid ~ .valid-tooltip, .form-check-input.is-valid ~ .valid-feedback,
.form-check-input.is-valid ~ .valid-tooltip {
  display: block; }

.was-validated .custom-control-input:valid ~ .custom-control-label, .custom-control-input.is-valid ~ .custom-control-label {
  color: #28a745; }
  .was-validated .custom-control-input:valid ~ .custom-control-label::before, .custom-control-input.is-valid ~ .custom-control-label::before {
    border-color: #28a745; }

.was-validated .custom-control-input:valid:checked ~ .custom-control-label::before, .custom-control-input.is-valid:checked ~ .custom-control-label::before {
  border-color: #34ce57;
  background-color: #34ce57; }

.was-validated .custom-control-input:valid:focus ~ .custom-control-label::before, .custom-control-input.is-valid:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25); }

.was-validated .custom-control-input:valid:focus:not(:checked) ~ .custom-control-label::before, .custom-control-input.is-valid:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #28a745; }

.was-validated .custom-file-input:valid ~ .custom-file-label, .custom-file-input.is-valid ~ .custom-file-label {
  border-color: #28a745; }

.was-validated .custom-file-input:valid:focus ~ .custom-file-label, .custom-file-input.is-valid:focus ~ .custom-file-label {
  border-color: #28a745;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25); }

.invalid-feedback {
  display: none;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 80%;
  color: #dc3545; }

.invalid-tooltip {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 5;
  display: none;
  max-width: 100%;
  padding: 0.25rem 0.5rem;
  margin-top: .1rem;
  font-size: 10.5px;
  line-height: 1.5;
  color: #fff;
  background-color: rgba(220, 53, 69, 0.9);
  border-radius: 2.5px; }

.was-validated :invalid ~ .invalid-feedback,
.was-validated :invalid ~ .invalid-tooltip,
.is-invalid ~ .invalid-feedback,
.is-invalid ~ .invalid-tooltip {
  display: block; }

.was-validated .form-control:invalid, .form-control.is-invalid {
  border-color: #dc3545;
  padding-right: add(1.5, 7.5px);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right add(0.375, 1.875px) center;
  background-size: add(0.75, 3.75px) add(0.75, 3.75px); }
  .was-validated .form-control:invalid:focus, .form-control.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25); }

.was-validated textarea.form-control:invalid, textarea.form-control.is-invalid {
  padding-right: add(1.5, 7.5px);
  background-position: top add(0.375, 1.875px) right add(0.375, 1.875px); }

.was-validated .custom-select:invalid, .custom-select.is-invalid {
  border-color: #dc3545;
  padding-right: add(7.5px, 23.125px);
  background: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e") no-repeat right 7.5px center/8px 10px, url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e") #fff no-repeat center right 17.5px/add(0.75, 3.75px) add(0.75, 3.75px); }
  .was-validated .custom-select:invalid:focus, .custom-select.is-invalid:focus {
    border-color: #dc3545;
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25); }

.was-validated .form-check-input:invalid ~ .form-check-label, .form-check-input.is-invalid ~ .form-check-label {
  color: #dc3545; }

.was-validated .form-check-input:invalid ~ .invalid-feedback,
.was-validated .form-check-input:invalid ~ .invalid-tooltip, .form-check-input.is-invalid ~ .invalid-feedback,
.form-check-input.is-invalid ~ .invalid-tooltip {
  display: block; }

.was-validated .custom-control-input:invalid ~ .custom-control-label, .custom-control-input.is-invalid ~ .custom-control-label {
  color: #dc3545; }
  .was-validated .custom-control-input:invalid ~ .custom-control-label::before, .custom-control-input.is-invalid ~ .custom-control-label::before {
    border-color: #dc3545; }

.was-validated .custom-control-input:invalid:checked ~ .custom-control-label::before, .custom-control-input.is-invalid:checked ~ .custom-control-label::before {
  border-color: #e4606d;
  background-color: #e4606d; }

.was-validated .custom-control-input:invalid:focus ~ .custom-control-label::before, .custom-control-input.is-invalid:focus ~ .custom-control-label::before {
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25); }

.was-validated .custom-control-input:invalid:focus:not(:checked) ~ .custom-control-label::before, .custom-control-input.is-invalid:focus:not(:checked) ~ .custom-control-label::before {
  border-color: #dc3545; }

.was-validated .custom-file-input:invalid ~ .custom-file-label, .custom-file-input.is-invalid ~ .custom-file-label {
  border-color: #dc3545; }

.was-validated .custom-file-input:invalid:focus ~ .custom-file-label, .custom-file-input.is-invalid:focus ~ .custom-file-label {
  border-color: #dc3545;
  box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.25); }

.form-inline {
  display: flex;
  flex-flow: row wrap;
  align-items: center; }
  .form-inline .form-check {
    width: 100%; }
  @media (min-width: 576px) {
    .form-inline label {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0; }
    .form-inline .form-group {
      display: flex;
      flex: 0 0 auto;
      flex-flow: row wrap;
      align-items: center;
      margin-bottom: 0; }
    .form-inline .form-control {
      display: inline-block;
      width: auto;
      vertical-align: middle; }
    .form-inline .form-control-plaintext {
      display: inline-block; }
    .form-inline .input-group,
    .form-inline .custom-select {
      width: auto; }
    .form-inline .form-check {
      display: flex;
      align-items: center;
      justify-content: center;
      width: auto;
      padding-left: 0; }
    .form-inline .form-check-input {
      position: relative;
      flex-shrink: 0;
      margin-top: 0;
      margin-right: 0.25rem;
      margin-left: 0; }
    .form-inline .custom-control {
      align-items: center;
      justify-content: center; }
    .form-inline .custom-control-label {
      margin-bottom: 0; } }

.btn {
  display: inline-block;
  font-weight: 400;
  color: #212529;
  text-align: center;
  vertical-align: middle;
  user-select: none;
  background-color: transparent;
  border: 1px solid transparent;
  padding: 3.75px 7.5px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 2.5px;
  transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out; }
  @media (prefers-reduced-motion: reduce) {
    .btn {
      transition: none; } }
  .btn:hover {
    color: #212529;
    text-decoration: none; }
  .btn:focus, .btn.focus {
    outline: 0;
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25); }
  .btn.disabled, .btn:disabled {
    opacity: 0.65; }
  .btn:not(:disabled):not(.disabled) {
    cursor: pointer; }

a.btn.disabled,
fieldset:disabled a.btn {
  pointer-events: none; }

.btn-primary {
  color: #fff;
  background-color: #007bff;
  border-color: #007bff; }
  .btn-primary:hover {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc; }
  .btn-primary:focus, .btn-primary.focus {
    color: #fff;
    background-color: #0069d9;
    border-color: #0062cc;
    box-shadow: 0 0 0 2px rgba(38, 143, 255, 0.5); }
  .btn-primary.disabled, .btn-primary:disabled {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff; }
  .btn-primary:not(:disabled):not(.disabled):active, .btn-primary:not(:disabled):not(.disabled).active,
  .show > .btn-primary.dropdown-toggle {
    color: #fff;
    background-color: #0062cc;
    border-color: #005cbf; }
    .btn-primary:not(:disabled):not(.disabled):active:focus, .btn-primary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-primary.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(38, 143, 255, 0.5); }

.btn-secondary {
  color: #fff;
  background-color: #6c757d;
  border-color: #6c757d; }
  .btn-secondary:hover {
    color: #fff;
    background-color: #5a6268;
    border-color: #545b62; }
  .btn-secondary:focus, .btn-secondary.focus {
    color: #fff;
    background-color: #5a6268;
    border-color: #545b62;
    box-shadow: 0 0 0 2px rgba(130, 138, 145, 0.5); }
  .btn-secondary.disabled, .btn-secondary:disabled {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d; }
  .btn-secondary:not(:disabled):not(.disabled):active, .btn-secondary:not(:disabled):not(.disabled).active,
  .show > .btn-secondary.dropdown-toggle {
    color: #fff;
    background-color: #545b62;
    border-color: #4e555b; }
    .btn-secondary:not(:disabled):not(.disabled):active:focus, .btn-secondary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-secondary.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(130, 138, 145, 0.5); }

.btn-success {
  color: #fff;
  background-color: #28a745;
  border-color: #28a745; }
  .btn-success:hover {
    color: #fff;
    background-color: #218838;
    border-color: #1e7e34; }
  .btn-success:focus, .btn-success.focus {
    color: #fff;
    background-color: #218838;
    border-color: #1e7e34;
    box-shadow: 0 0 0 2px rgba(72, 180, 97, 0.5); }
  .btn-success.disabled, .btn-success:disabled {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745; }
  .btn-success:not(:disabled):not(.disabled):active, .btn-success:not(:disabled):not(.disabled).active,
  .show > .btn-success.dropdown-toggle {
    color: #fff;
    background-color: #1e7e34;
    border-color: #1c7430; }
    .btn-success:not(:disabled):not(.disabled):active:focus, .btn-success:not(:disabled):not(.disabled).active:focus,
    .show > .btn-success.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(72, 180, 97, 0.5); }

.btn-info {
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8; }
  .btn-info:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b; }
  .btn-info:focus, .btn-info.focus {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b;
    box-shadow: 0 0 0 2px rgba(58, 176, 195, 0.5); }
  .btn-info.disabled, .btn-info:disabled {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8; }
  .btn-info:not(:disabled):not(.disabled):active, .btn-info:not(:disabled):not(.disabled).active,
  .show > .btn-info.dropdown-toggle {
    color: #fff;
    background-color: #117a8b;
    border-color: #10707f; }
    .btn-info:not(:disabled):not(.disabled):active:focus, .btn-info:not(:disabled):not(.disabled).active:focus,
    .show > .btn-info.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(58, 176, 195, 0.5); }

.btn-warning {
  color: #212529;
  background-color: #ffc107;
  border-color: #ffc107; }
  .btn-warning:hover {
    color: #212529;
    background-color: #e0a800;
    border-color: #d39e00; }
  .btn-warning:focus, .btn-warning.focus {
    color: #212529;
    background-color: #e0a800;
    border-color: #d39e00;
    box-shadow: 0 0 0 2px rgba(222, 170, 12, 0.5); }
  .btn-warning.disabled, .btn-warning:disabled {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107; }
  .btn-warning:not(:disabled):not(.disabled):active, .btn-warning:not(:disabled):not(.disabled).active,
  .show > .btn-warning.dropdown-toggle {
    color: #212529;
    background-color: #d39e00;
    border-color: #c69500; }
    .btn-warning:not(:disabled):not(.disabled):active:focus, .btn-warning:not(:disabled):not(.disabled).active:focus,
    .show > .btn-warning.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(222, 170, 12, 0.5); }

.btn-danger {
  color: #fff;
  background-color: #dc3545;
  border-color: #dc3545; }
  .btn-danger:hover {
    color: #fff;
    background-color: #c82333;
    border-color: #bd2130; }
  .btn-danger:focus, .btn-danger.focus {
    color: #fff;
    background-color: #c82333;
    border-color: #bd2130;
    box-shadow: 0 0 0 2px rgba(225, 83, 97, 0.5); }
  .btn-danger.disabled, .btn-danger:disabled {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545; }
  .btn-danger:not(:disabled):not(.disabled):active, .btn-danger:not(:disabled):not(.disabled).active,
  .show > .btn-danger.dropdown-toggle {
    color: #fff;
    background-color: #bd2130;
    border-color: #b21f2d; }
    .btn-danger:not(:disabled):not(.disabled):active:focus, .btn-danger:not(:disabled):not(.disabled).active:focus,
    .show > .btn-danger.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(225, 83, 97, 0.5); }

.btn-light {
  color: #212529;
  background-color: #f8f9fa;
  border-color: #f8f9fa; }
  .btn-light:hover {
    color: #212529;
    background-color: #e2e6ea;
    border-color: #dae0e5; }
  .btn-light:focus, .btn-light.focus {
    color: #212529;
    background-color: #e2e6ea;
    border-color: #dae0e5;
    box-shadow: 0 0 0 2px rgba(216, 217, 219, 0.5); }
  .btn-light.disabled, .btn-light:disabled {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa; }
  .btn-light:not(:disabled):not(.disabled):active, .btn-light:not(:disabled):not(.disabled).active,
  .show > .btn-light.dropdown-toggle {
    color: #212529;
    background-color: #dae0e5;
    border-color: #d3d9df; }
    .btn-light:not(:disabled):not(.disabled):active:focus, .btn-light:not(:disabled):not(.disabled).active:focus,
    .show > .btn-light.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(216, 217, 219, 0.5); }

.btn-dark {
  color: #fff;
  background-color: #343a40;
  border-color: #343a40; }
  .btn-dark:hover {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124; }
  .btn-dark:focus, .btn-dark.focus {
    color: #fff;
    background-color: #23272b;
    border-color: #1d2124;
    box-shadow: 0 0 0 2px rgba(82, 88, 93, 0.5); }
  .btn-dark.disabled, .btn-dark:disabled {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40; }
  .btn-dark:not(:disabled):not(.disabled):active, .btn-dark:not(:disabled):not(.disabled).active,
  .show > .btn-dark.dropdown-toggle {
    color: #fff;
    background-color: #1d2124;
    border-color: #171a1d; }
    .btn-dark:not(:disabled):not(.disabled):active:focus, .btn-dark:not(:disabled):not(.disabled).active:focus,
    .show > .btn-dark.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(82, 88, 93, 0.5); }

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff; }
  .btn-outline-primary:hover {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff; }
  .btn-outline-primary:focus, .btn-outline-primary.focus {
    box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); }
  .btn-outline-primary.disabled, .btn-outline-primary:disabled {
    color: #007bff;
    background-color: transparent; }
  .btn-outline-primary:not(:disabled):not(.disabled):active, .btn-outline-primary:not(:disabled):not(.disabled).active,
  .show > .btn-outline-primary.dropdown-toggle {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff; }
    .btn-outline-primary:not(:disabled):not(.disabled):active:focus, .btn-outline-primary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-primary.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.5); }

.btn-outline-secondary {
  color: #6c757d;
  border-color: #6c757d; }
  .btn-outline-secondary:hover {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d; }
  .btn-outline-secondary:focus, .btn-outline-secondary.focus {
    box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.5); }
  .btn-outline-secondary.disabled, .btn-outline-secondary:disabled {
    color: #6c757d;
    background-color: transparent; }
  .btn-outline-secondary:not(:disabled):not(.disabled):active, .btn-outline-secondary:not(:disabled):not(.disabled).active,
  .show > .btn-outline-secondary.dropdown-toggle {
    color: #fff;
    background-color: #6c757d;
    border-color: #6c757d; }
    .btn-outline-secondary:not(:disabled):not(.disabled):active:focus, .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-secondary.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(108, 117, 125, 0.5); }

.btn-outline-success {
  color: #28a745;
  border-color: #28a745; }
  .btn-outline-success:hover {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745; }
  .btn-outline-success:focus, .btn-outline-success.focus {
    box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.5); }
  .btn-outline-success.disabled, .btn-outline-success:disabled {
    color: #28a745;
    background-color: transparent; }
  .btn-outline-success:not(:disabled):not(.disabled):active, .btn-outline-success:not(:disabled):not(.disabled).active,
  .show > .btn-outline-success.dropdown-toggle {
    color: #fff;
    background-color: #28a745;
    border-color: #28a745; }
    .btn-outline-success:not(:disabled):not(.disabled):active:focus, .btn-outline-success:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-success.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.5); }

.btn-outline-info {
  color: #17a2b8;
  border-color: #17a2b8; }
  .btn-outline-info:hover {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8; }
  .btn-outline-info:focus, .btn-outline-info.focus {
    box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.5); }
  .btn-outline-info.disabled, .btn-outline-info:disabled {
    color: #17a2b8;
    background-color: transparent; }
  .btn-outline-info:not(:disabled):not(.disabled):active, .btn-outline-info:not(:disabled):not(.disabled).active,
  .show > .btn-outline-info.dropdown-toggle {
    color: #fff;
    background-color: #17a2b8;
    border-color: #17a2b8; }
    .btn-outline-info:not(:disabled):not(.disabled):active:focus, .btn-outline-info:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-info.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(23, 162, 184, 0.5); }

.btn-outline-warning {
  color: #ffc107;
  border-color: #ffc107; }
  .btn-outline-warning:hover {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107; }
  .btn-outline-warning:focus, .btn-outline-warning.focus {
    box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.5); }
  .btn-outline-warning.disabled, .btn-outline-warning:disabled {
    color: #ffc107;
    background-color: transparent; }
  .btn-outline-warning:not(:disabled):not(.disabled):active, .btn-outline-warning:not(:disabled):not(.disabled).active,
  .show > .btn-outline-warning.dropdown-toggle {
    color: #212529;
    background-color: #ffc107;
    border-color: #ffc107; }
    .btn-outline-warning:not(:disabled):not(.disabled):active:focus, .btn-outline-warning:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-warning.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(255, 193, 7, 0.5); }

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545; }
  .btn-outline-danger:hover {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545; }
  .btn-outline-danger:focus, .btn-outline-danger.focus {
    box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.5); }
  .btn-outline-danger.disabled, .btn-outline-danger:disabled {
    color: #dc3545;
    background-color: transparent; }
  .btn-outline-danger:not(:disabled):not(.disabled):active, .btn-outline-danger:not(:disabled):not(.disabled).active,
  .show > .btn-outline-danger.dropdown-toggle {
    color: #fff;
    background-color: #dc3545;
    border-color: #dc3545; }
    .btn-outline-danger:not(:disabled):not(.disabled):active:focus, .btn-outline-danger:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-danger.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(220, 53, 69, 0.5); }

.btn-outline-light {
  color: #f8f9fa;
  border-color: #f8f9fa; }
  .btn-outline-light:hover {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa; }
  .btn-outline-light:focus, .btn-outline-light.focus {
    box-shadow: 0 0 0 2px rgba(248, 249, 250, 0.5); }
  .btn-outline-light.disabled, .btn-outline-light:disabled {
    color: #f8f9fa;
    background-color: transparent; }
  .btn-outline-light:not(:disabled):not(.disabled):active, .btn-outline-light:not(:disabled):not(.disabled).active,
  .show > .btn-outline-light.dropdown-toggle {
    color: #212529;
    background-color: #f8f9fa;
    border-color: #f8f9fa; }
    .btn-outline-light:not(:disabled):not(.disabled):active:focus, .btn-outline-light:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-light.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(248, 249, 250, 0.5); }

.btn-outline-dark {
  color: #343a40;
  border-color: #343a40; }
  .btn-outline-dark:hover {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40; }
  .btn-outline-dark:focus, .btn-outline-dark.focus {
    box-shadow: 0 0 0 2px rgba(52, 58, 64, 0.5); }
  .btn-outline-dark.disabled, .btn-outline-dark:disabled {
    color: #343a40;
    background-color: transparent; }
  .btn-outline-dark:not(:disabled):not(.disabled):active, .btn-outline-dark:not(:disabled):not(.disabled).active,
  .show > .btn-outline-dark.dropdown-toggle {
    color: #fff;
    background-color: #343a40;
    border-color: #343a40; }
    .btn-outline-dark:not(:disabled):not(.disabled):active:focus, .btn-outline-dark:not(:disabled):not(.disabled).active:focus,
    .show > .btn-outline-dark.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(52, 58, 64, 0.5); }

.btn-link {
  font-weight: 400;
  color: #007bff;
  text-decoration: none; }
  .btn-link:hover {
    color: #0056b3;
    text-decoration: underline; }
  .btn-link:focus, .btn-link.focus {
    text-decoration: underline; }
  .btn-link:disabled, .btn-link.disabled {
    color: #6c757d;
    pointer-events: none; }

.btn-lg, .btn-group-lg > .btn {
  padding: 3px 10px;
  font-size: 15px;
  line-height: 1.5;
  border-radius: 2.5px; }

.btn-sm, .btn-group-sm > .btn {
  padding: 2.5px 0.5rem;
  font-size: 10.5px;
  line-height: 18px;
  border-radius: 2.5px; }

.btn-block {
  display: block;
  width: 100%; }
  .btn-block + .btn-block {
    margin-top: 0.5rem; }

input[type="submit"].btn-block,
input[type="reset"].btn-block,
input[type="button"].btn-block {
  width: 100%; }

.fade {
  transition: opacity 0.15s linear; }
  @media (prefers-reduced-motion: reduce) {
    .fade {
      transition: none; } }
  .fade:not(.show) {
    opacity: 0; }

.collapse:not(.show) {
  display: none; }

.collapsing {
  position: relative;
  height: 0;
  overflow: hidden;
  transition: height 0.35s ease; }
  @media (prefers-reduced-motion: reduce) {
    .collapsing {
      transition: none; } }

.btn-group,
.btn-group-vertical {
  position: relative;
  display: inline-flex;
  vertical-align: middle; }
  .btn-group > .btn,
  .btn-group-vertical > .btn {
    position: relative;
    flex: 1 1 auto; }
    .btn-group > .btn:hover,
    .btn-group-vertical > .btn:hover {
      z-index: 1; }
    .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,
    .btn-group-vertical > .btn:focus,
    .btn-group-vertical > .btn:active,
    .btn-group-vertical > .btn.active {
      z-index: 1; }

.btn-toolbar {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start; }
  .btn-toolbar .input-group {
    width: auto; }

.btn-group > .btn:not(:first-child),
.btn-group > .btn-group:not(:first-child) {
  margin-left: -1px; }

.btn-group > .btn:not(:last-child):not(.dropdown-toggle),
.btn-group > .btn-group:not(:last-child) > .btn {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0; }

.btn-group > .btn:not(:first-child),
.btn-group > .btn-group:not(:first-child) > .btn {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0; }

.dropdown-toggle-split {
  padding-right: 5.625px;
  padding-left: 5.625px; }
  .dropdown-toggle-split::after,
  .dropup .dropdown-toggle-split::after,
  .dropright .dropdown-toggle-split::after {
    margin-left: 0; }
  .dropleft .dropdown-toggle-split::before {
    margin-right: 0; }

.btn-sm + .dropdown-toggle-split, .btn-group-sm > .btn + .dropdown-toggle-split {
  padding-right: 0.375rem;
  padding-left: 0.375rem; }

.btn-lg + .dropdown-toggle-split, .btn-group-lg > .btn + .dropdown-toggle-split {
  padding-right: 7.5px;
  padding-left: 7.5px; }

.btn-group-vertical {
  flex-direction: column;
  align-items: flex-start;
  justify-content: center; }
  .btn-group-vertical > .btn,
  .btn-group-vertical > .btn-group {
    width: 100%; }
  .btn-group-vertical > .btn:not(:first-child),
  .btn-group-vertical > .btn-group:not(:first-child) {
    margin-top: -1px; }
  .btn-group-vertical > .btn:not(:last-child):not(.dropdown-toggle),
  .btn-group-vertical > .btn-group:not(:last-child) > .btn {
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0; }
  .btn-group-vertical > .btn:not(:first-child),
  .btn-group-vertical > .btn-group:not(:first-child) > .btn {
    border-top-left-radius: 0;
    border-top-right-radius: 0; }

.btn-group-toggle > .btn,
.btn-group-toggle > .btn-group > .btn {
  margin-bottom: 0; }
  .btn-group-toggle > .btn input[type="radio"],
  .btn-group-toggle > .btn input[type="checkbox"],
  .btn-group-toggle > .btn-group > .btn input[type="radio"],
  .btn-group-toggle > .btn-group > .btn input[type="checkbox"] {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    pointer-events: none; }

.nav {
  display: flex;
  flex-wrap: wrap;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none; }

.nav-link {
  display: block;
  padding: 5px 10px; }
  .nav-link:hover, .nav-link:focus {
    text-decoration: none; }
  .nav-link.disabled {
    color: #6c757d;
    pointer-events: none;
    cursor: default; }

.nav-tabs {
  border-bottom: 1px solid #dee2e6; }
  .nav-tabs .nav-item {
    margin-bottom: -1px; }
  .nav-tabs .nav-link {
    border: 1px solid transparent;
    border-top-left-radius: 2.5px;
    border-top-right-radius: 2.5px; }
    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus {
      border-color: #e9ecef #e9ecef #dee2e6; }
    .nav-tabs .nav-link.disabled {
      color: #6c757d;
      background-color: transparent;
      border-color: transparent; }
  .nav-tabs .nav-link.active,
  .nav-tabs .nav-item.show .nav-link {
    color: #495057;
    background-color: #fff;
    border-color: #dee2e6 #dee2e6 #fff; }
  .nav-tabs .dropdown-menu {
    margin-top: -1px;
    border-top-left-radius: 0;
    border-top-right-radius: 0; }

.nav-pills .nav-link {
  border-radius: 2.5px; }

.nav-pills .nav-link.active,
.nav-pills .show > .nav-link {
  color: #fff;
  background-color: #007bff; }

.nav-fill > .nav-link,
.nav-fill .nav-item {
  flex: 1 1 auto;
  text-align: center; }

.nav-justified > .nav-link,
.nav-justified .nav-item {
  flex-basis: 0;
  flex-grow: 1;
  text-align: center; }

.tab-content > .tab-pane {
  display: none; }

.tab-content > .active {
  display: block; }

.navbar {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  padding: 5px 10px; }
  .navbar .container,
  .navbar .container-fluid, .navbar .container-sm, .navbar .container-md, .navbar .container-lg, .navbar .container-xl {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between; }

.navbar-brand {
  display: inline-block;
  padding-top: 2.75px;
  padding-bottom: 2.75px;
  margin-right: 10px;
  font-size: 15px;
  line-height: inherit;
  white-space: nowrap; }
  .navbar-brand:hover, .navbar-brand:focus {
    text-decoration: none; }

.navbar-nav {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  list-style: none; }
  .navbar-nav .nav-link {
    padding-right: 0;
    padding-left: 0; }
  .navbar-nav .dropdown-menu {
    position: static;
    float: none; }

.navbar-text {
  display: inline-block;
  padding-top: 5px;
  padding-bottom: 5px; }

.navbar-collapse {
  flex-basis: 100%;
  flex-grow: 1;
  align-items: center; }

.navbar-toggler {
  padding: 0.25rem 0.75rem;
  font-size: 15px;
  line-height: 1;
  background-color: transparent;
  border: 1px solid transparent;
  border-radius: 2.5px; }
  .navbar-toggler:hover, .navbar-toggler:focus {
    text-decoration: none; }

.navbar-toggler-icon {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  vertical-align: middle;
  content: "";
  background: no-repeat center center;
  background-size: 100% 100%; }

@media (max-width: 575.98px) {
  .navbar-expand-sm > .container,
  .navbar-expand-sm > .container-fluid, .navbar-expand-sm > .container-sm, .navbar-expand-sm > .container-md, .navbar-expand-sm > .container-lg, .navbar-expand-sm > .container-xl {
    padding-right: 0;
    padding-left: 0; } }

@media (min-width: 576px) {
  .navbar-expand-sm {
    flex-flow: row nowrap;
    justify-content: flex-start; }
    .navbar-expand-sm .navbar-nav {
      flex-direction: row; }
      .navbar-expand-sm .navbar-nav .dropdown-menu {
        position: absolute; }
      .navbar-expand-sm .navbar-nav .nav-link {
        padding-right: 0.5rem;
        padding-left: 0.5rem; }
    .navbar-expand-sm > .container,
    .navbar-expand-sm > .container-fluid, .navbar-expand-sm > .container-sm, .navbar-expand-sm > .container-md, .navbar-expand-sm > .container-lg, .navbar-expand-sm > .container-xl {
      flex-wrap: nowrap; }
    .navbar-expand-sm .navbar-collapse {
      display: flex !important;
      flex-basis: auto; }
    .navbar-expand-sm .navbar-toggler {
      display: none; } }

@media (max-width: 767.98px) {
  .navbar-expand-md > .container,
  .navbar-expand-md > .container-fluid, .navbar-expand-md > .container-sm, .navbar-expand-md > .container-md, .navbar-expand-md > .container-lg, .navbar-expand-md > .container-xl {
    padding-right: 0;
    padding-left: 0; } }

@media (min-width: 768px) {
  .navbar-expand-md {
    flex-flow: row nowrap;
    justify-content: flex-start; }
    .navbar-expand-md .navbar-nav {
      flex-direction: row; }
      .navbar-expand-md .navbar-nav .dropdown-menu {
        position: absolute; }
      .navbar-expand-md .navbar-nav .nav-link {
        padding-right: 0.5rem;
        padding-left: 0.5rem; }
    .navbar-expand-md > .container,
    .navbar-expand-md > .container-fluid, .navbar-expand-md > .container-sm, .navbar-expand-md > .container-md, .navbar-expand-md > .container-lg, .navbar-expand-md > .container-xl {
      flex-wrap: nowrap; }
    .navbar-expand-md .navbar-collapse {
      display: flex !important;
      flex-basis: auto; }
    .navbar-expand-md .navbar-toggler {
      display: none; } }

@media (max-width: 991.98px) {
  .navbar-expand-lg > .container,
  .navbar-expand-lg > .container-fluid, .navbar-expand-lg > .container-sm, .navbar-expand-lg > .container-md, .navbar-expand-lg > .container-lg, .navbar-expand-lg > .container-xl {
    padding-right: 0;
    padding-left: 0; } }

@media (min-width: 992px) {
  .navbar-expand-lg {
    flex-flow: row nowrap;
    justify-content: flex-start; }
    .navbar-expand-lg .navbar-nav {
      flex-direction: row; }
      .navbar-expand-lg .navbar-nav .dropdown-menu {
        position: absolute; }
      .navbar-expand-lg .navbar-nav .nav-link {
        padding-right: 0.5rem;
        padding-left: 0.5rem; }
    .navbar-expand-lg > .container,
    .navbar-expand-lg > .container-fluid, .navbar-expand-lg > .container-sm, .navbar-expand-lg > .container-md, .navbar-expand-lg > .container-lg, .navbar-expand-lg > .container-xl {
      flex-wrap: nowrap; }
    .navbar-expand-lg .navbar-collapse {
      display: flex !important;
      flex-basis: auto; }
    .navbar-expand-lg .navbar-toggler {
      display: none; } }

@media (max-width: 1199.98px) {
  .navbar-expand-xl > .container,
  .navbar-expand-xl > .container-fluid, .navbar-expand-xl > .container-sm, .navbar-expand-xl > .container-md, .navbar-expand-xl > .container-lg, .navbar-expand-xl > .container-xl {
    padding-right: 0;
    padding-left: 0; } }

@media (min-width: 1200px) {
  .navbar-expand-xl {
    flex-flow: row nowrap;
    justify-content: flex-start; }
    .navbar-expand-xl .navbar-nav {
      flex-direction: row; }
      .navbar-expand-xl .navbar-nav .dropdown-menu {
        position: absolute; }
      .navbar-expand-xl .navbar-nav .nav-link {
        padding-right: 0.5rem;
        padding-left: 0.5rem; }
    .navbar-expand-xl > .container,
    .navbar-expand-xl > .container-fluid, .navbar-expand-xl > .container-sm, .navbar-expand-xl > .container-md, .navbar-expand-xl > .container-lg, .navbar-expand-xl > .container-xl {
      flex-wrap: nowrap; }
    .navbar-expand-xl .navbar-collapse {
      display: flex !important;
      flex-basis: auto; }
    .navbar-expand-xl .navbar-toggler {
      display: none; } }

.navbar-expand {
  flex-flow: row nowrap;
  justify-content: flex-start; }
  .navbar-expand > .container,
  .navbar-expand > .container-fluid, .navbar-expand > .container-sm, .navbar-expand > .container-md, .navbar-expand > .container-lg, .navbar-expand > .container-xl {
    padding-right: 0;
    padding-left: 0; }
  .navbar-expand .navbar-nav {
    flex-direction: row; }
    .navbar-expand .navbar-nav .dropdown-menu {
      position: absolute; }
    .navbar-expand .navbar-nav .nav-link {
      padding-right: 0.5rem;
      padding-left: 0.5rem; }
  .navbar-expand > .container,
  .navbar-expand > .container-fluid, .navbar-expand > .container-sm, .navbar-expand > .container-md, .navbar-expand > .container-lg, .navbar-expand > .container-xl {
    flex-wrap: nowrap; }
  .navbar-expand .navbar-collapse {
    display: flex !important;
    flex-basis: auto; }
  .navbar-expand .navbar-toggler {
    display: none; }

.navbar-light .navbar-brand {
  color: rgba(0, 0, 0, 0.9); }
  .navbar-light .navbar-brand:hover, .navbar-light .navbar-brand:focus {
    color: rgba(0, 0, 0, 0.9); }

.navbar-light .navbar-nav .nav-link {
  color: rgba(0, 0, 0, 0.5); }
  .navbar-light .navbar-nav .nav-link:hover, .navbar-light .navbar-nav .nav-link:focus {
    color: rgba(0, 0, 0, 0.7); }
  .navbar-light .navbar-nav .nav-link.disabled {
    color: rgba(0, 0, 0, 0.3); }

.navbar-light .navbar-nav .show > .nav-link,
.navbar-light .navbar-nav .active > .nav-link,
.navbar-light .navbar-nav .nav-link.show,
.navbar-light .navbar-nav .nav-link.active {
  color: rgba(0, 0, 0, 0.9); }

.navbar-light .navbar-toggler {
  color: rgba(0, 0, 0, 0.5);
  border-color: rgba(0, 0, 0, 0.1); }

.navbar-light .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e"); }

.navbar-light .navbar-text {
  color: rgba(0, 0, 0, 0.5); }
  .navbar-light .navbar-text a {
    color: rgba(0, 0, 0, 0.9); }
    .navbar-light .navbar-text a:hover, .navbar-light .navbar-text a:focus {
      color: rgba(0, 0, 0, 0.9); }

.navbar-dark .navbar-brand {
  color: #fff; }
  .navbar-dark .navbar-brand:hover, .navbar-dark .navbar-brand:focus {
    color: #fff; }

.navbar-dark .navbar-nav .nav-link {
  color: rgba(255, 255, 255, 0.5); }
  .navbar-dark .navbar-nav .nav-link:hover, .navbar-dark .navbar-nav .nav-link:focus {
    color: rgba(255, 255, 255, 0.75); }
  .navbar-dark .navbar-nav .nav-link.disabled {
    color: rgba(255, 255, 255, 0.25); }

.navbar-dark .navbar-nav .show > .nav-link,
.navbar-dark .navbar-nav .active > .nav-link,
.navbar-dark .navbar-nav .nav-link.show,
.navbar-dark .navbar-nav .nav-link.active {
  color: #fff; }

.navbar-dark .navbar-toggler {
  color: rgba(255, 255, 255, 0.5);
  border-color: rgba(255, 255, 255, 0.1); }

.navbar-dark .navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255, 255, 255, 0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e"); }

.navbar-dark .navbar-text {
  color: rgba(255, 255, 255, 0.5); }
  .navbar-dark .navbar-text a {
    color: #fff; }
    .navbar-dark .navbar-text a:hover, .navbar-dark .navbar-text a:focus {
      color: #fff; }

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: #fff;
  background-clip: border-box;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 2.5px; }
  .card > hr {
    margin-right: 0;
    margin-left: 0; }
  .card > .list-group {
    border-top: inherit;
    border-bottom: inherit; }
    .card > .list-group:first-child {
      border-top-width: 0;
      border-top-left-radius: 1.5px;
      border-top-right-radius: 1.5px; }
    .card > .list-group:last-child {
      border-bottom-width: 0;
      border-bottom-right-radius: 1.5px;
      border-bottom-left-radius: 1.5px; }
  .card > .card-header + .list-group,
  .card > .list-group + .card-footer {
    border-top: 0; }

.card-body {
  flex: 1 1 auto;
  min-height: 1px;
  padding: 12.5px; }

.card-title {
  margin-bottom: 7.5px; }

.card-subtitle {
  margin-top: -3.75px;
  margin-bottom: 0; }

.card-text:last-child {
  margin-bottom: 0; }

.card-link:hover {
  text-decoration: none; }

.card-link + .card-link {
  margin-left: 12.5px; }

.card-header {
  padding: 7.5px 12.5px;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.03);
  border-bottom: 1px solid rgba(0, 0, 0, 0.125); }
  .card-header:first-child {
    border-radius: 1.5px 1.5px 0 0; }

.card-footer {
  padding: 7.5px 12.5px;
  background-color: rgba(0, 0, 0, 0.03);
  border-top: 1px solid rgba(0, 0, 0, 0.125); }
  .card-footer:last-child {
    border-radius: 0 0 1.5px 1.5px; }

.card-header-tabs {
  margin-right: -6.25px;
  margin-bottom: -7.5px;
  margin-left: -6.25px;
  border-bottom: 0; }

.card-header-pills {
  margin-right: -6.25px;
  margin-left: -6.25px; }

.card-img-overlay {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: 1.25rem;
  border-radius: 1.5px; }

.card-img,
.card-img-top,
.card-img-bottom {
  flex-shrink: 0;
  width: 100%; }

.card-img,
.card-img-top {
  border-top-left-radius: 1.5px;
  border-top-right-radius: 1.5px; }

.card-img,
.card-img-bottom {
  border-bottom-right-radius: 1.5px;
  border-bottom-left-radius: 1.5px; }

.card-deck .card {
  margin-bottom: 15px; }

@media (min-width: 576px) {
  .card-deck {
    display: flex;
    flex-flow: row wrap;
    margin-right: -15px;
    margin-left: -15px; }
    .card-deck .card {
      flex: 1 0 0%;
      margin-right: 15px;
      margin-bottom: 0;
      margin-left: 15px; } }

.card-group > .card {
  margin-bottom: 15px; }

@media (min-width: 576px) {
  .card-group {
    display: flex;
    flex-flow: row wrap; }
    .card-group > .card {
      flex: 1 0 0%;
      margin-bottom: 0; }
      .card-group > .card + .card {
        margin-left: 0;
        border-left: 0; }
      .card-group > .card:not(:last-child) {
        border-top-right-radius: 0;
        border-bottom-right-radius: 0; }
        .card-group > .card:not(:last-child) .card-img-top,
        .card-group > .card:not(:last-child) .card-header {
          border-top-right-radius: 0; }
        .card-group > .card:not(:last-child) .card-img-bottom,
        .card-group > .card:not(:last-child) .card-footer {
          border-bottom-right-radius: 0; }
      .card-group > .card:not(:first-child) {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0; }
        .card-group > .card:not(:first-child) .card-img-top,
        .card-group > .card:not(:first-child) .card-header {
          border-top-left-radius: 0; }
        .card-group > .card:not(:first-child) .card-img-bottom,
        .card-group > .card:not(:first-child) .card-footer {
          border-bottom-left-radius: 0; } }

.card-columns .card {
  margin-bottom: 7.5px; }

@media (min-width: 576px) {
  .card-columns {
    column-count: 3;
    column-gap: 1.25rem;
    orphans: 1;
    widows: 1; }
    .card-columns .card {
      display: inline-block;
      width: 100%; } }

.accordion {
  overflow-anchor: none; }
  .accordion > .card {
    overflow: hidden; }
    .accordion > .card:not(:last-of-type) {
      border-bottom: 0;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0; }
    .accordion > .card:not(:first-of-type) {
      border-top-left-radius: 0;
      border-top-right-radius: 0; }
    .accordion > .card > .card-header {
      border-radius: 0;
      margin-bottom: -1px; }

.alert {
  position: relative;
  padding: 7.5px 12.5px;
  margin-bottom: 1rem;
  border: 1px solid transparent;
  border-radius: 2.5px; }

.alert-heading {
  color: inherit; }

.alert-link {
  font-weight: 700; }

.alert-dismissible {
  padding-right: 43px; }
  .alert-dismissible .close {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    padding: 7.5px 12.5px;
    color: inherit; }

.alert-primary {
  color: #004085;
  background-color: #cce5ff;
  border-color: #b8daff; }
  .alert-primary hr {
    border-top-color: #9fcdff; }
  .alert-primary .alert-link {
    color: #002752; }

.alert-secondary {
  color: #383d41;
  background-color: #e2e3e5;
  border-color: #d6d8db; }
  .alert-secondary hr {
    border-top-color: #c8cbcf; }
  .alert-secondary .alert-link {
    color: #202326; }

.alert-success {
  color: #155724;
  background-color: #d4edda;
  border-color: #c3e6cb; }
  .alert-success hr {
    border-top-color: #b1dfbb; }
  .alert-success .alert-link {
    color: #0b2e13; }

.alert-info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-color: #bee5eb; }
  .alert-info hr {
    border-top-color: #abdde5; }
  .alert-info .alert-link {
    color: #062c33; }

.alert-warning {
  color: #856404;
  background-color: #fff3cd;
  border-color: #ffeeba; }
  .alert-warning hr {
    border-top-color: #ffe8a1; }
  .alert-warning .alert-link {
    color: #533f03; }

.alert-danger {
  color: #721c24;
  background-color: #f8d7da;
  border-color: #f5c6cb; }
  .alert-danger hr {
    border-top-color: #f1b0b7; }
  .alert-danger .alert-link {
    color: #491217; }

.alert-light {
  color: #818182;
  background-color: #fefefe;
  border-color: #fdfdfe; }
  .alert-light hr {
    border-top-color: #ececf6; }
  .alert-light .alert-link {
    color: #686868; }

.alert-dark {
  color: #1b1e21;
  background-color: #d6d8d9;
  border-color: #c6c8ca; }
  .alert-dark hr {
    border-top-color: #b9bbbe; }
  .alert-dark .alert-link {
    color: #040505; }

.media {
  display: flex;
  align-items: flex-start; }

.media-body {
  flex: 1; }

.align-baseline {
  vertical-align: baseline !important; }

.align-top {
  vertical-align: top !important; }

.align-middle {
  vertical-align: middle !important; }

.align-bottom {
  vertical-align: bottom !important; }

.align-text-bottom {
  vertical-align: text-bottom !important; }

.align-text-top {
  vertical-align: text-top !important; }

.bg-primary {
  background-color: #007bff !important; }

a.bg-primary:hover, a.bg-primary:focus,
button.bg-primary:hover,
button.bg-primary:focus {
  background-color: #0062cc !important; }

.bg-secondary {
  background-color: #6c757d !important; }

a.bg-secondary:hover, a.bg-secondary:focus,
button.bg-secondary:hover,
button.bg-secondary:focus {
  background-color: #545b62 !important; }

.bg-success {
  background-color: #28a745 !important; }

a.bg-success:hover, a.bg-success:focus,
button.bg-success:hover,
button.bg-success:focus {
  background-color: #1e7e34 !important; }

.bg-info {
  background-color: #17a2b8 !important; }

a.bg-info:hover, a.bg-info:focus,
button.bg-info:hover,
button.bg-info:focus {
  background-color: #117a8b !important; }

.bg-warning {
  background-color: #ffc107 !important; }

a.bg-warning:hover, a.bg-warning:focus,
button.bg-warning:hover,
button.bg-warning:focus {
  background-color: #d39e00 !important; }

.bg-danger {
  background-color: #dc3545 !important; }

a.bg-danger:hover, a.bg-danger:focus,
button.bg-danger:hover,
button.bg-danger:focus {
  background-color: #bd2130 !important; }

.bg-light {
  background-color: #f8f9fa !important; }

a.bg-light:hover, a.bg-light:focus,
button.bg-light:hover,
button.bg-light:focus {
  background-color: #dae0e5 !important; }

.bg-dark {
  background-color: #343a40 !important; }

a.bg-dark:hover, a.bg-dark:focus,
button.bg-dark:hover,
button.bg-dark:focus {
  background-color: #1d2124 !important; }

.bg-white {
  background-color: #fff !important; }

.bg-transparent {
  background-color: transparent !important; }

.border {
  border: 1px solid #dee2e6 !important; }

.border-top {
  border-top: 1px solid #dee2e6 !important; }

.border-right {
  border-right: 1px solid #dee2e6 !important; }

.border-bottom {
  border-bottom: 1px solid #dee2e6 !important; }

.border-left {
  border-left: 1px solid #dee2e6 !important; }

.border-0 {
  border: 0 !important; }

.border-top-0 {
  border-top: 0 !important; }

.border-right-0 {
  border-right: 0 !important; }

.border-bottom-0 {
  border-bottom: 0 !important; }

.border-left-0 {
  border-left: 0 !important; }

.border-primary {
  border-color: #007bff !important; }

.border-secondary {
  border-color: #6c757d !important; }

.border-success {
  border-color: #28a745 !important; }

.border-info {
  border-color: #17a2b8 !important; }

.border-warning {
  border-color: #ffc107 !important; }

.border-danger {
  border-color: #dc3545 !important; }

.border-light {
  border-color: #f8f9fa !important; }

.border-dark {
  border-color: #343a40 !important; }

.border-white {
  border-color: #fff !important; }

.rounded-sm {
  border-radius: 2.5px !important; }

.rounded {
  border-radius: 2.5px !important; }

.rounded-top {
  border-top-left-radius: 2.5px !important;
  border-top-right-radius: 2.5px !important; }

.rounded-right {
  border-top-right-radius: 2.5px !important;
  border-bottom-right-radius: 2.5px !important; }

.rounded-bottom {
  border-bottom-right-radius: 2.5px !important;
  border-bottom-left-radius: 2.5px !important; }

.rounded-left {
  border-top-left-radius: 2.5px !important;
  border-bottom-left-radius: 2.5px !important; }

.rounded-lg {
  border-radius: 2.5px !important; }

.rounded-circle {
  border-radius: 50% !important; }

.rounded-pill {
  border-radius: 50rem !important; }

.rounded-0 {
  border-radius: 0 !important; }

.clearfix::after {
  display: block;
  clear: both;
  content: ""; }

.d-none {
  display: none !important; }

.d-inline {
  display: inline !important; }

.d-inline-block {
  display: inline-block !important; }

.d-block {
  display: block !important; }

.d-table {
  display: table !important; }

.d-table-row {
  display: table-row !important; }

.d-table-cell {
  display: table-cell !important; }

.d-flex {
  display: flex !important; }

.d-inline-flex {
  display: inline-flex !important; }

@media (min-width: 576px) {
  .d-sm-none {
    display: none !important; }
  .d-sm-inline {
    display: inline !important; }
  .d-sm-inline-block {
    display: inline-block !important; }
  .d-sm-block {
    display: block !important; }
  .d-sm-table {
    display: table !important; }
  .d-sm-table-row {
    display: table-row !important; }
  .d-sm-table-cell {
    display: table-cell !important; }
  .d-sm-flex {
    display: flex !important; }
  .d-sm-inline-flex {
    display: inline-flex !important; } }

@media (min-width: 768px) {
  .d-md-none {
    display: none !important; }
  .d-md-inline {
    display: inline !important; }
  .d-md-inline-block {
    display: inline-block !important; }
  .d-md-block {
    display: block !important; }
  .d-md-table {
    display: table !important; }
  .d-md-table-row {
    display: table-row !important; }
  .d-md-table-cell {
    display: table-cell !important; }
  .d-md-flex {
    display: flex !important; }
  .d-md-inline-flex {
    display: inline-flex !important; } }

@media (min-width: 992px) {
  .d-lg-none {
    display: none !important; }
  .d-lg-inline {
    display: inline !important; }
  .d-lg-inline-block {
    display: inline-block !important; }
  .d-lg-block {
    display: block !important; }
  .d-lg-table {
    display: table !important; }
  .d-lg-table-row {
    display: table-row !important; }
  .d-lg-table-cell {
    display: table-cell !important; }
  .d-lg-flex {
    display: flex !important; }
  .d-lg-inline-flex {
    display: inline-flex !important; } }

@media (min-width: 1200px) {
  .d-xl-none {
    display: none !important; }
  .d-xl-inline {
    display: inline !important; }
  .d-xl-inline-block {
    display: inline-block !important; }
  .d-xl-block {
    display: block !important; }
  .d-xl-table {
    display: table !important; }
  .d-xl-table-row {
    display: table-row !important; }
  .d-xl-table-cell {
    display: table-cell !important; }
  .d-xl-flex {
    display: flex !important; }
  .d-xl-inline-flex {
    display: inline-flex !important; } }

@media print {
  .d-print-none {
    display: none !important; }
  .d-print-inline {
    display: inline !important; }
  .d-print-inline-block {
    display: inline-block !important; }
  .d-print-block {
    display: block !important; }
  .d-print-table {
    display: table !important; }
  .d-print-table-row {
    display: table-row !important; }
  .d-print-table-cell {
    display: table-cell !important; }
  .d-print-flex {
    display: flex !important; }
  .d-print-inline-flex {
    display: inline-flex !important; } }

.embed-responsive {
  position: relative;
  display: block;
  width: 100%;
  padding: 0;
  overflow: hidden; }
  .embed-responsive::before {
    display: block;
    content: ""; }
  .embed-responsive .embed-responsive-item,
  .embed-responsive iframe,
  .embed-responsive embed,
  .embed-responsive object,
  .embed-responsive video {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0; }

.embed-responsive-21by9::before {
  padding-top: 42.85714%; }

.embed-responsive-16by9::before {
  padding-top: 56.25%; }

.embed-responsive-4by3::before {
  padding-top: 75%; }

.embed-responsive-1by1::before {
  padding-top: 100%; }

.flex-row {
  flex-direction: row !important; }

.flex-column {
  flex-direction: column !important; }

.flex-row-reverse {
  flex-direction: row-reverse !important; }

.flex-column-reverse {
  flex-direction: column-reverse !important; }

.flex-wrap {
  flex-wrap: wrap !important; }

.flex-nowrap {
  flex-wrap: nowrap !important; }

.flex-wrap-reverse {
  flex-wrap: wrap-reverse !important; }

.flex-fill {
  flex: 1 1 auto !important; }

.flex-grow-0 {
  flex-grow: 0 !important; }

.flex-grow-1 {
  flex-grow: 1 !important; }

.flex-shrink-0 {
  flex-shrink: 0 !important; }

.flex-shrink-1 {
  flex-shrink: 1 !important; }

.justify-content-start {
  justify-content: flex-start !important; }

.justify-content-end {
  justify-content: flex-end !important; }

.justify-content-center {
  justify-content: center !important; }

.justify-content-between {
  justify-content: space-between !important; }

.justify-content-around {
  justify-content: space-around !important; }

.align-items-start {
  align-items: flex-start !important; }

.align-items-end {
  align-items: flex-end !important; }

.align-items-center {
  align-items: center !important; }

.align-items-baseline {
  align-items: baseline !important; }

.align-items-stretch {
  align-items: stretch !important; }

.align-content-start {
  align-content: flex-start !important; }

.align-content-end {
  align-content: flex-end !important; }

.align-content-center {
  align-content: center !important; }

.align-content-between {
  align-content: space-between !important; }

.align-content-around {
  align-content: space-around !important; }

.align-content-stretch {
  align-content: stretch !important; }

.align-self-auto {
  align-self: auto !important; }

.align-self-start {
  align-self: flex-start !important; }

.align-self-end {
  align-self: flex-end !important; }

.align-self-center {
  align-self: center !important; }

.align-self-baseline {
  align-self: baseline !important; }

.align-self-stretch {
  align-self: stretch !important; }

@media (min-width: 576px) {
  .flex-sm-row {
    flex-direction: row !important; }
  .flex-sm-column {
    flex-direction: column !important; }
  .flex-sm-row-reverse {
    flex-direction: row-reverse !important; }
  .flex-sm-column-reverse {
    flex-direction: column-reverse !important; }
  .flex-sm-wrap {
    flex-wrap: wrap !important; }
  .flex-sm-nowrap {
    flex-wrap: nowrap !important; }
  .flex-sm-wrap-reverse {
    flex-wrap: wrap-reverse !important; }
  .flex-sm-fill {
    flex: 1 1 auto !important; }
  .flex-sm-grow-0 {
    flex-grow: 0 !important; }
  .flex-sm-grow-1 {
    flex-grow: 1 !important; }
  .flex-sm-shrink-0 {
    flex-shrink: 0 !important; }
  .flex-sm-shrink-1 {
    flex-shrink: 1 !important; }
  .justify-content-sm-start {
    justify-content: flex-start !important; }
  .justify-content-sm-end {
    justify-content: flex-end !important; }
  .justify-content-sm-center {
    justify-content: center !important; }
  .justify-content-sm-between {
    justify-content: space-between !important; }
  .justify-content-sm-around {
    justify-content: space-around !important; }
  .align-items-sm-start {
    align-items: flex-start !important; }
  .align-items-sm-end {
    align-items: flex-end !important; }
  .align-items-sm-center {
    align-items: center !important; }
  .align-items-sm-baseline {
    align-items: baseline !important; }
  .align-items-sm-stretch {
    align-items: stretch !important; }
  .align-content-sm-start {
    align-content: flex-start !important; }
  .align-content-sm-end {
    align-content: flex-end !important; }
  .align-content-sm-center {
    align-content: center !important; }
  .align-content-sm-between {
    align-content: space-between !important; }
  .align-content-sm-around {
    align-content: space-around !important; }
  .align-content-sm-stretch {
    align-content: stretch !important; }
  .align-self-sm-auto {
    align-self: auto !important; }
  .align-self-sm-start {
    align-self: flex-start !important; }
  .align-self-sm-end {
    align-self: flex-end !important; }
  .align-self-sm-center {
    align-self: center !important; }
  .align-self-sm-baseline {
    align-self: baseline !important; }
  .align-self-sm-stretch {
    align-self: stretch !important; } }

@media (min-width: 768px) {
  .flex-md-row {
    flex-direction: row !important; }
  .flex-md-column {
    flex-direction: column !important; }
  .flex-md-row-reverse {
    flex-direction: row-reverse !important; }
  .flex-md-column-reverse {
    flex-direction: column-reverse !important; }
  .flex-md-wrap {
    flex-wrap: wrap !important; }
  .flex-md-nowrap {
    flex-wrap: nowrap !important; }
  .flex-md-wrap-reverse {
    flex-wrap: wrap-reverse !important; }
  .flex-md-fill {
    flex: 1 1 auto !important; }
  .flex-md-grow-0 {
    flex-grow: 0 !important; }
  .flex-md-grow-1 {
    flex-grow: 1 !important; }
  .flex-md-shrink-0 {
    flex-shrink: 0 !important; }
  .flex-md-shrink-1 {
    flex-shrink: 1 !important; }
  .justify-content-md-start {
    justify-content: flex-start !important; }
  .justify-content-md-end {
    justify-content: flex-end !important; }
  .justify-content-md-center {
    justify-content: center !important; }
  .justify-content-md-between {
    justify-content: space-between !important; }
  .justify-content-md-around {
    justify-content: space-around !important; }
  .align-items-md-start {
    align-items: flex-start !important; }
  .align-items-md-end {
    align-items: flex-end !important; }
  .align-items-md-center {
    align-items: center !important; }
  .align-items-md-baseline {
    align-items: baseline !important; }
  .align-items-md-stretch {
    align-items: stretch !important; }
  .align-content-md-start {
    align-content: flex-start !important; }
  .align-content-md-end {
    align-content: flex-end !important; }
  .align-content-md-center {
    align-content: center !important; }
  .align-content-md-between {
    align-content: space-between !important; }
  .align-content-md-around {
    align-content: space-around !important; }
  .align-content-md-stretch {
    align-content: stretch !important; }
  .align-self-md-auto {
    align-self: auto !important; }
  .align-self-md-start {
    align-self: flex-start !important; }
  .align-self-md-end {
    align-self: flex-end !important; }
  .align-self-md-center {
    align-self: center !important; }
  .align-self-md-baseline {
    align-self: baseline !important; }
  .align-self-md-stretch {
    align-self: stretch !important; } }

@media (min-width: 992px) {
  .flex-lg-row {
    flex-direction: row !important; }
  .flex-lg-column {
    flex-direction: column !important; }
  .flex-lg-row-reverse {
    flex-direction: row-reverse !important; }
  .flex-lg-column-reverse {
    flex-direction: column-reverse !important; }
  .flex-lg-wrap {
    flex-wrap: wrap !important; }
  .flex-lg-nowrap {
    flex-wrap: nowrap !important; }
  .flex-lg-wrap-reverse {
    flex-wrap: wrap-reverse !important; }
  .flex-lg-fill {
    flex: 1 1 auto !important; }
  .flex-lg-grow-0 {
    flex-grow: 0 !important; }
  .flex-lg-grow-1 {
    flex-grow: 1 !important; }
  .flex-lg-shrink-0 {
    flex-shrink: 0 !important; }
  .flex-lg-shrink-1 {
    flex-shrink: 1 !important; }
  .justify-content-lg-start {
    justify-content: flex-start !important; }
  .justify-content-lg-end {
    justify-content: flex-end !important; }
  .justify-content-lg-center {
    justify-content: center !important; }
  .justify-content-lg-between {
    justify-content: space-between !important; }
  .justify-content-lg-around {
    justify-content: space-around !important; }
  .align-items-lg-start {
    align-items: flex-start !important; }
  .align-items-lg-end {
    align-items: flex-end !important; }
  .align-items-lg-center {
    align-items: center !important; }
  .align-items-lg-baseline {
    align-items: baseline !important; }
  .align-items-lg-stretch {
    align-items: stretch !important; }
  .align-content-lg-start {
    align-content: flex-start !important; }
  .align-content-lg-end {
    align-content: flex-end !important; }
  .align-content-lg-center {
    align-content: center !important; }
  .align-content-lg-between {
    align-content: space-between !important; }
  .align-content-lg-around {
    align-content: space-around !important; }
  .align-content-lg-stretch {
    align-content: stretch !important; }
  .align-self-lg-auto {
    align-self: auto !important; }
  .align-self-lg-start {
    align-self: flex-start !important; }
  .align-self-lg-end {
    align-self: flex-end !important; }
  .align-self-lg-center {
    align-self: center !important; }
  .align-self-lg-baseline {
    align-self: baseline !important; }
  .align-self-lg-stretch {
    align-self: stretch !important; } }

@media (min-width: 1200px) {
  .flex-xl-row {
    flex-direction: row !important; }
  .flex-xl-column {
    flex-direction: column !important; }
  .flex-xl-row-reverse {
    flex-direction: row-reverse !important; }
  .flex-xl-column-reverse {
    flex-direction: column-reverse !important; }
  .flex-xl-wrap {
    flex-wrap: wrap !important; }
  .flex-xl-nowrap {
    flex-wrap: nowrap !important; }
  .flex-xl-wrap-reverse {
    flex-wrap: wrap-reverse !important; }
  .flex-xl-fill {
    flex: 1 1 auto !important; }
  .flex-xl-grow-0 {
    flex-grow: 0 !important; }
  .flex-xl-grow-1 {
    flex-grow: 1 !important; }
  .flex-xl-shrink-0 {
    flex-shrink: 0 !important; }
  .flex-xl-shrink-1 {
    flex-shrink: 1 !important; }
  .justify-content-xl-start {
    justify-content: flex-start !important; }
  .justify-content-xl-end {
    justify-content: flex-end !important; }
  .justify-content-xl-center {
    justify-content: center !important; }
  .justify-content-xl-between {
    justify-content: space-between !important; }
  .justify-content-xl-around {
    justify-content: space-around !important; }
  .align-items-xl-start {
    align-items: flex-start !important; }
  .align-items-xl-end {
    align-items: flex-end !important; }
  .align-items-xl-center {
    align-items: center !important; }
  .align-items-xl-baseline {
    align-items: baseline !important; }
  .align-items-xl-stretch {
    align-items: stretch !important; }
  .align-content-xl-start {
    align-content: flex-start !important; }
  .align-content-xl-end {
    align-content: flex-end !important; }
  .align-content-xl-center {
    align-content: center !important; }
  .align-content-xl-between {
    align-content: space-between !important; }
  .align-content-xl-around {
    align-content: space-around !important; }
  .align-content-xl-stretch {
    align-content: stretch !important; }
  .align-self-xl-auto {
    align-self: auto !important; }
  .align-self-xl-start {
    align-self: flex-start !important; }
  .align-self-xl-end {
    align-self: flex-end !important; }
  .align-self-xl-center {
    align-self: center !important; }
  .align-self-xl-baseline {
    align-self: baseline !important; }
  .align-self-xl-stretch {
    align-self: stretch !important; } }

.float-left {
  float: left !important; }

.float-right {
  float: right !important; }

.float-none {
  float: none !important; }

@media (min-width: 576px) {
  .float-sm-left {
    float: left !important; }
  .float-sm-right {
    float: right !important; }
  .float-sm-none {
    float: none !important; } }

@media (min-width: 768px) {
  .float-md-left {
    float: left !important; }
  .float-md-right {
    float: right !important; }
  .float-md-none {
    float: none !important; } }

@media (min-width: 992px) {
  .float-lg-left {
    float: left !important; }
  .float-lg-right {
    float: right !important; }
  .float-lg-none {
    float: none !important; } }

@media (min-width: 1200px) {
  .float-xl-left {
    float: left !important; }
  .float-xl-right {
    float: right !important; }
  .float-xl-none {
    float: none !important; } }

.user-select-all {
  user-select: all !important; }

.user-select-auto {
  user-select: auto !important; }

.user-select-none {
  user-select: none !important; }

.overflow-auto {
  overflow: auto !important; }

.overflow-hidden {
  overflow: hidden !important; }

.position-static {
  position: static !important; }

.position-relative {
  position: relative !important; }

.position-absolute {
  position: absolute !important; }

.position-fixed {
  position: fixed !important; }

.position-sticky {
  position: sticky !important; }

.fixed-top {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 1030; }

.fixed-bottom {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030; }

@supports (position: sticky) {
  .sticky-top {
    position: sticky;
    top: 0;
    z-index: 1020; } }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0; }

.sr-only-focusable:active, .sr-only-focusable:focus {
  position: static;
  width: auto;
  height: auto;
  overflow: visible;
  clip: auto;
  white-space: normal; }

.shadow-sm {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075) !important; }

.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important; }

.shadow-lg {
  box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important; }

.shadow-none {
  box-shadow: none !important; }

.w-25 {
  width: 25% !important; }

.w-50 {
  width: 50% !important; }

.w-75 {
  width: 75% !important; }

.w-100 {
  width: 100% !important; }

.w-auto {
  width: auto !important; }

.h-25 {
  height: 25% !important; }

.h-50 {
  height: 50% !important; }

.h-75 {
  height: 75% !important; }

.h-100 {
  height: 100% !important; }

.h-auto {
  height: auto !important; }

.mw-100 {
  max-width: 100% !important; }

.mh-100 {
  max-height: 100% !important; }

.min-vw-100 {
  min-width: 100vw !important; }

.min-vh-100 {
  min-height: 100vh !important; }

.vw-100 {
  width: 100vw !important; }

.vh-100 {
  height: 100vh !important; }

.m-0 {
  margin: 0 !important; }

.mt-0,
.my-0 {
  margin-top: 0 !important; }

.mr-0,
.mx-0 {
  margin-right: 0 !important; }

.mb-0,
.my-0 {
  margin-bottom: 0 !important; }

.ml-0,
.mx-0 {
  margin-left: 0 !important; }

.m-1 {
  margin: 2.5px !important; }

.mt-1,
.my-1 {
  margin-top: 2.5px !important; }

.mr-1,
.mx-1 {
  margin-right: 2.5px !important; }

.mb-1,
.my-1 {
  margin-bottom: 2.5px !important; }

.ml-1,
.mx-1 {
  margin-left: 2.5px !important; }

.m-2 {
  margin: 5px !important; }

.mt-2,
.my-2 {
  margin-top: 5px !important; }

.mr-2,
.mx-2 {
  margin-right: 5px !important; }

.mb-2,
.my-2 {
  margin-bottom: 5px !important; }

.ml-2,
.mx-2 {
  margin-left: 5px !important; }

.m-3 {
  margin: 10px !important; }

.mt-3,
.my-3 {
  margin-top: 10px !important; }

.mr-3,
.mx-3 {
  margin-right: 10px !important; }

.mb-3,
.my-3 {
  margin-bottom: 10px !important; }

.ml-3,
.mx-3 {
  margin-left: 10px !important; }

.m-4 {
  margin: 15px !important; }

.mt-4,
.my-4 {
  margin-top: 15px !important; }

.mr-4,
.mx-4 {
  margin-right: 15px !important; }

.mb-4,
.my-4 {
  margin-bottom: 15px !important; }

.ml-4,
.mx-4 {
  margin-left: 15px !important; }

.m-5 {
  margin: 30px !important; }

.mt-5,
.my-5 {
  margin-top: 30px !important; }

.mr-5,
.mx-5 {
  margin-right: 30px !important; }

.mb-5,
.my-5 {
  margin-bottom: 30px !important; }

.ml-5,
.mx-5 {
  margin-left: 30px !important; }

.p-0 {
  padding: 0 !important; }

.pt-0,
.py-0 {
  padding-top: 0 !important; }

.pr-0,
.px-0 {
  padding-right: 0 !important; }

.pb-0,
.py-0 {
  padding-bottom: 0 !important; }

.pl-0,
.px-0 {
  padding-left: 0 !important; }

.p-1 {
  padding: 2.5px !important; }

.pt-1,
.py-1 {
  padding-top: 2.5px !important; }

.pr-1,
.px-1 {
  padding-right: 2.5px !important; }

.pb-1,
.py-1 {
  padding-bottom: 2.5px !important; }

.pl-1,
.px-1 {
  padding-left: 2.5px !important; }

.p-2 {
  padding: 5px !important; }

.pt-2,
.py-2 {
  padding-top: 5px !important; }

.pr-2,
.px-2 {
  padding-right: 5px !important; }

.pb-2,
.py-2 {
  padding-bottom: 5px !important; }

.pl-2,
.px-2 {
  padding-left: 5px !important; }

.p-3 {
  padding: 10px !important; }

.pt-3,
.py-3 {
  padding-top: 10px !important; }

.pr-3,
.px-3 {
  padding-right: 10px !important; }

.pb-3,
.py-3 {
  padding-bottom: 10px !important; }

.pl-3,
.px-3 {
  padding-left: 10px !important; }

.p-4 {
  padding: 15px !important; }

.pt-4,
.py-4 {
  padding-top: 15px !important; }

.pr-4,
.px-4 {
  padding-right: 15px !important; }

.pb-4,
.py-4 {
  padding-bottom: 15px !important; }

.pl-4,
.px-4 {
  padding-left: 15px !important; }

.p-5 {
  padding: 30px !important; }

.pt-5,
.py-5 {
  padding-top: 30px !important; }

.pr-5,
.px-5 {
  padding-right: 30px !important; }

.pb-5,
.py-5 {
  padding-bottom: 30px !important; }

.pl-5,
.px-5 {
  padding-left: 30px !important; }

.m-n1 {
  margin: -2.5px !important; }

.mt-n1,
.my-n1 {
  margin-top: -2.5px !important; }

.mr-n1,
.mx-n1 {
  margin-right: -2.5px !important; }

.mb-n1,
.my-n1 {
  margin-bottom: -2.5px !important; }

.ml-n1,
.mx-n1 {
  margin-left: -2.5px !important; }

.m-n2 {
  margin: -5px !important; }

.mt-n2,
.my-n2 {
  margin-top: -5px !important; }

.mr-n2,
.mx-n2 {
  margin-right: -5px !important; }

.mb-n2,
.my-n2 {
  margin-bottom: -5px !important; }

.ml-n2,
.mx-n2 {
  margin-left: -5px !important; }

.m-n3 {
  margin: -10px !important; }

.mt-n3,
.my-n3 {
  margin-top: -10px !important; }

.mr-n3,
.mx-n3 {
  margin-right: -10px !important; }

.mb-n3,
.my-n3 {
  margin-bottom: -10px !important; }

.ml-n3,
.mx-n3 {
  margin-left: -10px !important; }

.m-n4 {
  margin: -15px !important; }

.mt-n4,
.my-n4 {
  margin-top: -15px !important; }

.mr-n4,
.mx-n4 {
  margin-right: -15px !important; }

.mb-n4,
.my-n4 {
  margin-bottom: -15px !important; }

.ml-n4,
.mx-n4 {
  margin-left: -15px !important; }

.m-n5 {
  margin: -30px !important; }

.mt-n5,
.my-n5 {
  margin-top: -30px !important; }

.mr-n5,
.mx-n5 {
  margin-right: -30px !important; }

.mb-n5,
.my-n5 {
  margin-bottom: -30px !important; }

.ml-n5,
.mx-n5 {
  margin-left: -30px !important; }

.m-auto {
  margin: auto !important; }

.mt-auto,
.my-auto {
  margin-top: auto !important; }

.mr-auto,
.mx-auto {
  margin-right: auto !important; }

.mb-auto,
.my-auto {
  margin-bottom: auto !important; }

.ml-auto,
.mx-auto {
  margin-left: auto !important; }

@media (min-width: 576px) {
  .m-sm-0 {
    margin: 0 !important; }
  .mt-sm-0,
  .my-sm-0 {
    margin-top: 0 !important; }
  .mr-sm-0,
  .mx-sm-0 {
    margin-right: 0 !important; }
  .mb-sm-0,
  .my-sm-0 {
    margin-bottom: 0 !important; }
  .ml-sm-0,
  .mx-sm-0 {
    margin-left: 0 !important; }
  .m-sm-1 {
    margin: 2.5px !important; }
  .mt-sm-1,
  .my-sm-1 {
    margin-top: 2.5px !important; }
  .mr-sm-1,
  .mx-sm-1 {
    margin-right: 2.5px !important; }
  .mb-sm-1,
  .my-sm-1 {
    margin-bottom: 2.5px !important; }
  .ml-sm-1,
  .mx-sm-1 {
    margin-left: 2.5px !important; }
  .m-sm-2 {
    margin: 5px !important; }
  .mt-sm-2,
  .my-sm-2 {
    margin-top: 5px !important; }
  .mr-sm-2,
  .mx-sm-2 {
    margin-right: 5px !important; }
  .mb-sm-2,
  .my-sm-2 {
    margin-bottom: 5px !important; }
  .ml-sm-2,
  .mx-sm-2 {
    margin-left: 5px !important; }
  .m-sm-3 {
    margin: 10px !important; }
  .mt-sm-3,
  .my-sm-3 {
    margin-top: 10px !important; }
  .mr-sm-3,
  .mx-sm-3 {
    margin-right: 10px !important; }
  .mb-sm-3,
  .my-sm-3 {
    margin-bottom: 10px !important; }
  .ml-sm-3,
  .mx-sm-3 {
    margin-left: 10px !important; }
  .m-sm-4 {
    margin: 15px !important; }
  .mt-sm-4,
  .my-sm-4 {
    margin-top: 15px !important; }
  .mr-sm-4,
  .mx-sm-4 {
    margin-right: 15px !important; }
  .mb-sm-4,
  .my-sm-4 {
    margin-bottom: 15px !important; }
  .ml-sm-4,
  .mx-sm-4 {
    margin-left: 15px !important; }
  .m-sm-5 {
    margin: 30px !important; }
  .mt-sm-5,
  .my-sm-5 {
    margin-top: 30px !important; }
  .mr-sm-5,
  .mx-sm-5 {
    margin-right: 30px !important; }
  .mb-sm-5,
  .my-sm-5 {
    margin-bottom: 30px !important; }
  .ml-sm-5,
  .mx-sm-5 {
    margin-left: 30px !important; }
  .p-sm-0 {
    padding: 0 !important; }
  .pt-sm-0,
  .py-sm-0 {
    padding-top: 0 !important; }
  .pr-sm-0,
  .px-sm-0 {
    padding-right: 0 !important; }
  .pb-sm-0,
  .py-sm-0 {
    padding-bottom: 0 !important; }
  .pl-sm-0,
  .px-sm-0 {
    padding-left: 0 !important; }
  .p-sm-1 {
    padding: 2.5px !important; }
  .pt-sm-1,
  .py-sm-1 {
    padding-top: 2.5px !important; }
  .pr-sm-1,
  .px-sm-1 {
    padding-right: 2.5px !important; }
  .pb-sm-1,
  .py-sm-1 {
    padding-bottom: 2.5px !important; }
  .pl-sm-1,
  .px-sm-1 {
    padding-left: 2.5px !important; }
  .p-sm-2 {
    padding: 5px !important; }
  .pt-sm-2,
  .py-sm-2 {
    padding-top: 5px !important; }
  .pr-sm-2,
  .px-sm-2 {
    padding-right: 5px !important; }
  .pb-sm-2,
  .py-sm-2 {
    padding-bottom: 5px !important; }
  .pl-sm-2,
  .px-sm-2 {
    padding-left: 5px !important; }
  .p-sm-3 {
    padding: 10px !important; }
  .pt-sm-3,
  .py-sm-3 {
    padding-top: 10px !important; }
  .pr-sm-3,
  .px-sm-3 {
    padding-right: 10px !important; }
  .pb-sm-3,
  .py-sm-3 {
    padding-bottom: 10px !important; }
  .pl-sm-3,
  .px-sm-3 {
    padding-left: 10px !important; }
  .p-sm-4 {
    padding: 15px !important; }
  .pt-sm-4,
  .py-sm-4 {
    padding-top: 15px !important; }
  .pr-sm-4,
  .px-sm-4 {
    padding-right: 15px !important; }
  .pb-sm-4,
  .py-sm-4 {
    padding-bottom: 15px !important; }
  .pl-sm-4,
  .px-sm-4 {
    padding-left: 15px !important; }
  .p-sm-5 {
    padding: 30px !important; }
  .pt-sm-5,
  .py-sm-5 {
    padding-top: 30px !important; }
  .pr-sm-5,
  .px-sm-5 {
    padding-right: 30px !important; }
  .pb-sm-5,
  .py-sm-5 {
    padding-bottom: 30px !important; }
  .pl-sm-5,
  .px-sm-5 {
    padding-left: 30px !important; }
  .m-sm-n1 {
    margin: -2.5px !important; }
  .mt-sm-n1,
  .my-sm-n1 {
    margin-top: -2.5px !important; }
  .mr-sm-n1,
  .mx-sm-n1 {
    margin-right: -2.5px !important; }
  .mb-sm-n1,
  .my-sm-n1 {
    margin-bottom: -2.5px !important; }
  .ml-sm-n1,
  .mx-sm-n1 {
    margin-left: -2.5px !important; }
  .m-sm-n2 {
    margin: -5px !important; }
  .mt-sm-n2,
  .my-sm-n2 {
    margin-top: -5px !important; }
  .mr-sm-n2,
  .mx-sm-n2 {
    margin-right: -5px !important; }
  .mb-sm-n2,
  .my-sm-n2 {
    margin-bottom: -5px !important; }
  .ml-sm-n2,
  .mx-sm-n2 {
    margin-left: -5px !important; }
  .m-sm-n3 {
    margin: -10px !important; }
  .mt-sm-n3,
  .my-sm-n3 {
    margin-top: -10px !important; }
  .mr-sm-n3,
  .mx-sm-n3 {
    margin-right: -10px !important; }
  .mb-sm-n3,
  .my-sm-n3 {
    margin-bottom: -10px !important; }
  .ml-sm-n3,
  .mx-sm-n3 {
    margin-left: -10px !important; }
  .m-sm-n4 {
    margin: -15px !important; }
  .mt-sm-n4,
  .my-sm-n4 {
    margin-top: -15px !important; }
  .mr-sm-n4,
  .mx-sm-n4 {
    margin-right: -15px !important; }
  .mb-sm-n4,
  .my-sm-n4 {
    margin-bottom: -15px !important; }
  .ml-sm-n4,
  .mx-sm-n4 {
    margin-left: -15px !important; }
  .m-sm-n5 {
    margin: -30px !important; }
  .mt-sm-n5,
  .my-sm-n5 {
    margin-top: -30px !important; }
  .mr-sm-n5,
  .mx-sm-n5 {
    margin-right: -30px !important; }
  .mb-sm-n5,
  .my-sm-n5 {
    margin-bottom: -30px !important; }
  .ml-sm-n5,
  .mx-sm-n5 {
    margin-left: -30px !important; }
  .m-sm-auto {
    margin: auto !important; }
  .mt-sm-auto,
  .my-sm-auto {
    margin-top: auto !important; }
  .mr-sm-auto,
  .mx-sm-auto {
    margin-right: auto !important; }
  .mb-sm-auto,
  .my-sm-auto {
    margin-bottom: auto !important; }
  .ml-sm-auto,
  .mx-sm-auto {
    margin-left: auto !important; } }

@media (min-width: 768px) {
  .m-md-0 {
    margin: 0 !important; }
  .mt-md-0,
  .my-md-0 {
    margin-top: 0 !important; }
  .mr-md-0,
  .mx-md-0 {
    margin-right: 0 !important; }
  .mb-md-0,
  .my-md-0 {
    margin-bottom: 0 !important; }
  .ml-md-0,
  .mx-md-0 {
    margin-left: 0 !important; }
  .m-md-1 {
    margin: 2.5px !important; }
  .mt-md-1,
  .my-md-1 {
    margin-top: 2.5px !important; }
  .mr-md-1,
  .mx-md-1 {
    margin-right: 2.5px !important; }
  .mb-md-1,
  .my-md-1 {
    margin-bottom: 2.5px !important; }
  .ml-md-1,
  .mx-md-1 {
    margin-left: 2.5px !important; }
  .m-md-2 {
    margin: 5px !important; }
  .mt-md-2,
  .my-md-2 {
    margin-top: 5px !important; }
  .mr-md-2,
  .mx-md-2 {
    margin-right: 5px !important; }
  .mb-md-2,
  .my-md-2 {
    margin-bottom: 5px !important; }
  .ml-md-2,
  .mx-md-2 {
    margin-left: 5px !important; }
  .m-md-3 {
    margin: 10px !important; }
  .mt-md-3,
  .my-md-3 {
    margin-top: 10px !important; }
  .mr-md-3,
  .mx-md-3 {
    margin-right: 10px !important; }
  .mb-md-3,
  .my-md-3 {
    margin-bottom: 10px !important; }
  .ml-md-3,
  .mx-md-3 {
    margin-left: 10px !important; }
  .m-md-4 {
    margin: 15px !important; }
  .mt-md-4,
  .my-md-4 {
    margin-top: 15px !important; }
  .mr-md-4,
  .mx-md-4 {
    margin-right: 15px !important; }
  .mb-md-4,
  .my-md-4 {
    margin-bottom: 15px !important; }
  .ml-md-4,
  .mx-md-4 {
    margin-left: 15px !important; }
  .m-md-5 {
    margin: 30px !important; }
  .mt-md-5,
  .my-md-5 {
    margin-top: 30px !important; }
  .mr-md-5,
  .mx-md-5 {
    margin-right: 30px !important; }
  .mb-md-5,
  .my-md-5 {
    margin-bottom: 30px !important; }
  .ml-md-5,
  .mx-md-5 {
    margin-left: 30px !important; }
  .p-md-0 {
    padding: 0 !important; }
  .pt-md-0,
  .py-md-0 {
    padding-top: 0 !important; }
  .pr-md-0,
  .px-md-0 {
    padding-right: 0 !important; }
  .pb-md-0,
  .py-md-0 {
    padding-bottom: 0 !important; }
  .pl-md-0,
  .px-md-0 {
    padding-left: 0 !important; }
  .p-md-1 {
    padding: 2.5px !important; }
  .pt-md-1,
  .py-md-1 {
    padding-top: 2.5px !important; }
  .pr-md-1,
  .px-md-1 {
    padding-right: 2.5px !important; }
  .pb-md-1,
  .py-md-1 {
    padding-bottom: 2.5px !important; }
  .pl-md-1,
  .px-md-1 {
    padding-left: 2.5px !important; }
  .p-md-2 {
    padding: 5px !important; }
  .pt-md-2,
  .py-md-2 {
    padding-top: 5px !important; }
  .pr-md-2,
  .px-md-2 {
    padding-right: 5px !important; }
  .pb-md-2,
  .py-md-2 {
    padding-bottom: 5px !important; }
  .pl-md-2,
  .px-md-2 {
    padding-left: 5px !important; }
  .p-md-3 {
    padding: 10px !important; }
  .pt-md-3,
  .py-md-3 {
    padding-top: 10px !important; }
  .pr-md-3,
  .px-md-3 {
    padding-right: 10px !important; }
  .pb-md-3,
  .py-md-3 {
    padding-bottom: 10px !important; }
  .pl-md-3,
  .px-md-3 {
    padding-left: 10px !important; }
  .p-md-4 {
    padding: 15px !important; }
  .pt-md-4,
  .py-md-4 {
    padding-top: 15px !important; }
  .pr-md-4,
  .px-md-4 {
    padding-right: 15px !important; }
  .pb-md-4,
  .py-md-4 {
    padding-bottom: 15px !important; }
  .pl-md-4,
  .px-md-4 {
    padding-left: 15px !important; }
  .p-md-5 {
    padding: 30px !important; }
  .pt-md-5,
  .py-md-5 {
    padding-top: 30px !important; }
  .pr-md-5,
  .px-md-5 {
    padding-right: 30px !important; }
  .pb-md-5,
  .py-md-5 {
    padding-bottom: 30px !important; }
  .pl-md-5,
  .px-md-5 {
    padding-left: 30px !important; }
  .m-md-n1 {
    margin: -2.5px !important; }
  .mt-md-n1,
  .my-md-n1 {
    margin-top: -2.5px !important; }
  .mr-md-n1,
  .mx-md-n1 {
    margin-right: -2.5px !important; }
  .mb-md-n1,
  .my-md-n1 {
    margin-bottom: -2.5px !important; }
  .ml-md-n1,
  .mx-md-n1 {
    margin-left: -2.5px !important; }
  .m-md-n2 {
    margin: -5px !important; }
  .mt-md-n2,
  .my-md-n2 {
    margin-top: -5px !important; }
  .mr-md-n2,
  .mx-md-n2 {
    margin-right: -5px !important; }
  .mb-md-n2,
  .my-md-n2 {
    margin-bottom: -5px !important; }
  .ml-md-n2,
  .mx-md-n2 {
    margin-left: -5px !important; }
  .m-md-n3 {
    margin: -10px !important; }
  .mt-md-n3,
  .my-md-n3 {
    margin-top: -10px !important; }
  .mr-md-n3,
  .mx-md-n3 {
    margin-right: -10px !important; }
  .mb-md-n3,
  .my-md-n3 {
    margin-bottom: -10px !important; }
  .ml-md-n3,
  .mx-md-n3 {
    margin-left: -10px !important; }
  .m-md-n4 {
    margin: -15px !important; }
  .mt-md-n4,
  .my-md-n4 {
    margin-top: -15px !important; }
  .mr-md-n4,
  .mx-md-n4 {
    margin-right: -15px !important; }
  .mb-md-n4,
  .my-md-n4 {
    margin-bottom: -15px !important; }
  .ml-md-n4,
  .mx-md-n4 {
    margin-left: -15px !important; }
  .m-md-n5 {
    margin: -30px !important; }
  .mt-md-n5,
  .my-md-n5 {
    margin-top: -30px !important; }
  .mr-md-n5,
  .mx-md-n5 {
    margin-right: -30px !important; }
  .mb-md-n5,
  .my-md-n5 {
    margin-bottom: -30px !important; }
  .ml-md-n5,
  .mx-md-n5 {
    margin-left: -30px !important; }
  .m-md-auto {
    margin: auto !important; }
  .mt-md-auto,
  .my-md-auto {
    margin-top: auto !important; }
  .mr-md-auto,
  .mx-md-auto {
    margin-right: auto !important; }
  .mb-md-auto,
  .my-md-auto {
    margin-bottom: auto !important; }
  .ml-md-auto,
  .mx-md-auto {
    margin-left: auto !important; } }

@media (min-width: 992px) {
  .m-lg-0 {
    margin: 0 !important; }
  .mt-lg-0,
  .my-lg-0 {
    margin-top: 0 !important; }
  .mr-lg-0,
  .mx-lg-0 {
    margin-right: 0 !important; }
  .mb-lg-0,
  .my-lg-0 {
    margin-bottom: 0 !important; }
  .ml-lg-0,
  .mx-lg-0 {
    margin-left: 0 !important; }
  .m-lg-1 {
    margin: 2.5px !important; }
  .mt-lg-1,
  .my-lg-1 {
    margin-top: 2.5px !important; }
  .mr-lg-1,
  .mx-lg-1 {
    margin-right: 2.5px !important; }
  .mb-lg-1,
  .my-lg-1 {
    margin-bottom: 2.5px !important; }
  .ml-lg-1,
  .mx-lg-1 {
    margin-left: 2.5px !important; }
  .m-lg-2 {
    margin: 5px !important; }
  .mt-lg-2,
  .my-lg-2 {
    margin-top: 5px !important; }
  .mr-lg-2,
  .mx-lg-2 {
    margin-right: 5px !important; }
  .mb-lg-2,
  .my-lg-2 {
    margin-bottom: 5px !important; }
  .ml-lg-2,
  .mx-lg-2 {
    margin-left: 5px !important; }
  .m-lg-3 {
    margin: 10px !important; }
  .mt-lg-3,
  .my-lg-3 {
    margin-top: 10px !important; }
  .mr-lg-3,
  .mx-lg-3 {
    margin-right: 10px !important; }
  .mb-lg-3,
  .my-lg-3 {
    margin-bottom: 10px !important; }
  .ml-lg-3,
  .mx-lg-3 {
    margin-left: 10px !important; }
  .m-lg-4 {
    margin: 15px !important; }
  .mt-lg-4,
  .my-lg-4 {
    margin-top: 15px !important; }
  .mr-lg-4,
  .mx-lg-4 {
    margin-right: 15px !important; }
  .mb-lg-4,
  .my-lg-4 {
    margin-bottom: 15px !important; }
  .ml-lg-4,
  .mx-lg-4 {
    margin-left: 15px !important; }
  .m-lg-5 {
    margin: 30px !important; }
  .mt-lg-5,
  .my-lg-5 {
    margin-top: 30px !important; }
  .mr-lg-5,
  .mx-lg-5 {
    margin-right: 30px !important; }
  .mb-lg-5,
  .my-lg-5 {
    margin-bottom: 30px !important; }
  .ml-lg-5,
  .mx-lg-5 {
    margin-left: 30px !important; }
  .p-lg-0 {
    padding: 0 !important; }
  .pt-lg-0,
  .py-lg-0 {
    padding-top: 0 !important; }
  .pr-lg-0,
  .px-lg-0 {
    padding-right: 0 !important; }
  .pb-lg-0,
  .py-lg-0 {
    padding-bottom: 0 !important; }
  .pl-lg-0,
  .px-lg-0 {
    padding-left: 0 !important; }
  .p-lg-1 {
    padding: 2.5px !important; }
  .pt-lg-1,
  .py-lg-1 {
    padding-top: 2.5px !important; }
  .pr-lg-1,
  .px-lg-1 {
    padding-right: 2.5px !important; }
  .pb-lg-1,
  .py-lg-1 {
    padding-bottom: 2.5px !important; }
  .pl-lg-1,
  .px-lg-1 {
    padding-left: 2.5px !important; }
  .p-lg-2 {
    padding: 5px !important; }
  .pt-lg-2,
  .py-lg-2 {
    padding-top: 5px !important; }
  .pr-lg-2,
  .px-lg-2 {
    padding-right: 5px !important; }
  .pb-lg-2,
  .py-lg-2 {
    padding-bottom: 5px !important; }
  .pl-lg-2,
  .px-lg-2 {
    padding-left: 5px !important; }
  .p-lg-3 {
    padding: 10px !important; }
  .pt-lg-3,
  .py-lg-3 {
    padding-top: 10px !important; }
  .pr-lg-3,
  .px-lg-3 {
    padding-right: 10px !important; }
  .pb-lg-3,
  .py-lg-3 {
    padding-bottom: 10px !important; }
  .pl-lg-3,
  .px-lg-3 {
    padding-left: 10px !important; }
  .p-lg-4 {
    padding: 15px !important; }
  .pt-lg-4,
  .py-lg-4 {
    padding-top: 15px !important; }
  .pr-lg-4,
  .px-lg-4 {
    padding-right: 15px !important; }
  .pb-lg-4,
  .py-lg-4 {
    padding-bottom: 15px !important; }
  .pl-lg-4,
  .px-lg-4 {
    padding-left: 15px !important; }
  .p-lg-5 {
    padding: 30px !important; }
  .pt-lg-5,
  .py-lg-5 {
    padding-top: 30px !important; }
  .pr-lg-5,
  .px-lg-5 {
    padding-right: 30px !important; }
  .pb-lg-5,
  .py-lg-5 {
    padding-bottom: 30px !important; }
  .pl-lg-5,
  .px-lg-5 {
    padding-left: 30px !important; }
  .m-lg-n1 {
    margin: -2.5px !important; }
  .mt-lg-n1,
  .my-lg-n1 {
    margin-top: -2.5px !important; }
  .mr-lg-n1,
  .mx-lg-n1 {
    margin-right: -2.5px !important; }
  .mb-lg-n1,
  .my-lg-n1 {
    margin-bottom: -2.5px !important; }
  .ml-lg-n1,
  .mx-lg-n1 {
    margin-left: -2.5px !important; }
  .m-lg-n2 {
    margin: -5px !important; }
  .mt-lg-n2,
  .my-lg-n2 {
    margin-top: -5px !important; }
  .mr-lg-n2,
  .mx-lg-n2 {
    margin-right: -5px !important; }
  .mb-lg-n2,
  .my-lg-n2 {
    margin-bottom: -5px !important; }
  .ml-lg-n2,
  .mx-lg-n2 {
    margin-left: -5px !important; }
  .m-lg-n3 {
    margin: -10px !important; }
  .mt-lg-n3,
  .my-lg-n3 {
    margin-top: -10px !important; }
  .mr-lg-n3,
  .mx-lg-n3 {
    margin-right: -10px !important; }
  .mb-lg-n3,
  .my-lg-n3 {
    margin-bottom: -10px !important; }
  .ml-lg-n3,
  .mx-lg-n3 {
    margin-left: -10px !important; }
  .m-lg-n4 {
    margin: -15px !important; }
  .mt-lg-n4,
  .my-lg-n4 {
    margin-top: -15px !important; }
  .mr-lg-n4,
  .mx-lg-n4 {
    margin-right: -15px !important; }
  .mb-lg-n4,
  .my-lg-n4 {
    margin-bottom: -15px !important; }
  .ml-lg-n4,
  .mx-lg-n4 {
    margin-left: -15px !important; }
  .m-lg-n5 {
    margin: -30px !important; }
  .mt-lg-n5,
  .my-lg-n5 {
    margin-top: -30px !important; }
  .mr-lg-n5,
  .mx-lg-n5 {
    margin-right: -30px !important; }
  .mb-lg-n5,
  .my-lg-n5 {
    margin-bottom: -30px !important; }
  .ml-lg-n5,
  .mx-lg-n5 {
    margin-left: -30px !important; }
  .m-lg-auto {
    margin: auto !important; }
  .mt-lg-auto,
  .my-lg-auto {
    margin-top: auto !important; }
  .mr-lg-auto,
  .mx-lg-auto {
    margin-right: auto !important; }
  .mb-lg-auto,
  .my-lg-auto {
    margin-bottom: auto !important; }
  .ml-lg-auto,
  .mx-lg-auto {
    margin-left: auto !important; } }

@media (min-width: 1200px) {
  .m-xl-0 {
    margin: 0 !important; }
  .mt-xl-0,
  .my-xl-0 {
    margin-top: 0 !important; }
  .mr-xl-0,
  .mx-xl-0 {
    margin-right: 0 !important; }
  .mb-xl-0,
  .my-xl-0 {
    margin-bottom: 0 !important; }
  .ml-xl-0,
  .mx-xl-0 {
    margin-left: 0 !important; }
  .m-xl-1 {
    margin: 2.5px !important; }
  .mt-xl-1,
  .my-xl-1 {
    margin-top: 2.5px !important; }
  .mr-xl-1,
  .mx-xl-1 {
    margin-right: 2.5px !important; }
  .mb-xl-1,
  .my-xl-1 {
    margin-bottom: 2.5px !important; }
  .ml-xl-1,
  .mx-xl-1 {
    margin-left: 2.5px !important; }
  .m-xl-2 {
    margin: 5px !important; }
  .mt-xl-2,
  .my-xl-2 {
    margin-top: 5px !important; }
  .mr-xl-2,
  .mx-xl-2 {
    margin-right: 5px !important; }
  .mb-xl-2,
  .my-xl-2 {
    margin-bottom: 5px !important; }
  .ml-xl-2,
  .mx-xl-2 {
    margin-left: 5px !important; }
  .m-xl-3 {
    margin: 10px !important; }
  .mt-xl-3,
  .my-xl-3 {
    margin-top: 10px !important; }
  .mr-xl-3,
  .mx-xl-3 {
    margin-right: 10px !important; }
  .mb-xl-3,
  .my-xl-3 {
    margin-bottom: 10px !important; }
  .ml-xl-3,
  .mx-xl-3 {
    margin-left: 10px !important; }
  .m-xl-4 {
    margin: 15px !important; }
  .mt-xl-4,
  .my-xl-4 {
    margin-top: 15px !important; }
  .mr-xl-4,
  .mx-xl-4 {
    margin-right: 15px !important; }
  .mb-xl-4,
  .my-xl-4 {
    margin-bottom: 15px !important; }
  .ml-xl-4,
  .mx-xl-4 {
    margin-left: 15px !important; }
  .m-xl-5 {
    margin: 30px !important; }
  .mt-xl-5,
  .my-xl-5 {
    margin-top: 30px !important; }
  .mr-xl-5,
  .mx-xl-5 {
    margin-right: 30px !important; }
  .mb-xl-5,
  .my-xl-5 {
    margin-bottom: 30px !important; }
  .ml-xl-5,
  .mx-xl-5 {
    margin-left: 30px !important; }
  .p-xl-0 {
    padding: 0 !important; }
  .pt-xl-0,
  .py-xl-0 {
    padding-top: 0 !important; }
  .pr-xl-0,
  .px-xl-0 {
    padding-right: 0 !important; }
  .pb-xl-0,
  .py-xl-0 {
    padding-bottom: 0 !important; }
  .pl-xl-0,
  .px-xl-0 {
    padding-left: 0 !important; }
  .p-xl-1 {
    padding: 2.5px !important; }
  .pt-xl-1,
  .py-xl-1 {
    padding-top: 2.5px !important; }
  .pr-xl-1,
  .px-xl-1 {
    padding-right: 2.5px !important; }
  .pb-xl-1,
  .py-xl-1 {
    padding-bottom: 2.5px !important; }
  .pl-xl-1,
  .px-xl-1 {
    padding-left: 2.5px !important; }
  .p-xl-2 {
    padding: 5px !important; }
  .pt-xl-2,
  .py-xl-2 {
    padding-top: 5px !important; }
  .pr-xl-2,
  .px-xl-2 {
    padding-right: 5px !important; }
  .pb-xl-2,
  .py-xl-2 {
    padding-bottom: 5px !important; }
  .pl-xl-2,
  .px-xl-2 {
    padding-left: 5px !important; }
  .p-xl-3 {
    padding: 10px !important; }
  .pt-xl-3,
  .py-xl-3 {
    padding-top: 10px !important; }
  .pr-xl-3,
  .px-xl-3 {
    padding-right: 10px !important; }
  .pb-xl-3,
  .py-xl-3 {
    padding-bottom: 10px !important; }
  .pl-xl-3,
  .px-xl-3 {
    padding-left: 10px !important; }
  .p-xl-4 {
    padding: 15px !important; }
  .pt-xl-4,
  .py-xl-4 {
    padding-top: 15px !important; }
  .pr-xl-4,
  .px-xl-4 {
    padding-right: 15px !important; }
  .pb-xl-4,
  .py-xl-4 {
    padding-bottom: 15px !important; }
  .pl-xl-4,
  .px-xl-4 {
    padding-left: 15px !important; }
  .p-xl-5 {
    padding: 30px !important; }
  .pt-xl-5,
  .py-xl-5 {
    padding-top: 30px !important; }
  .pr-xl-5,
  .px-xl-5 {
    padding-right: 30px !important; }
  .pb-xl-5,
  .py-xl-5 {
    padding-bottom: 30px !important; }
  .pl-xl-5,
  .px-xl-5 {
    padding-left: 30px !important; }
  .m-xl-n1 {
    margin: -2.5px !important; }
  .mt-xl-n1,
  .my-xl-n1 {
    margin-top: -2.5px !important; }
  .mr-xl-n1,
  .mx-xl-n1 {
    margin-right: -2.5px !important; }
  .mb-xl-n1,
  .my-xl-n1 {
    margin-bottom: -2.5px !important; }
  .ml-xl-n1,
  .mx-xl-n1 {
    margin-left: -2.5px !important; }
  .m-xl-n2 {
    margin: -5px !important; }
  .mt-xl-n2,
  .my-xl-n2 {
    margin-top: -5px !important; }
  .mr-xl-n2,
  .mx-xl-n2 {
    margin-right: -5px !important; }
  .mb-xl-n2,
  .my-xl-n2 {
    margin-bottom: -5px !important; }
  .ml-xl-n2,
  .mx-xl-n2 {
    margin-left: -5px !important; }
  .m-xl-n3 {
    margin: -10px !important; }
  .mt-xl-n3,
  .my-xl-n3 {
    margin-top: -10px !important; }
  .mr-xl-n3,
  .mx-xl-n3 {
    margin-right: -10px !important; }
  .mb-xl-n3,
  .my-xl-n3 {
    margin-bottom: -10px !important; }
  .ml-xl-n3,
  .mx-xl-n3 {
    margin-left: -10px !important; }
  .m-xl-n4 {
    margin: -15px !important; }
  .mt-xl-n4,
  .my-xl-n4 {
    margin-top: -15px !important; }
  .mr-xl-n4,
  .mx-xl-n4 {
    margin-right: -15px !important; }
  .mb-xl-n4,
  .my-xl-n4 {
    margin-bottom: -15px !important; }
  .ml-xl-n4,
  .mx-xl-n4 {
    margin-left: -15px !important; }
  .m-xl-n5 {
    margin: -30px !important; }
  .mt-xl-n5,
  .my-xl-n5 {
    margin-top: -30px !important; }
  .mr-xl-n5,
  .mx-xl-n5 {
    margin-right: -30px !important; }
  .mb-xl-n5,
  .my-xl-n5 {
    margin-bottom: -30px !important; }
  .ml-xl-n5,
  .mx-xl-n5 {
    margin-left: -30px !important; }
  .m-xl-auto {
    margin: auto !important; }
  .mt-xl-auto,
  .my-xl-auto {
    margin-top: auto !important; }
  .mr-xl-auto,
  .mx-xl-auto {
    margin-right: auto !important; }
  .mb-xl-auto,
  .my-xl-auto {
    margin-bottom: auto !important; }
  .ml-xl-auto,
  .mx-xl-auto {
    margin-left: auto !important; } }

.stretched-link::after {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1;
  pointer-events: auto;
  content: "";
  background-color: rgba(0, 0, 0, 0); }

.text-monospace {
  font-family: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important; }

.text-justify {
  text-align: justify !important; }

.text-wrap {
  white-space: normal !important; }

.text-nowrap {
  white-space: nowrap !important; }

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; }

.text-left {
  text-align: left !important; }

.text-right {
  text-align: right !important; }

.text-center {
  text-align: center !important; }

@media (min-width: 576px) {
  .text-sm-left {
    text-align: left !important; }
  .text-sm-right {
    text-align: right !important; }
  .text-sm-center {
    text-align: center !important; } }

@media (min-width: 768px) {
  .text-md-left {
    text-align: left !important; }
  .text-md-right {
    text-align: right !important; }
  .text-md-center {
    text-align: center !important; } }

@media (min-width: 992px) {
  .text-lg-left {
    text-align: left !important; }
  .text-lg-right {
    text-align: right !important; }
  .text-lg-center {
    text-align: center !important; } }

@media (min-width: 1200px) {
  .text-xl-left {
    text-align: left !important; }
  .text-xl-right {
    text-align: right !important; }
  .text-xl-center {
    text-align: center !important; } }

.text-lowercase {
  text-transform: lowercase !important; }

.text-uppercase {
  text-transform: uppercase !important; }

.text-capitalize {
  text-transform: capitalize !important; }

.font-weight-light {
  font-weight: 300 !important; }

.font-weight-lighter {
  font-weight: lighter !important; }

.font-weight-normal {
  font-weight: 400 !important; }

.font-weight-bold {
  font-weight: 700 !important; }

.font-weight-bolder {
  font-weight: bolder !important; }

.font-italic {
  font-style: italic !important; }

.text-white {
  color: #fff !important; }

.text-primary {
  color: #007bff !important; }

a.text-primary:hover, a.text-primary:focus {
  color: #0056b3 !important; }

.text-secondary {
  color: #6c757d !important; }

a.text-secondary:hover, a.text-secondary:focus {
  color: #494f54 !important; }

.text-success {
  color: #28a745 !important; }

a.text-success:hover, a.text-success:focus {
  color: #19692c !important; }

.text-info {
  color: #17a2b8 !important; }

a.text-info:hover, a.text-info:focus {
  color: #0f6674 !important; }

.text-warning {
  color: #ffc107 !important; }

a.text-warning:hover, a.text-warning:focus {
  color: #ba8b00 !important; }

.text-danger {
  color: #dc3545 !important; }

a.text-danger:hover, a.text-danger:focus {
  color: #a71d2a !important; }

.text-light {
  color: #f8f9fa !important; }

a.text-light:hover, a.text-light:focus {
  color: #cbd3da !important; }

.text-dark {
  color: #343a40 !important; }

a.text-dark:hover, a.text-dark:focus {
  color: #121416 !important; }

.text-body {
  color: #212529 !important; }

.text-muted {
  color: #6c757d !important; }

.text-black-50 {
  color: rgba(0, 0, 0, 0.5) !important; }

.text-white-50 {
  color: rgba(255, 255, 255, 0.5) !important; }

.text-hide {
  font: 0/0 a;
  color: transparent;
  text-shadow: none;
  background-color: transparent;
  border: 0; }

.text-decoration-none {
  text-decoration: none !important; }

.text-break {
  word-break: break-word !important;
  word-wrap: break-word !important; }

.text-reset {
  color: inherit !important; }

.visible {
  visibility: visible !important; }

.invisible {
  visibility: hidden !important; }

@media print {
  *,
  *::before,
  *::after {
    text-shadow: none !important;
    box-shadow: none !important; }
  a:not(.btn) {
    text-decoration: underline; }
  abbr[title]::after {
    content: " (" attr(title) ")"; }
  pre {
    white-space: pre-wrap !important; }
  pre,
  blockquote {
    border: 1px solid #adb5bd;
    page-break-inside: avoid; }
  thead {
    display: table-header-group; }
  tr,
  img {
    page-break-inside: avoid; }
  p,
  h2,
  h3 {
    orphans: 3;
    widows: 3; }
  h2,
  h3 {
    page-break-after: avoid; }
  @page {
    size: a3; }
  body {
    min-width: 992px !important; }
  .container {
    min-width: 992px !important; }
  .navbar {
    display: none; }
  .badge {
    border: 1px solid #000; }
  .table {
    border-collapse: collapse !important; }
    .table td,
    .table th {
      background-color: #fff !important; }
  .table-bordered th,
  .table-bordered td {
    border: 1px solid #dee2e6 !important; }
  .table-dark {
    color: inherit; }
    .table-dark th,
    .table-dark td,
    .table-dark thead th,
    .table-dark tbody + tbody {
      border-color: #dee2e6; }
  .table .thead-dark th {
    color: inherit;
    border-color: #dee2e6; } }

.list-alert-enter,
.list-alert-leave-to {
  opacity: 0;
  transform: translateX(300px); }

.list-alert-leave-active {
  position: absolute; }

.alert {
  transition: all 1s; }

#PTTChat .ptt-chat {
  font-weight: 500; }

#PTTChat .ptt-chat-msg {
  word-break: break-all; }

#PTTChat hr {
  border-top: 1px solid rgba(128, 128, 128, 0.5) !important; }

#PTTChat .ptt-chat-msg a {
  text-decoration: underline !important; }

.pttbgc-0 .ptt-bg {
  background-color: black; }

.pttbgc-0 .ptt-chat-id {
  color: #ffff66; }

.pttbgc-0 .ptt-chat-time {
  color: #bbbbbb; }

.pttbgc-0 .ptt-chat-msg {
  color: #999900 !important; }

.pttbgc-0 .ptt-chat-type {
  color: white; }

.pttbgc-0 .ptt-chat-type-n {
  color: red; }

.pttbgc-1 .ptt-bg {
  background-color: #0d0d0d; }

.pttbgc-1 .ptt-chat-id {
  color: #ffff6b; }

.pttbgc-1 .ptt-chat-time {
  color: #bebebe; }

.pttbgc-1 .ptt-chat-msg {
  color: #9b9b00 !important; }

.pttbgc-1 .ptt-chat-type {
  color: white; }

.pttbgc-1 .ptt-chat-type-n {
  color: #ff0404; }

.pttbgc-2 .ptt-bg {
  background-color: #1a1a1a; }

.pttbgc-2 .ptt-chat-id {
  color: #ffff71; }

.pttbgc-2 .ptt-chat-time {
  color: #c1c1c1; }

.pttbgc-2 .ptt-chat-msg {
  color: #9e9e00 !important; }

.pttbgc-2 .ptt-chat-type {
  color: white; }

.pttbgc-2 .ptt-chat-type-n {
  color: #ff0808; }

.pttbgc-3 .ptt-bg {
  background-color: #262626; }

.pttbgc-3 .ptt-chat-id {
  color: #ffff76; }

.pttbgc-3 .ptt-chat-time {
  color: #c3c3c3; }

.pttbgc-3 .ptt-chat-msg {
  color: #a0a000 !important; }

.pttbgc-3 .ptt-chat-type {
  color: white; }

.pttbgc-3 .ptt-chat-type-n {
  color: #ff0b0b; }

.pttbgc-4 .ptt-bg {
  background-color: #333333; }

.pttbgc-4 .ptt-chat-id {
  color: #ffff7b; }

.pttbgc-4 .ptt-chat-time {
  color: #c6c6c6; }

.pttbgc-4 .ptt-chat-msg {
  color: #a2a200 !important; }

.pttbgc-4 .ptt-chat-type {
  color: white; }

.pttbgc-4 .ptt-chat-type-n {
  color: #ff0f0f; }

.pttbgc-5 .ptt-bg {
  background-color: #404040; }

.pttbgc-5 .ptt-chat-id {
  color: #ffff81; }

.pttbgc-5 .ptt-chat-time {
  color: #c9c9c9; }

.pttbgc-5 .ptt-chat-msg {
  color: #a4a400 !important; }

.pttbgc-5 .ptt-chat-type {
  color: white; }

.pttbgc-5 .ptt-chat-type-n {
  color: #ff1313; }

.pttbgc-6 .ptt-bg {
  background-color: #4d4d4d; }

.pttbgc-6 .ptt-chat-id {
  color: #ffff86; }

.pttbgc-6 .ptt-chat-time {
  color: #cccccc; }

.pttbgc-6 .ptt-chat-msg {
  color: #a7a700 !important; }

.pttbgc-6 .ptt-chat-type {
  color: white; }

.pttbgc-6 .ptt-chat-type-n {
  color: #ff1717; }

.pttbgc-7 .ptt-bg {
  background-color: #595959; }

.pttbgc-7 .ptt-chat-id {
  color: #ffff8b; }

.pttbgc-7 .ptt-chat-time {
  color: #cfcfcf; }

.pttbgc-7 .ptt-chat-msg {
  color: #a9a900 !important; }

.pttbgc-7 .ptt-chat-type {
  color: white; }

.pttbgc-7 .ptt-chat-type-n {
  color: #ff1b1b; }

.pttbgc-8 .ptt-bg {
  background-color: #666666; }

.pttbgc-8 .ptt-chat-id {
  color: #ffff91; }

.pttbgc-8 .ptt-chat-time {
  color: #d1d1d1; }

.pttbgc-8 .ptt-chat-msg {
  color: #abab00 !important; }

.pttbgc-8 .ptt-chat-type {
  color: white; }

.pttbgc-8 .ptt-chat-type-n {
  color: #ff1f1f; }

.pttbgc-9 .ptt-bg {
  background-color: #737373; }

.pttbgc-9 .ptt-chat-id {
  color: #ffff96; }

.pttbgc-9 .ptt-chat-time {
  color: #d4d4d4; }

.pttbgc-9 .ptt-chat-msg {
  color: #aeae00 !important; }

.pttbgc-9 .ptt-chat-type {
  color: white; }

.pttbgc-9 .ptt-chat-type-n {
  color: #ff2222; }

.pttbgc-10 .ptt-bg {
  background-color: gray; }

.pttbgc-10 .ptt-chat-id {
  color: #ffff9c; }

.pttbgc-10 .ptt-chat-time {
  color: #d7d7d7; }

.pttbgc-10 .ptt-chat-msg {
  color: #b0b000 !important; }

.pttbgc-10 .ptt-chat-type {
  color: white; }

.pttbgc-10 .ptt-chat-type-n {
  color: #ff2626; }

.pttbgc-11 .ptt-bg {
  background-color: #8c8c8c; }

.pttbgc-11 .ptt-chat-id {
  color: #ffffa1; }

.pttbgc-11 .ptt-chat-time {
  color: #dadada; }

.pttbgc-11 .ptt-chat-msg {
  color: #b2b200 !important; }

.pttbgc-11 .ptt-chat-type {
  color: white; }

.pttbgc-11 .ptt-chat-type-n {
  color: #ff2a2a; }

.pttbgc-12 .ptt-bg {
  background-color: #999999; }

.pttbgc-12 .ptt-chat-id {
  color: #888800; }

.pttbgc-12 .ptt-chat-time {
  color: #474747; }

.pttbgc-12 .ptt-chat-msg {
  color: #3a3a00 !important; }

.pttbgc-12 .ptt-chat-type {
  color: #616161; }

.pttbgc-12 .ptt-chat-type-n {
  color: #610000; }

.pttbgc-13 .ptt-bg {
  background-color: #a6a6a6; }

.pttbgc-13 .ptt-chat-id {
  color: #8d8d00; }

.pttbgc-13 .ptt-chat-time {
  color: #4a4a4a; }

.pttbgc-13 .ptt-chat-msg {
  color: #3c3c00 !important; }

.pttbgc-13 .ptt-chat-type {
  color: #656565; }

.pttbgc-13 .ptt-chat-type-n {
  color: #650000; }

.pttbgc-14 .ptt-bg {
  background-color: #b3b3b3; }

.pttbgc-14 .ptt-chat-id {
  color: #929200; }

.pttbgc-14 .ptt-chat-time {
  color: #4d4d4d; }

.pttbgc-14 .ptt-chat-msg {
  color: #3f3f00 !important; }

.pttbgc-14 .ptt-chat-type {
  color: dimgray; }

.pttbgc-14 .ptt-chat-type-n {
  color: #690000; }

.pttbgc-15 .ptt-bg {
  background-color: #bfbfbf; }

.pttbgc-15 .ptt-chat-id {
  color: #989800; }

.pttbgc-15 .ptt-chat-time {
  color: #4f4f4f; }

.pttbgc-15 .ptt-chat-msg {
  color: #414100 !important; }

.pttbgc-15 .ptt-chat-type {
  color: #6c6c6c; }

.pttbgc-15 .ptt-chat-type-n {
  color: #6c0000; }

.pttbgc-16 .ptt-bg {
  background-color: #cccccc; }

.pttbgc-16 .ptt-chat-id {
  color: #9d9d00; }

.pttbgc-16 .ptt-chat-time {
  color: #525252; }

.pttbgc-16 .ptt-chat-msg {
  color: #434300 !important; }

.pttbgc-16 .ptt-chat-type {
  color: #707070; }

.pttbgc-16 .ptt-chat-type-n {
  color: #700000; }

.pttbgc-17 .ptt-bg {
  background-color: #d9d9d9; }

.pttbgc-17 .ptt-chat-id {
  color: #a2a200; }

.pttbgc-17 .ptt-chat-time {
  color: #555555; }

.pttbgc-17 .ptt-chat-msg {
  color: #464600 !important; }

.pttbgc-17 .ptt-chat-type {
  color: #747474; }

.pttbgc-17 .ptt-chat-type-n {
  color: #740000; }

.pttbgc-18 .ptt-bg {
  background-color: #e6e6e6; }

.pttbgc-18 .ptt-chat-id {
  color: #a8a800; }

.pttbgc-18 .ptt-chat-time {
  color: #585858; }

.pttbgc-18 .ptt-chat-msg {
  color: #484800 !important; }

.pttbgc-18 .ptt-chat-type {
  color: #787878; }

.pttbgc-18 .ptt-chat-type-n {
  color: #780000; }

.pttbgc-19 .ptt-bg {
  background-color: #f2f2f2; }

.pttbgc-19 .ptt-chat-id {
  color: #adad00; }

.pttbgc-19 .ptt-chat-time {
  color: #5b5b5b; }

.pttbgc-19 .ptt-chat-msg {
  color: #4a4a00 !important; }

.pttbgc-19 .ptt-chat-type {
  color: #7c7c7c; }

.pttbgc-19 .ptt-chat-type-n {
  color: #7c0000; }

.pttbgc-20 .ptt-bg {
  background-color: white; }

.pttbgc-20 .ptt-chat-id {
  color: #b3b300; }

.pttbgc-20 .ptt-chat-time {
  color: #5e5e5e; }

.pttbgc-20 .ptt-chat-msg {
  color: #4d4d00 !important; }

.pttbgc-20 .ptt-chat-type {
  color: gray; }

.pttbgc-20 .ptt-chat-type-n {
  color: maroon; }

.pttc-10 .ptt-border {
  border: 1px solid black !important; }

.pttc-10 .ptt-text {
  color: black !important; }

.pttc-10 .ptt-btnoutline {
  color: black;
  color: black;
  border-color: black; }
  .pttc-10 .ptt-btnoutline:hover {
    color: #fff;
    background-color: black;
    border-color: black; }
  .pttc-10 .ptt-btnoutline:focus, .pttc-10 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5); }
  .pttc-10 .ptt-btnoutline.disabled, .pttc-10 .ptt-btnoutline:disabled {
    color: black;
    background-color: transparent; }
  .pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-10 .ptt-btnoutline.dropdown-toggle {
    color: #fff;
    background-color: black;
    border-color: black; }
    .pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-10 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.5); }

.pttc-10 .nav-link.active,
.pttc-10 .nav-item.show .nav-link {
  color: black;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-9 .ptt-border {
  border: 1px solid #1a1a1a !important; }

.pttc-9 .ptt-text {
  color: #1a1a1a !important; }

.pttc-9 .ptt-btnoutline {
  color: #1a1a1a;
  color: #1a1a1a;
  border-color: #1a1a1a; }
  .pttc-9 .ptt-btnoutline:hover {
    color: #fff;
    background-color: #1a1a1a;
    border-color: #1a1a1a; }
  .pttc-9 .ptt-btnoutline:focus, .pttc-9 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.5); }
  .pttc-9 .ptt-btnoutline.disabled, .pttc-9 .ptt-btnoutline:disabled {
    color: #1a1a1a;
    background-color: transparent; }
  .pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-9 .ptt-btnoutline.dropdown-toggle {
    color: #fff;
    background-color: #1a1a1a;
    border-color: #1a1a1a; }
    .pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-9 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.5); }

.pttc-9 .nav-link.active,
.pttc-9 .nav-item.show .nav-link {
  color: #1a1a1a;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-8 .ptt-border {
  border: 1px solid #333333 !important; }

.pttc-8 .ptt-text {
  color: #333333 !important; }

.pttc-8 .ptt-btnoutline {
  color: #333333;
  color: #333333;
  border-color: #333333; }
  .pttc-8 .ptt-btnoutline:hover {
    color: #fff;
    background-color: #333333;
    border-color: #333333; }
  .pttc-8 .ptt-btnoutline:focus, .pttc-8 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.5); }
  .pttc-8 .ptt-btnoutline.disabled, .pttc-8 .ptt-btnoutline:disabled {
    color: #333333;
    background-color: transparent; }
  .pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-8 .ptt-btnoutline.dropdown-toggle {
    color: #fff;
    background-color: #333333;
    border-color: #333333; }
    .pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-8 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.5); }

.pttc-8 .nav-link.active,
.pttc-8 .nav-item.show .nav-link {
  color: #333333;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-7 .ptt-border {
  border: 1px solid #4d4d4d !important; }

.pttc-7 .ptt-text {
  color: #4d4d4d !important; }

.pttc-7 .ptt-btnoutline {
  color: #4d4d4d;
  color: #4d4d4d;
  border-color: #4d4d4d; }
  .pttc-7 .ptt-btnoutline:hover {
    color: #fff;
    background-color: #4d4d4d;
    border-color: #4d4d4d; }
  .pttc-7 .ptt-btnoutline:focus, .pttc-7 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(77, 77, 77, 0.5); }
  .pttc-7 .ptt-btnoutline.disabled, .pttc-7 .ptt-btnoutline:disabled {
    color: #4d4d4d;
    background-color: transparent; }
  .pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-7 .ptt-btnoutline.dropdown-toggle {
    color: #fff;
    background-color: #4d4d4d;
    border-color: #4d4d4d; }
    .pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-7 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(77, 77, 77, 0.5); }

.pttc-7 .nav-link.active,
.pttc-7 .nav-item.show .nav-link {
  color: #4d4d4d;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-6 .ptt-border {
  border: 1px solid #666666 !important; }

.pttc-6 .ptt-text {
  color: #666666 !important; }

.pttc-6 .ptt-btnoutline {
  color: #666666;
  color: #666666;
  border-color: #666666; }
  .pttc-6 .ptt-btnoutline:hover {
    color: #fff;
    background-color: #666666;
    border-color: #666666; }
  .pttc-6 .ptt-btnoutline:focus, .pttc-6 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(102, 102, 102, 0.5); }
  .pttc-6 .ptt-btnoutline.disabled, .pttc-6 .ptt-btnoutline:disabled {
    color: #666666;
    background-color: transparent; }
  .pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-6 .ptt-btnoutline.dropdown-toggle {
    color: #fff;
    background-color: #666666;
    border-color: #666666; }
    .pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-6 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(102, 102, 102, 0.5); }

.pttc-6 .nav-link.active,
.pttc-6 .nav-item.show .nav-link {
  color: #666666;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-5 .ptt-border {
  border: 1px solid gray !important; }

.pttc-5 .ptt-text {
  color: gray !important; }

.pttc-5 .ptt-btnoutline {
  color: gray;
  color: gray;
  border-color: gray; }
  .pttc-5 .ptt-btnoutline:hover {
    color: #fff;
    background-color: gray;
    border-color: gray; }
  .pttc-5 .ptt-btnoutline:focus, .pttc-5 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(128, 128, 128, 0.5); }
  .pttc-5 .ptt-btnoutline.disabled, .pttc-5 .ptt-btnoutline:disabled {
    color: gray;
    background-color: transparent; }
  .pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-5 .ptt-btnoutline.dropdown-toggle {
    color: #fff;
    background-color: gray;
    border-color: gray; }
    .pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-5 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(128, 128, 128, 0.5); }

.pttc-5 .nav-link.active,
.pttc-5 .nav-item.show .nav-link {
  color: gray;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-4 .ptt-border {
  border: 1px solid #999999 !important; }

.pttc-4 .ptt-text {
  color: #999999 !important; }

.pttc-4 .ptt-btnoutline {
  color: #999999;
  color: #999999;
  border-color: #999999; }
  .pttc-4 .ptt-btnoutline:hover {
    color: #212529;
    background-color: #999999;
    border-color: #999999; }
  .pttc-4 .ptt-btnoutline:focus, .pttc-4 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.5); }
  .pttc-4 .ptt-btnoutline.disabled, .pttc-4 .ptt-btnoutline:disabled {
    color: #999999;
    background-color: transparent; }
  .pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-4 .ptt-btnoutline.dropdown-toggle {
    color: #212529;
    background-color: #999999;
    border-color: #999999; }
    .pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-4 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(153, 153, 153, 0.5); }

.pttc-4 .nav-link.active,
.pttc-4 .nav-item.show .nav-link {
  color: #999999;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-3 .ptt-border {
  border: 1px solid #b3b3b3 !important; }

.pttc-3 .ptt-text {
  color: #b3b3b3 !important; }

.pttc-3 .ptt-btnoutline {
  color: #b3b3b3;
  color: #b3b3b3;
  border-color: #b3b3b3; }
  .pttc-3 .ptt-btnoutline:hover {
    color: #212529;
    background-color: #b3b3b3;
    border-color: #b3b3b3; }
  .pttc-3 .ptt-btnoutline:focus, .pttc-3 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(179, 179, 179, 0.5); }
  .pttc-3 .ptt-btnoutline.disabled, .pttc-3 .ptt-btnoutline:disabled {
    color: #b3b3b3;
    background-color: transparent; }
  .pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-3 .ptt-btnoutline.dropdown-toggle {
    color: #212529;
    background-color: #b3b3b3;
    border-color: #b3b3b3; }
    .pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-3 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(179, 179, 179, 0.5); }

.pttc-3 .nav-link.active,
.pttc-3 .nav-item.show .nav-link {
  color: #b3b3b3;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-2 .ptt-border {
  border: 1px solid #cccccc !important; }

.pttc-2 .ptt-text {
  color: #cccccc !important; }

.pttc-2 .ptt-btnoutline {
  color: #cccccc;
  color: #cccccc;
  border-color: #cccccc; }
  .pttc-2 .ptt-btnoutline:hover {
    color: #212529;
    background-color: #cccccc;
    border-color: #cccccc; }
  .pttc-2 .ptt-btnoutline:focus, .pttc-2 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5); }
  .pttc-2 .ptt-btnoutline.disabled, .pttc-2 .ptt-btnoutline:disabled {
    color: #cccccc;
    background-color: transparent; }
  .pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-2 .ptt-btnoutline.dropdown-toggle {
    color: #212529;
    background-color: #cccccc;
    border-color: #cccccc; }
    .pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-2 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(204, 204, 204, 0.5); }

.pttc-2 .nav-link.active,
.pttc-2 .nav-item.show .nav-link {
  color: #cccccc;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-1 .ptt-border {
  border: 1px solid #e6e6e6 !important; }

.pttc-1 .ptt-text {
  color: #e6e6e6 !important; }

.pttc-1 .ptt-btnoutline {
  color: #e6e6e6;
  color: #e6e6e6;
  border-color: #e6e6e6; }
  .pttc-1 .ptt-btnoutline:hover {
    color: #212529;
    background-color: #e6e6e6;
    border-color: #e6e6e6; }
  .pttc-1 .ptt-btnoutline:focus, .pttc-1 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(230, 230, 230, 0.5); }
  .pttc-1 .ptt-btnoutline.disabled, .pttc-1 .ptt-btnoutline:disabled {
    color: #e6e6e6;
    background-color: transparent; }
  .pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-1 .ptt-btnoutline.dropdown-toggle {
    color: #212529;
    background-color: #e6e6e6;
    border-color: #e6e6e6; }
    .pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-1 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(230, 230, 230, 0.5); }

.pttc-1 .nav-link.active,
.pttc-1 .nav-item.show .nav-link {
  color: #e6e6e6;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

.pttc-0 .ptt-border {
  border: 1px solid white !important; }

.pttc-0 .ptt-text {
  color: white !important; }

.pttc-0 .ptt-btnoutline {
  color: white;
  color: white;
  border-color: white; }
  .pttc-0 .ptt-btnoutline:hover {
    color: #212529;
    background-color: white;
    border-color: white; }
  .pttc-0 .ptt-btnoutline:focus, .pttc-0 .ptt-btnoutline.focus {
    box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); }
  .pttc-0 .ptt-btnoutline.disabled, .pttc-0 .ptt-btnoutline:disabled {
    color: white;
    background-color: transparent; }
  .pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled):active, .pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled).active,
  .show > .pttc-0 .ptt-btnoutline.dropdown-toggle {
    color: #212529;
    background-color: white;
    border-color: white; }
    .pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus, .pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,
    .show > .pttc-0 .ptt-btnoutline.dropdown-toggle:focus {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.5); }

.pttc-0 .nav-link.active,
.pttc-0 .nav-item.show .nav-link {
  color: white;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff; }

/*# sourceMappingURL=../map/index.css.map */`;
  setTimeout(() =>{document.body.appendChild($style);}, 1000);
})();