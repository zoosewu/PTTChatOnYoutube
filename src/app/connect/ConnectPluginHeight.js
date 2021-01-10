export let ConnectPluginHeight = {
  el: "#connectpluginheight",
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
  },
  template: `<div id="connectpluginheight" class="form-row my-3">
  <label for="setH" class="col-3 col-form-label">設定插件長度</label>
  <div class="col">
    <input id="setHeight" class="form-control" type="text" placeholder="600" autocomplete="off"
      v-on:keyup.13="newHeight" v-model.lazy="inputheight">
  </div>
  <div class="col-2 px-0">
    <button id="setHeightbtn" class="btn ptt-btnoutline w-100" @click.self="newHeight()"
      type="button">確認</button>
  </div>
</div>`

}