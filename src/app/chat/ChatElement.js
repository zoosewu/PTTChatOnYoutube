

import ChatElementMessage from './ChatElementMessage.js';
Vue.component('chat-item', {
  props: ['index', 'chat', 'gray'],
  data: function () {
    return {
      uid: this.index,
      timeH: paddingLeft(this.chat.time.getHours(), +2),
      timem: paddingLeft(this.chat.time.getMinutes(), +2),
    }
  },
  computed: {
    /*msg: function () {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");
    },*/
    typeclass: function () {
      const typecolor = this.chat.type === "推 " ? "ptt-chat-type" : "ptt-chat-type-n";
      return typecolor + " mr-2 mb-0";
    },
    bgc: function () {
      if (this.getDisablePushGray) return "";

      // console.log("bgc", this.index, this.chat, this.chat.gray);
      const isUnchat = this.gray ? "0.25" : "0";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      return { backgroundColor: color, transition: "2s" };
    },
    msgFontsize: function () {
      return { 'font-size': this.getFontsize + 'px', "line-height": this.getFontsize * 1.2 + 'px' };
    },
    infoFontsize: function () {
      return { 'font-size': this.getFontsize * 0.8334 + 'px', "line-height": this.getFontsize + 'px' };
    },
    space: function () {
      return { 'margin-bottom': this.getChatSpace * 18 + 'px' };
    },
    ...Vuex.mapGetters([
      'getDisablePushGray',
      'getFontsize',
      'getChatSpace',
    ])
  },
  // mounted() { console.log("mounted", this.index, this.chat); },
  //updated: function () { if (reportmode) console.log('updated, uid, listIndex, chatIndex, msg', this.uid, this.index, this.chat.index, this.chat.msg); },
  template: `<li :id="chat.index" class="ptt-chat media px-3" v-bind:style="bgc">
  <div class="media-body mw-100">
    <div class="ptt-chat-info d-flex flex-row" :style="infoFontsize">
      <p :class="typeclass">{{ this.chat.type }}</p>
      <p class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.chat.id }}</p>
      <p class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</p>
    </div>
    <div>
      <chat-item-msg :msg="chat.msg"></chat-item-msg>
    </div>
    <div :style="space"> </div>
  </div>
</li>`,
});
