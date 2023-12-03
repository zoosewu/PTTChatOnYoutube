import { types } from './mutations_type'

export const state = {
  count: 0,
  alert: [],
  anySearch: '',
  setNewComment: '',
  post: {
    key: '',
    board: '',
    title: '',
    date: (() => {
      const t = new Date()
      t.setHours(0)
      t.setMinutes(0)
      t.setSeconds(0)
      return t
    })(),
    lastEndLine: 0,
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
  customPluginSetting: false,
  siteName: '',
  // checkbox
  enablesetnewcomment: GM_getValue(types.ENABLESETNEWCOMMENT, false),
  disableCommentGray: GM_getValue(types.DISABLECOMMENTGRAY, false),
  deleteotherconnect: GM_getValue(types.DELETEOTHERCONNECT, false),
  anySearchHint: GM_getValue(types.ANYSEARCHHINT, false),
  // input value
  pluginHeight: GM_getValue(types.PLUGINHEIGHT, -1),
  commentInterval: GM_getValue(types.COMMENTINTERVAL, -1),
  chatFontsize: GM_getValue(types.CHATFONTSIZE, -1),
  chatSpace: GM_getValue(types.CHATSPACE, -1),
  pluginWidth: GM_getValue(types.PLUGINWIDTH, -1),
  pluginPortraitHeight: GM_getValue(types.PLUGINPORTRAITHEIGHT, -1),

  // inputfield value
  enableBlacklist: GM_getValue(types.ENABLEBLACKLIST, false),
  blacklist: GM_getValue(types.BLACKLIST, ''),
  enableCommentBlacklist: GM_getValue(types.ENABLECOMMENTBLACKLIST, false),
  commentBlacklist: GM_getValue(types.COMMENTBLACKLIST, ''),

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
  [types.ADDANYSEARCH] (state, search) {
    state.anySearch = search
  },
  [types.SETNEWCOMMENT] (state, text) {
    state.setNewComment = text
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
  [types.SETPOSTLASTENDLINE] (state, lastEndLine) {
    state.post.lastEndLine = lastEndLine
  },
  [types.SETPOSTCOMMENTCOUNT] (state, commentCount) {
    state.post.commentCount = commentCount
  },
  [types.UPDATELOG] (state, log) {
    if (showAllLog) console.log('UPDATELOG', log)
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
  [types.CUSTOMPLUGINSETTING] (state, value) {
    state.customPluginSetting = value
  },
  [types.SITENAME] (state, value) {
    state.siteName = value
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
    state.disableCommentGray = disable
  },
  [types.ANYSEARCHHINT] (state, search) {
    GM_setValue(types.ANYSEARCHHINT, search)
    state.anySearchHint = search
  },

  // input value
  [types.PLUGINHEIGHT] (state, height) {
    const ValueName = types.PLUGINHEIGHT + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, height)
    if (showAllLog)console.log('PLUGINHEIGHT', ValueName, state.customPluginSetting, state.siteName)
    state.pluginHeight = height
  },
  [types.COMMENTINTERVAL] (state, interval) {
    const ValueName = types.COMMENTINTERVAL + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, interval)
    state.commentInterval = interval
  },
  [types.CHATFONTSIZE] (state, size) {
    const ValueName = types.CHATFONTSIZE + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, size)
    state.chatFontsize = size
  },
  [types.CHATSPACE] (state, space) {
    const ValueName = types.CHATSPACE + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, space)
    state.chatSpace = space
  },
  [types.PLUGINWIDTH] (state, width) {
    const ValueName = types.PLUGINWIDTH + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, width)
    state.pluginWidth = width
  },
  [types.PLUGINPORTRAITHEIGHT] (state, portraitHeight) {
    const ValueName = types.PLUGINPORTRAITHEIGHT + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, portraitHeight)
    state.pluginPortraitHeight = portraitHeight
  },

  // inputfield value
  [types.ENABLEBLACKLIST] (state, isEnable) {
    GM_setValue(types.ENABLEBLACKLIST, isEnable)
    state.enableBlacklist = isEnable
  },
  [types.BLACKLIST] (state, list) {
    const l = list.toLowerCase()
    GM_setValue(types.BLACKLIST, l)
    state.blacklist = l
  },
  [types.ENABLECOMMENTBLACKLIST] (state, isEnable) {
    GM_setValue(types.ENABLECOMMENTBLACKLIST, isEnable)
    state.enableCommentBlacklist = isEnable
  },
  [types.COMMENTBLACKLIST] (state, list) {
    const l = list.toLowerCase()
    GM_setValue(types.COMMENTBLACKLIST, l)
    state.commentBlacklist = l
  },

  // dropdown
  [types.THEME] (state, theme) {
    const ValueName = types.PLUGINPORTRAITHEIGHT + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, theme)
    state.theme = theme
  },
  [types.THEMECOLORBG] (state, themecolorbg) {
    const ValueName = types.THEMECOLORBG + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, themecolorbg)
    state.themeColorBG = themecolorbg
  },
  [types.THEMECOLORBORDER] (state, themecolorborder) {
    const ValueName = types.THEMECOLORBORDER + (state.customPluginSetting ? '-' + state.siteName : '')
    GM_setValue(ValueName, themecolorborder)
    state.themeColorBorder = themecolorborder
  },
  [types.TITLELIST] (state, list) {
    GM_setValue(types.TITLELIST, list)
    state.titleList = list
  }
}
