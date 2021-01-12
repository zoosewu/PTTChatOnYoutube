import types from './mutations_type.js';

// state
export const state = {
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
export const mutations = {
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