Vue.component('ChatItemMsg', {
  props: { msgs: { type: String, required: true }, style: { type: Object, required: true } },
  data () {
    return {
      parsedmsg: []
    }
  },
  /* methods: {
    $_ChatElementMessage_ParseMsg: function () {
      //var exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      //return this.chat.msg.replace(exp, "<a class='ptt-chat-msg' href='$1' target='_blank' rel='noopener noreferrer'>$1</a>");

    },
  }, */
  computed: {
    msgList: function () {
      return this.msgs
    },
    ...Vuex.mapGetters([
      'getFontsize',
      'previewImage'
    ])
  },
  /* mounted() {
    this.$_ChatElementMessage_ParseMsg();
  }, */
  beforeDestroy () {
    this.msgList.forEach(element => { if (element.islink && this.previewImage === element.string) this.$store.dispatch('previewImage', '') })
  },
  render: function (createElement) {
    // <p class="ptt-chat-msg mb-0 mx-2" :style="msgFontsize"></p>
    return createElement(
      'p',
      {
        class: {
          'ptt-chat-msg': true,
          'mb-0': true,
          'mx-2': true
        },
        style: this.style
      },
      this.msgList.map(data => {
        if (!data.islink) return data.string
        return createElement('a', {
          class: {
            'ptt-chat-msg': true
          },
          attrs: {
            href: data.string,
            target: '_blank',
            rel: 'noopener noreferrer'
          },
          on: {
            mouseover: () => { /* console.log("onmouseover", data.string); */ this.$store.dispatch('previewImage', data.string) },
            mouseleave: () => { /* console.log("onmouseout", data.string); */ this.$store.dispatch('previewImage', '') }
          }
        }, data.string)
      })
    )
  }
})
