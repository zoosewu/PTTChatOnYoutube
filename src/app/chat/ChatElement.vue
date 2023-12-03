<template>
  <div
    class="ptt-chat media px-3"
    :style="bgc"
  >
    <div class="media-body mw-100">
      <div
        class="ptt-chat-info d-flex flex-row"
        :style="infoStyle"
      >
        <p :class="typeclass">
          {{ item.type }}
        </p>
        <p class="ptt-chat-id mr-2 mb-0 flex-grow-1">
          {{ item.pttid }}
        </p>
        <p class="ptt-chat-time mb-0">
          {{ timeH }}:{{ timem }}
        </p>
      </div>
      <div>
        <p
          ref="p"
          class="ptt-chat-msg mb-0 mx-2"
          :style="msgStyle"
          v-html="item.msg"
        />
      </div>
      <div :style="spaceStyle" />
    </div>
  </div>
</template>

<script>
/* eslint-disable-next-line no-unused-vars */
import ChatElementMessage from './ChatElementMessage'
import { paddingLeft } from 'src/library'

export default {
  props: {
    item: { type: Object, required: true },
    index: { type: Number, required: true },
    msgStyle: { type: Object, required: true },
    infoStyle: { type: Object, required: true },
    spaceStyle: { type: Object, required: true },
    activeChat: { type: Number, required: true }
  },
  computed: {
    timeH: function () { return paddingLeft(this.item.time.getHours(), +2) },
    timem: function () { return paddingLeft(this.item.time.getMinutes(), +2) },
    typeclass: function () {
      const typecolor = this.item.type === '推 ' ? 'ptt-chat-type' : 'ptt-chat-type-n'
      return typecolor + ' mr-2 mb-0'
    },
    bgc: function () {
      if (this.getDisableCommentGray) return ''
      const isUnchat = this.item.gray ? '0.25' : '0'
      const color = 'rgba(128, 128, 128, ' + isUnchat + ')'
      return { backgroundColor: color, transition: '2s' }
    },
    ...Vuex.mapGetters(['getDisableCommentGray'])
  },
  watch: {
    activeChat: function () { this.$_ChatElementMessage_GrayCheck() }
  },
  mounted () {
    if (!this.getDisableCommentGray) this.$_ChatElementMessage_GrayCheck()
    this.$nextTick(function () {
      this.$refs.p.mouseEnter = this.$_ChatElementMessage_MoueseEnter
      this.$refs.p.mouseLeave = this.$_ChatElementMessage_MoueseLeave
      this.$refs.p.AddAnySrarch = this.$_ChatElementMessage_AddAnySrarch
    })
  },
  updated () { if (showScrollLog) console.log('updated, listIndex, chatIndex, msg', this.item.id, this.item.msg) },
  methods: {
    $_ChatElementMessage_GrayCheck () {
      if (reportMode) console.log('GrayCheck', this.item, 'id', this.item.id, 'index', this.index, 'activeChat', this.activeChat, this.item, 'id>activeChat', this.item.id > this.activeChat, '->', this.item.gray, 'getDisableCommentGray', this.getDisableCommentGray)
      if (this.index > this.activeChat && !this.item.gray) this.$emit('updategray', this.index, true)
      else if (this.index <= this.activeChat && this.item.gray) this.$emit('updategray', this.index, false)
    },
    $_ChatElementMessage_MoueseEnter (url) {
      this.$store.dispatch('previewImage', url)
    },
    $_ChatElementMessage_MoueseLeave (url) {
      this.$store.dispatch('previewImage', '')
    },
    $_ChatElementMessage_AddAnySrarch (search) {
      if (reportMode) console.log('click addAnySearch')
      this.$store.dispatch('addAnySearch', search)
    }
  }
}
</script>

<style lang="scss">
</style>
