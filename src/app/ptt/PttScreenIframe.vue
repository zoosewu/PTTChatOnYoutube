<template>
  <iframe
    v-if="!removePttFrame"
    id="PTTframe"
    :src="src"
    class="h-100 flex-grow-1"
  >你的瀏覽器不支援 iframe</iframe>
</template>

<script>
export default {
  inject: ['msg'],
  data () {
    return {
      src: '//term.ptt.cc/?url=' + this.msg.ownerorigin,
      removePttFrame: false
    }
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
  methods: {
    removeiframe: function (event) {
      if (this.msg.ownerorigin === 'https://holodex.net') {
        document.getElementById('PTTframe').parentElement.remove()
      } else {
        this.$el.parentNode.removeChild(this.$el)
      }
    }
  }
}

</script>

<style lang="scss" scoped>
iframe {
  zoom: 1.65;
  z-index: 351;
  -moz-transform: scale(1);
}
</style>
