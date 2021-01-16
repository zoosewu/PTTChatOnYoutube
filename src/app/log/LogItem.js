export let LogItem = {
  props: {
    itemTitle: { type: String, required: true },
    itemType: { type: String, required: true },
    itemColSpan: { type: Number, required: false },
    secondItemTitle: { type: String, required: false },
    secondItemType: { type: String, required: false },
  },
  data: function () {
    return {
      item1Title: this.itemTitle,
      i1Data: "--",
      i2Data: "",
      lastlog1: [],
      lastlog2: [],
    }
  },
  computed: {
    item1ColSpan: function () {
      if (this.secondItemTitle) return 1;
      else return this.itemColSpan ? Math.min(this.itemColSpan, 3) : 1;
    },
    item2Title: function () {
      return this.secondItemTitle ? this.secondItemTitle : "";
    },
    item1Data: function () {
      if (this.lastlog1 !== this.log) {
        this.lastlog1 = this.log;
        if (reportmode) console.log("item1Data", this.itemType, this.log.type, this.itemType === this.log.type);
        if (this.itemType === this.log.type) this.i1Data = this.log.data;
      }
      return this.i1Data;
    },
    item2Data: function () {
      if (this.lastlog2 !== this.log) {
        this.lastlog2 = this.log;
        if (reportmode) console.log("item2Data", this.secondItemTitle, this.secondItemType, this.log.type, this.secondItemType === this.log.type);
        if (this.secondItemTitle && this.secondItemType === this.log.type) this.i2Data = this.log.data;
      }
      return this.i2Data;
    },
    ...Vuex.mapGetters(['log'])
  },
  mounted() {
    if (reportmode) console.log("LogItem", this.itemTitle, this.itemType, this.itemColSpan, this.secondItemTitle, this.secondItemType);
  },
  template: `<tr>
  <th colspan="1" scope="row">{{this.item1Title}}</th>
  <td :colspan="item1ColSpan">{{this.item1Data}}</td>
  <th scope="row" v-if="secondItemTitle">{{this.item2Title}}</th>
  <td v-if="secondItemTitle">{{this.item2Data}}</td>
</tr>`,
}
