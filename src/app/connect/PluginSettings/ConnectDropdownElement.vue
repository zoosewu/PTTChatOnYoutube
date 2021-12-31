
<template>
  <div
    :id="id"
    class="form-row px-0 mx-0 col-12 my-2"
  >
    <legend class="col-form-label col-3 pt-0">
      {{ description }}
    </legend>
    <div class="col px-0">
      <div class="dropdown">
        <button
          :id="btnid"
          class="btn ptt-btnoutline btn-sm dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {{ DisplayOption }}
        </button>
        <div
          class="dropdown-menu"
          :aria-labelledby="btnid"
        >
          <a
            v-for="(option, index) in optionGroup"
            :key="index"
            class="dropdown-item"
            href="#"
            @click.prevent="$_ConnectDropdownElement_Select(index)"
          >{{ option }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    settingName: { type: String, required: true },
    description: { type: String, required: true },
    optionGroup: { type: Array, required: true },
    defaultValue: { type: Number, required: false, default: 0 }
  },
  data () {
    return {
      SettingValue: this.$store.getters['get' + this.settingName],
      btnid: this.settingName + 'btn',
      id: 'PTTConnect-' + this.settingName
    }
  },
  computed: {
    DisplayOption () { return this.optionGroup[this.SettingValue] }
  },
  mounted () {
    // console.log(this.description + " mounted", this.settingName, this.SettingValue, this.defaultValue);
    this.$_ConnectDropdownElement_Select(this.SettingValue)
  },
  methods: {
    $_ConnectDropdownElement_Select (newOption) {
      if (newOption > this.optionGroup.length - 1) {
        // console.log(this.description + " set to length - 1", this.optionGroup.length - 1);
        this.SettingValue = this.optionGroup.length - 1
      } else if (newOption < 0) {
        // console.log(this.description + " set to defaultValue", this.defaultValue);
        this.SettingValue = this.defaultValue
      } else {
        // console.log(this.description + " set to newOption", newOption);
        this.SettingValue = newOption
      }
      this.$store.dispatch('set' + this.settingName, this.SettingValue)
    }
  }
}
</script>

<style lang="scss">
</style>
