
<template>
  <tr>
    <th
      colspan="1"
      scope="row"
    >
      {{ item1Title }}
    </th>
    <td :colspan="item1ColSpan">
      {{ item1Data }}
    </td>
    <th
      v-if="secondItemTitle"
      scope="row"
    >
      {{ item2Title }}
    </th>
    <td v-if="secondItemTitle">
      {{ item2Data }}
    </td>
  </tr>
</template>

<script>
export default {
  props: {
    itemTitle: { type: String, required: true },
    itemType: { type: String, required: true },
    itemColSpan: { type: Number, required: false, default: 3 },
    secondItemTitle: { type: String, required: false, default: '' },
    secondItemType: { type: String, required: false, default: '' }
  },
  data () {
    return {
      item1Title: this.itemTitle,
      i1Data: '--',
      i2Data: ''
    }
  },
  computed: {
    item1ColSpan: function () {
      if (this.secondItemTitle) return 1
      else return this.itemColSpan ? Math.min(this.itemColSpan, 3) : 1
    },
    item2Title: function () {
      return this.secondItemTitle ? this.secondItemTitle : ''
    },
    item1Data: function () {
      let i = 0
      for (; i < this.newLog.length; i++) {
        if (this.newLog[i].type === this.itemType) break
      }
      // console.log('computed', this.itemType, this.newLog[i], i)
      return i < this.newLog.length ? this.$_LogItem_updateLog1(this.newLog[i].data) : this.i1Data
    },
    item2Data: function () {
      let i = 0
      for (; i < this.newLog.length; i++) {
        if (this.newLog[i].type === this.secondItemType) break
      }
      // console.log('computed', this.secondItemType, this.newLog[i], i)
      return i < this.newLog.length ? this.$_LogItem_updateLog2(this.newLog[i].data) : this.i2Data
    },
    ...Vuex.mapGetters(['newLog'])
  },
  mounted () {
    // if (showAllLog) console.log('LogItem', this.itemTitle, this.itemType, this.itemColSpan, this.secondItemTitle, this.secondItemType)
  },
  methods: {
    $_LogItem_updateLog1: function (data) {
      this.i1Data = data
      this.$store.dispatch('removeLog', this.itemType)
      return this.i1Data
    },
    $_LogItem_updateLog2: function (data) {
      this.i2Data = data
      this.$store.dispatch('removeLog', this.secondItemType)
      return this.i2Data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
