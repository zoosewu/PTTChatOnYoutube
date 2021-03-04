import { ConnectLogin } from './ConnectConnectSetting/ConnectLogin.js';
import { ConnectLoginDeleteOtherConnect } from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.js';
import { ConnectAID } from './ConnectConnectSetting/ConnectAID.js';
import { ConnectReinstancePTTBtn } from './ConnectConnectSetting/ConnectReinstancePTTBtn.js';

export let ConnectConnectSetting = {
  components: {
    "connect-login": ConnectLogin,
    "connect-login-delete-other-connect": ConnectLoginDeleteOtherConnect,
    "connect-aid": ConnectAID,
    "connect-reinstance-ptt-btn": ConnectReinstancePTTBtn,
  },
  template: `<div class="mt-4 mb-1">
  <connect-login></connect-login>
  <connect-login-delete-other-connect></connect-login-delete-other-connect>
  <connect-aid></connect-aid>
  <connect-reinstance-ptt-btn></connect-reinstance-ptt-btn>
</div>`,
}