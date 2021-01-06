// ==UserScript==
// @name               pttchatonyoutube
// @namespace          https://github.com/zoosewu
// @version            2.0.1663
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
// @license            MIT
// @name:zh-TW         Youtube聊天室顯示PTT推文
// @description:zh-tw  連結PTT推文到Youtube聊天室  讓你簡單追實況搭配推文
// @run-at             document-start
// @require            https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require            https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require            https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js
// @require            https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @require            https://cdn.jsdelivr.net/npm/vue@2.6.12/dist/vue.js
// @require            https://cdn.jsdelivr.net/npm/vuex@3.6.0/dist/vuex.js
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
const showalertmsg = true || showalllog;

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
      //console.log(`insertText : \"` + str + `\"`);
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
        PTT.pagestate = filter.state;
        console.log("==page state = " + PTT.pagestate);
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
    //console.log("==GetPush from " + targetline + "to " + (PTT.screen.length - 1));
    //console.log("==(pttstartline, pttendline, startline, endline, targetline): (" + PTTPost.startline + ", " + PTTPost.endline + ", " + startline + ", " + endline + ", " + targetline + ")");
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
    else if (PTT.pagestate === 1) console.log("==PostPercentCheck error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==PostPercentCheck error, PTT.pagestate == 2.");
    return res;
  }
  // -----------------------task getpostbyrecent --------------------
  function gotoend() { insertText('G'); }
  function GetRecentLine() {
    const res = { pass: false, callback: gotoend }
    if (PTT.pagestate === 4) {
      const line = PTT.screenHaveText(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~(\d+) 行/);
      if (line) {
        let targetline = +line[1] - PTTPost.endline - 1;
        if (targetline < 3) targetline = 3;
        //console.log("==GetRecentLine, TotalLine, GotoLline", line[1], targetline);
        PTTPost.endline = targetline;
        insertText(PTTPost.endline + ".\n");
        res.pass = true;
      }
    }
    else if (PTT.pagestate === 1) console.log("==GetPushTask error, PTT.pagestate == 1.");
    else if (PTT.pagestate === 2) console.log("==GetPushTask error, PTT.pagestate == 2.");
    else if (PTT.pagestate === 3) { }
    return res;
  }
  //------------------------tasks--------------------------------
  const task = {};
  task.GetPostByLine = [boardcheck, PostCheck, PotsTitleCheck, PostLineCheck, PostPercentCheck];
  task.GetPostRecentLine = [boardcheck, PostCheck, PotsTitleCheck, GetRecentLine];
  function GetRecentLineTask() {
    if (PTTPost.isgotopost && PTT.pagestate === 2) {
      msg.PostMessage("alert", { type: 0, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
      PTT.unlock();
    }
    //console.log("==(startline, endline): ( " + PTTPost.startline + ", " + PTTPost.endline + ")");
    for (let i = 0; i < task.GetPostRecentLine.length; i++) {
      const element = task.GetPostRecentLine[i];
      const result = element();
      //console.log("==Run task", { element, result });
      if (result.pass === false) {
        result.callback();
        PTT.commands.add(/.*/, "", GetRecentLineTask);
        return;
      }
    }
    PTT.commands.add(/.*/, "", GetPushTask);
  }
  function GetPushTask() {
    if (PTTPost.isgotopost && PTT.pagestate === 2) {
      msg.PostMessage("alert", { type: 0, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
      PTT.unlock();
    }
    //console.log("==(startline, endline): ( " + PTTPost.startline + ", " + PTTPost.endline + ")");
    for (let i = 0; i < task.GetPostByLine.length; i++) {
      const element = task.GetPostByLine[i];
      const result = element();
      //console.log("==Run task", { element, result });
      if (result.pass === false) {
        result.callback();
        PTT.commands.add(/.*/, "", GetPushTask);
        return;
      }
    }
    //end
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
        PTTPost.isgotopost = false;
        //console.log("==Get Same Post Push from PTTPost.endline, startline: " + PTTPost.endline + ", " + startline);
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
      }
      if (PTT.pagestate === 1) insertText("m");
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
          msg.PostMessage("alert", { type: 0, msg: "發生了未知錯誤。" });
          console.log(PTT.screen);
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
    if (Reconnect()) {

    }
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
      callback(...args);
      setTimeout(checkscreenupdate, 3500);
    }
  }
  //end
  const ReconnectInterval = window.setInterval((() => {
    Reconnect();
  }), 1500);

  msg["login"] = data => {
    const i = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8);
    const p = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8);
    //console.log(data );
    //console.log([i, p],cryptkey);
    PTTLockCheck(Login, i, p);
  };
  msg["getPushByLine"] = data => { PTTLockCheck(GetPush, data.AID, data.board, data.startline, GetPushTask); };
  msg["getPushByRecent"] = data => { PTTLockCheck(GetPush, data.AID, data.board, data.recent, GetRecentLineTask); };
}

