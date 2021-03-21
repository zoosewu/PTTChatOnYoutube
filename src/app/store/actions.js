import { mutations } from './mutations.js';
import { types } from './mutations_type.js';

export const actions = {
  actionIncrease: ({ commit }) => { console.log('actionIncrease'); commit(types.INCREASE); },
  actionDecrease: ({ commit }) => { console.log('actionDecrease'); commit(types.DECREASE); },
  Alert: (context, alertobject) => { context.commit(types.ALERT, alertobject); },
  gotoPost: ({ dispatch, commit, state }, aid) => {
    const result = /#(.+) \((.+)\)/.exec(aid);
    if (!result || result.length <= 2) {
      dispatch('Alert', { type: 0, msg: "文章AID格式錯誤，請重新輸入。" });
    }
    else if (state.PTTState < 1) {
      dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
    }
    else {
      GM_setValue("PostAID", aid);
      dispatch('pageChange', true);
      commit(types.GOTOPOST, aid);
    }
  },
  updateLog: (context, log) => {
    if (!Array.isArray(log)) context.commit(types.UPDATELOG, log);
    else for (let i = 0; i < log.length; i++) context.commit(types.UPDATELOG, log[i]);
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
      dispatch("updateLog", { type: "postAID", data: newpost.AID });
      dispatch("updateLog", [{ type: "postBoard", data: newpost.board },
      { type: "postTitle", data: newpost.title },
      { type: "postDate", data: t.toLocaleDateString() + " " + t.toLocaleTimeString() },
      { type: "postEndline", data: newpost.lastendline }]);
    }
    if (postdata.pushes.length > 0) {
      newpost.pushcount += postdata.pushes.length;
    }
    commit(types.UPDATEPOST, newpost);
    dispatch('updateChat', postdata.pushes);
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
      chat.pttid = currpush.id;
      chat.type = currpush.type;
      // chat.msg = currpush.content;
      let msg = "";
      let m = filterXSS(currpush.content);
      const haveAID = /(.*)(#.{8} \(.+\))(.*)/.exec(m);
      if (haveAID && haveAID.length > 3) {
        m = haveAID[1] + '<u onclick="this.parentNode.gotoPost(`' + haveAID[2] + '`)" style="cursor: pointer;">' + haveAID[2] + "</u>" + haveAID[3];
        console.log(haveAID[1] + '<u onclick="this.parentNode.gotoPost(' + haveAID[2] + ')">' + haveAID[2] + "</u>" + haveAID[3]);
      }
      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(.*)/ig.exec(m);
      let parsetime = 5;
      while (result && m !== "" && parsetime > 0) {
        const prestring = result[1];
        const linkstring = result[2];
        if (prestring !== "") msg = msg + prestring;
        msg = msg + `<a href="` + linkstring + `" target="_blank" rel="noopener noreferrer" class="ptt-chat-msg" ref="link` + (5 - parsetime) + `" onmouseover="this.parentNode.mouseEnter(this.href)" onmouseleave="this.parentNode.mouseLeave(this.href)">` + linkstring + `</a>`;
        m = result[3];
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(.*)/ig.exec(m);
        parsetime--;
      }
      if (m !== "") msg = msg + m;
      chat.msg = msg;
      chat.id = existpush + index;
      chat.uid = state.post.AID + "_" + chat.id;
      chat.gray = !state.disablepushgray;
      if (state.enableblacklist) {
        let list = state.blacklist.split('\n');
        let id = chat.pttid.toLowerCase();
        for (let index = 0; index < list.length; index++) {
          if (id == list[index]) {
            chat.pttid = "隱藏的使用者";
            chat.msg = "";
            chat.type = "→ ";
          }
        }
      }
      chatlist.push(chat);
      if (reportmode) console.log("new Chat", chat, currpush);
    }
    //console.log("chatlist actions", chatlist);
    commit(types.UPDATECHAT, chatlist);
  },
  updateVideoStartDate: ({ dispatch, commit, state }, d) => {
    console.trace("updateVideoStartDate", d);
    dispatch("updateLog", { type: "videoStartTime", data: d.toLocaleDateString() + " " + d.toLocaleTimeString() });
    commit(types.VIDEOSTARTDATE, d);
    dispatch('updateVideoCurrentTime');
  },
  updateVideoPlayedTime: ({ dispatch, commit, state }, time) => {
    // console.log("updateVideoPlayedTime", time);
    commit(types.VIDEOPLAYEDTIME, time);
    dispatch("updateLog", { type: "videoPlayedTime", data: time });
    dispatch('updateVideoCurrentTime');
  },
  updateVideoCurrentTime: ({ dispatch, commit, state }) => {
    const vstart = state.VStartDate;
    const time = state.VPlayedTime;//[H,m,s,isVideoVeforePost]
    let currtime = new Date(vstart.valueOf());
    currtime.setSeconds(vstart.getSeconds() + time);
    if (reportmode) console.log("updateVideoCurrentTime check, currtime.valueOf() < state.post.date.valueOf()", currtime.valueOf() < state.post.date.valueOf(), currtime.valueOf(), state.post.date.valueOf());
    //console.log("updateVideoCurrentTime vstart, time, currtime", vstart, time, currtime);
    dispatch("updateLog", { type: "videoCurrentTime", data: currtime.toLocaleDateString() + " " + currtime.toLocaleTimeString() });
    commit(types.VIDEOCURRENTRIME, currtime);
  },
  pageChange: ({ commit }, Change) => { commit(types.PAGECHANGE, Change); },
  gotoChat: ({ commit }, gtChat) => { commit(types.GOTOCHAT, gtChat); },
  PTTState: ({ commit }, pttstate) => { commit(types.PTTSTATE, pttstate); },
  isStream: ({ commit }, isStream) => { commit(types.ISSTREAM, isStream); },
  previewImage: ({ commit }, src) => { commit(types.PREVIEWIMG, src); },
  reInstancePTT: ({ commit }) => commit(types.REINSTANCEPTT),

  //checkbox
  setEnableSetNewPush: ({ commit }, value) => { /*console.log("EnableSetNewPush action",value);*/commit(types.ENABLESETNEWPUSH, value); },
  setDisablePushGray: ({ commit }, value) => { commit(types.DISABLEPUSHGRAY, value); },
  setDeleteOtherConnect: ({ commit }, value) => { commit(types.DELETEOTHERCONNECT, value); },
  setEnableBlacklist: ({ commit }, value) => { commit(types.ENABLEBLACKLIST, value); },
  //input value
  setPluginHeight: (context, value) => { context.commit(types.PLUGINHEIGHT, value); },
  setFontsize: ({ commit }, value) => { commit(types.CHATFONTSIZE, value); },
  setChatSpace: ({ commit }, value) => { commit(types.CHATSPACE, value); },
  setPushInterval: ({ commit }, value) => { commit(types.PUSHINTERVAL, value); },
  setPluginWidth: ({ commit }, value) => { commit(types.PLUGINWIDTH, value); },
  setBlacklist: ({ commit }, value) => { commit(types.BLACKLIST, value); },
  //dropdown
  setTheme: ({ commit }, value) => { commit(types.THEME, value); },
  setThemeColorBG: ({ commit }, value) => { commit(types.THEMECOLORBG, value); },
  setThemeColorBorder: ({ commit }, value) => { commit(types.THEMECOLORBORDER, value); },
}