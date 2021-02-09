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
    scrollToChat: function () {
      if (reportmode) console.log("scrollToChat", this.lastactiveChat, this.activeChat, this.lastactiveChat !== this.activeChat);
      if (this.lastactiveChat !== this.activeChat) { this.lastactiveChat = this.activeChat; }
      if (reportmode) console.log("this.isAutoScroll", this.isAutoScroll, this.lastautoscrolltime + 50 < Date.now());
      if (this.isAutoScroll && this.lastautoscrolltime + 50 < Date.now()) {
        const list = this.$refs.chatmain;
        const scroller = list.$refs.scroller;
        const accumulator = this.activeChat > 0 ? scroller.sizes[this.activeChat - 1].accumulator : 0;
        const clientHeight = list.$el.clientHeight;
        let scroll = accumulator - clientHeight / 2;
        if (scroll < 0) scroll = 0;
        scroller.$el.scrollTo({
          top: scroll,
          behavior: ((Math.abs(scroller.$el.scrollTop - scroll) > clientHeight) ? 'auto' : 'smooth'),
        });
        // scroller.scrollToPosition(scroll);
      }
    },
    updateChat: function () {
      this.getCurrentChat();
      setTimeout(() => this.scrollToChat(), 10);
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
            //console.log("move activeChat to ", this.activeChat);
          }
          while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
            this.activeChat += move;
            //console.log("move activeChat to ", this.activeChat);
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
  //chatelement methods
  GrayCheck(item) {
    if (reportmode) console.log("GrayCheck", item, "id", item.id, "activeChat", this.activeChat, item, "id>activeChat", item.id > this.activeChat, item.gray)
    if (item.id > this.activeChat && !item.gray) this.$emit('updategray', item.id, true);
    else if (item.id <= this.activeChat && item.gray) this.$emit('updategray', item.id, false);
  },
  timeH: function (item) { return paddingLeft(item.time.getHours(), + 2); },
  timem: function (item) { return paddingLeft(item.time.getMinutes(), +2); },
  typeclass: function (item) {
    const typecolor = item.type === "推 " ? "ptt-chat-type" : "ptt-chat-type-n";
    return typecolor + " mr-2 mb-0";
  },
  bgc: function (item) {
    if (this.getDisablePushGray) return "";
    const isUnchat = item.gray ? "0.25" : "0";
    const color = "rgba(128, 128, 128, " + isUnchat + ")";
    return { backgroundColor: color, transition: "2s" };
  },
  computed: {
    allchats: function () {
      //console.log("allchats");
      if (this.newChatList !== this.lastChat) {
        if (this.lastpostaid !== this.post.AID) { this.lastpostaid = this.post.AID; this._allchats = []; }
        if (!this._allchats) this._allchats = [];
        if (!this.isStream) this.newChatList.forEach(item => { item.gray = item.id > this.activeChat; });
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
    elMsgLineHeight: function () { return this.getFontsize * 1.2; },
    elMsgStyle: function () { return { 'font-size': this.getFontsize + 'px', "line-height": this.elMsgLineHeight + 'px' }; },
    elInfoStyle: function () { return { 'font-size': this.getFontsize / 1.2 + 'px', "line-height": this.getFontsize + 'px' }; },
    elSpace: function () { return this.getChatSpace * this.getFontsize; },
    elSpaceStyle: function () { return { 'margin-bottom': this.elSpace + 'px' }; },
    defaultElClientHeight: function () {
      // console.log("defaultElClientHeight", this.elMsgLineHeight, this.getFontsize, this.elSpace, (+this.elMsgLineHeight + +this.getFontsize + +this.elSpace));
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
    //初始化聊天列表
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
      let m = filterXSS(i + " 太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦 https://pbs.twimg.com/media/ErtC6XwVoAM_ktN.jpg 太神啦");
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