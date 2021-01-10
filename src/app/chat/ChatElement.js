

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
    msg: function () {
      var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");
    },
    typeclass: function () {
      const typecolor = this.chat.type === "推 " ? "ptt-chat-type" : "ptt-chat-type-n";
      return typecolor + " mr-2 mb-0";
    },
    bgc: function () {
      // console.log("bgc", this.index, this.chat, this.chat.gray);
      const isUnchat = this.gray ? "0.25" : "0";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      return { backgroundColor: color, transition: "2s" };
    },

  },
  // mounted() { console.log("mounted", this.index, this.chat); },
  updated: function () { if (reportmode) console.log('updated, uid, listIndex, chatIndex, msg', this.uid, this.index, this.chat.index, this.chat.msg); },
  template: `<li :id="chat.index" class="media px-4" v-bind:style="bgc">
  <div class="media-body mw-100">
    <div class="d-flex flex-row">
      <h5 :class="typeclass">{{ this.chat.type }}</h5>
      <h5 class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.chat.id }}</h5>
      <h5 class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</h5>
    </div>
    <div>
      <h4 class="ptt-chat-msg mb-0 ml-2 mr-2" style="word-break: break-all;" v-html="msg"></h4>
    </div>
    <div class="mb-4"> </div>
  </div>
</li>`,
});
