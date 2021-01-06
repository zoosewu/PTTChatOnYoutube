export let ChatScrollBtn = {
  props: ['isAutoScroll'],
  methods: {
    click: function () {
      this.$emit("autoscrollclick");
    }
  },
  computed: {
    className: function () {
      const disable = this.isAutoScroll ? "d-none" : "";
      return "position-absolute " + disable;
    }
  },
  template: `<div id="PTTChat-contents-Chat-btn" :class="className"
  style="z-index:400; bottom:5%; left: 50%; -ms-transform: translateX(-50%); transform: translateX(-50%);">
  <button id="AutoScroll" class="btn btn-primary" type="button" v-on:click="click">自動滾動</button>
</div>`,
}