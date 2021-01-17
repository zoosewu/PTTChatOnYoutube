export let ConnectNewVersionInfoElement = {
  props: { items: { type: Array, required: true }, },
  template: `<div>
  <hr class="mt-1 mb-2">
  <p class="mt-1 mb-0 px-1" v-for="item in items">{{item}}</p>
</div>`,
}