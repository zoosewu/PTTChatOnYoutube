import { GenerateCryptKey } from '../../library.js'

export const PTTScreenIframe = {
  inject: ['msg'],
  data () {
    return {
      src: '//term.ptt.cc/?url=' + this.msg.ownerorigin,
      removePttFrame: false
    }
  },
  methods: {
    removeiframe: function (event) {
      if (this.msg.ownerorigin === 'https://holodex.net') {
        document.getElementById('PTTframe').parentElement.remove()
      } else {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  },
  beforeCreate () {
    /* eslint-disable no-global-assign */
    cryptkey = GenerateCryptKey()
    /* eslint-enable no-global-assign */
  },
  mounted () {
    if (this.msg.ownerorigin === 'https://holodex.net') {
      this.removePttFrame = true
      this.$nextTick(function () {
        const t = setInterval(() => {
          if (document.getElementById('PTTframe') !== null) {
            this.msg.targetWindow = document.getElementById('PTTframe').contentWindow
            clearInterval(t)
          }
        }, 200)
      })
    } else {
      this.msg.targetWindow = this.$el.contentWindow
    }
    window.addEventListener('beforeunload', this.removeiframe)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.removeiframe)
  },
  template: `<iframe id="PTTframe" :src="src" v-if="!removePttFrame" class="h-100 flex-grow-1" style="zoom: 1.65; z-index: 351; -moz-transform: scale(1);"
   >你的瀏覽器不支援 iframe</iframe>`
}
