
import PTTAppMain from './PTTAppMain';
export let PTTApp = {
  template: `<pttdiv id="PTTMain" class="pttchat rounded-right position-absolute rounded-bottom w-100 collapse" style="z-index: 301;">
  <PTTAppMain></PTTAppMain>
  </pttdiv>`,
  components: {
    'PTTAppMain': PTTAppMain
  },
}