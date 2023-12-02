<template>
  <div
    id="PTTMain"
    class="pttchat rounded-right position-absolute rounded-bottom w-100 collapse"
  >
    <PTTAppMain :style="updateheight" />
  </div>
</template>

<script>
import PTTAppMain from './PttAppMain.vue'
export default {
  components: {
    PTTAppMain: PTTAppMain
  },
  computed: {
    updateheight () {
      return {
        height: this.$store.getters.getPluginHeight + 'px'
      }
    }
  },
  mouted () {
    GM_deleteValue('PostAID')
    GM_deleteValue('A-custom-PushIntervalMax')
    GM_deleteValue('A-custom-PushIntervalMin')
    GM_deleteValue('DisablePushGray')
    GM_deleteValue('PushInterval')
    GM_deleteValue('TitleList')
    GM_deleteValue('lastupdateframe')
    GM_deleteValue('lastupdatetop')
  }
}
</script>

<style lang="scss" scoped>
div {
  z-index: 3010 !important;
}
</style>
