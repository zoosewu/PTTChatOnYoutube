
import { ConnectPluginSettingCheckboxElement } from './ConnectPluginSettingCheckboxElement.js';
//import { ConnectEnableSetNewChat } from './ConnectEnableSetNewChat.js';
//import { ConnectDisablePushGray } from './ConnectPluginSettingCheckboxElement.js';
export let ConnectOtherSetting = {
  mounted() {
    GM_deleteValue('disablepushgray');///
    GM_deleteValue('enablesetnewpush');///
    GM_deleteValue('chatFontsize');///
    GM_deleteValue('chatSpace');///
    GM_deleteValue('LastPostUID');///
    
    //console.log("remove check: " + GM_getValue('enablesetnewpush', "removed"));
  },
  template: `<div id="PTTConnect-OtherSetting" class="form-row px-0 mx-0 col-12 my-2">
  <legend class="col-form-label col-3 pt-0">其他設定</legend>
  <div class="col px-0">
    <plugin-setting-checkbox setting-name="EnableSetNewPush" description="推文功能(使用此功能後果請自負)" defaultValue="false"></plugin-setting-checkbox>
    <plugin-setting-checkbox setting-name="DisablePushGray" description="關閉灰色漸變以提升效能" defaultValue="false"></plugin-setting-checkbox>
  </div>
</div>`,
}