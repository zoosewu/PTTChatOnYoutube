
<template>
  <div class="text-center mb-2">
    <h4 class="mb-1 mt-0">
      {{ title }}
    </h4>
    <p class="mt-1 mb-0">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, required: true },
    description: { type: String, required: false, default: '' }
  }
}
</script>
