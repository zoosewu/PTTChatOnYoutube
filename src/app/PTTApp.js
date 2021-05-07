
import PTTAppMain from './PTTAppMain'
export const PTTApp = {
  template: `<div id="PTTMain" class="pttchat rounded-right position-absolute rounded-bottom w-100 collapse" style="z-index: 301;">
  <PTTAppMain></PTTAppMain>
  </div>`,
  components: {
    PTTAppMain: PTTAppMain
  }
}
