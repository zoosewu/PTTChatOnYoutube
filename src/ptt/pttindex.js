
export function InitPTT(messageposter) {
  const SkipCommand = true;
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
    screenHaveText: function (regText) {
      let result = null;
      let reg = regText;
      if (typeof regText.exec !== "function")
        reg = new RegExp(regText, 'i');
      if (this.screenstate === 0) {
        const sElement = $("[data-type='bbsline']", this.wind.document);
        for (let i = 0; i < sElement.length; i++) {
          const txt = sElement[i].textContent;
          if (result == null) result = new RegExp(reg, 'i').exec(txt);
          this.screen.push(txt);
          // if (reportmode) console.log("==screenHaveText", reg, result, txt);
        }
        this.screenstate = 1;
        return result;
      }
      else {
        for (let i = 0; i < this.screen.length; i++) {
          const txt = this.screen[i];
          result = new RegExp(reg, 'i').exec(txt);
          // if (reportmode) console.log("==screenHaveText", reg, result, txt);
          if (result != null) {
            return result;
          }
        }
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
      {
        reg: /您想刪除其他重複登入的連線嗎/, input: '', callback: () => {
          const inserttxt = PTT.DeleteOtherConnect ? 'y\n' : 'n\n';
          insertText(inserttxt);
          return SkipCommand;
        }
      },
      { reg: /您要刪除以上錯誤嘗試的記錄嗎/, input: 'n\n' },
      {
        reg: /按任意鍵繼續/, input: '', callback: () => {
          result = PTT.screenHaveText(/(找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了|這一篇文章值)/)
          if (result)
            return !SkipCommand;
          else {
            insertText('\n');
            return SkipCommand;
          }
        }
      },
      { reg: /動畫播放中\.\.\./, input: 'q' },
      {
        reg: /系統過載, 請稍後再來\.\.\./, input: '', callback: () => {
          serverfull = true;
          if (PTT.controlstate === 1) {
            PTT.unlock();
            msg.PostMessage("alert", { type: 0, msg: "系統過載, 請稍後再來..." });
            return SkipCommand;
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
      { reg: /鴻雁往返  \(R\/y\)回信 \(x\)站內轉寄 \(d\/D\)刪信 \(\^P\)寄發新信/, input: 'q' },
      { reg: /【精華文章】/, input: 'q' },
      { reg: /【看板列表】/, input: 'q' },
      { reg: /【分類看板】/, input: 'q' },
      { reg: /【電子郵件】/, input: 'e' },
      { reg: /【聊天說話】/, input: 'e' },
      { reg: /【個人設定】/, input: 'e' },
      { reg: /【工具程式】/, input: 'e' },
      { reg: /【網路遊樂場】/, input: 'e' },
      { reg: /您確定要離開【 批踢踢實業坊 】嗎\(Y\/N\)？/, input: 'n\n' },

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
    haveNormalTitle: false,
    enteredAID: false,
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
          const args = cmd.args ? cmd.args : [];
          return cmd.callback(...args);
        }
        else
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
        const args = cmd.args ? cmd.args : [];
        cmd.callback(...args);
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
    const res = { pass: false, callback: gotoBoard }
    let reg = "";
    if (PTT.pagestate === 4 || PTT.pagestate === 3) {
      res.pass = true;
      return res;
    }
    else if (PTT.pagestate === 1) return res;
    else if (PTT.pagestate === 2) reg = "看板《" + PTTPost.board + "》";
    const currect = PTT.screenHaveText(reg);
    if (currect) res.pass = true;
    return res;
  }

  function gotoPost() {
    if (PTTPost.enteredAID) {
      insertText("r");
      PTTPost.enteredAID = false;
    }
    else {
      insertText("NPP#" + PTTPost.AID + "\n");
      PTTPost.enteredAID = true;
    }
  }
  function PostCheck() {
    const res = { pass: true, callback: gotoPost }
    if (PTT.pagestate === 2) {
      if (!PTTPost.enteredAID)
        res.pass = false;
      else {
        if (PTT.screenHaveText(/找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了/)) {
          msg.PostMessage("alert", { type: 0, msg: "文章AID錯誤，文章已消失或是你找錯看板了。" });
          if (reportmode) console.log("文章AID錯誤，文章已消失或是你找錯看板了", PTT.pagestate, PTT, PTTPost);
          PTT.unlock();
          return;
        }
        else {
          res.pass = false;
        }
      }
    }
    else if (PTT.pagestate === 1) console.log("==PostCheck error, PTT.pagestate == 1.");
    return res;
  }

  function backtoboard() { insertText("qP"); }
  function PotsTitleCheck() {
    const res = { pass: true, callback: backtoboard }
    if (PTT.pagestate === 3) {
      const reg = / 標題 +(.+)/;
      const posttitle = PTT.screenHaveText(reg);
      let title = "";
      if (posttitle) {
        PTTPost.haveNormalTitle = true;
        if (reportmode) console.log("==set haveNormalTitle true", posttitle);
        title = posttitle[1].replace(/\s+$/g, ""); //抓一般標題
      }
      else for (let i = 0; i < 5 && i < PTT.screen.length; i++) title += PTT.screen[i]; //抓前幾行
      if (PTTPost.samepost) {
        if (title === PTTPost.title) { }
        else { res.pass = false; }
      }
      else {
        PTTPost.title = title;
        let result = PTT.screenHaveText(/時間  (\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/);
        if (result) PTTPost.posttime = new Date(result[1]);
        else PTTPost.posttime = new Date(Date.now());
      }
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
      if (startline < 5 && PTTPost.haveNormalTitle) targetline += 1;
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
    const startline = +lineresult[1];
    const endline = +lineresult[2];
    let targetline = PTTPost.endline - startline + 1;
    if (startline < 5 && PTTPost.haveNormalTitle) targetline += 1;
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
        if (reportmode) console.log("GetPush at line", i, content, line);
      }
      else if (reportmode) console.log("GetPush at line fail", i, line);
    }
    if (reportmode) console.log("GetPush startline,", startline, ", endline", PTTPost.endline, ", targetline", targetline, ", checkedline", checkedline, ", haveNormalTitle", PTTPost.haveNormalTitle);
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
        if (PTT.pagestate === 4 || PTT.pagestate === 3) insertText("qP");//insertText(PTTPost.endline + ".\n");
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
          haveNormalTitle: false,
          enteredAID: false,
        }
        if (reportmode) console.log("Get new post's push.", bname, PTTPost.board, pAID, PTTPost.AID);
      }
      if (PTT.pagestate === 1) {
        if (PTT.screenHaveText(/●\(M\)ail         【 私人信件區 】/)) insertText("c");//隨意切畫面
        else insertText("m");//隨意切畫面
      }
      else if (PTT.pagestate === 2) insertText("P");//切下一頁
      else {//PTT.pagestate === 3 || 4
        if (!PTTPost.samepost) {
          insertText("qP");//在標題或是其他文章就退出
        }
        else insertText("qr");//相同文章直接進入標題
      }
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
  let TryLogin = 0;
  function Login(id, pw, DeleteOtherConnect) {
    msg.PostMessage("alert", { type: 2, msg: "登入中" });
    if (!PTT.login) {
      PTT.DeleteOtherConnect = DeleteOtherConnect;
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
        if (TryLogin <= 0) {//防止過度嘗試
          msg.PostMessage("alert", { type: 0, msg: "未知原因登入失敗。" });
          PTT.unlock();
          return;
        }
        else TryLogin--;
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
    TryLogin = 2;
    //console.log(data );
    //console.log([i, p],cryptkey);
    PTTLockCheck(Login, i, p, data.DeleteOtherConnect);
  };
  msg["getPushByLine"] = data => { if (reportmode) console.log("getPushByLine", data); PTTLockCheck(GetPush, data.AID, data.board, data.startline, GetPushTask); };
  msg["getPushByRecent"] = data => { if (reportmode) console.log("getPushByRecent", data); PTTLockCheck(GetPush, data.AID, data.board, data.recent, GetRecentLineTask); };
  msg["setNewPush"] = data => { if (reportmode) console.log("setNewPush", data); PTTLockCheck(SetNewPushTask, data); };
}