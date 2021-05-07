import { GenerateCryptKey } from '../../library.js'

export const PTTScreenIframe = {
  inject: ['msg'],
  data () {
    return {
      src: '//term.ptt.cc/?url=' + this.msg.ownerorigin
    }
  },
  methods: {
    removeiframe: function (event) {
      this.$el.parentNode.removeChild(this.$el)
    }
  },
  beforeCreate () {
    /* eslint-disable no-global-assign */
    cryptkey = GenerateCryptKey()
    /* eslint-enable no-global-assign */
  },
  mounted () {
    this.msg.targetWindow = this.$el.contentWindow
    window.addEventListener('beforeunload', this.removeiframe)
  },
  beforeDestroy () {
    window.removeEventListener('beforeunload', this.removeiframe)
  },
  template: `<iframe id="PTTframe" :src="src" class="h-100 flex-grow-1" style="zoom: 1.65; z-index: 351; -moz-transform: scale(1);"
   >你的瀏覽器不支援 iframe</iframe>`
}
