
<template>
  <div>
    <div class="form-row mb-3">
      <div class="col">
        <connect-plugin-setting-checkbox-element
          :setting-name="'AnySearchHint'"
          :description="'顯示詳細說明'"
          :default-value="false"
        />
      </div>
    </div>
    <div
      ref="AnySearchHint"
      class="text-break collapse"
    >
      <pre>
      搜尋規則為[看板名稱,搜尋指令+關鍵字,搜尋指令+關鍵字]
      最多可以搜尋兩次, 可以搜尋的種類有:
      # AID搜尋        /或? 標題搜尋
      a 作者搜尋        Z 推文數搜尋
      G 標記搜尋        A 稿酬搜尋
      ! 排除關鍵字(僅限第二次搜尋時使用)
      範例:C_Chat,/間直播,Z5
      在C_Chat板搜尋標題含有"間直播"且推文數5以上最新的一篇文章
      PTT本身的AID格式(#1VobIvqC (C_Chat))也可以使用
      </pre>
      <div />
    </div>
  </div>
</template>

<script>
import ConnectPluginSettingCheckboxElement from '../PluginSettings/ConnectPluginSettingCheckboxElement.vue'
export default {
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement
  },
  data () {
    return {
      showHint: false,
      hint: ''
    }
  },
  computed: {
    ...Vuex.mapGetters(['getAnySearchHint'])
  },
  watch: {
    getAnySearchHint (e) {
      $(this.$refs.AnySearchHint).collapse(e ? 'show' : 'hide')
    }
  },
  mounted () {
    if (this.getAnySearchHint)$(this.$refs.AnySearchHint).collapse('show')
  }
}
</script>

<style lang="scss">
</style>
