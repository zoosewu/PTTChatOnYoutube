
<template>
  <th
    class="text-center bg-secondary text-white"
    colspan="4"
  >
    {{ title }}
  </th>
</template>

<script>
export default {
  props: { title: { type: String, required: true } }
}
</script>

<style lang="scss">
</style>
