export let ConnectPluginHeight = {
  el: "#connectpluginheight",
  template: `<div id="connectpluginheight" class="my-3 form-row">
  <label for="setH" class="col-3 col-form-label">設定插件長度</label>
  <input id="setHeight" class="form-control col mr-3" type="text" placeholder="600" autocomplete="off"
    v-on:keyup.13="newHeight()" v-model.lazy="inputheight">
  <button id="setHeightbtn" class="btn ptttext border btn-outline-secondary" @click="newHeight()"
    type="button">確認</button>
</div>`,
  data: function () {
    return {
      inputheight: this.$store.getters.getHeight
    }
  },
  methods: {
    newHeight: function () {
      if (this.inputheight > 800) this.inputheight = 800;
      if (this.inputheight < 180) this.inputheight = 180;
      this.$store.dispatch('setHeight', this.inputheight);
    }
  }
}