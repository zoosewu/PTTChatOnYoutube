
export function InitPTT(messageposter) {
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
      msg.PostMessage("alert", { type: 0, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
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
    msg.PostMessage("alert", { type: 2, msg: "文章讀取完成。" });
    msg.PostMessage("newPush", PTTPost);
    if (showalllog) console.log(PTTPost);
  }
  function GetPushByLine(pAID, bname, startline, forceget = false) {
    if (PTT.pagestate > 0 || forceget) {
      startline = startline || 3;
      msg.PostMessage("alert", { type: 2, msg: "文章讀取中。" });
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
      else insertText("q\n");
      PTT.commands.add(/.*/, "", GetPushTask);
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
  }), 500);

  msg["login"] = data => {
    const i = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8);
    const p = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8);
    //console.log(data );
    //console.log([i, p],cryptkey);
    PTTLockCheck(Login, i, p);
  };
  msg["getPushByLine"] = data => { PTTLockCheck(GetPushByLine, data.AID, data.board, data.startline); };
  msg["getPushByRecent"] = data => { PTTLockCheck(GetRecentLine, data.AID, data.board, data.line); };
}