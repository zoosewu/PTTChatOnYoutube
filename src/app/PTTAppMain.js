import PTTAppNav from './PTTAppNav.js';
import PTTAppContent from './PTTAppContent.js';

export let PTTAppMain = {
  template: `<div id="PTTChat-app" class="ptt-bg ptt-border rounded w-100 d-flex flex-column">
  <PTTAppNav></PTTAppNav>
  <PTTAppContent></PTTAppContent>
  </div>`,
  components: {
    'PTTAppNav': PTTAppNav,
    'PTTAppContent': PTTAppContent
  },
}