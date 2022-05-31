
<template>
  <div
    id="PTTConnect-OtherSetting"
    class="form-row px-0 mx-0 col-12 my-2"
  >
    <legend class="col-form-label col-3 pt-0">
      其他設定
    </legend>
    <div class="col px-0">
      <connect-plugin-setting-checkbox-element
        :setting-name="'EnableSetNewComment'"
        :description="'推文功能(使用此功能後果請自負)'"
        :default-value="false"
      />
      <connect-plugin-setting-checkbox-element
        :setting-name="'DisablePushGray'"
        :description="'關閉灰色漸變以提升效能'"
        :default-value="false"
      />
      <plugin-setting-blacklist
        :setting-name="'Blacklist'"
        :description="'ID黑名單'"
        text=""
      />
      <plugin-setting-blacklist
        :setting-name="'CommentBlacklist'"
        :description="'推文關鍵字黑名單'"
        text=""
      />
    </div>
  </div>
</template>

<script>
import ConnectPluginSettingCheckboxElement from './ConnectPluginSettingCheckboxElement.vue'
import ConnectPluginSettingBlacklist from './ConnectPluginSettingBlacklist.vue'
export default {
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement,
    'plugin-setting-blacklist': ConnectPluginSettingBlacklist
  }
}
</script>

<style lang="scss">
</style>
