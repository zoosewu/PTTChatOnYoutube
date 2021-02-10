import { ConnectLogin } from './ConnectConnectSetting/ConnectLogin.js';
import { ConnectLoginDeleteOtherConnect } from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.js';
import { ConnectAID } from './ConnectConnectSetting/ConnectAID.js';

export let ConnectConnectSetting = {
  components: {
    "connect-login": ConnectLogin,
    "connect-login-delete-other-connect": ConnectLoginDeleteOtherConnect,
    "connect-aid": ConnectAID,
  },
  template: `<div class="mt-4 mb-1">
  <connect-login></connect-login>
  <connect-login-delete-other-connect></connect-login-delete-other-connect>
  <connect-aid></connect-aid>
</div>`,
}