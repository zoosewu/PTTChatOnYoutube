import { types } from './mutations_type'

// state
export const state = {
  count: 0,
  alert: [],
  aid: GM_getValue('PostAID', ''),
  post: {
    AID: '',
    board: '',
    title: '',
    date: (() => {
      const t = new Date()
      t.setHours(0)
      t.setMinutes(0)
      t.setSeconds(0)
      return t
    })(),
    lastendline: 0,
    lastcommenttime: new Date(),
    commentcount: 0,
    nowcomment: 0,
    gettedpost: false
  },
  chatlist: [],
  log: [],
  firstChatTime: {},
  lastChatTime: {},
  VStartDate: (() => {
    const t = new Date()
    t.setHours(0)
    t.setMinutes(0)
    t.setSeconds(0)
    return t
  })(),
  VPlayedTime: 0,
  VCurrentTime: new Date(),
  pageChange: false,
  gotoChat: false,
  pttState: 0,
  isStream: true,
  previewImg: '',
  InstancePTTID: 1,
  // checkbox
  enablesetnewcomment: GM_getValue(types.ENABLESETNEWCOMMENT, false),
  disablecommentgray: GM_getValue(types.DISABLECOMMENTGRAY, false),
  deleteotherconnect: GM_getValue(types.DELETEOTHERCONNECT, false),
  enableblacklist: GM_getValue(types.ENABLEBLACKLIST, false),
  // input value
  pluginHeight: GM_getValue(types.PLUGINHEIGHT, -1),
  commentInterval: GM_getValue(types.COMMENTINTERVAL, -1),
  chatFontsize: GM_getValue(types.CHATFONTSIZE, -1),
  chatSpace: GM_getValue(types.CHATSPACE, -1),
  pluginWidth: GM_getValue(types.PLUGINWIDTH, -1),
  pluginPortraitHeight: GM_getValue(types.PLUGINPORTRAITHEIGHT, -1),
  blacklist: GM_getValue(types.BLACKLIST, null),
  // dropdown
  theme: GM_getValue(types.THEME, -1),
  themeColorBG: GM_getValue(types.THEMECOLORBG, -1),
  themeColorBorder: GM_getValue(types.THEMECOLORBORDER, -1),
  titleList: GM_getValue(types.TITLELIST, [
    '直播單 (C_Chat)',
    '彩虹直播 (Vtuber)'
  ])
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
    state.alert.push(alert)
  },
  [types.CLEARALERT] (state) {
    state.alert = []
  },
  [types.GOTOPOST] (state, aid) {
    state.aid = aid
  },
  [types.UPDATEBOARD] (state, board) {
    state.post.board = board
  },
  [types.UPDATEPOST] (state, post) {
    if (reportMode) console.log('UPDATEPOST', post)
    state.post = post
  },
  [types.UPDATECHAT] (state, chatlist) {
    if (reportMode) console.log('UPDATECHAT', chatlist)
    state.chatlist = chatlist
  },
  [types.CLEARCHAT] (state) {
    state.chatlist = []
  },
  [types.UPDATELOG] (state, log) {
    console.log('UPDATELOG', log)
    if (!Array.isArray(log)) state.log.push(log)
    else state.log = state.log.concat(log)
  },
  [types.REMOVELOG] (state, type) {
    for (let i = 0; i < state.log.length; i++) {
      if (state.log[i].type === type) {
        state.log.splice(i, 1)
        return
      }
    }
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
    state.pttState = pttstate
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
  [types.ENABLESETNEWCOMMENT] (state, value) {
    GM_setValue(types.ENABLESETNEWCOMMENT, value)
    state.enablesetnewcomment = value
  },
  [types.DISABLECOMMENTGRAY] (state, disable) {
    GM_setValue(types.DISABLECOMMENTGRAY, disable)
    state.disablecommentgray = disable
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
  [types.COMMENTINTERVAL] (state, interval) {
    GM_setValue(types.COMMENTINTERVAL, interval)
    state.commentInterval = interval
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
  [types.TITLELIST] (state, list) {
    GM_setValue(types.TITLELIST, list)
    state.titleList = list
  }
}
