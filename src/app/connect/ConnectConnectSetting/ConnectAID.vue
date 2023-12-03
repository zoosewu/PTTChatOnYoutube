
<template>
  <div
    class="form-row my-3"
    :now-aid="nowAID"
  >
    <label
      for="postAID"
      class="col-3 col-form-label"
    >代碼搜尋</label>
    <div class="col">
      <input
        id="postAID"
        v-model.lazy="aid"
        class="form-control"
        type="text"
        placeholder="#1VobIvqC (C_Chat)"
        autocomplete="off"
        @keyup.13="$_ConnectAID_SubmitSearch"
      >
    </div>
    <div class="col-2 px-0">
      <button
        id="postAIDbtn"
        class="btn ptt-btnoutline w-100 px-2"
        type="button"
        @click.self="$_ConnectAID_SubmitSearch()"
      >
        讀取
      </button>
    </div>
  </div>
</template>

<script>
export default {
  inject: ['msg', 'isStream'],
  data () {
    return {
      aid: GM_getValue('PostAID', ''),
      lastaid: GM_getValue('PostAID', ''),
      forceSubmit: false
    }
  },
  computed: {
    nowAID: function () {
      if (this.lastaid === this.newAID && !this.forceSubmit) return this.aid
      else return this.$_ConnectAID_updateAID(this.newAID)
    },
    ...Vuex.mapGetters([
      'post',
      'newAID'
    ])
  },
  methods: {
    $_ConnectAID_updateAID: function () {
      this.forceSubmit = false
      this.aid = this.newAID
      this.lastaid = this.newAID
      this.$_ConnectAID_SearchPushByPostAID()
      return this.aid
    },
    $_ConnectAID_SubmitSearch: function () {
      if (reportMode) console.log('submitAID', this.aid)
      this.$store.dispatch('gotoPost', this.aid)
      this.forceSubmit = true
    },
    $_ConnectAID_SearchPushByPostAID: function () {
      const result = /(#.+) \((.+)\)/.exec(this.aid)
      // console.log('_ConnectAID_SearchPushByPostAID', this.aid)
      // console.log('_ConnectAID_SearchPushByPostAID', result)
      // console.log('_ConnectAID_SearchPushByPostAID', this.post)
      if (this.post.AID === result[1] && this.post.board === result[2]) { // 相同文章取最新推文
        if (reportMode) console.log('nowAID same post', result[1], result[2], this.post.lastEndLine)
        this.msg.PostMessage('getCommentByAID', { key: result[1], board: result[2], startLine: this.post.lastEndLine })
      } else if (this.isStream) { // 實況取得最近的推文
        if (reportMode) console.log('nowAID recent', result[1], result[2], 200)
        this.msg.PostMessage('getCommentByAID', { key: result[1], board: result[2], recent: 200 })
      } else { // 實況紀錄取得所有推文
        if (reportMode) console.log('nowAID total', result[1], result[2], 0)
        this.msg.PostMessage('getCommentByAID', { key: result[1], board: result[2], startLine: 0 })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
