export const LogTitle = {
  props: { title: { type: String, required: true } },
  template: '<th class="text-center bg-secondary text-white" colspan="4"> {{ this.title }}</th>'
}
