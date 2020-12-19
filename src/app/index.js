export function InitApp(chatcon, whitetheme, isstream) {
  /*setTimeout(repeatlog, 1000);
  function repeatlog() {
    console.log("PTTChat_Chat_Main", PTTChat_Chat_Main);
    console.log("player", player);
    setTimeout(repeatlog, 1000);
  }*/
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
  //log
  let logs = {};

  //scroll
  let AotoScroller;
  let PTTChat_Chat_Main;
  let PTTChat_Chat;
  let PTTChat_Log;
  let scriptscrolltime = Date.now();
  let scrolltargetpos = 0;
  let scrolllastpos = 0;
  let scrolloffset = 0;

  InitChatApp(chatcon);
  function InitChatApp(cn) {
    /*-----------------------------------preInitApp-----------------------------------*/
    //init property
    player = document.getElementsByTagName("video")[0];

    const PTTAppCollapse = $(`<pttdiv id="PTTChat" class="pttchat rounded-right rounded-bottom w-100 collapse" style="z-index: 301; position: absolute;"></pttdiv>`);
    const PTTApp = $(`<div id="PTTChat-app" class=" pttbg border rounded w-100 d-flex flex-column"></div>`);
    const PTTChatnavbar = $(`<ul id="PTTChat-navbar" class="nav nav-tabs justify-content-center" role="tablist"><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-Chat" data-toggle="tab" href="#PTTChat-contents-Chat" role="tab" aria-controls="PTTChat-contents-Chat" aria-selected="false">聊天室</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent active" id="nav-item-Connect" data-toggle="tab" href="#PTTChat-contents-Connect" role="tab" aria-controls="PTTChat-contents-Connect" aria-selected="true">連線設定</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-other" data-toggle="tab" href="#PTTChat-contents-other" role="tab" aria-controls="PTTChat-contents-other" aria-selected="false">說明</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-PTT" data-toggle="tab" href="#PTTChat-contents-PTT" role="tab" aria-controls="PTTChat-contents-PTT" aria-selected="false">PTT畫面</a></li><li class="nav-item"><a class="nav-link ptttext bg-transparent" id="nav-item-log" data-toggle="tab" href="#PTTChat-contents-log" role="tab" aria-controls="PTTChat-contents-log" aria-selected="false">log</a></li><li class="nav-item"><button class="nav-link ptttext bg-transparent d-none" id="nav-item-TimeSet" type="button" data-toggle="collapse" data-target="#PTTChat-Time" aria-controls="PTTChat-Time" aria-expanded="false">時間</button></li></ul>
    `);
    const PTTChatContents = $(`<div id="PTTChat-contents" class="tab-content container d-flex flex-column ptttext"><!-------- 聊天室 --------><div class="tab-pane mh-100 fade" id="PTTChat-contents-Chat" role="tabpanel" aria-labelledby="nav-item-Chat"><!-------- 開台時間 --------><div id="PTTChat-Time" class="ptttext pttbg p-2 position-absolute w-75 d-none" style="z-index:400"><div id="PTTChat-Time-Setting"><form class="form-inline d-flex justify-content-between w-100"><label for="dis" class="mr-1">實況重播時間微調:</label> <button id="minus-time" class="btn ptttext border btn-outline-secondary" type="button">-1分鐘</button> <button id="add-time" class="btn ptttext border btn-outline-secondary" type="button">+1分鐘</button></form></div></div><!-------- 聊天室 --------><div class="flex-grow-1 overflow-auto mh-100 row" id="PTTChat-contents-Chat-main" style="overscroll-behavior:contain"><ul id="PTTChat-contents-Chat-pushes" class="col mb-0"></ul><div id="PTTChat-contents-Chat-btn" class="position-absolute d-none" style="z-index:400;bottom:5%;left:50%;-ms-transform:translateX(-50%);transform:translateX(-50%)"><button id="AutoScroll" class="btn btn-primary" type="button">自動滾動</button></div></div></div><!-------- 連線設定 --------><div class="tab-pane h-100 row fade show active" id="PTTChat-contents-Connect" role="tabpanel" aria-labelledby="nav-item-Connect"><div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0"></div><div id="PTTChat-contents-Connect-alert" class="position-relative container" style="top:-100%;z-index:400"></div></div><!-------- 其他 --------><div class="tab-pane h-100 card bg-transparent overflow-auto row fade" id="PTTChat-contents-other" role="tabpanel" aria-labelledby="nav-item-other"><div id="PTTChat-contents-other-main" class="card-body"></div></div><!-------- PTT畫面 --------><div class="tab-pane h-100 row fade" id="PTTChat-contents-PTT" role="tabpanel" aria-labelledby="nav-item-PTT"><div id="PTTChat-contents-PTT-main" class="h-100 d-flex justify-content-center px-0"></div></div><!-------- Log --------><div class="tab-pane mh-100 fade" id="PTTChat-contents-log" role="tabpanel" aria-labelledby="nav-item-log" style="overscroll-behavior:contain"><div class="flex-grow-1 overflow-auto mh-100 row" id="PTTChat-contents-log-main" style="overscroll-behavior:contain"><!--<ul id="PTTChat-contents-log-table" class="col mb-0"> </ul>--></div></div></div>
    `);
    const MainBtn = $(`<a id="PTTMainBtn" class="btn btn-lg border" type="button" data-toggle="collapse" data-target="#PTTChat" aria-expanded="false" aria-controls="PTTChat">P</a>`)
    cn.append(PTTAppCollapse);
    cn.append(MainBtn);

    PTTAppCollapse.append(PTTApp);
    MainBtn.css({ "z-index": "450", "position": "absolute" });

    if (defaultopen) {
      $(`#PTTMainBtn`)[0].click();
    }
    PTTAppCollapse.on("remove", function () {
      alert("PTTApp was removed");
    })
    PTTApp.append(PTTChatnavbar);
    PTTApp.append(PTTChatContents);

    //180 to 600
    //let PTTAppHeight = defaultChatApp[0].clientHeight * 0.6;
    ///
    let PTTAppHeight = 450;
    PTTChatContents.css({ "height": PTTAppHeight + "px" });
    //player.addEventListener('timeupdate', PlayerUpdate);








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
      scrolllastpos = scrollnowpos;
      if (reportmode) console.log(scrolltype + ", (targetpos, lastpos, nowpos): (" + scrolltargetpos + ", " + scrolllastpos + ", " + scrollnowpos + "), scroll time step:" + t + " ms.");

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
    const PTTChat_ConnectContent = $(`<!-------- 連線 --------><!-- stream time input field--><div id="PTTConnect-Time-Setting" class="form-row mb-2 d-none"><div class="form-group col-7"><label for="appt-time">實況重播開台時間:</label> <input id="stream-time" type="time" name="stream-time"></div><div class="form-check col-4 pl-4"><input type="checkbox" class="form-check-input" id="streambeforepost"> <label class="form-check-label ml-2" for="streambeforepost">發文前已開台</label></div></div><!-- login input field--><div class="form-row mb-2"><div class="col-5"><label for="PTTid">PTT ID</label> <input id="PTTid" type="text" class="form-control" placeholder="PTT ID" autocomplete="off"></div><div class="col-5"><label for="PTTpw">PTT密碼</label> <input id="PTTpw" type="password" class="form-control" placeholder="PTT密碼" autocomplete="off"></div><div class="col-2"><label for="PTTlogin" class="col-2">　</label> <button id="PTTlogin" type="button" class="btn ptttext border btn-outline-secondary">登入</button></div></div><!-- Post AID input field --><div class="my-3 form-row"><label for="post0" class="col-3 col-form-label">輸入文章AID</label> <input id="post0" class="form-control col mr-3" type="text" placeholder="#1VobIvqC (C_Chat)" autocomplete="off"> <button id="post0btn" class="btn ptttext border btn-outline-secondary" type="button">讀取推文</button></div><!-- test push button --> <button id="fakebtn" class="btn ptttext border btn-outline-secondary m-2 d-none" type="button">讀取測試用假推文</button><!-- New version button --> <a id="updatebtn" class="btn ptttext border btn-outline-secondary m-2 d-none" href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt" target="_blank" rel="noopener noreferrer" role="button">檢測到新版本</a>
    `);

    const fakedata = '{"board":"Test","AID":"1VpKTOfx","title":"","posttime":"2020-12-06T21:04:22.000Z","pushes":[{"type":"→ ","id":"ZooseWu","content":"推文1","date":"2020-12-06T21:04:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文2","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文3","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文5","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文678","date":"2020-12-06T21:05:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文100","date":"2020-12-06T21:06:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文101","date":"2020-12-06T21:06:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"推文102Y","date":"2020-12-06T21:10:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"123","date":"2020-12-06T21:11:00.000Z"},{"type":"推 ","id":"hu7592","content":"☂","date":"2020-12-06T22:24:00.000Z"},{"type":"→ ","id":"ss15669659","content":"☂","date":"2020-12-06T23:56:00.000Z"},{"type":"→ ","id":"ZooseWu","content":"hey","date":"2020-12-07T00:31:00.000Z"}],"startline":"127","endline":"149","percent":"100"}';
    const fakedata1push = '{"board":"Test","AID":"1VpKTOfx","title":"","posttime":"2020-12-06T21:04:22.000Z","pushes":[{"type":"→ ","id":"ZooseWu","content":"hey","date":"2020-12-07T00:31:00.000Z"}],"startline":"127","endline":"149","percent":"100"}';

    PTTChat_Connect.append(PTTChat_ConnectContent);

    const loginbtn = $(`#PTTlogin`, PTTChat_Connect);
    const fakebtn = $(`#fakebtn`, PTTChat_Connect);
    const pptid = $(`#PTTid`, PTTChat_Connect);
    const pttpw = $(`#PTTpw`, PTTChat_Connect);
    const postinput = $(`#post0`, PTTChat_Connect);
    const postbtn = $(`#post0btn`, PTTChat_Connect);
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

    loginbtn[0].addEventListener("click", function () {
      //const i = pptid[0].value;
      //const p = pttpw[0].value;
      const i = CryptoJS.AES.encrypt(pptid[0].value, cryptkey).toString();
      const p = CryptoJS.AES.encrypt(pttpw[0].value, cryptkey).toString();
      //console.log("login", pptid[0].value, pttpw[0].value, cryptkey);
      //console.log("login", i, p);
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

    postbtn[0].addEventListener("click", function () {
      const postAID = postinput[0].value;
      const result = /#(.+) \((.+)\)/.exec(postAID);
      if (!result || result.length <= 2) {
        AlertMsg(false, "文章AID格式錯誤，請重新輸入。");
      }
      else {
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

    postinput[0].addEventListener("keyup", e => {
      if (e.keyCode === 13) {
        e.preventDefault();
        postbtn[0].click();
      }
    });

    fakebtn[0].addEventListener("click", getfakedata);
    function getfakedata(e, f) {
      f = f || fakedata;
      console.log("分析假推文", f);
      const obj = JSON.parse(f, dateReviver);
      ParsePostData(obj);
      if (simulateisstreaming) setTimeout(getfakedata, 5000, null, fakedata1push);///danger
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
        const PTTFrame = $(`<iframe id="PTTframe" src="//term.ptt.cc/?url=` + msg.ownorigin + `" class="h-100 flex-grow-1" style="zoom: 1.65; z-index: 351; -moz-transform: scale(1);">你的瀏覽器不支援 iframe</iframe>`);
        $(window).on('beforeunload', function () {
          PTTFrame.remove();
        });
        PTTChat_PTT.append(PTTFrame);
        msg.targetWindow = PTTFrame[0].contentWindow;
        //PTTCHAT_PTTTab.css({ "display": "none" });
      }
      const testtype = `.p-4`;
      console.log(testtype, $(testtype));/////////////////////
    });
    /*--------------------------------------Log--------------------------------------*/
    PTTChat_Log = $(`<table class="table"><tbody class="ptttext"><tr><th scope="row">PTT狀態</th><td id="log-PTTstate">--</td><td colspan="2">更多的詳細資訊請參考PTT畫面</td></tr><th class="text-center bg-secondary text-white" colspan="4">文章資訊</th><tr><th scope="row">文章標題</th><td id="log-posttitle" colspan="3">--</td></tr><tr><th scope="row">文章看板</th><td id="log-postboard">--</td><th scope="row">文章代碼</th><td id="log-postaid">--</td></tr><tr><th scope="row">推文數</th><td id="log-postpushcount">--</td><th scope="row">結尾行數</th><td id="log-postendline">--</td></tr><tr><th scope="row">發文時間</th><td id="log-posttime" colspan="3">--</td></tr><tr><th scope="row">最後推文時間</th><td id="log-postlastpushtime" colspan="3">--</td></tr><th class="text-center bg-secondary text-white" colspan="4">詳細資訊</th><tr><th scope="row">影片類型</th><td id="log-videotype">--</td><th scope="row">自動獲得推文</th><td id="log-isautogetpush">--</td></tr><tr><th scope="row">主題顏色</th><td id="log-themecolor">--</td><th scope="row"></th><td></td></tr><tr><th scope="row">預估開台時間</th><td id="log-streamstarttime" colspan="3">--</td></tr><tr><th scope="row">影片當下時間</th><td id="log-streamnowtime" colspan="3">--</td></tr><th class="text-center bg-secondary text-white" colspan="4">滾動狀態</th><tr><th scope="row">目標推文樓數</th><td id="log-pushindex">--</td><th scope="row">目標捲動高度</th><td id="log-targetscroll">--</td></tr><tr><th scope="row">現在捲動高度</th><td id="log-nowscroll">--</td><th scope="row">上次捲動高度</th><td id="log-lastscroll">--</td></tr><th class="text-center bg-secondary text-white" colspan="4">近期訊息</th><tr><td id="log-alert0" colspan="4">--</td></tr><tr><td id="log-alert1" colspan="4">--</td></tr><tr><td id="log-alert2" colspan="4">--</td></tr><tr><td id="log-alert3" colspan="4">--</td></tr><tr><td id="log-alert4" colspan="4">--</td></tr><tr><td id="log-alert5" colspan="4">--</td></tr><tr><td id="log-alert6" colspan="4">--</td></tr><tr><td id="log-alert7" colspan="4">--</td></tr><tr><td id="log-alert8" colspan="4">--</td></tr><tr><td id="log-alert9" colspan="4">--</td></tr></tbody></table>
    `);
    $(`#PTTChat-contents-log-main`, PTTChatContents).append(PTTChat_Log);

    /*----------------------------------postInitApp----------------------------------*/
    //other init
    if (whitetheme) {
      updatelog("themecolor", "淺色");
      console.log("themecolor", "淺色");
      MainBtn.addClass("btn-outline-dark");
    }
    else {
      updatelog("themecolor", "深色");
      console.log("themecolor", "深色");
      MainBtn.addClass("btn-outline-light");
    }
    StreamCheck(isstream);
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
  /*---------------------------------Other Function---------------------------------*/
  function StreamCheck(stream) {
    if (stream) {
      //console.log("This video is streaming.");
      isstreaming = true;
      updatelog("videotype", "實況");
    }
    else {
      isstreaming = false;
      $(`#PTTConnect-Time-Setting`).removeClass('d-none');
      //console.log("This video is not streaming.");
      updatelog("videotype", "紀錄檔");
    }
    return true;
    //$(`#PTTConnect-Time-Setting`).addClass('d-none');
  }

  /*------------------------------------Update Log------------------------------------*/
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

  function PlayerUpdate(forceScroll) {
    /*console.log((scriptscrolltime + 100) + " + " + Date.now());
    console.log((scriptscrolltime - Date.now()));
    console.log((scriptscrolltime + 100 > Date.now()));*/
    if (isstreaming) {
      const t = Date.now();
      updatelog("streamnowtime", t.toLocaleDateString() + " " + t.toLocaleTimeString());

      if (autogetpush && (Date.now() > lastgetpushtime + 2500)) {
        console.log("PlayerUpdate autogetpush", autogetpush, lastgetpushtime, Date.now());
        autogetpush = false;
        lastgetpushtime = Date.now();
        msg.PostMessage("getpost", { AID: pushdata.AID, board: pushdata.board, startline: pushdata.lastendline });
      }
    }
    else {
      const t = new Date(streamtime.getTime() + player.currentTime * 1000);
      updatelog("streamnowtime", t.toLocaleDateString() + " " + t.toLocaleTimeString());
    }
    ScrollToTime(false);
  }
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
      console.log("go to push: " + pushdata.nowpush);
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
  /*--------------------------------------Parse Post Data--------------------------------------*/
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
    if (PTTpostdata.AID === pushdata.AID && PTTpostdata.board === pushdata.board) { }
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