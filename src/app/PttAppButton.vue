<template>
  <a
    id="PTTMainBtn"
    class="btn btn-lg ptt-btnoutline position-absolute openpttchat"
    type="button"
    data-toggle="collapse"
    data-target="#PTTMain"
    aria-expanded="false"
    aria-controls="PTTMain"
    @click.self="$_PttAppButton_Openpttchat()"
  >P</a>
</template>

<script>
import gaUseExtensionEvent from 'src/ga/useExtensionEvent'
export default {
  methods: {
    $_PttAppButton_Openpttchat: function () {
      gaUseExtensionEvent()
    }
  }
}
</script>

<style lang="scss" scoped>
a {
  z-index: 4000 !important;
}
</style>
