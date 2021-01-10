import { ConnectStreamTimeSetting } from './ConnectStreamTimeSetting.js';
import { ConnectLogin } from './ConnectLogin.js';
import { ConnectAID } from './ConnectAID.js';
import { ConnectOtherSetting } from './ConnectOtherSetting.js';
import { ConnectPluginHeight } from './ConnectPluginHeight.js';

export let Connect = {
  components: {
    "connect-stream-sime-setting": ConnectStreamTimeSetting,
    "connect-login": ConnectLogin,
    "connect-aid": ConnectAID,
    "connect-plugin-height": ConnectPluginHeight,
    "connect-other-setting": ConnectOtherSetting,
  },
  template: `<div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0">
  <connect-stream-sime-setting></connect-stream-sime-setting>
  <connect-login></connect-login>
  <connect-aid></connect-aid>
  <connect-plugin-height></connect-plugin-height>
  <connect-other-setting></connect-other-setting>
</div>`,
}