
<template>
  <div class="mt-4 mb-1">
    <connect-login />
    <connect-login-delete-other-connect />
    <connect-anysearch />
    <connect-reinstance-ptt-btn />
  </div>
</template>

<script>
import ConnectLogin from './ConnectConnectSetting/ConnectLogin.vue'
import ConnectLoginDeleteOtherConnect from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue'
import ConnectReinstancePTTBtn from './ConnectConnectSetting/ConnectReinstancePttButton.vue'
import ConnectAnySearch from './ConnectConnectSetting/ConnectAnySearch.vue'

export default {
  components: {
    'connect-login': ConnectLogin,
    'connect-login-delete-other-connect': ConnectLoginDeleteOtherConnect,
    'connect-anysearch': ConnectAnySearch,
    'connect-reinstance-ptt-btn': ConnectReinstancePTTBtn
  }
}
</script>

<style lang="scss">
</style>
