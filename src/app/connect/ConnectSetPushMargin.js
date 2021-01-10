export let ConnectSetPushMargin = {
  inject: ['isStream'],
  data: function () {
    return {
      enablesetnewpush: GM_getValue('enablesetnewpush', false),
    }
  },
  methods: {
    valueChange: function () {
      this.$store.dispatch('enableSetNewPush', this.enablesetnewpush);
    }
  },
  computed: {
    className: function () {
      let classes = [];
      if (!this.isStream) { classes.push("d-none"); }
      return classes.join(' ');
    }
  },
  mounted() {
    this.valueChange();
  },
  template: `<div class="form-check" :class="className">
  <input type="checkbox" class="form-check-input" id="enable-set-new-push" v-model="enablesetnewpush"
    @change="valueChange($event)">
  <label class="form-check-label ml-2" for="enable-set-new-push">推文功能(使用此功能後果請自負)</label>
</div>`,
}