
<template>
  <div>
    <div class="my-3">
      <connect-anysearch-addnew />
      <connect-anysearch-dropdown />
      <connect-anysearch-hint />
    </div>
  </div>
</template>

<script>
import ConnectAnySearchAddNew from './ConnectAnySearchAddNew.vue'
import ConnectAnySearchDropdown from './ConnectAnySearchDropdown.vue'
import ConnectAnySearchHint from './ConnectAnySearchHint.vue'
export default {
  components: {
    'connect-anysearch-addnew': ConnectAnySearchAddNew,
    'connect-anysearch-dropdown': ConnectAnySearchDropdown,
    'connect-anysearch-hint': ConnectAnySearchHint
  }
}
</script>

<style lang="scss">
</style>
