

import ChatElementMessage from './ChatElementMessage.js';
export let ChatElement = {
  props: {
    item: { type: Object, required: true, },
    msgStyle: { type: Object, required: true, },
    infoStyle: { type: Object, required: true, },
    spaceStyle: { type: Object, required: true, },
    activeChat: { type: Boolean, required: true, },
  },
  methods: {
    $_ChatElementMessage_GrayCheck() {
      if (reportmode) console.log("GrayCheck", this.item, "id", this.item.id, "activeChat", this.activeChat, this.item, "id>activeChat", this.item.id > this.activeChat, "->", this.item.gray, "getDisablePushGray", this.getDisablePushGray);
      if (this.item.id > this.activeChat && !this.item.gray) this.$emit('updategray', this.item.id, true);
      else if (this.item.id <= this.activeChat && this.item.gray) this.$emit('updategray', this.item.id, false);
    },
    $_ChatElementMessage_MoueseEnter(url) {
      this.$store.dispatch('previewImage', url);
    },
    $_ChatElementMessage_MoueseLeave(url) {
      this.$store.dispatch('previewImage', "");
    },
    $_ChatElementMessage_GotoPost(aid) {
      console.log("GotoPost");
      this.$store.dispatch("gotoPost", aid);
    },
  },
  computed: {
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
  watch: {
    activeChat: function () { this.$_ChatElementMessage_GrayCheck(); }
  },
  mounted() {
    if (!this.getDisablePushGray) this.$_ChatElementMessage_GrayCheck();
    this.$nextTick(function () {
      this.$refs.p.mouseEnter = this.$_ChatElementMessage_MoueseEnter;
      this.$refs.p.mouseLeave = this.$_ChatElementMessage_MoueseLeave;
      this.$refs.p.gotoPost = this.$_ChatElementMessage_GotoPost;
      if (reportmode) console.log("mounted", this, this.$refs);
    });
  },
  updated() { if (reportmode) console.log('updated, listIndex, chatIndex, msg', this.item.id, this.item.msg); },
  template: `<div class="ptt-chat media px-3" :style="bgc">
  <div class="media-body mw-100">
    <div class="ptt-chat-info d-flex flex-row" :style="infoStyle">
      <p :class="typeclass">{{ this.item.type }}</p>
      <p class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.item.pttid }}</p>
      <p class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</p>
    </div>
    <div>
      <p class="ptt-chat-msg mb-0 mx-2" :style="msgStyle" v-html="item.msg" ref="p"></p>
    </div>
    <div :style="spaceStyle"> </div>
  </div>
</div>`,
}
