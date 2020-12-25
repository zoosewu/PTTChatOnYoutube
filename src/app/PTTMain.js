
import PTTApp from './PTTApp';
export let PTTMain = {
  template: `<pttdiv id="PTTMain" class="pttchat rounded-right position-absolute rounded-bottom w-100 collapse" style="z-index: 301;">
  <PTTApp></PTTApp>
  </pttdiv>`,
  components: {
    'PTTApp': PTTApp
  },
}