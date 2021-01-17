export let PTTScreen = {
  inject: ['msg'],
  data() {
    return {
      src: "//term.ptt.cc/?url=" + this.msg.ownerorigin,
      iframe: {},
      show: true
    }
  },
  template: `<div id="PTTChat-contents-PTT-main" class="h-100 d-flex justify-content-center px-0">
  <iframe id="PTTframe" :src="src" class="h-100 flex-grow-1"
    style="zoom: 1.65; z-index: 351; -moz-transform: scale(1);" ref="ifm" v-if="show">你的瀏覽器不支援 iframe</iframe>
</div>`,
  methods: {
    removeiframe: function removeiframe(event) {
      console.log('removeiframe');
      this.$el.removeChild(this.iframe);
      //this.iframe.remove();
    }
  },
  mounted() {
    this.iframe = this.$refs.ifm;
    this.msg.targetWindow = this.iframe.contentWindow;
    window.addEventListener('beforeunload', this.removeiframe);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.removeiframe);
  }
}