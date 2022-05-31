import { types } from './mutations_type'

export const actions = {
  actionIncrease: ({ commit }) => { console.log('actionIncrease'); commit(types.INCREASE) },
  actionDecrease: ({ commit }) => { console.log('actionDecrease'); commit(types.DECREASE) },
  Alert: (context, alertobject) => { context.commit(types.ALERT, alertobject) },
  ClearAlert: (context) => { context.commit(types.CLEARALERT) },
  addAnySearch: ({ commit }, search) => { commit(types.ADDANYSEARCH, search) },
  updateLog: (context, log) => { context.commit(types.UPDATELOG, log) },
  removeLog: (context, log) => { context.commit(types.REMOVELOG, log) },
  updatePost: ({ dispatch, commit, state }, RecievedData) => {
    let newpost
    if (RecievedData.key === state.post.key && RecievedData.board === state.post.board) {
      newpost = state.post
      commit(types.SETPOSTLASTENDLINE, RecievedData.endLine)
      const commentCount = state.post.commentCount + RecievedData.comments.length
      commit(types.SETPOSTCOMMENTCOUNT, commentCount)
      dispatch('updateLog', [{ type: 'postEndLine', data: RecievedData.endLine },
        { type: 'postCommentCount', data: commentCount }])
    } else {
      newpost = {
        key: RecievedData.key,
        board: RecievedData.board,
        title: RecievedData.title,
        date: RecievedData.date,
        lastEndLine: RecievedData.endLine,
        lastCommentTime: new Date(),
        commentCount: RecievedData.comments.length,
        nowComment: 0,
        gettedpost: true
      }
      const t = newpost.date
      dispatch('updateLog', [{ type: 'postKey', data: newpost.key },
        { type: 'postBoard', data: newpost.board },
        { type: 'postTitle', data: newpost.title },
        { type: 'postDate', data: t.toLocaleDateString() + ' ' + t.toLocaleTimeString() },
        { type: 'postEndLine', data: newpost.lastEndLine },
        { type: 'postCommentCount', data: newpost.commentCount }])
    }
    commit(types.UPDATEPOST, newpost)
    dispatch('updateChat', RecievedData.comments)
    if (RecievedData.comments.length > 0) {
      const lastcommentDate = RecievedData.comments[RecievedData.comments.length - 1].date
      dispatch('updateLog', { type: 'postLastCommentTime', data: lastcommentDate.toLocaleDateString() + ' ' + lastcommentDate.toLocaleTimeString() })
    }
    if (state.pageChange) {
      dispatch('gotoChat', true)
      dispatch('pageChange', false)
    }
  },
  updateChat: ({ commit, state }, comments) => {
    console.log('state.post.commentCount', state.post.commentCount, comments.length)
    const existcomment = state.post.commentCount - comments.length
    const chatlist = []
    let sametimecount = 0
    let sametimeIndex = 0
    for (let index = 0; index < comments.length; index++) {
      const currcomment = comments[index]// 抓出來的推文
      const chat = {}
      if (!state.isStream) {
        if (index >= sametimeIndex) { // 獲得同時間點的推文數量
          for (let nextpointer = index + 1; nextpointer < comments.length; nextpointer++) {
            const element = comments[nextpointer]
            if ((currcomment.date.getTime() < element.date.getTime()) || (nextpointer >= comments.length - 1)) {
              sametimeIndex = nextpointer
              sametimecount = nextpointer - index
              break
            }
          }
        }
      }
      chat.time = new Date(currcomment.date.getTime())
      // console.log("sametimeIndex, index, sametimecount", sametimeIndex, index, sametimecount);
      if (!state.isStream && sametimecount > 0) chat.time.setSeconds((sametimecount + index - sametimeIndex) * 60 / sametimecount)
      chat.pttid = currcomment.id
      chat.type = currcomment.type
      // chat.msg = currpush.content;
      let msg = ''
      let m = filterXSS(currcomment.content)
      const AidResult = /(.*)(#[a-zA-Z0-9-_^'"`]{8} \([^'"`)]+\))(.*)/.exec(m)
      if (AidResult && AidResult.length > 3) {
        const precontent = AidResult[1]
        const aid = AidResult[2]
        const postcontent = AidResult[3]
        const aidResult = /(#[a-zA-Z0-9_-]+) \(([a-zA-Z0-9_-]+)\)/.exec(aid)
        const search = aidResult[2] + ',' + aidResult[1]
        m = precontent + '<u onclick="this.parentNode.AddAnySrarch(`' + search + '`)" style="cursor: pointer;">' + aid + '</u>' + postcontent
        if (reportMode) console.log(precontent + '<u onclick="this.parentNode.AddAnySrarch(' + search + ')">' + aid + '</u>' + postcontent)
      }
      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m)
      let parsetime = 5
      while (result && m !== '' && parsetime > 0) {
        const prestring = result[1]
        const linkstring = result[2]
        if (prestring !== '') msg = msg + prestring
        msg = msg + '<a href="' + linkstring + '" target="_blank" rel="noopener noreferrer" class="ptt-chat-msg" ref="link' + (5 - parsetime) + '" onmouseover="this.parentNode.mouseEnter(this.href)" onmouseleave="this.parentNode.mouseLeave(this.href)">' + linkstring + '</a>'
        m = result[3]
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m)
        parsetime--
      }
      if (m !== '') msg = msg + m
      chat.msg = msg
      chat.id = existcomment + index
      chat.uid = state.post.key + '_' + chat.id
      chat.gray = !state.disablecommentgray
      let isMatch = false
      if (state.enableblacklist) {
        const list = state.blacklist.split('\n')
        const id = chat.pttid.toLowerCase()
        for (let i = 0; i < list.length; i++) {
          if (id === list[i]) {
            isMatch = true
            break
          }
        }
      }
      if (!isMatch) {
        chatlist.push(chat)
      }
      if (reportMode) console.log('new Chat', chat, currcomment)
    }
    // console.log("chatlist actions", chatlist);
    commit(types.UPDATECHAT, chatlist)
  },
  clearChat: ({ commit }) => { commit(types.CLEARCHAT) },
  updateVideoStartDate: ({ dispatch, commit, state }, d) => {
    dispatch('updateLog', { type: 'videoStartTime', data: d.toLocaleDateString() + ' ' + d.toLocaleTimeString() })
    commit(types.VIDEOSTARTDATE, d)
    dispatch('updateVideoCurrentTime')
  },
  updateVideoPlayedTime: ({ dispatch, commit, state }, time) => {
    // console.log("updateVideoPlayedTime", time);
    commit(types.VIDEOPLAYEDTIME, time)
    dispatch('updateLog', { type: 'videoPlayedTime', data: time })
    dispatch('updateVideoCurrentTime')
  },
  updateVideoCurrentTime: ({ dispatch, commit, state }) => {
    const vstart = state.VStartDate
    const time = state.VPlayedTime// [H,m,s,isVideoVeforePost]
    const currtime = new Date(vstart.valueOf())
    currtime.setSeconds(vstart.getSeconds() + time)
    if (reportMode) console.log('updateVideoCurrentTime check, currtime.valueOf() < state.post.date.valueOf()', currtime.valueOf() < state.post.date.valueOf(), currtime.valueOf(), state.post.date.valueOf())
    // console.log("updateVideoCurrentTime vstart, time, currtime", vstart, time, currtime);
    dispatch('updateLog', { type: 'videoCurrentTime', data: currtime.toLocaleDateString() + ' ' + currtime.toLocaleTimeString() })
    commit(types.VIDEOCURRENTRIME, currtime)
  },
  pageChange: ({ commit }, Change) => { commit(types.PAGECHANGE, Change) },
  gotoChat: ({ commit }, gtChat) => { commit(types.GOTOCHAT, gtChat) },
  pttState: ({ dispatch, commit }, pttstate) => { dispatch('updateLog', { type: 'pttState', data: pttstate }); commit(types.PTTSTATE, pttstate) },
  isStream: ({ commit }, isStream) => { commit(types.ISSTREAM, isStream) },
  previewImage: ({ commit }, src) => { commit(types.PREVIEWIMG, src) },
  reInstancePTT: ({ commit }) => commit(types.REINSTANCEPTT),
  setCustomPluginSetting: ({ commit }, value) => { commit(types.CUSTOMPLUGINSETTING, value) },
  setSiteName: ({ commit }, value) => { commit(types.SITENAME, value) },

  // checkbox
  setEnableSetNewComment: ({ commit }, value) => { commit(types.ENABLESETNEWCOMMENT, value) },
  setDisableCommentGray: ({ commit }, value) => { commit(types.DISABLECOMMENTGRAY, value) },
  setDeleteOtherConnect: ({ commit }, value) => { commit(types.DELETEOTHERCONNECT, value) },
  setAnySearchHint: ({ commit }, value) => { commit(types.ANYSEARCHHINT, value) },

  // input value
  setPluginHeight: (context, value) => { context.commit(types.PLUGINHEIGHT, value) },
  setFontsize: ({ commit }, value) => { commit(types.CHATFONTSIZE, value) },
  setChatSpace: ({ commit }, value) => { commit(types.CHATSPACE, value) },
  setCommentInterval: ({ commit }, value) => { commit(types.COMMENTINTERVAL, value) },
  setPluginWidth: ({ commit }, value) => { commit(types.PLUGINWIDTH, value) },
  setPluginPortraitHeight: ({ commit }, value) => { commit(types.PLUGINPORTRAITHEIGHT, value) },

  // inputfield value
  setEnableBlacklist: ({ commit }, value) => { commit(types.ENABLEBLACKLIST, value) },
  setBlacklist: ({ commit }, value) => { commit(types.BLACKLIST, value) },
  setEnableCommentBlacklist: ({ commit }, value) => { commit(types.ENABLECOMMENTBLACKLIST, value) },
  setCommentBlacklist: ({ commit }, value) => { commit(types.COMMENTBLACKLIST, value) },

  // dropdown
  setTheme: ({ commit }, value) => { commit(types.THEME, value) },
  setThemeColorBG: ({ commit }, value) => { commit(types.THEMECOLORBG, value) },
  setThemeColorBorder: ({ commit }, value) => { commit(types.THEMECOLORBORDER, value) },
  setTitleList: ({ commit }, list) => { commit(types.TITLELIST, list) }
}
