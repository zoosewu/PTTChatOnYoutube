import { store } from "../store/store.js";
import { ChatPreviewImage } from './ChatPreviewImage.js';
import { ChatScrollBtn } from './ChatScrollBtn.js';
import { ChatElement } from './ChatElement.js';
import { ChatSetNewPush } from './ChatSetNewPush.js';

Vue.component('dynamic-scroller', VueVirtualScroller.DynamicScroller);
Vue.component('dynamic-scroller-item', VueVirtualScroller.DynamicScrollerItem);
//Vue.component('RecycleScroller', VueVirtualScroller.RecycleScroller)
export let Chat = {
  inject: ['msg', 'isStream'],
  data() {
    return {
      _allchats: [],
      lastChat: [],
      acChat: 0,
      lastpostaid: "",
      lastactiveChat: -1,
      intervalChat: null,
      intervalScroll: null,
      nextUpdateTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
      isAutoScroll: true,
      lastautoscrolltime: Date.now(),
      ChatElement: ChatElement,
      scrolloffset: 0,
    }
  },
  methods: {
    updateGray: function (index, isgray) {
      if (reportmode) console.log("update gray", index, this.allchats[index].gray, "->", isgray, this.allchats[index].msg);
      if (this.allchats[index].gray != isgray) this.allchats[index].gray = isgray;
      else console.log("update gray error", index, this.allchats[index].gray, "->", isgray, this.allchats[index].msg);
    },
    updateChat: function () {
      this.getCurrentChat();
      setTimeout(() => this.autoScrollCheck(), 10);
    },
    autoScrollCheck: function () {
      if (reportmode) console.log("scrollToChat", this.lastactiveChat, this.activeChat, this.lastactiveChat !== this.activeChat, "this.isAutoScroll", this.isAutoScroll, this.lastautoscrolltime + 50 < Date.now());
      if (this.lastactiveChat !== this.activeChat) { this.lastactiveChat = this.activeChat; }
      if (this.isAutoScroll && this.lastautoscrolltime + 50 < Date.now()) {
        this.scrollToChat();
      }
    },
    scrollToChat: function () {
      const list = this.$refs.chatmain;
      const scroller = list.$refs.scroller;
      const accumulator = this.activeChat > 0 ? scroller.sizes[this.activeChat - 1].accumulator : 0;
      const clientHeight = list.$el.clientHeight;
      let scroll = accumulator - clientHeight / 2;
      if (scroll < 0) scroll = 0;
      scroller.$el.scrollTo({
        top: scroll,
        behavior: ((Math.abs(scroller.$el.scrollTop - scroll) > clientHeight * 2) ? 'auto' : 'smooth'),
      });
      // scroller.scrollToPosition(scroll);
    },
    getCurrentChat: function () {
      const chats = this.allchats;
      if (this.isStream) { this.activeChat = chats.length - 1; }
      else {
        // console.log("this.activeChat && chats && reportmode", this.activeChat, chats, reportmode);
        if (this.activeChat > -1 && chats && reportmode) {
          console.log("current time: " + this.videoCurrentTime.toString(), ", activeChat", this.activeChat);
          if (chats[this.activeChat - 1]) { console.log("activeChat-1", chats[this.activeChat - 1].time.toString()); }
          if (chats[this.activeChat]) { console.log("activeChat+0", chats[this.activeChat].time.toString(), ", activeChat > CurrentTime", chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()); }
          if (chats[this.activeChat + 1]) { console.log("activeChat+1", chats[this.activeChat + 1].time.toString(), ", activeChat < CurrentTime", chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()); }
        }
        let move = 128;
        while (true) {
          while (this.activeChat > 0 && chats[this.activeChat] && chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
            this.activeChat -= move;
          }
          while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
            this.activeChat += move;
          }
          if (move <= 1) break;
          move = move / 2
        }
      }
      if (reportmode && this.lastactiveChat != this.activeChat && chats[this.activeChat]) console.log("CurrentChat, ", this.lastactiveChat, "->", this.activeChat, "chats.length-1", chats.length - 1, " isStream", this.isStream, "chats[this.activeChat].msg", chats[this.activeChat].msg);
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false;
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true;
      this.scrollToChat();
    },
    AddEventHandler: function () {
      const list = this.$refs.chatmain.$el;
      //使用者滾輪事件
      if (list.addEventListener) {
        list.addEventListener("mousewheel", this.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera
        list.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);// Firefox
      }
      else {// IE 6/7/8
        list.attachEvent("onmousewheel", this.MouseWheelHandler);
      }
      list.addEventListener('scroll', e => { if (this.isAutoScroll) this.lastautoscrolltime = Date.now(); });
    },
  },
  computed: {
    allchats: function () {
      //console.log("allchats");
      if (this.newChatList !== this.lastChat) {
        if (this.lastpostaid !== this.post.AID) { this.lastpostaid = this.post.AID; this._allchats = []; }
        if (!this._allchats) this._allchats = [];
        const new_allchats = this._allchats.concat(this.newChatList);
        // console.log("old _allchats", this._allchats, "newChatList", this.newChatList, "new_allchats", new_allchats);
        this._allchats = new_allchats;
        this.lastChat = this.newChatList;
      }
      return this._allchats ? this._allchats : [];
    },
    activeChat: {
      get() {
        return this.acChat;
      },
      set(value) {
        if (value > this.allchats.length - 1) this.acChat = this.allchats.length - 1;
        else if (value < 0) this.acChat = 0;
        else this.acChat = value;
      }
    },
    //chatelement computed
    elMsgLineHeight: function () {
      return this.getFontsize * 1.2;
    },
    elMsgStyle: function () {
      return { 'font-size': this.getFontsize + 'px', "line-height": this.elMsgLineHeight + 'px' };
    },
    elInfoStyle: function () {
      return { 'font-size': this.getFontsize / 1.2 + 'px', "line-height": this.getFontsize + 'px' };
    },
    elSpace: function () {
      return this.getChatSpace * this.getFontsize;
    },
    elSpaceStyle: function () {
      return { 'margin-bottom': this.elSpace + 'px' };
    },
    defaultElClientHeight: function () {
      return +this.elMsgLineHeight + +this.getFontsize + +this.elSpace;
    },
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
      'PTTState',
      'getDisablePushGray',
      'getPushInterval',
      'getFontsize',
      'getChatSpace',
    ])
  },
  created() {
    if (reportmode) this._allchats = testchat.list;//test
    else this._allchats = [];
    this.lastChat = [];
    this.lastpostaid = this.post.AID;

    this.activeChat = 0;
    this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;
  },
  mounted() {
    //註冊文章事件
    this.msg["newPush"] = data => {
      this.$store.dispatch('updatePost', data);
      this.nextUpdateTime = Date.now() + Math.max(this.getPushInterval, 2.5) * 1000;
    };
    //定時抓新聊天
    this.intervalChat = window.setInterval(() => {
      if (this.isStream && this.PTTState > 0 && Date.now() > this.nextUpdateTime) {
        this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;
        //console.log("updateChat", this.isStream, Date.now(), this.nextUpdateTime);
        this.msg.PostMessage("getPushByLine", { AID: this.post.AID, board: this.post.board, startline: this.post.lastendline });
      }
    }, 340);
    //定時滾動
    this.intervalScroll = window.setInterval(() => { this.updateChat(); }, 500);
  },
  // updated: function () { console.log("updateChat", this.allchats); },
  beforeDestroy() {
    clearInterval(this.intervalChat);
    clearInterval(this.intervalScroll);
  },
  components: {
    "chat-preview-image": ChatPreviewImage,
    "chat-scroll-btn": ChatScrollBtn,
    "chat-set-new-push": ChatSetNewPush,
    "chat-element": ChatElement,
  },
  template: `<div id="PTTChat-contents-Chat-main" class="h-100 d-flex flex-column">
  <dynamic-scroller ref="chatmain"
    style="overscroll-behavior: none;overflow-y: scroll;height: 100%;"
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
  <chat-set-new-push></chat-set-new-push>
  <chat-preview-image></chat-preview-image>
  <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
</div>`,
}
let testchat = {
  l: [],
  get list() {
    for (let i = this.l.length; i < 12000; i++) {
      const el = {
        type: "推 ",
        pttid: "ID_NO." + i,
        time: new Date(),
      };
      let msg = "";
      let m = i + "";
      switch (i % 4) {
        case 0:
          m += filterXSS("太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦 https://www.youtube.com/watch?t=1237&v=Suab3SD1rbI&feature=youtu.be");
          break;
        case 1:
          m += filterXSS("太神啦 https://pbs.twimg.com/media/ErtC6XwVoAM_ktN.jpg 太神啦 https://imgur.com/kFOAhnc");
          break;
        case 2:
          m += filterXSS("太神啦 https://i.imgur.com/m8VTnyA.png 太神啦 https://m.youtube.com/watch?v=8p-JW2RtLoY&feature=youtu.be");
          break;
        case 3:
          m += filterXSS("太神啦 https://hololive.jetri.co/#/watch ");
          break;
        default:
          break;
      }
      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(.*)/ig.exec(m);
      let parsetime = 5;
      while (result && m !== "" && parsetime > 0) {
        const prestring = result[1];
        const linkstring = result[2];
        if (prestring !== "") msg = msg + prestring;
        msg = msg + `<a href="` + linkstring + `" target="_blank" rel="noopener noreferrer" class="ptt-chat-msg" ref="link` + (5 - parsetime) + `" onmouseover="this.parentNode.mouseEnter(this.href)" onmouseleave="this.parentNode.mouseLeave(this.href)">` + linkstring + `</a>`;
        m = result[3];
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(.*)/ig.exec(m);
        parsetime--;
      }
      if (m !== "") msg = msg + m;
      el.msg = msg;
      el.time.setHours(18);
      el.time.setMinutes(0);
      el.time.setSeconds(i * 3);
      el.id = i;
      el.uid = "#test_" + i;
      el.gray = true;
      this.l.push(el);
    }
    return this.l;
  }
}