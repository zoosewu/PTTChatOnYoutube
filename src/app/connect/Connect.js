import { ConnectConnectSetting } from './ConnectConnectSetting.js';
import { ConnectPluginSetting } from './ConnectPluginSetting.js';
import { ConnectNewVersionInfo } from './ConnectNewVersionInfo.js';

export let Connect = {
  components: {
    "connect-connect-setting": ConnectConnectSetting,
    "connect-plugin-setting": ConnectPluginSetting,
    "connect-new-version-info": ConnectNewVersionInfo,
  },
  template: `<div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0">
  <connect-connect-setting></connect-connect-setting>
  <hr>
  <connect-plugin-setting></connect-plugin-setting>
  <hr>
  <connect-new-version-info></connect-new-version-info>
</div>`,
}