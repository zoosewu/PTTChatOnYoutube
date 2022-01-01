<template>
  <div class="form-check">
    <input
      :id="settingName"
      v-model="SettingValue"
      type="checkbox"
      class="form-check-input"
      @change="$_PluginSetting_valueChange()"
    >
    <label
      class="form-check-label ml-2"
      :for="settingName"
    >{{ description }}</label>
  </div>
</template>

<script>
export default {
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    defaultValue: { type: Boolean, required: false, default: false }
  },
  data () { return { SettingValue: this.$store.getters['get' + this.settingName] } },
  methods: {
    $_PluginSetting_valueChange: function () { this.$store.dispatch('set' + this.settingName, this.SettingValue) }
  }
}
</script>

<style lang="scss">
</style>
