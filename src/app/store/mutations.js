import { types } from './mutations_type.js'
import { ReportMode } from '../../logsetting.js'

// state
export const state = {
  count: 0,
  alert: { type: 0, msg: '' },
  aid: '',
  post: { AID: '', board: '', title: '', date: (() => { const t = new Date(); t.setHours(0); t.setMinutes(0); t.setSeconds(0); return t })(), lastendline: 0, lastpushtime: new Date(), pushcount: 0, nowpush: 0, gettedpost: false },
  chatlist: [],
  log: {},
  firstChatTime: {},
  lastChatTime: {},
  VStartDate: (() => { const t = new Date(); t.setHours(0); t.setMinutes(0); t.setSeconds(0); return t })(),
  VPlayedTime: 0,
  VCurrentTime: new Date(),
  pageChange: false,
  gotoChat: false,
  PTTState: 0,
  isStream: true,
  previewImg: '',
  InstancePTTID: 1,
  // checkbox
  enablesetnewpush: GM_getValue(types.ENABLESETNEWPUSH, false),
  disablepushgray: GM_getValue(types.DISABLEPUSHGRAY, false),
  deleteotherconnect: GM_getValue(types.DELETEOTHERCONNECT, false),
  enableblacklist: GM_getValue(types.ENABLEBLACKLIST, false),
  // input value
  pluginHeight: GM_getValue(types.PLUGINHEIGHT, -1),
  pushInterval: GM_getValue(types.PUSHINTERVAL, -1),
  chatFontsize: GM_getValue(types.CHATFONTSIZE, -1),
  chatSpace: GM_getValue(types.CHATSPACE, -1),
  pluginWidth: GM_getValue(types.PLUGINWIDTH, -1),
  pluginPortraitHeight: GM_getValue(types.PLUGINPORTRAITHEIGHT, -1),
  blacklist: GM_getValue(types.BLACKLIST, null),
  // dropdown
  theme: GM_getValue(types.THEME, -1),
  themeColorBG: GM_getValue(types.THEMECOLORBG, -1),
  themeColorBorder: GM_getValue(types.THEMECOLORBORDER, -1),
  searchTitle: GM_getValue(types.SEARCHTITLE, null)
}
// mutations
export const mutations = {
  // action 發出 commit 會對應到 mutation 使用的是 Object key 方式
  [types.INCREASE] (state) {
    // 在 mutation 改變 state（只有 mutation 可以改變！）
    state.count += 1
  },
  [types.DECREASE] (state) {
    state.count -= 1
  },
  [types.ALERT] (state, alert) {
    state.alert = alert
  },
  [types.GOTOPOST] (state, aid) {
    state.aid = aid
  },
  [types.UPDATEPOST] (state, post) {
    if (ReportMode) console.log('UPDATEPOST', post)
    state.post = post
  },
  [types.UPDATECHAT] (state, chatlist) {
    if (ReportMode) console.log('UPDATECHAT', chatlist)
    state.chatlist = chatlist
  },
  [types.UPDATELOG] (state, log) {
    if (ReportMode) console.log('UPDATELOG', log)
    state.log = log
  },
  [types.VIDEOSTARTDATE] (state, videostartdate) {
    console.trace('VIDEOSTARTDATE mutations', videostartdate)
    state.VStartDate = videostartdate
  },
  [types.VIDEOPLAYEDTIME] (state, videoplayedtime) {
    state.VPlayedTime = videoplayedtime
  },
  [types.VIDEOCURRENTRIME] (state, vcurrentime) {
    state.VCurrentTime = vcurrentime
  },
  [types.PAGECHANGE] (state, pageChange) {
    state.pageChange = pageChange
  },
  [types.GOTOCHAT] (state, gotoChat) {
    state.gotoChat = gotoChat
  },
  [types.PTTSTATE] (state, pttstate) {
    state.PTTState = pttstate
  },
  [types.ISSTREAM] (state, isStream) {
    state.isStream = isStream
  },
  [types.PREVIEWIMG] (state, src) {
    state.previewImg = src
  },
  [types.REINSTANCEPTT] (state) {
    state.InstancePTTID++
  },

  // checkbox
  [types.DELETEOTHERCONNECT] (state, deleteotherconnect) {
    GM_setValue(types.DELETEOTHERCONNECT, deleteotherconnect)
    state.deleteotherconnect = deleteotherconnect
  },
  [types.ENABLESETNEWPUSH] (state, value) {
    GM_setValue(types.ENABLESETNEWPUSH, value)
    state.enablesetnewpush = value
  },
  [types.DISABLEPUSHGRAY] (state, disable) {
    GM_setValue(types.DISABLEPUSHGRAY, disable)
    state.disablepushgray = disable
  },
  [types.ENABLEBLACKLIST] (state, enable) {
    GM_setValue(types.ENABLEBLACKLIST, enable)
    state.enableblacklist = enable
  },
  // input value
  [types.PLUGINHEIGHT] (state, height) {
    GM_setValue(types.PLUGINHEIGHT, height)
    state.pluginHeight = height
  },
  [types.PUSHINTERVAL] (state, interval) {
    GM_setValue(types.PUSHINTERVAL, interval)
    state.pushInterval = interval
  },
  [types.CHATFONTSIZE] (state, size) {
    GM_setValue(types.CHATFONTSIZE, size)
    state.chatFontsize = size
  },
  [types.CHATSPACE] (state, space) {
    GM_setValue(types.CHATSPACE, space)
    state.chatSpace = space
  },
  [types.PLUGINWIDTH] (state, width) {
    GM_setValue(types.PLUGINWIDTH, width)
    state.pluginWidth = width
  },
  [types.PLUGINPORTRAITHEIGHT] (state, portraitHeight) {
    GM_setValue(types.PLUGINPORTRAITHEIGHT, portraitHeight)
    state.pluginPortraitHeight = portraitHeight
  },
  [types.BLACKLIST] (state, list) {
    const l = list.toLowerCase()
    GM_setValue(types.BLACKLIST, l)
    state.blacklist = l
  },
  // dropdown
  [types.THEME] (state, theme) {
    GM_setValue(types.THEME, theme)
    state.theme = theme
  },
  [types.THEMECOLORBG] (state, themecolorbg) {
    GM_setValue(types.THEMECOLORBG, themecolorbg)
    state.themeColorBG = themecolorbg
  },
  [types.THEMECOLORBORDER] (state, themecolorborder) {
    GM_setValue(types.THEMECOLORBORDER, themecolorborder)
    state.themeColorBorder = themecolorborder
  },
  [types.SEARCHTITLE] (state, list) {
    GM_setValue(types.SEARCHTITLE, list)
    state.searchTitle = list
  }
}