function HerfFilter(msg, filters) {
  const isTopframe = (window.top == window.self);
  if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
    if (isTopframe) throw throwstring("PTT");//check script work in right frame
    //init msg
    msg.ownerorigin = "https://term.ptt.cc";
    msg.targetorigin = /\?url=(.+?)\/?$/.exec(window.location.href)[1];
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
      console.log("isGotoChat", go);
      if (go) {
        this.$store.dispatch('gotoChat', false);
        this.$refs.chatbtn.click();
        console.log("gotoChat");
      }
      return go;
    },
    ...Vuex.mapGetters([
      'gotoChat',
    ])
  },
  mounted() {
    //this.$store.dispatch('chatBtn', this.$refs.chatbtn);
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
  SETHEIGHT: 'PluginHeight',
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
}

// state
const state = {
  count: 0,
  pluginHeight: GM_getValue(types.SETHEIGHT, 450),
  alert: { type: 0, msg: "" },
  msg: {},
  post: {
    AID: "",
    board: "",
    title: "",
    date: (() => { const t = new Date(); t.setHours(0); t.setMinutes(0); t.setSeconds(0); return t; })(),
    lastendline: 0,
    lastpushtime: new Date(),
    pushcount: 0,
    nowpush: 0,
  },
  chatlist: [],
  log: {},
  firstChatTime: {},
  lastChatTime: {},
  VStartTime: ["18", "00", "00"],
  VStartDate: (() => { const t = new Date(); t.setHours(0); t.setMinutes(0); t.setSeconds(0); return t; })(),
  VPlayedTime: 0,
  VCurrentTime: new Date(),
  pageChange: false,
  gotoChat: false,
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
  [types.SETHEIGHT](state, height) {
    state.pluginHeight = height;
    GM_setValue(types.SETHEIGHT, height);
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
}

const getters = {
  getCount: state => { return state.count },
  getHeight: state => { return state.pluginHeight },
  newAlert: state => { return state.alert },
  log: state => { return state.log },
  post: state => { return state.post },
  newChatList: state => { return state.chatlist },
  videoCurrentTime: state => { return state.VCurrentTime; },
  gotoChat: state => { return state.gotoChat; },

}

const actions = {
  actionIncrease: ({ commit }) => { console.log('actionIncrease'); commit(types.INCREASE); },
  actionDecrease: ({ commit }) => { console.log('actionDecrease'); commit(types.DECREASE); },

  setHeight: (context, height) => {
    context.commit(types.SETHEIGHT, height);
  },
  Alert: (context, alertobject) => {
    console.log("actions Alert");
    context.commit(types.ALERT, alertobject);
  },
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
      };
      const t = newpost.date;
      commit(types.UPDATELOG, { type: "postaid", data: newpost.AID });
      commit(types.UPDATELOG, [{ type: "postboard", data: newpost.board },
      { type: "posttitle", data: newpost.title },
      { type: "postdate", data: t.toLocaleDateString() + " " + t.toLocaleTimeString() },
      { type: "postendline", data: newpost.lastendline }]);
    }
    if (newpost.pushcount == 0 && postdata.pushes.length > 0)

      newpost.pushcount += postdata.pushes.length;
    if (postdata.pushes.length > 0) {
      commit(types.UPDATEPOST, newpost);
      dispatch('updateVideoStartDate');
      dispatch('updateChat', postdata.pushes);
    }
    console.log("state.pageChange", state.pageChange);
    console.log("state.chatBtn", state.chatBtn);
    if (state.pageChange) {
      dispatch('gotoChat', true);
      dispatch('pageChange', false);
    }
  },
  updateChat: ({ commit, state }, pushes) => {
    const chatlist = [];
    let sametimecount = 0;
    let sametimeIndex = 0;
    for (let index = 0; index < pushes.length; index++) {
      const currpush = pushes[index];//抓出來的推文
      const chat = {};
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
      chat.time = currpush.date;
      //console.log("sametimeIndex, index, sametimecount", sametimeIndex, index, sametimecount);
      if (sametimecount > 0) chat.time.setSeconds((sametimecount + index - sametimeIndex) * 60 / sametimecount);
      chat.id = currpush.id;
      chat.type = currpush.type;
      chat.msg = currpush.content;
      chat.timeH = paddingLeft(chat.time.getHours(), +2);
      chat.timem = paddingLeft(chat.time.getMinutes(), +2);
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
    if (currtime.valueOf() < state.post.date.valueOf()) {
      currtime.setHours(currtime.getHours() + 24);
      if (state.VStartTime[3]) {
        currtime.setHours(currtime.getHours() - 24);
      }
    }
    //console.log("updateVideoCurrentTime vstart, time, currtime", vstart, time, currtime);
    commit(types.UPDATELOG, { type: "videocurrenttime", data: currtime.toLocaleDateString() + " " + currtime.toLocaleTimeString() });
    commit(types.VIDEOCURRENTRIME, currtime);
  },
  pageChange: ({ commit, state }, Change) => {
    commit(types.PAGECHANGE, Change);
  },
  gotoChat: ({ commit, state }, gtChat) => {
    commit(types.GOTOCHAT, gtChat);
  },
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
      const disable = this.isAutoScroll ? "d-none" : "";
      return "position-absolute " + disable;
    }
  },
  template: `<div id="PTTChat-contents-Chat-btn" :class="className"
  style="z-index:400; bottom:5%; left: 50%; -ms-transform: translateX(-50%); transform: translateX(-50%);">
  <button id="AutoScroll" class="btn btn-primary" type="button" v-on:click="click">自動滾動</button>
</div>`,
}

