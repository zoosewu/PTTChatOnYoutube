/* eslint-disable no-unused-vars */
import { ConnectPluginSettingInputElement } from './PluginSettings/ConnectPluginSettingInputElement.js'
/* eslint-enable no-unused-vars */
import { ConnectOtherSetting } from './PluginSettings/ConnectOtherSetting.js'
import { ConnectNewVersion } from './PluginSettings/ConnectNewVersion.js'
import { ConnectDropdownElement } from './PluginSettings/ConnectDropdownElement.js'
export const ConnectPluginSetting = {
  inject: ['dynamicPlugin'],
  data () {
    return {
      ThemeOptions: ['與網站相同', '淺色主題', '深色主題', '使用者自訂']
    }
  },
  computed: {
    ThemeColorBGOptions: function () {
      const array = ['黑色']
      for (let i = 1; i < 20; i++) array.push((i * 5) + '%')
      array.push('白色')
      return array
    },
    ThemeColorBorderOptions: function () {
      const array = ['黑色']
      for (let i = 1; i < 10; i++) array.push((i * 10) + '%')
      array.push('白色')
      return array
    },
    showThemeColorOption: function () {
      // console.log("showThemeColorOption", (+this.getTheme == 3));
      return (+this.getTheme === 3)
    },
    ...Vuex.mapGetters([
      'getTheme'
    ])
  },
  components: {
    // "connect-plugin-height": ConnectPluginHeight,
    'connect-other-setting': ConnectOtherSetting,
    'connect-new-version': ConnectNewVersion,
    'connect-dropdown': ConnectDropdownElement
  },
  template: `<div class="mt-4 mb-1">
  <div class="text-center mb-2">
    <h4 class="mb-1 mt-0">套件設定</h4>
    <p class="mt-1 mb-0">輸入數值之後按Enter確認</p>
  </div>
  <div class="form-row px-2">
    <plugin-setting-input setting-name="PluginHeight" description="套件長度(px)" default-value="850" max="850" min="180"
      column="6"> </plugin-setting-input>
    <plugin-setting-input setting-name="PushInterval" description="推文更新(s)" default-value="2.5" max="360" min="2.5"
      column="6"> </plugin-setting-input>
  </div>
  <div class="form-row px-2">
    <plugin-setting-input setting-name="Fontsize" description="字體尺寸(px)" default-value="16" max="30" min="9" column="6">
    </plugin-setting-input>
    <plugin-setting-input setting-name="ChatSpace" description="推文間隔(行)" default-value="0.5" max="5" min="0"
      column="6"> </plugin-setting-input>
  </div>
  <div class="form-row px-2" v-if="dynamicPlugin">
    <plugin-setting-input setting-name="PluginWidth" description="套件寬度" default-value="400" max="800" min="290"
      column="12"> </plugin-setting-input>
    <p class="my-0 px-2">僅Holotools、niji-mado可用，需重新整理</p>
  </div>
  <div class="form-row px-2" v-if="dynamicPlugin">
    <plugin-setting-input setting-name="PluginPortraitHeight" description="直立顯示時的套件高度" default-value="400" max="800" min="290"
      column="12"> </plugin-setting-input>
    <p class="my-0 px-2">僅舊版Holotools可用，需重新整理</p>
  </div>
  <div class="form-row px-2">
    <connect-dropdown setting-name="Theme" description="主題顏色" :option-group="ThemeOptions" default-value="0">
    </connect-dropdown>
    <connect-dropdown setting-name="ThemeColorBG" description="背景亮度" :option-group="ThemeColorBGOptions"
      default-value="2" v-if="showThemeColorOption">
    </connect-dropdown>
    <connect-dropdown setting-name="ThemeColorBorder" description="字體亮度" :option-group="ThemeColorBorderOptions"
      default-value="2" v-if="showThemeColorOption">
    </connect-dropdown>
  </div>
  <div class="form-row px-2">
    <connect-other-setting></connect-other-setting>
  </div>
  <div class="form-row px-2">
    <connect-new-version></connect-new-version>
  </div>
</div>`
}
