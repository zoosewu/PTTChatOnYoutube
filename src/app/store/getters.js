export const getters = {
  getCount: state => { return state.count },
  getHeight: state => { return state.pluginHeight },
  newAlert: state => { return state.alert },
  log: state => { return state.log },
  post: state => { return state.post },
  newChatList: state => { return state.chatlist },
  firstChatTime: state => { return state.firstChatTime },
  lastChatTime: state => { return state.lastChatTime },
  videoCurrentTime: state => { return state.VCurrentTime; },
  pageChange: state => { return state.pageChange; },
}