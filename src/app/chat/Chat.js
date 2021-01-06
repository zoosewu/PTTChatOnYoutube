import { store } from "../store/store.js";
import { ChatScrollBtn } from './ChatScrollBtn.js';
import { ChatElement } from './ChatElement.js';

export let Chat = {
  inject: ['msg', 'isStream'],
  data: function () {
    return {
      chatList: testchat,
      lastChat: this.newChatList,
      activeChat: 0,
      activeRange: 1000,
      activeChatStart: 0,
      activeChatEnd: 0,
      updateChat: null,
      updateScroll: null,
      nextUpdateTime: Date.now(),
      isAutoScroll: true,
    }
  },
  methods: {
    scrollToChat: function () {
      this.getCurrentChat();
      if (this.isAutoScroll) {
        const scrollPos = this.getScrollPos();
        const p = this.$refs.chatmain.scrollTop - scrollPos;
        if (p > 20 || p < -20) {
          this.$refs.chatmain.scrollTo({
            top: scrollPos,
            behavior: "smooth"
          });
          //VueScrollTo.scrollTo('#chat-' + this.activeChat, 500, this.scrolloption());
        }
      }
    },
    getScrollPos: function () {
      const clientHeight = this.$refs.chatmain ? this.$refs.chatmain.clientHeight : 0;
      if (!this.$children[this.activeChat + 1]) return 0;
      const chat = this.$children[this.activeChat + 1].$el;
      const chatHeight = chat.clientHeight;

      const scrolloffset = (clientHeight - chatHeight) / 2;
      const scrollPos = chat.offsetTop - scrolloffset;
      //console.log("getScrollPos, activeChat, clientHeight, chatHeight, scrolloffset, chat.offsetTop, scrollPos, scrollTop", this.activeChat, clientHeight, chatHeight, scrolloffset, chat.offsetTop, scrollPos, this.$refs.chatmain.scrollTop);
      return scrollPos;
    },
    scrolloption: function () {
      const clientHeight = this.$refs.chatmain ? this.$refs.chatmain.clientHeight : 0;
      const chatHeight = this.$children[this.activeChat + 1] ? this.$children[this.activeChat + 1].$el.clientHeight : 0;
      this.scrollop.offset = -1 * (clientHeight - chatHeight) / 2;
      return this.scrollop;
    },
    getCurrentChat: function () {
      if (this.isStream) {
        this.activeChat = this.chatList.length - 1;
      }
      else {
        /*if (this.activeChat && this.chatList) {
          console.log("activeChat", this.activeChat, "current time: " + this.videoCurrentTime.toString());
          if (this.chatList[this.activeChat - 1]) {
            console.log("this.chatList[this.activeChat-1].time", this.chatList[this.activeChat - 1].time.toString());
          }
          if (this.chatList[this.activeChat]) {
            console.log("this.chatList[this.activeChat+0].time", this.chatList[this.activeChat].time.toString());
            console.log("this.chatList[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()", this.chatList[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf());
          }
          if (this.chatList[this.activeChat + 1]) {
            console.log("this.chatList[this.activeChat+1].time", this.chatList[this.activeChat + 1].time.toString());
            console.log("this.chatList[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()", this.chatList[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf());
          }
        }*/
        while (this.chatList[this.activeChat] && this.chatList[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
          this.activeChat--;
        }
        while (this.chatList[this.activeChat + 1] && this.chatList[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
          this.activeChat++;
        }
      }
      this.activeChatEnd = (this.activeChat + this.activeRange / 2) < this.chatList.length - 1 ? this.activeChat + this.activeRange / 2 : this.chatList.length - 1;
      this.activeChatStart = this.activeChatEnd - this.activeRange;
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false;
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true;
      this.scrollToChat();
    }
  },
  computed: {
    list: function () {
      if (this.newChatList !== this.lastChat) {
        this.chatList = this.chatList.concat(this.newChatList);
        this.lastChat = this.newChatList;
        const nextUpdate = this.isStream ? 2.5 * 1000 : 365 * 24 * 60 * 60 * 1000;
        this.nextUpdateTime = Date.now() + nextUpdate;
      }
      return this.chatList;
    },
    postAID: function () {
      this.chatList = [];
      return this.post.AID;
    },
    ...Vuex.mapGetters([
      'newChatList',
      'post',
      'videoCurrentTime',
    ])
  },
  mounted() {
    //註冊文章事件
    this.msg["newPush"] = data => { this.$store.dispatch('updatePost', data); };

    //初始化聊天列表
    this.lastChat = this.newChatList;
    //this.chatList = [];
    this.chatList = testchat.list;//test
    this.activeChat = 0;

    //定時抓新聊天
    this.updateChat = window.setInterval(() => {
      if (this.isStream && Date.now() > this.nextUpdateTime) {
        //console.log("updateChat", this.isStream, Date.now(), this.nextUpdateTime);
        //this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime);
        this.nextUpdateTime = Date.now() + 2.5 * 1000;
      }
    }, 500);

    //定時滾動
    this.updateScroll = window.setInterval(() => { this.scrollToChat(); }, 1000);

    //使用者滾輪事件
    if (this.$refs.chatmain.addEventListener) {
      this.$refs.chatmain.addEventListener("mousewheel", this.MouseWheelHandler, false);// IE9, Chrome, Safari, Opera
      this.$refs.chatmain.addEventListener("DOMMouseScroll", this.MouseWheelHandler, false);// Firefox
    }
    else {// IE 6/7/8
      this.$refs.chatmain.attachEvent("onmousewheel", this.MouseWheelHandler);
    }
  },
  beforeDestroy() {
    clearInterval(this.updateChat);
    clearInterval(this.updateScroll);
  },
  components: {
    "chat-scroll-btn": ChatScrollBtn,
  },
  template: `<div id="PTTChat-contents-Chat-main" ref="chatmain" class="flex-grow-1 mh-100 row"
  style="overscroll-behavior: none;overflow-y: scroll;">
  <ul id="PTTChat-contents-Chat-pushes" class="col mb-0 px-0" v-bind:post-aid="postAID" ref="chats">
    <chat-item :index="index" :ChatStart="activeChatStart" :ChatEnd="activeChatEnd" :ChatCurrent="activeChat"
      :type="item.type" :id="item.id" :time-h="item.timeH" :timem="item.timem" :msg="item.msg" :key="index"
      v-for="(item, index) in list">
    </chat-item>
  </ul>
  <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
</div>`,
}


let testchat = {
  l: [],
  get list() {
    for (let i = this.l.length; i < 3; i++) {
      const el = {
        type: "推 ",
        id: "Zoosewu ",
        time: new Date(),
      };
      el.msg = i + " 太神啦太神啦太神啦太神啦太神啦";
      el.time.setHours(18);
      el.time.setMinutes(i);
      el.timeH = paddingLeft(el.time.getHours(), +2);
      el.timem = paddingLeft(el.time.getMinutes(), +2);
      this.l.push(el);
    }
    return this.l;
  }
}