Vue.component('chat-item', {
  props: ['index', 'ChatStart', 'ChatEnd', 'ChatCurrent', 'type', 'id', 'timeH', 'timem', 'msg'],
  data: function () {
    return {
      dismissCount: 2,
      timerInterval: null,
      chatid: "chat-" + this.index,
    }
  },
  computed: {
    typeclass: function () {
      const typecolor = this.type === "噓" ? "ptt-chat-type-n" : "ptt-chat-type";
      return typecolor + "  mr-2 mb-0";
    },
    bgc: function () {
      const isUnchat = this.ChatCurrent >= this.index ? "0" : "0.25";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      //console.log("Chat:", this.index, "isischat", isUnchat);
      return { backgroundColor: color, transition: "2s" };
    }
  },
  watch: {

  },
  methods: {

  },
  mounted() {
    //console.log(this.index, this.type, this.id, this.timeH, this.timem, this.msg);
  },
  template: `<li :id="this.chatid" class="media px-4" v-if="index >= ChatStart && index <= ChatEnd" v-bind:style="bgc">
  <div class="media-body mw-100">
    <div class="d-flex flex-row">
      <h5 :class="typeclass">{{ this.type }}</h5>
      <h5 class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.id }}</h5>
      <h5 class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</h5>
    </div>
    <div>
      <h4 class="ptt-chat-msg mb-0 ml-2 mr-2" style="word-break: break-all;">{{ this.msg }}</h4>
    </div>
    <div class="mb-4"> </div>
  </div>
</li>`,
});

