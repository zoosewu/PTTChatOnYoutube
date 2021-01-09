export let chatSetNewPush = {
  data: function () {
    return {
      pushtext: "",
    }
  },
  inject: ['msg', 'isStream'],
  methods: {
    setPush: function () {
      const result = /.+/.exec(this.aid);
      if (!result) this.$store.dispatch('Alert', { type: 0, msg: "請輸入文字。" });
      else if (this.PTTState < 1) this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
      else if (!this.post.gettedpost) this.$store.dispatch('Alert', { type: 0, msg: "尚未獲取文章，請先獲取文章。" });
      else this.msg.PostMessage("setNewPush", this.pushtext);
    },
    removePushedText(text) {
      const reg = "(" + text + ")(.*)";
      const result = new RegExp(reg).exec(this.pushtext);
      console.log("removePushedText", text, this.pushtext, result);
      this.pushtext = result[2];
    }
  },
  computed: {
    ...Vuex.mapGetters([
      'post',
      'PTTState',
    ])
  },
  mounted() {
    this.msg["pushedText"] = data => this.removePushedText(data);
  },
  template: `<div class="form-row my-2">
  <div class="col">
    <input id="setnewpush" class="form-control" type="text" placeholder="輸入文字以推文..." autocomplete="off"
      v-model.lazy="pushtext" v-on:keyup.13="setPush">
  </div>
  <div class="col-2 px-0">
    <button id="setnewpushbtn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="setPush()">推文</button>
  </div>
</div>`,
}