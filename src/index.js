import { logsetting } from './logsetting.js';
import { MessagePoster } from './MessagePoster.js';
import { HerfFilter } from './filter/HerfFilter.js';
import { ytfilter } from './youtube/ytfilter.js';
import { htfilter } from './holotools/htfilter.js';
import { blankfilter } from './blank/blankfilter.js';
import { twitchfilter } from './twitch/twitchfilter.js';

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
  HerfFilter(msg, filters);
})();
