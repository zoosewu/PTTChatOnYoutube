
<template>
  <div class="mt-4 mb-1">
    <div class="text-center mb-2">
      <h4 class="mb-1 mt-0">
        套件設定
      </h4>
      <p class="mt-1 mb-0">
        輸入數值之後按Enter確認
      </p>
    </div>
    <div class="form-row px-2">
      <connect-plugin-setting-input-element
        :setting-name="'PluginHeight'"
        :description="'套件長度(px)'"
        :default-value="850"
        :max="850"
        :min="180"
        :column="6"
      />
      <connect-plugin-setting-input-element
        :setting-name="'PushInterval'"
        :description="'推文更新(s)'"
        :default-value="2.5"
        :max="360"
        :min="2.5"
        :column="6"
      />
    </div>
    <div class="form-row px-2">
      <connect-plugin-setting-input-element
        :setting-name="'Fontsize'"
        :description="'字體尺寸(px)'"
        :default-value="16"
        :max="30"
        :min="9"
        :column="6"
      />
      <connect-plugin-setting-input-element
        :setting-name="'ChatSpace'"
        :description="'推文間隔(行)'"
        :default-value="0.5"
        :max="5"
        :min="0"
        :column="6"
      />
    </div>
    <div
      v-if="dynamicPlugin"
      class="form-row px-2"
    >
      <connect-plugin-setting-input-element
        :setting-name="'PluginWidth'"
        :description="'套件寬度'"
        :default-value="400"
        :max="800"
        :min="290"
        :column="12"
      />
      <p class="my-0 px-2">
        僅Holotools、niji-mado可用，需重新整理
      </p>
    </div>
    <div
      v-if="dynamicPlugin"
      class="form-row px-2"
    >
      <connect-plugin-setting-input-element
        :setting-name="'PluginPortraitHeight'"
        :description="'直立顯示時的套件高度'"
        :default-value="400"
        :max="800"
        :min="290"
        :column="12"
      />
      <p class="my-0 px-2">
        僅舊版Holotools可用，需重新整理
      </p>
    </div>
    <div class="form-row px-2">
      <connect-dropdown
        :setting-name="'Theme'"
        :description="'主題顏色'"
        :option-group="ThemeOptions"
        :default-value="0"
      />
      <connect-dropdown
        v-if="showThemeColorOption"
        :setting-name="'ThemeColorBG'"
        :description="'背景亮度'"
        :option-group="ThemeColorBGOptions"
        :default-value="2"
      />
      <connect-dropdown
        v-if="showThemeColorOption"
        :setting-name="'ThemeColorBorder'"
        :description="'字體亮度'"
        :option-group="ThemeColorBorderOptions"
        :default-value="2"
      />
    </div>
    <div class="form-row px-2">
      <connect-other-setting />
    </div>
    <div class="form-row px-2">
      <connect-new-version />
    </div>
  </div>
</template>

<script>
import ConnectPluginSettingInputElement from './PluginSettings/ConnectPluginSettingInputElement.vue'
import ConnectOtherSetting from './PluginSettings/ConnectOtherSetting.vue'
import ConnectNewVersion from './PluginSettings/ConnectNewVersion.vue'
import ConnectDropdownElement from './PluginSettings/ConnectDropdownElement.vue'
export default {
  components: {
    'connect-plugin-setting-input-element': ConnectPluginSettingInputElement,
    'connect-other-setting': ConnectOtherSetting,
    'connect-new-version': ConnectNewVersion,
    'connect-dropdown': ConnectDropdownElement
  },
  inject: ['dynamicPlugin'],
  data () {
    return {
      ThemeOptions: ['與網站相同', '淺色主題', '深色主題', '使用者自訂']
    }
  },
  computed: {
    ThemeColorBGOptions: function () {
      const array = ['黑色']
      for (let i = 1; i < 20; i++) array.push(i * 5 + '%')
      array.push('白色')
      return array
    },
    ThemeColorBorderOptions: function () {
      const array = ['黑色']
      for (let i = 1; i < 10; i++) array.push(i * 10 + '%')
      array.push('白色')
      return array
    },
    showThemeColorOption: function () {
      // console.log("showThemeColorOption", (+this.getTheme == 3));
      return +this.getTheme === 3
    },
    ...Vuex.mapGetters(['getTheme'])
  }
}
</script>

<style lang="scss">
</style>
