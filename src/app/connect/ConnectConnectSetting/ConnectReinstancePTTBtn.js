export const ConnectReinstancePTTBtn = {
  inject: ['msg'],
  methods: {
    reLaunchPtt: function () {
      if (this.msg.ownerorigin === 'https://holodex.net') {
        const p = $('#PTTframe').clone()
        $('#PTTframe').remove()
        p.appendTo($('#ptt-frame-parent'))
        this.msg.targetWindow = document.getElementById('PTTframe').contentWindow
      } else {
        this.reInstancePTT()
      }
    },
    ...Vuex.mapActions([
      'reInstancePTT' // 将 `this.reInstancePTT()` 映射为 `this.$store.dispatch('reInstancePTT')`
    ])
  },
  template: `<div class="form-row my-3">
  <label class="col-3 col-form-label">重啟PTT</label>
  <div class="col-2 px-0 ml-2">
    <button id="reinstance-ptt-btn" class="btn ptt-btnoutline w-100 px-2" type="button" @click.self="reLaunchPtt">點我</button>
  </div>
  <label class="col col-form-label ml-2">PTT跑到奇怪的畫面壞掉時使用</label>
</div>
`
}
