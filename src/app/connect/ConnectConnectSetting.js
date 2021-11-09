import { ConnectLogin } from './ConnectConnectSetting/ConnectLogin.js'
import { ConnectLoginDeleteOtherConnect } from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.js'
import { ConnectAID } from './ConnectConnectSetting/ConnectAID.js'
import { ConnectReinstancePTTBtn } from './ConnectConnectSetting/ConnectReinstancePTTBtn.js'
import { ConnectAutoLoadPostDropDown } from './ConnectConnectSetting/ConnectAutoLoadPostDropDown.js'

export const ConnectConnectSetting = {
  components: {
    'connect-login': ConnectLogin,
    'connect-login-delete-other-connect': ConnectLoginDeleteOtherConnect,
    'connect-aid': ConnectAID,
    'connect-reinstance-ptt-btn': ConnectReinstancePTTBtn,
    'connect-auto-load-post-dropdown': ConnectAutoLoadPostDropDown
  },
  template: `<div class="mt-4 mb-1">
  <connect-login></connect-login>
  <connect-login-delete-other-connect></connect-login-delete-other-connect>
  <connect-aid></connect-aid>
  <connect-auto-load-post-dropdown></connect-auto-load-post-dropdown>
  <connect-reinstance-ptt-btn></connect-reinstance-ptt-btn>
</div>`
}
