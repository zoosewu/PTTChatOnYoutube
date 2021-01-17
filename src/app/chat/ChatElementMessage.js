

Vue.component('chat-item-msg', {
  props: { msg: { type: String, required: true }, },
  data() {
    return {
      parsedmsg: [],
    }
  },
  methods: {
    $_ChatElementMessage_ParseMsg: function () {
      //var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");
      let msg = this.msg;
      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(.*)/ig.exec(msg);
      let parsetime = 5;
      while (result && msg !== "" && parsetime > 0) {
        const prestring = result[1];
        const linkstring = result[2];
        if (prestring !== "") this.parsedmsg.push({ islink: false, string: prestring });
        this.parsedmsg.push({ islink: true, string: linkstring });
        msg = result[3];
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])(.*)/ig.exec(msg);
        parsetime--;
      }
      if (msg !== "") this.parsedmsg.push({ islink: false, string: msg });
    },
  },

  mounted() {
    this.$_ChatElementMessage_ParseMsg();
  },
  computed: {
    Fontsize: function () {
      return { 'font-size': this.getFontsize + 'px', "line-height": this.getFontsize * 1.2 + 'px' };
    },
    ...Vuex.mapGetters([
      'getFontsize',
    ])
  },
  render: function (createElement) {
    //<p class="ptt-chat-msg mb-0 mx-2" :style="msgFontsize"></p>
    return createElement(
      'p',
      {
        class: {
          "ptt-chat-msg": true,
          "mb-0": true,
          "mx-2": true,
        },
        style: this.Fontsize,
      },
      this.parsedmsg.map(data => {
        if (data.islink)
          return createElement('a', {
            class: {
              "ptt-chat-msg": true,
            },
            attrs: {
              href: data.string,
              target: '_blank',
              rel: 'noopener noreferrer',
            },
            on: {
              mouseover: () => { /*console.log("onmouseover", data.string);*/ this.$store.dispatch('previewImage', data.string) },
              mouseleave: () => { /*console.log("onmouseout", data.string);*/ this.$store.dispatch('previewImage', "") },
            },
          }, data.string);
        else return data.string;
      }));
  },
});
