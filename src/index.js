/* eslint-disable no-unused-vars */
import { ReportMode } from './logsetting.js'
/* eslint-enable no-unused-vars */
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
/* eslint-disable prefer-const */
let appinscount = 0
/* eslint-enable prefer-const */
/* eslint-enable no-unused-vars */
/* 關閉vue-devtools */
Vue.config.devtools = ReportMode
/* 關閉錯誤警告 */
Vue.config.debug = ReportMode;
(function () {
  const filters = []
  filters.push(
    ytfilter,
    htfilter,
    blankfilter,
    twitchfilter,
    nijimadofilter,
    hdfilter
  )
  // filters.push(lineTVfilter);
  HerfFilter(filters)
  /* eslint-disable semi */
})();
/* eslint-enable semi */
