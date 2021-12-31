<template>
  <div
    id="PTTChat-contents-Connect-main"
    class="col overflow-auto h-100 mb-0 p-4"
    data-spy="scroll"
    data-offset="0"
  >
    <connect-connect-setting />
    <hr class="my-1">
    <connect-plugin-setting />
    <hr class="my-1">
    <connect-new-version-info />
  </div>
</template>

<script>
import ConnectConnectSetting from './ConnectConnectSetting.vue'
import ConnectPluginSetting from './ConnectPluginSetting.vue'
import ConnectNewVersionInfo from './ConnectNewVersionInfo.vue'
export default {
  components: {
    'connect-connect-setting': ConnectConnectSetting,
    'connect-plugin-setting': ConnectPluginSetting,
    'connect-new-version-info': ConnectNewVersionInfo
  }
}
</script>

<style lang="scss">
</style>
