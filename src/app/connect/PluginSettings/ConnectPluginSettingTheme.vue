
<template>
  <div class="form-row px-2">
    <connect-dropdown
      :setting-name="'Theme'"
      :description="'主題顏色'"
      :option-group="ThemeOptions"
      :default-value="0"
    />
    <div
      ref="themeColorOption"
      class="collapse w-100"
    >
      <connect-dropdown
        :setting-name="'ThemeColorBG'"
        :description="'背景亮度'"
        :option-group="ThemeColorBGOptions"
        :default-value="2"
      />
      <connect-dropdown
        :setting-name="'ThemeColorBorder'"
        :description="'字體亮度'"
        :option-group="ThemeColorBorderOptions"
        :default-value="2"
      />
    </div>
  </div>
</template>

<script>
import ConnectDropdownElement from './ConnectDropdownElement.vue'
export default {
  components: {
    'connect-dropdown': ConnectDropdownElement
  },
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
  },
  watch: {
    getTheme (e) {
      if (+e === 3) $(this.$refs.themeColorOption).collapse('show')
      else $(this.$refs.themeColorOption).collapse('hide')
    }
  },
  mounted () {
    if (+this.getTheme === 3)$(this.$refs.themeColorOption).collapse('show')
  }
}
</script>

<style lang="scss">
</style>
