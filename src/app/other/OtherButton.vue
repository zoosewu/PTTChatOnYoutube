<template>
  <a
    :id="'other-button-' + id"
    class="btn ptt-btnoutline m-2"
    :href="href"
    target="_blank"
    rel="noopener noreferrer"
    role="button"
  >{{ title }}</a>
</template>

<script>
export default {
  props: {
    id: { type: String, required: false, default: '' },
    title: { type: String, required: true },
    href: { type: String, required: true }
  }
}
</script>
