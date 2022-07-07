import ChatPreviewImage from './ChatPreviewImage.vue'
import ChatScrollBtn from './ChatScrollButton.vue'
import ChatElement from './ChatElement.vue'
import ChatSetNewComment from './ChatSetNewComment.vue'

Vue.component('DynamicScroller', VueVirtualScroller.DynamicScroller)
Vue.component('DynamicScrollerItem', VueVirtualScroller.DynamicScrollerItem)

export default {
  inject: ['msg', 'isStream'],
  data () {
    return {
      _allchats: [],
      lastChat: [],
      acChat: 0,
      postKey: '',
      lastactiveChat: -1,
      intervalChat: null,
      intervalScroll: null,
      nextUpdateTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
      isAutoScroll: true,
      lastautoscrolltime: Date.now(),
      ChatElement: ChatElement,
      scrolloffset: 0
    }
  },
  methods: {
    updateComment: function () {
      if (this.postKey !== this.post.key) {
        if (reportMode) console.log('new post, reset chat')
        this.postKey = this.post.key
        this._allchats = []
      }
      if (!this._allchats) this._allchats = []
      this._allchats = this._allchats.concat(this.newChatList)
      if (reportMode) console.log('this._allchats', this._allchats)
      this.$store.dispatch('clearChat')
      return this._allchats
    },
    updateGray: function (index, isgray) {
      if (!this.allchats[index]) return
      if (reportMode) {
        console.log('update gray', index, this.allchats[index])
        console.log('update gray', this.allchats[index].gray, '->', isgray, this.allchats[index].msg)
      }
      if (this.allchats[index].gray !== isgray) this.allchats[index].gray = isgray
      else console.log('update gray error', index, this.allchats[index].gray, '->', isgray, this.allchats[index].msg)
    },
    updateChat: function () {
      this.getCurrentChat()
      setTimeout(() => this.autoScrollCheck(), 10)
    },
    autoScrollCheck: function () {
      if (showScrollLog) {
        console.log('scrollToChat', this.lastactiveChat, this.activeChat, this.lastactiveChat !== this.activeChat,
          'this.isAutoScroll', this.isAutoScroll, this.lastautoscrolltime + 50 < Date.now())
      }
      if (this.lastactiveChat !== this.activeChat) { this.lastactiveChat = this.activeChat }
      if (this.isAutoScroll && this.lastautoscrolltime + 50 < Date.now()) {
        this.scrollToChat()
      }
    },
    scrollToChat: function () {
      const list = this.$refs.chatmain
      const scroller = list.$refs.scroller
      const accumulator = this.activeChat > 0 ? scroller.sizes[this.activeChat - 1].accumulator : 0
      const clientHeight = list.$el.clientHeight
      let scroll = accumulator - clientHeight / 2
      if (scroll < 0) scroll = 0
      scroller.$el.scrollTo({
        top: scroll,
        behavior: ((Math.abs(scroller.$el.scrollTop - scroll) > clientHeight * 2) ? 'auto' : 'smooth')
      })
      this.$store.dispatch('updateLog', { type: 'targetScrollHeight', data: scroll })
      // scroller.scrollToPosition(scroll);
    },
    getCurrentChat: function () {
      const chats = this.allchats
      if (this.isStream) { this.activeChat = chats.length - 1 } else {
        // console.log("this.activeChat && chats && reportMode", this.activeChat, chats, reportMode);
        if (this.activeChat > -1 && chats && reportMode) {
          console.log('current time: ' + this.videoCurrentTime.toString(), ', activeChat', this.activeChat)
          if (chats[this.activeChat - 1]) { console.log(chats[this.activeChat - 1].time.toLocaleTimeString(), ', activeChat-1 < CurrentTime', chats[this.activeChat - 1].time.valueOf() < this.videoCurrentTime.valueOf()) }
          if (chats[this.activeChat + 0]) { console.log(chats[this.activeChat + 0].time.toLocaleTimeString(), ', activeChat   > CurrentTime', chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) }
          if (chats[this.activeChat + 1]) { console.log(chats[this.activeChat + 1].time.toLocaleTimeString(), ', activeChat+1 < CurrentTime', chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) }
        }
        let move = 128
        while (true) {
          while (this.activeChat > 0 && chats[this.activeChat] && chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
            this.activeChat -= move
          }
          while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
            this.activeChat += move
          }
          if (move <= 1) break
          move = move / 2
        }
      }
      this.$store.dispatch('updateLog', { type: 'commentIndex', data: this.activeChat })

      if (reportMode && this.lastactiveChat !== this.activeChat && chats[this.activeChat]) console.log('CurrentChat, ', this.lastactiveChat, '->', this.activeChat, 'chats.length-1', chats.length - 1, ' isStream', this.isStream, 'chats[this.activeChat].msg', chats[this.activeChat].msg)
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true
      this.scrollToChat()
    },
    AddEventHandler: function () {
      const list = this.$refs.chatmain.$el
      // 使用者滾輪事件
      if (list.addEventListener) {
        list.addEventListener('mousewheel', this.MouseWheelHandler, false)// IE9, Chrome, Safari, Opera
        list.addEventListener('DOMMouseScroll', this.MouseWheelHandler, false)// Firefox
      } else { // IE 6/7/8
        list.attachEvent('onmousewheel', this.MouseWheelHandler)
      }
      list.addEventListener('scroll', e => { if (this.isAutoScroll) this.lastautoscrolltime = Date.now() })
    }
  },
  computed: {
    allchats: function () {
      return this.newChatList.length > 0 ? this.updateComment() : this._allchats
    },
    activeChat: {
      get () {
        return this.acChat
      },
      set (value) {
        if (value > this.allchats.length - 1) this.acChat = this.allchats.length - 1
        else if (value < 0) this.acChat = 0
        else this.acChat = value
      }
    },
    // chatelement computed
    elMsgLineHeight: function () {
      return this.getFontsize * 1.2
    },
    elMsgStyle: function () {
      return { 'font-size': this.getFontsize + 'px', 'line-height': this.elMsgLineHeight + 'px' }
    },
    elInfoStyle: function () {
      return { 'font-size': this.getFontsize / 1.2 + 'px', 'line-height': this.getFontsize + 'px' }
    },
    elSpace: function () {
      return this.getChatSpace * this.getFontsize
    },
    elSpaceStyle: function () {
      return { 'margin-bottom': this.elSpace + 'px' }
    },
    defaultElClientHeight: function () {
      return +this.elMsgLineHeight + +this.getFontsize + +this.elSpace
    },
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
      'pttState',
      'getDisableCommentGray',
      'getCommentInterval',
      'getFontsize',
      'getChatSpace',
      'setNewComment'
    ])
  },
  created () {
    if (reportMode) this._allchats = testchat.list// test
    else this._allchats = []
    this.lastChat = []
    this.postKey = this.post.key

    this.activeChat = 0
    this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000
  },
  mounted () {
    if (showAllLog) console.log('Chat mounted')
    // 註冊文章事件
    this.msg.newComment = data => {
      this.$store.dispatch('updatePost', data)
      this.nextUpdateTime = Date.now() + Math.max(this.getCommentInterval, 2.5) * 1000
    }
    // 定時抓新聊天
    this.intervalChat = window.setInterval(() => {
      if (this.isStream && this.pttState > 0 && Date.now() > this.nextUpdateTime) {
        this.nextUpdateTime = Date.now() + 60 * 1000
        if (showAllLog) console.log('定時抓新聊天', this.nextUpdateTime)
        if (this.setNewComment !== '') {
          this.msg.PostMessage('setNewcomment', this.setNewComment)
          this.$store.dispatch('setNewcomment', '')
        } else this.msg.PostMessage('getCommentByAnySearch', { key: this.post.key, board: this.post.board, startLine: this.post.lastEndLine })
      }
    }, 340)
    // 定時滾動
    this.intervalScroll = window.setInterval(() => { this.updateChat() }, 500)
  },
  beforeDestroy () {
    clearInterval(this.intervalChat)
    clearInterval(this.intervalScroll)
  },
  components: {
    'chat-preview-image': ChatPreviewImage,
    'chat-scroll-btn': ChatScrollBtn,
    'chat-set-new-comment': ChatSetNewComment,
    'chat-element': ChatElement
    // 'dynamic-scroller': DynamicScroller,
    // 'dynamic-scroller-item': DynamicScrollerItem
  },
  template: `<div id="PTTChat-contents-Chat-main" class="h-100 d-flex flex-column">
  <dynamic-scroller ref="chatmain"
    style="overscroll-behavior: none;overflow-y: scroll;overflow-x:hidden;height: 100%;"
    @hook:mounted="AddEventHandler" :items="allchats" :min-item-size="defaultElClientHeight" class="scroller"
    key-field="uid">
    <template v-slot="{ item, index, active }">
      <dynamic-scroller-item :item="item" :active="active" :index="item.id"
        :size-dependencies="[item.msg,defaultElClientHeight]">
        <chat-element :item="item" :index="index" :key="index" :msg-style="elMsgStyle" :info-style="elInfoStyle"
          :space-style="elSpaceStyle" :active-chat="activeChat" @updategray="updateGray"></chat-element>
      </dynamic-scroller-item>
    </template>
  </dynamic-scroller>
  <chat-set-new-comment />
  <chat-preview-image></chat-preview-image>
  <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
</div>`
}
const testchat = {
  l: [],
  get list () {
    console.log('instance fake chat')
    for (let i = this.l.length; i < 12000; i++) {
      const el = {
        type: '推 ',
        pttid: 'ID_NO.' + i,
        time: new Date()
      }
      let msg = ''
      let m = i + ''
      switch (i % 4) {
        case 0:
          m += filterXSS('太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦 https://www.youtube.com/watch?t=1237&v=Suab3SD1rbI&feature=youtu.be')
          break
        case 1:
          m += filterXSS('太神啦 https://pbs.twimg.com/media/ErtC6XwVoAM_ktN.jpg 太神啦 https://imgur.com/kFOAhnc')
          break
        case 2:
          m += filterXSS('太神啦 https://i.imgur.com/m8VTnyA.png 太神啦 https://m.youtube.com/watch?v=8p-JW2RtLoY&feature=youtu.be')
          break
        case 3:
          m += filterXSS('太神啦 https://hololive.jetri.co/#/watch #1WHqSb2l (C_Chat)')
          break
        default:
          break
      }

      const AidResult = /(.*)(#[a-zA-Z0-9-_^'"`]{8} \([^'"`)]+\))(.*)/.exec(m)
      if (AidResult && AidResult.length > 3) {
        const precontent = AidResult[1]
        const aid = AidResult[2]
        const postcontent = AidResult[3]
        const aidResult = /(#[a-zA-Z0-9_-]+) \(([a-zA-Z0-9_-]+)\)/.exec(aid)
        const search = aidResult[2] + ',' + aidResult[1]
        m = precontent + '<u onclick="this.parentNode.AddAnySrarch(`' + search + '`)" style="cursor: pointer;">' + aid + '</u>' + postcontent
        if (showAllLog) console.log(precontent + '<u onclick="this.parentNode.AddAnySrarch(' + search + ')">' + aid + '</u>' + postcontent)
      }
      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m)
      let ParseTimeLimit = 5
      while (result && m !== '' && ParseTimeLimit > 0) {
        const prestring = result[1]
        const linkstring = result[2]
        if (prestring !== '') msg = msg + prestring
        msg = msg + '<a href="' + linkstring + '" target="_blank" rel="noopener noreferrer" class="ptt-chat-msg" ref="link' + (5 - ParseTimeLimit) + '" onmouseover="this.parentNode.mouseEnter(this.href)" onmouseleave="this.parentNode.mouseLeave(this.href)">' + linkstring + '</a>'
        m = result[3]
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m)
        ParseTimeLimit--
      }
      if (m !== '') msg = msg + m
      el.msg = msg
      el.time.setHours(18)
      el.time.setMinutes(0)
      el.time.setSeconds(i * 3)
      el.id = i
      el.uid = '#test_' + i
      el.gray = true
      this.l.push(el)
    }
    return this.l
  }
}
