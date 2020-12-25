import ConnectStreamTimeSetting from './ConnectStreamTimeSetting.js';
import ConnectLogin from './ConnectLogin.js';
import ConnectAID from './ConnectAID.js';
import ConnectOtherSetting from './ConnectOtherSetting.js';
import ConnectPluginHeight from './ConnectPluginHeight.js';

export let Connect = {
  template: `<div id="PTTChat-contents-Connect-main" class="col overflow-auto h-100 mb-0 p-4" data-spy="scroll" data-offset="0">
  <ConnectStreamTimeSetting></ConnectStreamTimeSetting>
  <ConnectLogin></ConnectLogin>
  <ConnectAID></ConnectAID>
  <ConnectPluginHeight></ConnectPluginHeight>
  <ConnectOtherSetting></ConnectOtherSetting>
</div>`,
  components: {
    "ConnectStreamTimeSetting": ConnectStreamTimeSetting,
    "ConnectLogin": ConnectLogin,
    "ConnectAID": ConnectAID,
    "ConnectPluginHeight":ConnectPluginHeight,
    "ConnectOtherSetting": ConnectOtherSetting
  }
}