let Chat = {
  inject: ['msg', 'isStream'],
  data: function () {
    return {
      chatList: [],
      lastChat: {},
      activeChat: 0,
      activeRange: 200,
      activeChatStart: 0,
      activeChatEnd: 0,
      updateChat: null,
      updateScroll: null,
      nextUpdateTime: Date.now(),
      isAutoScroll: true,
    }
  },
  methods: {
    scrollToChat: function () {
      //console.log("scrollToChatF", new Date().getTime());
      if (this.isAutoScroll) {
        const scrollPos = this.getScrollPos();
        const p = this.$refs.chatmain.scrollTop - scrollPos;
        if (p > 20 || p < -20) {
          //console.log("scrollToChatS", new Date().getTime(), this.isAutoScroll, scrollPos);
          this.$refs.chatmain.scrollTo({
            top: scrollPos,
            behavior: "smooth"
          });
        }
      }
      this.getCurrentChat();
    },
    getScrollPos: function () {
      const clientHeight = this.$refs.chatmain ? this.$refs.chatmain.clientHeight : 0;
      if (!this.$children[this.activeChat + 1]) return 0;
      const chat = this.$children[this.activeChat + 1].$el;
      const chatHeight = chat.clientHeight;

      const scrolloffset = (clientHeight - chatHeight) / 2;
      const scrollmin = 0;
      const scrollmax = this.$refs.chats.clientHeight - clientHeight;
      let scrollPos = chat.offsetTop - scrolloffset;
      if (scrollPos < scrollmin) scrollPos = scrollmin;
      else if (scrollPos > scrollmax) scrollPos = scrollmax;
      //console.log("getScrollPos, activeChat, clientHeight, chatHeight, scrolloffset, chat.offsetTop, scrollPos, scrollTop", this.activeChat, clientHeight, chatHeight, scrolloffset, chat.offsetTop, scrollPos, this.$refs.chatmain.scrollTop);
      return scrollPos;
    },
    getCurrentChat: function () {
      if (this.isStream) {
        this.activeChat = this.chatList.length - 1;
      }
      else {
        // if (this.activeChat && this.chatList) {
        //   console.log("activeChat", this.activeChat, "current time: " + this.videoCurrentTime.toString());
        //   if (this.chatList[this.activeChat - 1]) {
        //     console.log("this.chatList[this.activeChat-1].time", this.chatList[this.activeChat - 1].time.toString());
        //   }
        //   if (this.chatList[this.activeChat]) {
        //     console.log("this.chatList[this.activeChat+0].time", this.chatList[this.activeChat].time.toString());
        //     console.log("this.chatList[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()", this.chatList[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf());
        //   }
        //   if (this.chatList[this.activeChat + 1]) {
        //     console.log("this.chatList[this.activeChat+1].time", this.chatList[this.activeChat + 1].time.toString());
        //     console.log("this.chatList[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()", this.chatList[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf());
        //   }
        // }
        while (this.chatList[this.activeChat] && this.chatList[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
          this.activeChat--;
        }
        while (this.chatList[this.activeChat + 1] && this.chatList[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
          this.activeChat++;
        }
      }
      this.activeChatEnd = (this.activeChat + this.activeRange / 2) < this.chatList.length - 1 ? this.activeChat + this.activeRange / 2 : this.chatList.length - 1;
      this.activeChatStart = this.activeChatEnd - this.activeRange;
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false;
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true;
      this.scrollToChat();
    }
  },
  computed: {
    list: function () {
      if (this.newChatList !== this.lastChat) {
        this.chatList = this.chatList.concat(this.newChatList);
        this.lastChat = this.newChatList;
        const nextUpdate = this.isStream ? 2.5 * 1000 : 365 * 24 * 60 * 60 * 1000;
        this.nextUpdateTime = Date.now() + nextUpdate;
      }
      return this.chatList;
    },
    postAID: function () {
      this.chatList = [];
      return this.post.AID;
    },
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
    ])
  },
  mounted() {
    //註冊文章事件
    this.msg["newPush"] = data => { this.$store.dispatch('updatePost', data); };

    //初始化聊天列表
    this.lastChat = this.newChatList;
    //this.chatList = [];
    this.chatList = testchat.list;//test
    this.activeChat = 0;

    //定時抓新聊天
    this.updateChat = window.setInterval(() => {
      if (this.isStream && Date.now() > this.nextUpdateTime) {
        console.log("updateChat", this.isStream, Date.now(), this.nextUpdateTime);
        //this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime);
        this.nextUpdateTime = Date.now() + 2.5 * 1000;
      }
    }, 500);

    //定時滾動
    this.updateScroll = window.setInterval(() => { this.scrollToChat(); }, 1000);

    //使用者滾輪事件
    if (this.$refs.chatmain.addEventListener) {
      this.$refs.chatmain.addEventListener("mousewheel", this.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera
      this.$refs.chatmain.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);// Firefox
    }
    else {// IE 6/7/8
      this.$refs.chatmain.attachEvent("onmousewheel", this.MouseWheelHandler);
    }
  },
  beforeDestroy() {
    clearInterval(this.updateChat);
    clearInterval(this.updateScroll);
  },
  components: {
    "chat-scroll-btn": ChatScrollBtn,
  },
  template: `<div id="PTTChat-contents-Chat-main" ref="chatmain" class="flex-grow-1 mh-100 row"
  style="overscroll-behavior: none;overflow-y: scroll;">
  <ul id="PTTChat-contents-Chat-pushes" class="col mb-0 px-0" v-bind:post-aid="postAID" ref="chats">
    <chat-item :index="index" :ChatStart="activeChatStart" :ChatEnd="activeChatEnd" :ChatCurrent="activeChat"
      :type="item.type" :id="item.id" :time-h="item.timeH" :timem="item.timem" :msg="item.msg" :key="index"
      v-for="(item, index) in list">
    </chat-item>
  </ul>
  <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
</div>`,
}


