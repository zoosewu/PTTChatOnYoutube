<template>
  <div
    :class="className"
    role="alert"
    :count="dismissCount"
  >
    {{ alert.msg }}
  </div>
</template>

<script>
export default {
  props: { alert: { type: Object, required: true } },
  data () {
    return {
      dismissCount: 2,
      timerInterval: null
    }
  },
  computed: {
    className: function () {
      const classes = ['alert', 'mt-3', 'fade', 'show']
      if (this.alert.type === 0) { classes.push('alert-danger') } else if (this.alert.type === 1) { classes.push('alert-warning') } else if (this.alert.type === 2) { classes.push('alert-success') }
      return classes.join(' ')
    }
  },
  mounted () {
    this.timerInterval = setTimeout(this.destroy, this.dismissCount * 1000)
  },
  methods: {
    CountDown: function () {
      this.dismissCount--
      if (this.dismissCount <= 0) { this.destroy() }
    },
    destroy: function () {
      this.$emit('destroyalert')
    }
  }
}
</script>

<style lang="scss" scoped>
div {
  pointer-events: none;
}
</style>
