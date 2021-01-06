
Vue.component('chat-item', {
  props: ['index', 'ChatStart', 'ChatEnd', 'ChatCurrent', 'type', 'id', 'timeH', 'timem', 'msg'],
  data: function () {
    return {
      dismissCount: 2,
      timerInterval: null,
      chatid: "chat-" + this.index,
    }
  },
  computed: {
    typeclass: function () {
      const typecolor = this.type === "噓" ? "ptt-chat-type-n" : "ptt-chat-type";
      return typecolor + "  mr-2 mb-0";
    },
    bgc: function () {
      const isUnchat = this.ChatCurrent >= this.index ? "0" : "0.25";
      const color = "rgba(128, 128, 128, " + isUnchat + ")";
      console.log("Chat:", this.index, "isischat", isUnchat);
      return { backgroundColor: color, transition: "0.5s" };
    }
  },
  watch: {

  },
  methods: {

  },
  mounted() {
    //console.log(this.index, this.type, this.id, this.timeH, this.timem, this.msg);
  },
  template: `<li :id="this.chatid" class="media px-4" v-if="index >= ChatStart && index <= ChatEnd" v-bind:style="bgc">
  <div class="media-body mw-100">
    <div class="d-flex flex-row">
      <h5 :class="typeclass">{{ this.type }}</h5>
      <h5 class="ptt-chat-id mr-2 mb-0 flex-grow-1">{{this.id }}</h5>
      <h5 class="ptt-chat-time mb-0">{{this.timeH }}:{{this.timem}}</h5>
    </div>
    <div>
      <h4 class="ptt-chat-msg mb-0 ml-2 mr-2" style="word-break: break-all;">{{ this.msg }}</h4>
    </div>
    <div class="mb-4"> </div>
  </div>
</li>`,
});
