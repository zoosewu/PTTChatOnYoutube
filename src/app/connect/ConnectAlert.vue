
<template>
  <div
    id="PTTChat-contents-Connect-alert"
    class="position-relative container"
  >
    <transition-group
      name="list-alert"
      tag="div"
    >
      <connect-alert-item
        v-for="(item) in alertlist"
        :key="item"
        :alert="item"
        @destroyalert="removeAlert(item)"
      />
    </transition-group>
  </div>
</template>

<script>
import ConnectAlertItem from './ConnectAlertItem.vue'

export default {
  components: {
    'connect-alert-item': ConnectAlertItem
  },
  inject: ['msg'],
  data () {
    return {
      al: [],
      lastAlert: null
    }
  },
  computed: {
    alertlist: function () {
      if (this.lastAlert !== this.newAlert) {
      /* eslint-disable vue/no-side-effects-in-computed-properties */
        this.lastAlert = this.newAlert
        this.al.push(this.newAlert)
      /* eslint-enable vue/no-side-effects-in-computed-properties */
      }
      return this.al
    },
    ...Vuex.mapGetters([
      'newAlert'
    ])
  },
  mounted () {
    this.msg.alert = data => {
      this.$store.dispatch('Alert', { type: data.type, msg: data.msg })
      if (showAlertMsg) console.log('Alert,type: ' + data.type + ', msg: ' + data.msg)
    }
    this.lastAlert = this.newAlert
    this.al = []
  },
  methods: {
    removeAlert (item) {
      const index = this.al.indexOf(item)
      // console.log("removeAlert: this.al,item.msg,index", this.al, item.msg, index);
      this.al.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
#PTTChat-contents-Connect-alert {
  top: -100%;
  z-index: 400;
  pointer-events: none;
}
</style>