let testchat = {
  l: [],
  get list() {
    for (let i = this.l.length; i < 20; i++) {
      const el = {
        type: "推 ",
        id: "Zoosewu ",
        time: new Date(),
      };
      el.msg = i + " 太神啦太神啦太神啦太神啦太神啦";
      el.time.setHours(18);
      el.time.setMinutes(i);
      el.timeH = paddingLeft(el.time.getHours(), +2);
      el.timem = paddingLeft(el.time.getMinutes(), +2);
      this.l.push(el);
    }
    return this.l;
  }
}

let ChatTimeSetting = {
  template: `<div id="PTTChat-Time" class="ptt-text ptt-bg p-2 position-absolute w-100 d-none" style="z-index:400;">
  <div id="PTTChat-Time-Setting">
    <form class="form-inline">
      <label for="dis" class="w-100">實況重播時間微調</label>
      <div class="d-flex justify-content-between w-100">
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
  data: function () {
    return {
      VideoTime: "18:00:00",
      isbeforpost: false,
    }
  },
  methods: {
    timeChange: function () {
      console.log(this.VideoTime);
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
      result.push(this.isbeforpost);
      this.$store.dispatch('updateVideoStartTime', videotime);
    }
  },
  mounted() {
    this.$store.dispatch('updateVideoStartTime', ["18", "00", "00"]);
  },
  template: `<div id="PTTConnect-Time-Setting" class="form-row mb-2">
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
      else {
        GM_setValue("PostAID", this.aid);
        gotomainchat = true;//// 
        if (this.post.AID === result[1] && this.post.board === result[2]) {//相同文章取最新推文
          this.msg.PostMessage("getPushByLine", { AID: result[1], board: result[2], startline: this.post.lastendline });
        }
        else if (this.isStream) {//實況取得最近的推文
          this.msg.PostMessage("getPushByRecent", { AID: result[1], board: result[2], recent: 200 });
        }
        else {//實況紀錄取得所有推文
          this.msg.PostMessage("getPushByLine", { AID: result[1], board: result[2], startline: 0 });
        }
        this.$store.dispatch('pageChange', true);
      }
    }
  },
  mounted() {
    // this.msg["postdata"] = data => {
    //   this.$store.dispatch('updatePost', data);
    // };
  },
  computed: {
    ...Vuex.mapGetters([
      'post',
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

let ConnectOtherSetting = {
  template: `<!-- test push button -->
  <button id="fakebtn" class="btn ptt-btnoutline m-2 d-none" type="button">讀取測試用假推文</button>
  <!-- New version button -->
  <a id="updatebtn" class="btn ptt-btnoutline m-2 d-none"
    href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer"
    role="button">檢測到新版本</a>`,
}

let ConnectPluginHeight = {
  el: "#connectpluginheight",
  data: function () {
    return {
      inputheight: this.$store.getters.getHeight
    }
  },
  methods: {
    newHeight: function () {
      if (this.inputheight > 800) this.inputheight = 800;
      if (this.inputheight < 180) this.inputheight = 180;
      this.$store.dispatch('setHeight', this.inputheight);
    }
  },
  template: `<div id="connectpluginheight" class="form-row my-3">
  <label for="setH" class="col-3 col-form-label">設定插件長度</label>
  <div class="col">
    <input id="setHeight" class="form-control" type="text" placeholder="600" autocomplete="off"
      v-on:keyup.13="newHeight" v-model.lazy="inputheight">
  </div>
  <div class="col-2 px-0">
    <button id="setHeightbtn" class="btn ptt-btnoutline w-100" @click.self="newHeight()"
      type="button">確認</button>
  </div>
</div>`

}

let Connect = {
  template: `<div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0">
  <ConnectStreamTimeSetting></ConnectStreamTimeSetting>
  <ConnectLogin></ConnectLogin>
  <ConnectAID></ConnectAID>
  <ConnectPluginHeight></ConnectPluginHeight>
  <ConnectOtherSetting></ConnectOtherSetting>
</div>`,
  components: {
    "ConnectStreamTimeSetting": ConnectStreamTimeSetting,
    "ConnectLogin": ConnectLogin,
    "ConnectAID": ConnectAID,
    "ConnectPluginHeight":ConnectPluginHeight,
    "ConnectOtherSetting": ConnectOtherSetting
  }
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
      console.log("removeAlert: this.al,item.msg,index", this.al, item.msg, index);
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
  <div>
    使用教學:</p>
    1.設定紀錄檔開始的時間</p>
    (實況無須設定)</p>
    2.輸入帳號與密碼登入PTT</p>
    3.在你自己的PTT找到想要同步的文章</p>
    4.鍵入大寫Q複製文章完整AID</p>
    5.將複製的AID貼上並讀取文章</p>
    &nbsp;</p>
    &nbsp;</p>
  </div>
  <div>如果需要回報或有任何問題請打開除錯模式以檢視PTT畫面及Log</p>
    目前測試版運行中 除錯模式已開啟</p>
  </div>
  <button id="opendevmode" class="btn ptt-btnoutline m-2" type="button">除錯模式</button>
  <div>
    &nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>&nbsp;</p>
    聲明:</p>
    &nbsp;</p>
    我的程式碼都公開在網路上了，如果覺得我會到帳號請不要使用。</p>
    &nbsp;</p>
    請保證瀏覽Youtube時沒有其他PTT腳本同時執行，這很重要。</p>
    &nbsp;</p>
    我盡量確保你的帳號不會因為我的插件被盜了。</p>
    &nbsp;</p>
    但是如果你被盜了我不負責。</p>
    &nbsp;</p>
    如果你用了插件導致被水桶或被退註或封IP與我無關。</p>
    &nbsp;</p>
    完整聲明請點網站說明進入</p>
    &nbsp;</p>
    Zoosewu</p>
    &nbsp;</p>
  </div>
  <a id="gfbtn" class="btn ptt-btnoutline m-2 "
    href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage" target="_blank" rel="noopener noreferrer"
    role="button">腳本介紹</a>
  <a id="gfbtn" class="btn ptt-btnoutline m-2 "
    href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer"
    role="button">greasyfork</a>
  <a id="gfbtn" class="btn ptt-btnoutline m-2"
    href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master" target="_blank" rel="noopener noreferrer"
    role="button">github</a>
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
        height: this.$store.getters.getHeight + "px"
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
    let color = whitetheme ? "pttbgc-20 pttc-5" : "pttbgc-2 pttc-2";
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
  if (devmode) {
    frameHead.append($(`<link rel="stylesheet" href="http://127.0.0.1:8889/css/index.css">`));
    console.log("custom css");
  } else {
    frameHead.append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/css/bootstrap.min.css" integrity="sha384-TX8t27EcRE3e/ihU7zmQxVncDAy5uIKz4rEkgIXeMed4M0jlfIDPvg6uqKI2xXr2" crossorigin="anonymous">`));
    console.log("normal css");
  }
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

      //生出插件
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
    const colorlight = "rgb(249, 249, 249)";
    const colordark = "rgb(24, 24, 24)";
    WhiteTheme = !(YTbgcolor === colordark);
  }, 100);
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

    InitApp(PTTChatHandler, WhiteTheme, true, msg);
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
  const Body = $("body", document)[0];
  Body.innerHTML = `<div id="container" class="position-relative" style="width:400px;height:800px;"></div>`;
  const blankcontainer = $(`#container`);
  InitApp(blankcontainer, WhiteTheme, true, msg);

}

let blankfilter = InsFilter("Blank", /blank\.org/, "http://blank.org/", Initblank);

//import { custom } from '../css/custom.css';
//dev use 

let devmode = true;
const defaultopen = false;
const disablepttframe = false;
const simulateisstreaming = false;
// add listener to get msg
let cryptkey;
let appinscount = 0;
/* 關閉vue-devtools */
Vue.config.devtools = true;
/* 關閉錯誤警告 */
Vue.config.debug = true;
(function () {
  let msg = new MessagePoster;
  let filters = [];
  filters.push(ytfilter);
  filters.push(htfilter);
  filters.push(blankfilter);
  HerfFilter(msg, filters);
})()