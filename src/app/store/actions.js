import mutations from './mutations.js';
import types from './mutations_type.js';

export const actions = {
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