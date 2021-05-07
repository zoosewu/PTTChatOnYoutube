import { PTTScreenIframe } from './PTTScreenIframe.js'
export const PTTScreen = {
  computed: {
    ...Vuex.mapGetters([
      'getInstancePTTID'
    ])
  },
  components: {
    'ptt-screen-iframe': PTTScreenIframe
  },
  template: `<div id="PTTChat-contents-PTT-main" class="h-100 d-flex justify-content-center px-0">
  <ptt-screen-iframe ref="ifm" :key="getInstancePTTID"></ptt-screen-iframe>
</div>`
}
