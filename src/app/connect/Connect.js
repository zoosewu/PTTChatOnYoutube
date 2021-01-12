import { ConnectStreamTimeSetting } from './ConnectStreamTimeSetting.js';
import { ConnectLogin } from './ConnectLogin.js';
import { ConnectAID } from './ConnectAID.js';
import { ConnectPluginSetting } from './ConnectPluginSetting.js';
import { ConnectNewVersionInfo } from './PluginSettings/ConnectNewVersionInfo.js';

export let Connect = {
  components: {
    "connect-stream-sime-setting": ConnectStreamTimeSetting,
    "connect-login": ConnectLogin,
    "connect-aid": ConnectAID,
    "connect-plugin-setting": ConnectPluginSetting,
    "connect-new-version-info": ConnectNewVersionInfo,
  },
  template: `<div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0">
  <div class="my-4">
    <connect-stream-sime-setting></connect-stream-sime-setting>
    <connect-login></connect-login>
    <connect-aid></connect-aid>
  </div>
  <hr>
  <connect-plugin-setting></connect-plugin-setting>
  <hr>
  <div class="my-4">
    <connect-new-version-info></connect-new-version-info>
  </div>
</div>`,
}