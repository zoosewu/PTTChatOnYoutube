// ==UserScript==
// @name         PTTTest
// @namespace    https://github.com/zoosewu/PTTChatOnYoutube
// @version      1.0.0
// @description  PTT操作
// @author       Zoosewu
// @match        https://term.ptt.cc/*
// @grant        unsafeWindow
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.5.1.slim.min.js
// @connect      www.ptt.cc
// @require      file://E:\Project\PTTChatOnYoutube\PTTConnect.user.js
// @license      MIT
// ==/UserScript==

let isTopframe = (window.top == window.self);
if (!isTopframe) throw new Error("script stopped:Not Top Frame");

'use strict'
const msg = {
  PostMessage: function (msg, data) {
    console.log("Message Posted:" + msg + ".", data.type, data.msg);
  },
};
(function () {
  const showalllog = true;
  const showPTTscreen = true || showalllog;
  const showcommand = false || showalllog;
  //start
  'use strict'
  let PTT = {
    connect: true,//自動 連線狀態
    login: false,//自動
    controlstate: 0,
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
    endline: 0,
    percent: 0,
  }
  let serverfull = false;
  const insertText = (() => {
    let t = PTT.wind.document.querySelector('#t')
    return str => {
      if (!t) t = PTT.wind.document.querySelector('#t')
      const e = new CustomEvent('paste')
      //debug用
      //console.log("insertText", str);
      e.clipboardData = { getData: () => str }
      t.dispatchEvent(e)
    }
  })()
  function ComLog(cmd) {
    if (showcommand) console.log("execute command:", cmd);
  }

  function chechAutoCommand() {
    let commands = PTT.autocom;
    for (let autoi = 0; autoi < commands.length; autoi++) {
      const cmd = commands[autoi];
      const result = PTT.screenHaveText(cmd.reg);
      if (showcommand) console.log("auto command", cmd, result);
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
    if (showPTTscreen) console.log("This is PTT screen", PTT.screen);
    let nextcom = PTT.commands.getfirst();
    if (showcommand && typeof nextcom !== 'undefined') console.log("next command : reg:" + nextcom.reg + "input:" + nextcom.input, nextcom.callback);
    else console.log("next command : none.");
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
        serverfull = false;
        OnUpdate();
      }
    }
  });
  //hook end
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
      if (PTT.screenHaveText(/文章選讀/)) {
        msg.PostMessage("alert", { type: false, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
      }
      else if (PTT.screenHaveText(/作者/)) {
        if (PTTPost.endline > 1) {
          const gotoline = "1\b" + PTTPost.endline + ".\n";
          insertText(gotoline);
          PTT.commands.add(/目前顯示: 第/, "", _getpush);
        }
        else {
          _getpush();
        }
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
    const lineresult = PTT.screenHaveText(/目前顯示: 第 (\d+)~(\d+) 行/);
    const startline = lineresult[1];
    const endline = lineresult[2];

    if (PTTPost.posttime === "") {
      let result = PTT.screenHaveText(/時間  (\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/);
      PTTPost.posttime = new Date(result[1]);
    }
    for (let i = PTTPost.endline - startline + 1; i < PTT.screen.length; i++) {
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
  function GetPostPush(pAID, bname, startline, forceget = false) {
    if ((PTT.connect && PTT.login) || forceget) {
      let searchboard = bname !== PTTPost.board;
      let searchpost = pAID !== PTTPost.AID;
      startline = startline | 1;
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
        if (PTTPost.endline > 22) {
          PTT.commands.add(/目前顯示: 第/, PTTPost.endline + ".\n");
        }
        PTT.commands.add(/目前顯示: 第/, "", _getpush);
      }
    }
    else if (!PTT.connect) {
      msg.PostMessage("alert", { type: false, msg: "PTT已斷線，請重新登入。" });
    }
    else if (!PTT.login) {
      msg.PostMessage("alert", { type: false, msg: "PTT尚未登入，請先登入。" });
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
    let disbtn = $(`.btn.btn-danger[type=button]`);
    if (disbtn.length > 0) {
      disbtn[0].click();
      PTT.unlock();
      serverfull = false;
      console.log("CLICK");
    }
    if (PTT.controlstate === 1) {
      msg.PostMessage("alert", { type: false, msg: "指令執行中，請稍後再試。" });
    }
    else if (serverfull) {
      msg.PostMessage("alert", { type: false, msg: "系統過載, 請稍後再來..." });
    }
    else {
      PTT.lock();
      callback(...args);
    }
  }
  //end
  setTimeout(PTTLockCheck, 5000, GetPostPush, '#1VpKTOfx (Test)', 0, true);
})()
