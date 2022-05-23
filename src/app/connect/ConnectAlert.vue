
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
        :key="item.no"
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
      serialNumber: 0,
      alert: []
    }
  },
  computed: {
    alertlist: function () {
      return this.Alert.length > 0 ? this.addAlert(this.Alert) : this.alert
    },
    ...Vuex.mapGetters(['Alert'])
  },
  mounted () {
    this.msg.alert = (data) => {
      this.$store.dispatch('Alert', { type: data.type, msg: data.msg })
      if (showAlertMsg) { console.log('Alert,type: ' + data.type + ', msg: ' + data.msg) }
    }
    this.alert = []
  },
  methods: {
    removeAlert (item) {
      const index = this.alert.indexOf(item)
      this.alert.splice(index, 1)
    },
    addAlert (items) {
      for (let i = 0; i < items.length; i++) {
        items[i].no = this.serialNumber
        this.serialNumber++
      }
      this.alert = this.alert.concat(items)
      this.$store.dispatch('ClearAlert')
      return this.alert
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
