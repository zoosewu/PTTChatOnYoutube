
import PTTAppMain from './PTTAppMain'
export const PTTApp = {
  template: `<div id="PTTMain" class="pttchat rounded-right rounded-bottom h-100 w-100 collapse" style="z-index: 301;">
  <PTTAppMain></PTTAppMain>
  </div>`,
  components: {
    PTTAppMain: PTTAppMain
  }
}
