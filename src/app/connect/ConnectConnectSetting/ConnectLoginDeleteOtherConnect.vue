<template>
  <div class="form-row mb-3">
    <div class="col">
      <connect-plugin-setting-checkbox-element
        :setting-name="'DeleteOtherConnect'"
        :description="'刪除其他重複連線(無法登入時請開啟)'"
        :default-value="false"
      />
    </div>
  </div>
</template>

<script>
import ConnectPluginSettingCheckboxElement from '../PluginSettings/ConnectPluginSettingCheckboxElement.vue'
export default {
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement
  }
}
</script>

<style lang="scss">
</style>
