export const getters = {
  getCount: state => { return state.count },
  getHeight: state => { return state.pluginHeight },
  newAlert: state => { return state.alert },
  log: state => { return state.log },
  post: state => { return state.post },
  newChatList: state => { return state.chatlist },
  videoCurrentTime: state => { return state.VCurrentTime; },
  gotoChat: state => { return state.gotoChat; },

}