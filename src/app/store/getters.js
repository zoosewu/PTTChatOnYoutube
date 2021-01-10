export const getters = {
  getCount: state => { return state.count },
  getHeight: state => { return state.pluginHeight },
  newAlert: state => { return state.alert },
  log: state => { return state.log },
  post: state => { return state.post },
  newChatList: state => { return state.chatlist },
  videoCurrentTime: state => { return state.VCurrentTime; },
  gotoChat: state => { return state.gotoChat; },
  PTTState: state => { return state.PTTState; },//PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
  enableSetNewPush: state => { return state.enablesetnewpush; },

}