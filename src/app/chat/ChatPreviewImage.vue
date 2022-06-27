
<template>
  <div style="z-index:460;">
    <img
      ref="imgel"
      :class="className"
      :style="style"
      :src="previewImageURL"
    >
  </div>
</template>

<script>
export default {
  data () {
    return {
      mousex: 0,
      mousey: 0,
      w: 0,
      h: 0
    }
  },

  computed: {
    preview: function () {
      return this.previewImageURL.match(/\.(jpeg|jpg|gif|png)$/) !== null
    },
    className: function () {
      const classes = ['position-fixed', 'my-2']
      if (this.preview) classes.push('d-block')
      else classes.push('d-none')
      return classes.join(' ')
    },
    style: function () {
      const l = this.mousex - this.getWidth() - 10
      const t = this.mousey - this.getHeight() - 10
      let styles = {
        left: l + 'px',
        top: t + 'px'
      }
      if (this.preview) {
        if (reportMode) console.log('W,H,', this.mousex, this.getWidth(), l, this.mousey, this.getHeight(), t)
        styles = {
          maxHeight: '400px',
          maxWidth: '400px',
          left: l + 'px',
          top: t + 'px'
        }
        // console.log("previewimage style", this.mousex, this.mousey, l, t, styles);
      }
      return styles
    },
    previewImageURL: function () {
      const url = this.previewImage
      return this.getNormalImage(url) || this.getImgurImage(url) || this.getYoutubeImage(url) || ''
    },
    ...Vuex.mapGetters(['previewImage'])
  },
  mounted () {
    const self = this
    $('body').mousemove(function (e) {
      self.mousex = e.pageX
      self.mousey = e.pageY
    })
  },
  beforeDestroy () { $('body').off('mousemove') },
  methods: {
    getWidth: function () {
      if (this.preview) this.w = this.$refs.imgel.width
      else this.w = -10000
      if (this.w === 0) this.w = 400
      return this.w
    },
    getHeight: function () {
      if (this.preview) this.h = this.$refs.imgel.height
      else this.h = -10000
      if (this.h === 0) this.h = 400
      return this.h
    },
    getNormalImage (text) {
      if (text.match(/\.(jpeg|jpg|gif|png)$/)) { return text } else { return null }
    },
    getImgurImage (text) {
      const isImageURL = text.match(/\b(https?|ftp|file):\/\/imgur\.com\/(\w+)/)
      if (isImageURL && isImageURL.length > 2) { return 'https://i.imgur.com/' + isImageURL[2] + '.png' } else { return null }
    },
    getYoutubeImage (text) {
      const videoURL = this.isYoutubeVideo(text)
      if (videoURL !== null) { return 'https://i.ytimg.com/vi/' + videoURL + '/maxresdefault.jpg' } else { return null }
    },
    isYoutubeVideo (text) {
      try {
        const youtubeURL = new URL(text)
        switch (youtubeURL.host) {
          case 'www.youtube.com':
          case 'm.youtube.com':
            return this.parseYoutubePreviewImage(youtubeURL)
          case 'youtu.be':
            return this.parseYoutubePreviewImageWithShortUrl(youtubeURL)
          default:
            return null
        }
      } catch (e) {
        return null
      }
    },
    parseYoutubePreviewImage (youtubeURL) {
      const youtubeURLArgs = youtubeURL.search.split('&')
      for (let i = 0; i < youtubeURLArgs.length; i++) {
        const isargvideo = this.parseYoutubeArgument(youtubeURLArgs[i])
        if (isargvideo !== null) return isargvideo
      }
      return null
    },
    parseYoutubeArgument (youtubeURLArg) {
      const isYoutubeURLArgVideo = youtubeURLArg.match('v=(.+)')
      if (isYoutubeURLArgVideo !== null) return isYoutubeURLArgVideo[1]
      else return null
    },
    parseYoutubePreviewImageWithShortUrl (url) {
      return url.pathname.split('/')[1]
    }
  },
  template: ''
}
</script>

<style lang="scss">
</style>
