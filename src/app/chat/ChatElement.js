

import ChatElementMessage from './ChatElementMessage.js';
export let ChatElement = {
  props: {
    item: { type: Object, required: true, },
    msgStyle: { type: Object, required: true, },
    infoStyle: { type: Object, required: true, },
    spaceStyle: { type: Object, required: true, },
  },
  computed: {
    /*msg: function () {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");
    },*/
    timeH: function () { return paddingLeft(this.item.time.getHours(), + 2); },
    timem: function () { return paddingLeft(this.item.time.getMinutes(), +2); },
    typeclass: function () {
      const typecolor = this.item.type === "推 " ? "ptt-chat-type" : "ptt-chat-type-n";
      return typecolor + " mr-2 mb-0";
    },
    bgc: function () {
      if (this.getDisablePushGray) return "";
      const isUnchat = this.item.gray ? "0.25" : "0";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      return { backgroundColor: color, transition: "2s" };
    },
    ...Vuex.mapGetters(['getDisablePushGray',])
  },
  mounted() { console.log("mounted", this.item); },
  updated: function () {
    if (reportmode) console.log('updated, listIndex, chatIndex, msg', this.item.id, this.item.msg);
  },
  template: `<div class="ptt-chat media px-3" :style="bgc">
  <div class="media-body mw-100">
    <div class="ptt-chat-info d-flex flex-row" :style="infoStyle">
      <p :class="typeclass">{{ this.item.type }}</p>
      <p class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.item.pttid }}</p>
      <p class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</p>
    </div>
    <div>
      <chat-item-msg :msg="item.msg" :style="msgStyle"></chat-item-msg>
    </div>
    <div :style="spaceStyle"> </div>
  </div>
</div>`,
}
