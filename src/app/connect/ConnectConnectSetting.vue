
<template>
  <div class="mt-4 mb-1">
    <connect-login />
    <connect-login-delete-other-connect />
    <connect-aid />
    <connect-auto-load-post-dropdown />
    <connect-reinstance-ptt-btn />
  </div>
</template>

<script>
import ConnectLogin from './ConnectConnectSetting/ConnectLogin.vue'
import ConnectLoginDeleteOtherConnect from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue'
import ConnectAID from './ConnectConnectSetting/ConnectAID.vue'
import ConnectReinstancePTTBtn from './ConnectConnectSetting/ConnectReinstancePttButton.vue'
import ConnectAutoLoadPostDropDown from './ConnectConnectSetting/ConnectAutoLoadPostDropDown.vue'

export default {
  components: {
    'connect-login': ConnectLogin,
    'connect-login-delete-other-connect': ConnectLoginDeleteOtherConnect,
    'connect-aid': ConnectAID,
    'connect-reinstance-ptt-btn': ConnectReinstancePTTBtn,
    'connect-auto-load-post-dropdown': ConnectAutoLoadPostDropDown
  }
}
</script>

<style lang="scss">
</style>
