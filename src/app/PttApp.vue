<template>
  <div
    id="PTTMain"
    class="pttchat rounded-right position-absolute rounded-bottom w-100 collapse"
    style="z-index: 301;"
  >
    <PTTAppMain />
  </div>
</template>

<script>
import PTTAppMain from './PttAppMain.vue'
export default {
  components: {
    PTTAppMain: PTTAppMain
  }
}
</script>

<style lang="scss" scoped></style>
