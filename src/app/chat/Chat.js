import { store } from "../store/store.js";
import { ChatScrollBtn } from './ChatScrollBtn.js';
import { ChatElement } from './ChatElement.js';
import { chatSetNewPush } from './chatSetNewPush.js';
export let Chat = {
  inject: ['msg', 'isStream'],
  data: function () {
    return {
      _allchats: [],
      chatList: [],
      lastChat: [],
      acChat: 0,
      lastactiveChat: -1,
      activeRange: 200,
      activeChatStart: 0,
      activeChatEnd: 0,
      intervalChat: null,
      intervalScroll: null,
      nextUpdateTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
      isAutoScroll: true,
    }
  },
  methods: {
    scrollToChat: function () {
      if (this.lastactiveChat != this.activeChat) {
        this.lastactiveChat = this.activeChat;
        //console.log("gray task, start, end, activeChat", this.chatList[0].index, this.chatList[this.chatList.length - 1].index, this.activeChat);
        if (!this.disableGray) {
          for (let i = 0; i < this.chatList.length; i++) {
            chat = this.chatList[i];
            const isgray = chat.index > this.activeChat;
            //console.log("gray check, uid, activeChat, color, lastColor", chat.index, this.activeChat, isgray, chat.gray);
            if (isgray != chat.gray) chat.gray = isgray;//console.log("gray change, graychange, chatuid", chat.gray, '=>', isgray, chat.index);
          }
        }
      }
      if (this.isAutoScroll) {
        const scrollPos = this.getScrollPos();
        const p = this.$refs.chatmain.scrollTop - scrollPos;
        if (reportmode) console.log("scrollToChat, scrollTop, scrollPos", this.$refs.chatmain.scrollTop, scrollPos, new Date());
        if (p > 20 || p < -20) { this.$refs.chatmain.scrollTo({ top: scrollPos, behavior: "smooth" }); }
      }
    },
    getScrollPos: function () {
      const clientHeight = this.$refs.chatmain ? this.$refs.chatmain.clientHeight : 0;
      const current = this.activeChat + 1 - this.activeChatStart;
      const chatnode = this.$children.find(ele => { return ele.chat && ele.chat.index === this.activeChat; });
      //console.log("getScrollPos, chatnode, chatnode - 1", current, [chatnode], this.$children[current - 1]);
      if (!chatnode) return 0;
      const chat = chatnode.$el;
      const chatHeight = chat.clientHeight;

      const scrolloffset = (clientHeight - chatHeight) / 2;
      const scrollmin = 0;
      const scrollmax = this.$refs.chats.clientHeight - clientHeight;
      let scrollPos = chat.offsetTop - scrolloffset;
      if (scrollPos < scrollmin) scrollPos = scrollmin;
      else if (scrollPos > scrollmax) scrollPos = scrollmax;
      return scrollPos;
    },
    updateChat: function () {
      this.getCurrentChat();
      if (this.lastactiveChat != this.activeChat) {
        const list = this.allchats;
        const start = this.activeChatStart > 0 ? this.activeChatStart : 0;
        const end = this.activeChatEnd;
        //if (this.chatList.length > 0) console.log("beforeupdate chat", this.chatList[0].msg, this.chatList[this.chatList.length - 1].msg);
        // if (this.chatList.length > 2000) {
        //   for (let i = this.chatList.length - 1; i >= 0; i--) {
        //     const chat = this.chatList[i];
        //     //console.log("remove check", chat.index, chat.msg, chat);
        //     if (chat.index < start || chat.index > end) {
        //       this.chatList.splice(i, 1);
        //       console.log("remove chat", chat.index, chat.msg, chat);
        //     }
        //   }
        // }
        const tmpchat = [];
        for (let i = start; i < list.length && i <= end; i++) {
          const chat = list[i];
          //console.log("add check, i, chat.index, chat.msg, chat", i, chat.index, chat.msg, chat);
          if (!this.chatList.includes(chat.ins)) {
            const ins = { time: chat.time, id: chat.id, type: chat.type, msg: chat.msg, index: chat.index, gray: chat.gray, };
            tmpchat.push(ins);
            chat.ins = ins;
            //console.log("add chat", i, chat.msg, chat);
          }
        }
        this.chatList = this.chatList.concat(tmpchat);
        //if (this.chatList.length > 0) console.log("after chat", this.chatList[0].msg, this.chatList[this.chatList.length - 1].msg);
        this.chatList.sort(function (a, b) { return a.index - b.index; });
        if (reportmode) console.log("activeChat, start, end, allList, chatList", this.activeChat, start, this.activeChatEnd, list, this.chatList);
      }
    },
    getCurrentChat: function () {
      const chats = this.allchats;
      if (this.isStream) {
        this.activeChat = chats.length - 1;
      }
      else {
        if (this.activeChat && chats && reportmode) {
          console.log("current time: " + this.videoCurrentTime.toString(), ", activeChat", this.activeChat);
          if (chats[this.activeChat - 1]) {
            console.log("activeChat-1", chats[this.activeChat - 1].time.toString());
          }
          if (chats[this.activeChat]) {
            console.log("activeChat+0", chats[this.activeChat].time.toString(), ", activeChat > CurrentTime", chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf());
          }
          if (chats[this.activeChat + 1]) {
            console.log("activeChat+1", chats[this.activeChat + 1].time.toString(), ", activeChat < CurrentTime", chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf());
          }
        }
        for (move = 128; move > 0; move = move / 2) {
          while (this.activeChat > 0 && chats[this.activeChat] && chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
            this.activeChat -= move;
            //console.log("move activeChat to ", this.activeChat);
          }
          while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
            this.activeChat += move;
            //console.log("move activeChat to ", this.activeChat);
          }
          if (move === 1) break;
        }
      }

      const visibleEnd = this.activeChat + this.activeRange / 2;
      this.activeChatEnd = visibleEnd < chats.length - 1 ? visibleEnd : chats.length - 1;
      this.activeChatStart = this.activeChatEnd - this.activeRange;
      if (reportmode) console.log("getCurrentChat, chats.length-1", chats.length - 1, ", activeChat,", this.activeChat, " start,", this.activeChatStart, " end,", this.activeChatEnd, " isStream", this.isStream);
      setTimeout(() => this.scrollToChat(), 10);
      if (reportmode) console.log(chats[this.activeChat]);
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false;
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true;
      this.scrollToChat();
    },
  },
  computed: {
    allchats: function () {
      //console.log("allchats");
      if (this.newChatList !== this.lastChat) {

        this._allchats = this._allchats.concat(this.newChatList);
        this.lastChat = this.newChatList;
        //console.log("add chat, newChatList", this.newChatList);
      }
      return this._allchats;
    },
    postAID: function () {
      if (reportmode) console.log("new post:", this.post.AID);
      this._allchats = [];
      this.chatList = [];
      return this.post.AID;
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
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
      'PTTState',
      'disableGray',
    ])
  },
  mounted() {
    //註冊文章事件
    this.msg["newPush"] = data => { this.$store.dispatch('updatePost', data); this.nextUpdateTime = Date.now() + 2.5 * 1000; };

    //初始化聊天列表
    this.lastChat = this.newChatList;
    if (reportmode) this._allchats = testchat.list;//test
    else this._allchats = [];
    this.activeChat = 0;
    this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;

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

    //使用者滾輪事件
    if (this.$refs.chatmain.addEventListener) {
      this.$refs.chatmain.addEventListener("mousewheel", this.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera
      this.$refs.chatmain.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);// Firefox
    }
    else {// IE 6/7/8
      this.$refs.chatmain.attachEvent("onmousewheel", this.MouseWheelHandler);
    }
  },
  updated: function () { },
  beforeDestroy() {
    clearInterval(this.intervalChat);
    clearInterval(this.intervalScroll);
  },
  components: {
    "chat-scroll-btn": ChatScrollBtn,
    "chat-set-new-push": chatSetNewPush,
  },
  template: `<div id="PTTChat-contents-Chat-main" class="h-100" style="display: flex;flex-direction: column;">
  <div ref="chatmain" class="h-100 row" style="overscroll-behavior: none;overflow-y: scroll;">
    <ul id="PTTChat-contents-Chat-pushes" class="col mb-0 px-0" v-bind:post-aid="postAID" ref="chats">
      <chat-item :index="index" :chat="item" :gray="item.gray" :key="item.index" v-for="(item, index) in chatList">
      </chat-item>
    </ul>
    <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
  </div>
  <chat-set-new-push></chat-set-new-push>
</div>`,
}


let testchat = {
  l: [],
  get list() {
    for (let i = this.l.length; i < 12000; i++) {
      const el = {
        type: "推 ",
        id: "Zoosewu ",
        time: new Date(),
      };
      el.msg = i + " 太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦";
      el.time.setHours(18);
      el.time.setMinutes(0);
      el.time.setSeconds(i * 3);
      el.index = i;
      el.gray = true;
      this.l.push(el);
    }
    return this.l;
  }
}