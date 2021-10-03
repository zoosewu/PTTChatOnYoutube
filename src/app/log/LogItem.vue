
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
import { showalllog } from '../../logsetting'

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
      i2Data: '',
      lastlog1: [],
      lastlog2: []
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
      if (this.lastlog1 !== this.log) {
      /* eslint-disable vue/no-side-effects-in-computed-properties */
        this.lastlog1 = this.log
        if (showalllog) console.log('item1Data', this.itemType, this.log.type, this.itemType === this.log.type)
        if (this.itemType === this.log.type) this.i1Data = this.log.data
      /* eslint-enable vue/no-side-effects-in-computed-properties */
      }
      return this.i1Data
    },
    item2Data: function () {
      if (this.lastlog2 !== this.log) {
      /* eslint-disable vue/no-side-effects-in-computed-properties */
        this.lastlog2 = this.log
        if (showalllog) console.log('item2Data', this.secondItemTitle, this.secondItemType, this.log.type, this.secondItemType === this.log.type)
        if (this.secondItemTitle && this.secondItemType === this.log.type) this.i2Data = this.log.data
      /* eslint-enable vue/no-side-effects-in-computed-properties */
      }
      return this.i2Data
    },
    ...Vuex.mapGetters(['log'])
  },
  mounted () {
    if (showalllog) console.log('LogItem', this.itemTitle, this.itemType, this.itemColSpan, this.secondItemTitle, this.secondItemType)
  }
}
</script>

<style lang="scss" scoped>
</style>
