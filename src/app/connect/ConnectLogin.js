export let ConnectLogin = {
  data: function () {
    return {
      id: GM_getValue("PTTID", ""),
      pw: ""
    }
  },
  inject: ['msg'],
  methods: {
    login: function () {
      if (this.id === "" || this.pw === "") {
        this.$store.dispatch('Alert', { type: 0, msg: "帳號或密碼不得為空。" });
        return;
      }
      GM_setValue("PTTID", this.id);
      const i = CryptoJS.AES.encrypt(this.id, cryptkey).toString();
      const p = CryptoJS.AES.encrypt(this.pw, cryptkey).toString();
      this.msg.PostMessage("login", { id: i, pw: p });
    }
  },
  template: `<div class="form-row my-3">
  <div class="col-5">
    <label for="PTTid">PTT ID</label>
    <input id="PTTid" type="text" class="form-control" placeholder="PTT ID" autocomplete="off" v-on:keyup.13="login"
      v-model.lazy="id">
  </div>
  <div class="col-5">
    <label for="PTTpw">PTT密碼</label>
    <input id="PTTpw" type="password" class="form-control" placeholder="PTT密碼" autocomplete="off" v-on:keyup.13="login"
      v-model.lazy="pw">
  </div>
  <div class="col-2 px-0">
    <label for="PTTlogin" class="col-2">&nbsp;</label>
    <button id="PTTlogin" class="btn ptt-btnoutline w-100" type="button" @click.self="login()">登入</button>
  </div>
</div>`,
}