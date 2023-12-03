
<template>
  <div class="container">
    <div :class="className">
      <div class="col">
        <input
          id="setnewcomment"
          v-model.lazy="commenttext"
          class="form-control"
          type="text"
          style="font-size:14px"
          :placeholder="placeholder"
          autocomplete="off"
          :disabled="!getEnableSetNewComment"
          @keyup.13="$_ChatSetNewComment_setComment"
        >
      </div>
      <div class="col-2 px-0">
        <button
          id="setnewcommentbtn"
          class="btn ptt-btnoutline w-100 px-2"
          type="button"
          @click="$_ChatSetNewComment_setComment()"
        >
          <div v-if="setNewComment !== ''">
            推文中...
          </div>
          <div v-if="setNewComment === ''">
            推文
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import gaPush from 'src/ga/setvalue'
export default {
  inject: ['msg', 'isStream'],
  data () {
    return {
      commenttext: ''
    }
  },
  computed: {
    placeholder: function () {
      if (this.getEnableSetNewComment) return '輸入文字以推文...'
      else return '請到連線設定開啟測試版推文功能'
    },
    className: function () {
      const classes = ['form-row', 'my-2']
      if (!this.isStream) { classes.push('d-none') }
      return classes.join(' ')
    },
    ...Vuex.mapGetters([
      'post',
      'pttState',
      'getEnableSetNewComment',
      'setNewComment'
    ])
  },
  mounted () {
    this.msg.commentedText = data => this.$_ChatSetNewComment_removeCommentedText(data.commentedText)
  },
  methods: {
    $_ChatSetNewComment_setComment: function () {
      const result = /.+/.exec(this.commenttext)
      if (!result) this.$store.dispatch('Alert', { type: 0, msg: '請輸入文字。' })
      else if (this.pttState < 1) this.$store.dispatch('Alert', { type: 0, msg: 'PTT尚未登入，請先登入。' })
      else if (!this.post.gettedpost) this.$store.dispatch('Alert', { type: 0, msg: '尚未獲取文章，請先獲取文章。' })
      else {
        gaPush({ event: 'setComment' })
        this.$store.dispatch('setNewcomment', this.commenttext)
        // this.msg.PostMessage('setNewcomment', this.commenttext)
      }
    },
    $_ChatSetNewComment_removeCommentedText (text) {
      if (this.commenttext.indexOf(text) === 0) this.commenttext = this.commenttext.substring(text.length, this.commenttext.length)
    }
  }
}
</script>

<style lang="scss">
</style>
