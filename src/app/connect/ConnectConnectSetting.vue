
<template>
  <div class="mt-4 mb-1">
    <connect-login />
    <connect-login-delete-other-connect />
    <connect-aid />
    <connect-autofetchpostdropdown
      setting-name="AutoFetchPost"
      description="標題搜尋"
    />
    <connect-reinstance-ptt-btn />
  </div>
</template>

<script>
import ConnectLogin from './ConnectConnectSetting/ConnectLogin.vue'
import ConnectLoginDeleteOtherConnect from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue'
import ConnectAID from './ConnectConnectSetting/ConnectAID.vue'
import ConnectReinstancePTTBtn from './ConnectConnectSetting/ConnectReinstancePttButton.vue'
import ConnectAutoFetchPostDropDownElement from './ConnectConnectSetting/ConnectAutoFetchPostDropDownElement.vue'

export default {
  components: {
    'connect-login': ConnectLogin,
    'connect-login-delete-other-connect': ConnectLoginDeleteOtherConnect,
    'connect-aid': ConnectAID,
    'connect-reinstance-ptt-btn': ConnectReinstancePTTBtn,
    'connect-autofetchpostdropdown': ConnectAutoFetchPostDropDownElement
  },
  data () {
    return {
      DropDownList: { // empty dict of boards will be automatically hidden and grouped to 施工中
        C_Chat: {
          holo: '間直播單',
          DD串: 'DD串'
        },
        Vtuber: {
          彩虹社: '彩虹直播'
        },
        Baseball: {

        },
        LoL: {

        },
        '直播單 (C_Chat)': '直播單 (C_Chat)',
        '彩虹直播 (Vtuber)': '彩虹直播 (Vtuber)'
      }
    }
  }
}
</script>

<style lang="scss">
</style>
