
<template>
  <tbody
    class="ptt-text"
    :alertcount="alertcount"
  >
    <log-title :title="'近期訊息'" />
    <tr
      v-for="(item) in alertlist"
      :key="item.no"
    >
      <th
        colspan="4"
        scope="row"
      >
        {{ item.type + ':' + item.msg }}
      </th>
    </tr>
  </tbody>
</template>

<script>
import LogTitle from './LogTitle.vue'
export default {
  components: {
    'log-title': LogTitle
  },
  data () {
    return {
      alertlist: []
    }
  },
  computed: {
    alertcount: function () {
      let i = 0
      for (; i < this.newLog.length; i++) {
        if (this.newLog[i].type === 'Alert') break
      }
      return i < this.newLog.length ? this.$_LogItem_updateLog1(this.newLog[i].data).length : this.alertlist.length
    },
    ...Vuex.mapGetters(['newLog'])
  },
  methods: {
    $_LogItem_updateLog1: function (data) {
      const alertObject = { msg: data.msg }
      switch (data.type) {
        case 0:
          alertObject.type = '錯誤'
          break
        case 1:
          alertObject.type = '警告'
          break
        case 2:
          alertObject.type = '訊息'
          break
        default:
          break
      }
      this.alertlist.unshift(alertObject)
      if (this.alertlist.length > 10) this.alertlist.pop()
      this.$store.dispatch('removeLog', 'Alert')
      return this.alertlist
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
