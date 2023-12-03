
<template>
  <div class="mt-4 mb-1">
    <connect-component-title
      :title="'套件設定'"
      :description="'輸入數值之後按Enter確認'"
    />
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
        :setting-name="'CommentInterval'"
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
      v-if="siteName === 'Holotools' ||siteName === 'niji-mado'"
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
      v-if="siteName === 'Holotools'"
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
    <connect-plugin-setting-theme />
    <div class="form-row px-2">
      <connect-other-setting />
    </div>
    <div class="form-row px-2">
      <connect-new-version />
    </div>
  </div>
</template>

<script>
import ConnectComponentTitle from './Components/ConnectComponentTitle.vue'
import ConnectPluginSettingInputElement from './PluginSettings/ConnectPluginSettingInputElement.vue'
import ConnectPluginSettingTheme from './PluginSettings/ConnectPluginSettingTheme.vue'
import ConnectOtherSetting from './PluginSettings/ConnectOtherSetting.vue'
import ConnectNewVersion from './PluginSettings/ConnectNewVersion.vue'
export default {
  components: {
    'connect-component-title': ConnectComponentTitle,
    'connect-plugin-setting-input-element': ConnectPluginSettingInputElement,
    'connect-plugin-setting-theme': ConnectPluginSettingTheme,
    'connect-other-setting': ConnectOtherSetting,
    'connect-new-version': ConnectNewVersion
  },
  computed: {
    ...Vuex.mapGetters(['siteName'])
  }
}
</script>
