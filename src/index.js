import { logsetting } from './logsetting.js';
import { MessagePoster } from './MessagePoster.js';
import { HerfFilter } from './filter/HerfFilter.js';
import { ytfilter } from './SupportWebsite/youtube/ytfilter.js';
import { htfilter } from './SupportWebsite/holotools/htfilter.js';
import { blankfilter } from './SupportWebsite/blank/blankfilter.js';
import { twitchfilter } from './SupportWebsite/twitch/twitchfilter.js';
import { nijimadofilter } from './SupportWebsite/nijimado/nijimadofilter.js';
import { lineTVfilter } from './SupportWebsite/lineTV/lineTVfilter.js';
import '../css/index.css';
//dev use 
const defaultopen = false;
const disablepttframe = false;
const simulateisstreaming = false;
// add listener to get msg
let cryptkey;
let appinscount = 0;
/* 關閉vue-devtools */
Vue.config.devtools = reportmode;
/* 關閉錯誤警告 */
Vue.config.debug = reportmode;
(function () {
  let msg = new MessagePoster;
  let filters = [];
  filters.push(ytfilter);
  filters.push(htfilter);
  filters.push(blankfilter);
  filters.push(twitchfilter);
  filters.push(nijimadofilter);
  //filters.push(lineTVfilter);
  HerfFilter(msg, filters);
})();
