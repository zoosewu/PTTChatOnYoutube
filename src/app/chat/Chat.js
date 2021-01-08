import { store } from "../store/store.js";
import { ChatScrollBtn } from './ChatScrollBtn.js';
import { ChatElement } from './ChatElement.js';

export let Chat = {
  inject: ['msg', 'isStream'],
  data: function () {
    return {
      allchats: [],
      chatList: [],
      lastChat: [],
      activeChat: 0,
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
        for (let i = 0; i < this.chatList.length; i++) {
          chat = this.chatList[i];
          const isgray = chat.index > this.activeChat;
          //console.log("gray check, uid, activeChat, color, lastColor", chat.index, this.activeChat, isgray, chat.gray);
          if (isgray != chat.gray) {
            //console.log("gray change, graychange, chatuid", chat.gray, '=>', isgray, chat.index);
            chat.gray = isgray;
          }
        }
      }
      if (this.isAutoScroll) {
        const scrollPos = this.getScrollPos();
        const p = this.$refs.chatmain.scrollTop - scrollPos;
        //console.log("scrollToChatS", new Date().getTime(), this.isAutoScroll, scrollPos);
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
        if (this.chatList.length > 2000) {
          for (let i = this.chatList.length - 1; i >= 0; i--) {
            const chat = this.chatList[i];
            //console.log("remove check", chat.index, chat.msg, chat);
            if (chat.index < start || chat.index > end) {
              this.chatList.splice(i, 1);
              console.log("remove chat", chat.index, chat.msg, chat);
            }
          }
        }
        for (let i = 0; i < list.length; i++) {
          const chat = list[i];
          if (chat.index >= start && chat.index <= end && !this.chatList.includes(chat)) {
            this.chatList.push(chat);
            console.log("add chat", chat.index, chat.msg, chat);
          }
        }
        //if (this.chatList.length > 0) console.log("after chat", this.chatList[0].msg, this.chatList[this.chatList.length - 1].msg);
        this.chatList.sort(function (a, b) { return a.index - b.index; });
        console.log("activeChat, start, end, allList, chatList", this.activeChat, start, this.activeChatEnd, list, this.chatList);
      }
    },

    getCurrentChat: function () {
      const chats = this.cList;
      if (this.isStream) {
        this.activeChat = chats.length - 1;
      }
      else {
        // if (this.activeChat && chats) {
        //   console.log("current time: " + this.videoCurrentTime.toString(), ", activeChat", this.activeChat);
        //   if (chats[this.activeChat - 1]) {
        //     console.log("activeChat-1", chats[this.activeChat - 1].time.toString());
        //   }
        //   if (chats[this.activeChat]) {
        //     console.log("activeChat+0", chats[this.activeChat].time.toString(), ", activeChat > CurrentTime", chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf());
        //   }
        //   if (chats[this.activeChat + 1]) {
        //     console.log("activeChat+1", chats[this.activeChat + 1].time.toString(), ", activeChat < CurrentTime", chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf());
        //   }
        // }
        while (chats[this.activeChat] && chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
          this.activeChat--;
        }
        while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
          this.activeChat++;
        }
      }
      const visibleEnd = this.activeChat + this.activeRange / 2;
      this.activeChatEnd = visibleEnd < chats.length - 1 ? visibleEnd : chats.length - 1;
      this.activeChatStart = this.activeChatEnd - this.activeRange;
      console.log("getCurrentChat, chats.length-1, activeChat, start, end, isStream", chats.length - 1, this.activeChat, this.activeChatStart, this.activeChatEnd, this.isStream);
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
    cList: function () {
      console.log("cList");
      if (this.newChatList !== this.lastChat) {
        this.allchats = this.allchats.concat(this.newChatList);
        this.lastChat = this.newChatList;
        console.log("add chat, newChatList", this.newChatList);
      }
      return this.allchats;
    },
    postAID: function () {
      this.allchats = [];
      this.chatList = [];
      return this.post.AID;
    },
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
      'PTTState',
    ])
  },
  mounted() {
    //註冊文章事件
    this.msg["newPush"] = data => { this.$store.dispatch('updatePost', data); this.nextUpdateTime = Date.now() + 2.5 * 1000; };

    //初始化聊天列表
    this.lastChat = this.newChatList;
    this.allchats = testchat.list;//test
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
    this.intervalScroll = window.setInterval(() => { this.updateChat(); }, 1000);

    //使用者滾輪事件
    if (this.$refs.chatmain.addEventListener) {
      this.$refs.chatmain.addEventListener("mousewheel", this.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera
      this.$refs.chatmain.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);// Firefox
    }
    else {// IE 6/7/8
      this.$refs.chatmain.attachEvent("onmousewheel", this.MouseWheelHandler);
    }
  },
  updated: function () {
    this.scrollToChat();
    console.log('chat updated');
  },
  beforeDestroy() {
    clearInterval(this.intervalChat);
    clearInterval(this.intervalScroll);
  },
  components: {
    "chat-scroll-btn": ChatScrollBtn,
  },
  template: `<div id="PTTChat-contents-Chat-main" ref="chatmain" class="flex-grow-1 mh-100 row"
  style="overscroll-behavior: none;overflow-y: scroll;">
  <ul id="PTTChat-contents-Chat-pushes" class="col mb-0 px-0" v-bind:post-aid="postAID" ref="chats">
    <chat-item :index="index" :chat="item" :gray="item.gray" :key="item.index" v-for="(item, index) in chatList">
    </chat-item>
  </ul>
  <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
</div>`,
}


let testchat = {
  l: [],
  get list() {
    for (let i = this.l.length; i < 720; i++) {
      const el = {
        type: "推 ",
        id: "Zoosewu ",
        time: new Date(),
      };
      el.msg = i + " 太神啦太神啦太神啦太神啦太神啦";
      el.time.setHours(18);
      el.time.setMinutes(0);
      el.time.setSeconds(i * 10);
      el.timeH = paddingLeft(el.time.getHours(), +2);
      el.timem = paddingLeft(el.time.getMinutes(), +2);
      el.index = i;
      el.gray = true;
      this.l.push(el);
    }
    return this.l;
  }
}