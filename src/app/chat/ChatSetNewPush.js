export let chatSetNewPush = {
  data: function () {
    return {
      pushtext: "",
    }
  },
  inject: ['msg', 'isStream'],
  methods: {
    setPush: function () {
      const result = /.+/.exec(this.pushtext);
      if (!result) this.$store.dispatch('Alert', { type: 0, msg: "請輸入文字。" });
      else if (this.PTTState < 1) this.$store.dispatch('Alert', { type: 0, msg: "PTT尚未登入，請先登入。" });
      else if (!this.post.gettedpost) this.$store.dispatch('Alert', { type: 0, msg: "尚未獲取文章，請先獲取文章。" });
      else this.msg.PostMessage("setNewPush", this.pushtext);
    },
    removePushedText(text) {
      if (this.pushtext.indexOf(text) === 0) this.pushtext = this.pushtext.substring(text.length, this.pushtext.length);
      console.log(this.pushtext);
      /*const reg = "(" + text + ")(.*)";
      const result = new RegExp(reg).exec(this.pushtext);
      if (reportmode) console.log("removePushedText", text, this.pushtext, result);
      this.pushtext = result[2];*/
    }
  },
  computed: {
    placeholder: function () {
      if (this.enableSetNewPush) return "輸入文字以推文...";
      else return "請到連線設定開啟測試版推文功能";
    },
    className: function () {
      let classes = ["form-row", "my-2"];
      if (!this.isStream) { classes.push("d-none"); }
      return classes.join(' ');
    },
    ...Vuex.mapGetters([
      'post',
      'PTTState',
      'enableSetNewPush',
    ])
  },
  mounted() {
    this.msg["pushedText"] = data => this.removePushedText(data);
  },
  template: `<div :class="className">
  <div class="col">
    <input id="setnewpush" class="form-control" type="text" style="font-size:14px" :placeholder="placeholder" autocomplete="off"
      v-model.lazy="pushtext" v-on:keyup.13="setPush" :disabled="!enableSetNewPush">
  </div>
  <div class="col-2 px-0">
    <button id="setnewpushbtn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="setPush()">推文</button>
  </div>
</div>`,
}