export const getters = {
  getCount: state => { return state.count },
  Alert: state => { return state.alert },
  newAID: state => { return state.aid },
  newLog: state => { return state.log },
  post: state => { return state.post },
  newChatList: state => { return state.chatlist },
  videoCurrentTime: state => { return state.VCurrentTime },
  gotoChat: state => { return state.gotoChat },
  pttState: state => { return state.pttState }, // PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
  previewImage: state => { return state.previewImg },
  getInstancePTTID: state => { return state.InstancePTTID },

  // checkbox
  getEnableSetNewComment: state => { /* console.log("EnableSetNewPush getter",state.enablesetnewpush); */ return state.enablesetnewcomment },
  getDisableCommentGray: state => { return state.disablepushgray },
  getDeleteOtherConnect: state => { return state.deleteotherconnect },
  getEnableBlacklist: state => { return state.enableblacklist },
  // input value
  getPluginHeight: state => { return state.pluginHeight },
  getFontsize: state => { return state.chatFontsize },
  getChatSpace: state => { return state.chatSpace },
  getCommentInterval: state => { return state.commentInterval },
  getPluginWidth: state => { return state.pluginWidth },
  getPluginPortraitHeight: state => { return state.pluginPortraitHeight },
  getBlacklist: state => { return state.blacklist },
  // dropdown
  getTheme: state => { return state.theme },
  getThemeColorBG: state => { return state.themeColorBG },
  getThemeColorBorder: state => { return state.themeColorBorder },
  getTitleList: state => { return state.titleList }
}
