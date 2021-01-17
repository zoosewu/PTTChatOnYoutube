import { ConnectStreamTimeSetting } from './ConnectConnectSetting/ConnectStreamTimeSetting.js';
import { ConnectLogin } from './ConnectConnectSetting/ConnectLogin.js';
import { ConnectLoginDeleteOtherConnect } from './ConnectConnectSetting/ConnectLoginDeleteOtherConnect.js';
import { ConnectAID } from './ConnectConnectSetting/ConnectAID.js';

export let ConnectConnectSetting = {
  components: {
    "connect-stream-time-setting": ConnectStreamTimeSetting,
    "connect-login": ConnectLogin,
    "connect-login-delete-other-connect": ConnectLoginDeleteOtherConnect,
    "connect-aid": ConnectAID,
  },
  template: `<div class="mt-4 mb-1">
  <connect-stream-time-setting></connect-stream-time-setting>
  <connect-login></connect-login>
  <connect-login-delete-other-connect></connect-login-delete-other-connect>
  <connect-aid></connect-aid>
</div>`,
}