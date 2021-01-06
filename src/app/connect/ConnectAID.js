export let ConnectAID = {
  data: function () {
    return {
      aid: GM_getValue("PostAID", ""),
    }
  },
  inject: ['msg'],
  methods: {
    getPush: function () {
      const result = /#(.+) \((.+)\)/.exec(this.aid);
      if (!result || result.length <= 2) {
        this.$store.dispatch('Alert', { type: 0, msg: "文章AID格式錯誤，請重新輸入。" });
      }
      else {
        GM_setValue("PostAID", this.aid);
        gotomainchat = true;//// 
        if (this.post.AID === result[1] && this.post.board === result[2]) {
          this.msg.PostMessage("getPushByLine", { AID: result[1], board: result[2], startline: this.post.lastendline });
        }
        else {
          this.msg.PostMessage("getPushByLine", { AID: result[1], board: result[2], startline: 0 });
        }
        this.$store.dispatch('pageChange', true);
      }
    }
  },
  mounted() {
    // this.msg["postdata"] = data => {
    //   this.$store.dispatch('updatePost', data);
    // };
  },
  computed: {
    ...Vuex.mapGetters([
      'post',
    ])
  },
  template: `<div class="form-row my-3">
  <label for="postAID" class="col-3 col-form-label">輸入文章AID</label>
  <div class="col">
    <input id="postAID" class="form-control" type="text" placeholder="#1VobIvqC (C_Chat)" autocomplete="off" v-model.lazy="aid" v-on:keyup.13="getPush">
  </div>
  <div class="col-2 px-0">
    <button id="postAIDbtn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="getPush()">讀取</button>
  </div>
</div>`,
}