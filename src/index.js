/* eslint-disable no-unused-vars */
import { logsetting } from './logsetting.js'
/* eslint-enable no-unused-vars */
import { MessagePoster } from './MessagePoster.js'
import { HerfFilter } from './filter/HerfFilter.js'
import { ytfilter } from './SupportWebsite/youtube/ytfilter.js'
import { htfilter } from './SupportWebsite/holotools/htfilter.js'
import { blankfilter } from './SupportWebsite/blank/blankfilter.js'
import { twitchfilter } from './SupportWebsite/twitch/twitchfilter.js'
import { nijimadofilter } from './SupportWebsite/nijimado/nijimadofilter.js'
// import { lineTVfilter } from './SupportWebsite/lineTV/lineTVfilter.js'
import { hdfilter } from './SupportWebsite/holodex/hdfilter.js'
import '../css/index.css'
/* eslint-disable no-unused-vars */
// dev use
const defaultopen = false
const disablepttframe = false
const simulateisstreaming = false
// add listener to get msg
let cryptkey
const appinscount = 0
/* eslint-enable no-unused-vars */
/* 關閉vue-devtools */
Vue.config.devtools = reportmode
/* 關閉錯誤警告 */
Vue.config.debug = reportmode;
(function () {
  const msg = new MessagePoster()
  const filters = []
  filters.push(ytfilter)
  filters.push(htfilter)
  filters.push(blankfilter)
  filters.push(twitchfilter)
  filters.push(nijimadofilter)
  // filters.push(lineTVfilter);
  filters.push(hdfilter)
  HerfFilter(msg, filters)
})()
