
export const getters = {
  getCount: state => state.count,
  Alert: state => state.alert,
  anySearch: state => state.anySearch,
  newLog: state => state.log,
  post: state => state.post,
  newChatList: state => state.chatlist,
  videoCurrentTime: state => state.VCurrentTime,
  gotoChat: state => state.gotoChat,
  pttState: state => state.pttState, // PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
  previewImage: state => state.previewImg,
  getInstancePTTID: state => state.InstancePTTID,
  customPluginSetting: state => state.customPluginSetting,
  siteName: state => state.siteName,

  // checkbox
  getEnableSetNewComment: state => state.enablesetnewcomment,
  getDisableCommentGray: state => state.disablepushgray,
  getDeleteOtherConnect: state => state.deleteotherconnect,
  getEnableBlacklist: state => state.enableblacklist,
  getAnySearchHint: state => state.anySearchHint,
  // input value
  getPluginHeight: state => state.pluginHeight,
  getFontsize: state => state.chatFontsize,
  getChatSpace: state => state.chatSpace,
  getCommentInterval: state => state.commentInterval,
  getPluginWidth: state => state.pluginWidth,
  getPluginPortraitHeight: state => state.pluginPortraitHeight,
  getBlacklist: state => state.blacklist,
  // dropdown
  getTheme: state => state.theme,
  getThemeColorBG: state => state.themeColorBG,
  getThemeColorBorder: state => state.themeColorBorder,
  getTitleList: state => state.titleList
}
