<template>
  <div :class="Classes">
    <label
      :for="settingName"
      :class="LabelClasses"
    >{{ description }}</label>
    <div class="col px-0">
      <input
        :id="settingName"
        v-model.lazy="SettingValue"
        class="form-control"
        type="text"
        :placeholder="defaultValue"
        autocomplete="off"
        @keyup.13="$_PluginSetting_update"
      >
    </div>
    <div
      v-if="confirmBtn"
      class="col-2 pr-0"
    >
      <button
        :id="BtnId"
        class="btn ptt-btnoutline w-100"
        type="button"
        @click.self="$_PluginSetting_update()"
      >
        確認
      </button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['nowPluginWidth'],
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    defaultValue: { type: Number, required: true },
    max: { type: Number, required: true },
    min: { type: Number, required: true },
    confirmBtn: { type: Boolean, required: false, default: false },
    column: { type: Number, required: false, default: 12 },
    perwebsite: { type: Boolean, required: false, default: false }
  },
  data () {
    return {
      SettingValue: +GM_getValue(this.settingName, -1),
      ValueMax: +GM_getValue('A-custom-' + this.settingName + 'Max', -1),
      ValueMin: +GM_getValue('A-custom-' + this.settingName + 'Min', -1),
      BtnId: this.settingName + '-btn',
      Col: this.column
    }
  },
  computed: {
    Classes: function () {
      const classes = ['form-row', 'px-0', 'mx-0', 'my-2']
      if (this.nowPluginWidth < 399) { classes.push('col-' + Math.min(this.Col * 2, 12)) } else classes.push('col-' + Math.min(this.Col, 12))
      return classes.join(' ')
    },
    LabelClasses: function () {
      const col = parseInt(12 / this.Col) * 3
      const classes = ['col-form-label']
      if (this.nowPluginWidth < 399) classes.push('col-12')
      else classes.push('col-' + col)
      return classes.join(' ')
    },
    ...Vuex.mapGetters([
      'customPluginSetting',
      'siteName'
    ])
  },
  watch: {
    customPluginSetting () {
      this.SettingValue = +GM_getValue(this.settingName + (this.customPluginSetting ? '-' + this.siteName : ''), -1)
      this.$_PluginSetting_GetValue()
      this.$_PluginSetting_MaxCheck()
      this.$_PluginSetting_MinCheck()
      this.$_PluginSetting_ValueCheck()
    }
  },
  mounted () {
    this.$_PluginSetting_MaxCheck()
    this.$_PluginSetting_MinCheck()
    this.$_PluginSetting_ValueCheck()
  },
  methods: {
    $_PluginSetting_update: function () {
      if (reportMode) { console.log('$_PluginSetting_update', this.settingName, this.SettingValue) }
      if (+this.SettingValue > this.ValueMax) {
        this.SettingValue = this.ValueMax
      } else if (+this.SettingValue < this.ValueMin) {
        this.SettingValue = this.ValueMin
      }
      this.$store.dispatch('set' + this.settingName, this.SettingValue)
    },
    $_PluginSetting_GetValue: function () {
      this.ValueMax = +GM_getValue('A-custom-' + this.settingName + 'Max' + (this.customPluginSetting ? '-' + this.siteName : ''), -1)
      this.ValueMin = +GM_getValue('A-custom-' + this.settingName + 'Min' + (this.customPluginSetting ? '-' + this.siteName : ''), -1)
    },
    $_PluginSetting_MaxCheck: function () {
      if (this.ValueMax < 0) {
        this.ValueMax = this.max
        GM_setValue('A-custom-' + this.settingName + 'Max' + (this.customPluginSetting ? '-' + this.siteName : ''), this.max)
      }
    },
    $_PluginSetting_MinCheck: function () {
      if (this.ValueMin < 0) {
        this.ValueMin = this.min
        GM_setValue('A-custom-' + this.settingName + 'Min' + (this.customPluginSetting ? '-' + this.siteName : ''), this.min)
      }
    },
    $_PluginSetting_ValueCheck: function () {
      if (showAllLog)console.log('ValueCheck', this.settingName, this.customPluginSetting)
      if (this.SettingValue < 0) this.SettingValue = this.defaultValue
      this.$_PluginSetting_update()
    }
  }
}
</script>

<style lang="scss">
</style>
