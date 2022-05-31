
<template>
  <div>
    <connect-plugin-setting-checkbox-element
      :setting-name="'Enable' + settingName"
      :description="'啟用' + description"
      :default-value="false"
    />
    <div
      ref="isEnable"
      class="col collapse"
    >
      <textarea
        :id="settingName"
        v-model="SettingValue"
        class="form-control"
        rows="5"
        :placeholder="'一行一個關鍵字\n想要隱藏舊推文需重新整理'"
        @change="$_PluginSetting_valueChange($event)"
      />
    </div>
  </div>
</template>

<script>
import ConnectPluginSettingCheckboxElement from './ConnectPluginSettingCheckboxElement.vue'
export default {
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement
  },
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    text: { type: String, required: false, default: '' }
  },
  data () { return { SettingValue: this.$store.getters['get' + this.settingName] } },
  computed: {
    isEnable: function () {
      return this.$store.getters['getEnable' + this.settingName]
    }
  },
  watch: {
    isEnable: function (e) {
      $(this.$refs.isEnable).collapse(e ? 'show' : 'hide')
    }
  },
  mounted () {
    if (this.isEnable)$(this.$refs.isEnable).collapse('show')
  },
  methods: {
    $_PluginSetting_valueChange: function () { this.$store.dispatch('set' + this.settingName, this.SettingValue) }
  }
}
</script>

<style lang="scss">
</style>
