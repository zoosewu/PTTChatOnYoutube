export const ConnectLogin = {
  inject: ['msg'],
  data () {
    return {
      id: GM_getValue('PTTID', ''),
      pw: ''
    }
  },
  methods: {
    login: function () {
      if (this.id === '' || this.pw === '') {
        this.$store.dispatch('Alert', { type: 0, msg: '帳號或密碼不得為空。' })
        return
      } else if (this.PTTState > 0) {
        this.$store.dispatch('Alert', { type: 0, msg: '已經登入，請勿重複登入。' })
        return
      }
      GM_setValue('PTTID', this.id)
      const i = CryptoJS.AES.encrypt(this.id, cryptkey).toString()
      const p = CryptoJS.AES.encrypt(this.pw, cryptkey).toString()
      this.msg.PostMessage('login', { id: i, pw: p, DeleteOtherConnect: this.getDeleteOtherConnect })
    }
  },
  computed: {
    ...Vuex.mapGetters(['getDeleteOtherConnect'])
  },
  template: `<div class="form-row mt-3">
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
</div>`
}
