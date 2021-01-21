

import ChatElementMessage from './ChatElementMessage.js';
export let ChatElement = {
  props: {
    item: { type: Object, required: true, },
    msgFontsize: { type: Object, required: true, },
    infoFontsize: { type: Object, required: true, },
    space: { type: Object, required: true, },
  },
  mixins: [VueVirtualScroller.IdState({ idProp: vm => vm.item.id, }),],
  idState() {
    return {
      timeH: paddingLeft(this.item.time.getHours(), + 2),
      timem: paddingLeft(this.item.time.getMinutes(), +2),
    }
  },
  /*data() {
    return {
      timeH: paddingLeft(this.item.time.getHours(), + 2),
      timem: paddingLeft(this.item.time.getMinutes(), +2),
    }
  },*/
  computed: {
    /*msg: function () {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");
    },*/
    typeclass: function () {
      const typecolor = this.item.type === "推 " ? "ptt-chat-type" : "ptt-chat-type-n";
      return typecolor + " mr-2 mb-0";
    },
    bgc: function () {
      if (this.getDisablePushGray) return "";
      const isUnchat = this.item.gray ? "0.25" : "0";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      return { backgroundColor: color };
    },
    ...Vuex.mapGetters([
      'getDisablePushGray',
    ])
  },
  // mounted() { console.log("mounted", this.chat); },
  updated: function () {
    if (reportmode) console.log('updated, listIndex, chatIndex, msg', this.item.id, this.item.msg);
  },
  template: `<div :id="item.id" class="ptt-chat media px-3" v-bind:style="bgc" :key="item.id">
  <div class="media-body mw-100">
    <div class="ptt-chat-info d-flex flex-row" :style="infoFontsize">
      <p :class="typeclass">{{ this.item.type }}</p>
      <p class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.item.pttid }}</p>
      <p class="ptt-chat-time mb-0">{{this.idState.timeH }}:{{this.idState.timem}}</p>
    </div>
    <div>
      <chat-item-msg :msg="item.msg"></chat-item-msg>
    </div>
    <div :style="space"> </div>
  </div>
</div>`,
}
