<template>
  <div>
    <h4 class="text-center mt-3 mb-1">
      {{ title }}
    </h4>
    <hr class="mt-1 mb-2">
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true }
  }
}
</script>
