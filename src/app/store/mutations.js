import types from './mutations_type.js';

// state
export const state = {
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
    gettedpost: false,
  },
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
  enablesetnewpush: false,
  disablepushgray: false,
}
// mutations
export const mutations = {
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
  [types.PTTSTATE](state, pttstate) {
    //console.log("PTTState mutations", pttstate);
    state.PTTState = pttstate;
  },
  [types.ENABLESETNEWPUSH](state, isenable) {
    //console.log("PTTState mutations", pttstate);
    GM_setValue('enablesetnewpush', isenable);
    state.enablesetnewpush = isenable;
  },
  [types.DISABLEPUSHGRAY](state, disable) {
    //console.log("PTTState mutations", pttstate);
    GM_setValue('disablepushgray', disable);
    state.disablepushgray = disable;
  },
  
}