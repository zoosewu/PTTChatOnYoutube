<template>
  <ul
    id="PTTChat-navbar"
    class="nav nav-tabs justify-content-center"
    role="tablist"
  >
    <li
      class="nav-item"
      :go="isGotoChat"
    >
      <a
        id="nav-item-Chat"
        ref="chatbtn"
        class="nav-link ptt-text bg-transparent"
        data-toggle="tab"
        href="#PTTChat-contents-Chat"
        role="tab"
        aria-controls="PTTChat-contents-Chat"
        aria-selected="false"
      >聊天室</a>
    </li>
    <li class="nav-item">
      <a
        id="nav-item-Connect"
        class="nav-link ptt-text bg-transparent active"
        data-toggle="tab"
        href="#PTTChat-contents-Connect"
        role="tab"
        aria-controls="PTTChat-contents-Connect"
        aria-selected="true"
      >連線設定</a>
    </li>
    <li class="nav-item">
      <a
        id="nav-item-other"
        class="nav-link ptt-text bg-transparent"
        data-toggle="tab"
        href="#PTTChat-contents-other"
        role="tab"
        aria-controls="PTTChat-contents-other"
        aria-selected="false"
      >說明</a>
    </li>
    <li class="nav-item">
      <a
        id="nav-item-PTT"
        class="nav-link ptt-text bg-transparent"
        data-toggle="tab"
        href="#PTTChat-contents-PTT"
        role="tab"
        aria-controls="PTTChat-contents-PTT"
        aria-selected="false"
      >PTT畫面</a>
    </li>
    <li class="nav-item">
      <a
        id="nav-item-log"
        class="nav-link ptt-text bg-transparent"
        data-toggle="tab"
        href="#PTTChat-contents-log"
        role="tab"
        aria-controls="PTTChat-contents-log"
        aria-selected="false"
      >log</a>
    </li>
    <li class="nav-item">
      <button
        id="nav-item-TimeSet"
        class="nav-link ptt-text bg-transparent d-none"
        type="button"
        data-toggle="collapse"
        data-target="#PTTChat-Time"
        aria-controls="PTTChat-Time"
        aria-expanded="false"
      >
        時間
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  computed: {
    isGotoChat: function () {
      const go = this.gotoChat
      if (reportMode) console.log('isGotoChat', go)
      if (go) {
        this.$store.dispatch('gotoChat', false)
        this.$refs.chatbtn.click()
        if (reportMode) console.log('gotoChat')
      }
      return go
    },
    ...Vuex.mapGetters([
      'gotoChat'
    ])
  }
}
</script>

<style lang="scss">
</style>
