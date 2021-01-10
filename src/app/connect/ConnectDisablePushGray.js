export let ConnectDisablePushGray = {
  data: function () {
    return {
      disablepushgray: GM_getValue('disablepushgray', false),
    }
  },
  methods: {
    valueChange: function () {
      this.$store.dispatch('disablePushGray', this.disablepushgray);
    }
  },
  mounted() {
    this.valueChange();
  },
  template: `<div class="form-check">
  <input type="checkbox" class="form-check-input" id="disable-push-gray" v-model="disablepushgray"
    @change="valueChange($event)">
  <label class="form-check-label ml-2" for="disable-push-gray">關閉灰色漸變以提升效能</label>
</div>`,
}