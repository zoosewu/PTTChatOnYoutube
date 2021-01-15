Vue.component('plugin-setting-input', {
  inject: ['pluginWidth'],
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    defaultValue: { type: Number, required: true },
    max: { type: Number, required: true },
    min: { type: Number, required: true },
    confirmBtn: { type: Boolean, required: false },
    column: { type: Number, required: false },
  },
  data: function () {
    return {
      SettingValue: this.$store.getters["get" + this.settingName],
      ValueMax: +GM_getValue('A-custom-' + this.settingName + 'Max', -1),
      ValueMin: +GM_getValue('A-custom-' + this.settingName + 'Min', -1),
      Btn: this.confirmBtn ? this.confirmBtn : false,
      BtnID: this.settingName + '-btn',
      Col: this.column ? this.column : 12,

    }
  },
  methods: {
    $_PluginSetting_update: function () {
      if (reportmode) console.log("$_PluginSetting_update", this.SettingValue);
      if (+this.SettingValue > this.ValueMax) { this.SettingValue = this.ValueMax; }
      else if (+this.SettingValue < this.ValueMin) { this.SettingValue = this.ValueMin; }

      this.$store.dispatch('set' + this.settingName, this.SettingValue);
    },
    $_PluginSetting_MaxCheck: function () {
      if (this.ValueMax < 0) {
        this.ValueMax = this.max;
        GM_setValue('A-custom-' + this.settingName + 'Max', this.max);
      }
    },
    $_PluginSetting_MinCheck: function () {
      if (this.ValueMin < 0) {
        this.ValueMin = this.min;
        GM_setValue('A-custom-' + this.settingName + 'Min', this.min);
      }
    },
    $_PluginSetting_ValueCheck: function () {
      if (this.SettingValue < 0) this.SettingValue = this.defaultValue;
      this.$_PluginSetting_update();
    },
  },
  computed: {
    Classes: function () {
      let c = this.Col;
      if (this.pluginWidth < 399) c = Math.min(this.Col * 2, 12);
      if (reportmode) console.log("Classes", this.Col, c);
      const classes = ["form-row", "px-0", "mx-0"];
      if (this.pluginWidth < 399) classes.push("my-2", "col-" + Math.min(this.Col * 2, 12));
      else classes.push("my-3", "col-" + Math.min(this.Col, 12));
      return classes.join(' ');
    },
    LabelClasses: function () {
      const col = parseInt(12 / this.Col) * 3;
      const classes = ["col-form-label"];
      if (this.pluginWidth < 399) classes.push("col-" + Math.min(col * 2, 12));
      else classes.push("col-" + col);
      return classes.join(' ');
    },
  },
  mounted() {
    this.$_PluginSetting_MaxCheck();
    this.$_PluginSetting_MinCheck();
    this.$_PluginSetting_ValueCheck();
  },
  template:
    `<div :class="Classes">
    <label :for="settingName" :class="LabelClasses">{{this.description}}</label>
    <div class="col px-0">
      <input :id="settingName" class="form-control" type="text" :placeholder="defaultValue" autocomplete="off"
        v-on:keyup.13="$_PluginSetting_update" v-model.lazy="SettingValue">
    </div>
    <div class="col-2 pr-0" v-if="Btn">
      <button :id="BtnID" class="btn ptt-btnoutline w-100" @click.self="$_PluginSetting_update()"
        type="button">確認</button>
    </div>
  </div>`,
});