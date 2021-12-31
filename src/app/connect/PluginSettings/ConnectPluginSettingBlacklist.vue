
<template>
  <div class="col">
    <textarea
      id="blacklist"
      v-model="SettingValue"
      class="form-control"
      rows="5"
      placeholder="一行一個ID\n隱藏舊推文需重新整理"
      @change="$_PluginSetting_valueChange($event)"
    />
  </div>
</template>

<script>
export default {
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    text: { type: String, required: false, default: '' }
  },
  data () { return { SettingValue: this.$store.getters['get' + this.settingName] } },
  methods: {
    $_PluginSetting_valueChange: function () { this.$store.dispatch('set' + this.settingName, this.SettingValue) }
  }
}
</script>

<style lang="scss">
</style>
