
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
import { reportmode } from '../../../logsetting'
export default {
  inject: ['msg', 'isStream'],
  data () {
    return {
      aid: GM_getValue('PostAID', ''),
      lastgotoAID: '',
      forceSubmit: false
    }
  },
  computed: {
    nowAID: function () {
      if (this.lastgotoAID === this.gotoAID && !this.forceSubmit) return this.lastgotoAID
      /* eslint-disable vue/no-side-effects-in-computed-properties */
      this.forceSubmit = false
      this.aid = this.gotoAID
      this.lastgotoAID = this.gotoAID
      /* eslint-enable vue/no-side-effects-in-computed-properties */
      this.$_ConnectAID_SearchPushByPostAID(this.gotoAID)
      return this.lastgotoAID
    },
    ...Vuex.mapGetters([
      'post',
      'PTTState',
      'gotoAID'
    ])
  },
  methods: {
    $_ConnectAID_SubmitSearch: function () {
      if (reportmode) console.log('submitAID', this.aid)
      this.$store.dispatch('gotoPost', this.aid)
      this.forceSubmit = true
    },
    $_ConnectAID_SearchPushByPostAID: function (aid) {
      const result = /#(.+) \((.+)\)/.exec(this.aid)
      if (this.post.AID === result[1] && this.post.board === result[2]) { // 相同文章取最新推文
        if (reportmode) console.log('nowAID same post', result[1], result[2], this.post.lastendline)
        this.msg.PostMessage('getPushByLine', { AID: result[1], board: result[2], startline: this.post.lastendline })
      } else if (this.isStream) { // 實況取得最近的推文
        if (reportmode) console.log('nowAID recent', result[1], result[2], 200)
        this.msg.PostMessage('getPushByRecent', { AID: result[1], board: result[2], recent: 200 })
      } else { // 實況紀錄取得所有推文
        if (reportmode) console.log('nowAID total', result[1], result[2], 0)
        this.msg.PostMessage('getPushByLine', { AID: result[1], board: result[2], startline: 0 })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
