import PTTAppNav from './PTTAppNav.js'
import PTTAppContent from './PTTAppContent.js'

export const PTTAppMain = {
  template: `<div id="PTTChat-app" class="ptt-bg ptt-border rounded h-100 w-100 d-flex flex-column">
  <PTTAppNav></PTTAppNav>
  <PTTAppContent></PTTAppContent>
  </div>`,
  components: {
    PTTAppNav: PTTAppNav,
    PTTAppContent: PTTAppContent
  }
}
