export let ConnectReinstancePTTBtn = {
  methods: {
    ...Vuex.mapActions([
      'reInstancePTT', // 将 `this.reInstancePTT()` 映射为 `this.$store.dispatch('reInstancePTT')`
    ]),
  },
  template: `<div class="row my-3">
  <label for="reinstance-ptt-btn" class="col-3 col-form-label">重啟PTT</label>
  <div class="col-2 px-0 ml-3">
    <button id="reinstance-ptt-btn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="reInstancePTT()">點我</button>
  </div>
  <label for="reinstance-ptt-btn" class="col-6 col-form-label pr-0">PTT跑到奇怪的畫面壞掉時使用</label>
</div>
`,
}