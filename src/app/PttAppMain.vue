<template>
  <div
    id="PTTChat-app"
    class="ptt-bg ptt-border rounded w-100 d-flex flex-column"
  >
    <PTTAppNav />
    <PTTAppContent />
  </div>
</template>

<script>
import PTTAppNav from './PttAppNav.vue'
import PTTAppContent from './PttAppContent.vue'

export default {
  components: {
    PTTAppNav: PTTAppNav,
    PTTAppContent: PTTAppContent
  }
}
</script>

<style lang="scss">
</style>
