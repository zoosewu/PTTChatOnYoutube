export let ConnectAlert = {
  inject: ['msg'],
  data: function () {
    return {
      al: [],
      lastAlert: null,
    }
  },
  methods: {
    removeAlert(item) {
      const index = this.al.indexOf(item);
      console.log("removeAlert: this.al,item.msg,index", this.al, item.msg, index);
      this.al.splice(index, 1);
    },
  },
  computed: {
    alertlist: function () {
      if (this.lastAlert !== this.newAlert) {
        this.lastAlert = this.newAlert;
        this.al.push(this.newAlert);
      }
      return this.al;
    },
    ...Vuex.mapGetters([
      'newAlert',
    ])
  },
  mounted() {
    this.msg["alert"] = data => {
      this.$store.dispatch('Alert', { type: data.type, msg: data.msg });
      if (showalertmsg) console.log("Alert,type: " + data.type + ", msg: " + data.msg);
    };
    this.lastAlert = this.newAlert;
    this.al = [];
  },
  template: `<div id="PTTChat-contents-Connect-alert" class="position-relative container"
  style="top:-100%; z-index:400; pointer-events: none;">
  <transition-group name="list-alert" tag="div">
    <alert-item :alert="item" :key="item" :index="index" @destroyalert="removeAlert(item)" v-for="(item, index) in alertlist"> </alert-item>
  </transition-group>
</div>`,
}

Vue.component('alert-item', {
  props: ['alert', 'index'],
  data: function () {
    return {
      dismissCount: 2,
      timerInterval: null,
    }
  },
  computed: {
    className: function () {
      let classes = ["alert", "mt-3", "fade", "show"];
      if (this.alert.type === 0) { classes.push("alert-danger"); }
      else if (this.alert.type === 1) { classes.push("alert-warning"); }
      else if (this.alert.type === 2) { classes.push("alert-success"); }
      return classes.join(' ');
    },
  },
  methods: {
    CountDown: function () {
      this.dismissCount--;
      //console.log(this.alert.msg + " index ", this.index,"dismissCount",this.dismissCount, "CountDown");
      if (this.dismissCount <= 0) { this.destroy(); }
    },
    destroy: function () {
      //console.log(this.alert.msg + " index", this.index, "beforeDestroy");
      this.$emit("destroyalert");
    }
  },
  mounted() {
    //console.log(this.alert.msg + ": index", this.index, "mounted");
    //不知道為什麼會stack溢出     this.timerInterval = window.setInterval(this.CountDown, 1000);
    this.timerInterval = setTimeout(this.destroy, this.dismissCount * 1000);
  },
  beforeDestroy() {
    //clearInterval(this.timerInterval);
  },
  template: `<div :class="className" role="alert" style="pointer-events: none;" :count="this.dismissCount"> {{this.alert.msg}}</div>`,
});