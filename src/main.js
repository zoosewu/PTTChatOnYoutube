import { MessagePoster } from './MessagePoster'
import { HerfFilter } from './filter/HerfFilter'
import { ytfilter } from './SupportWebsite/youtube/ytfilter'
import { htfilter } from './SupportWebsite/holotools/htfilter'
import { blankfilter } from './SupportWebsite/blank/blankfilter'
import { twitchfilter } from './SupportWebsite/twitch/twitchfilter'
import { nijimadofilter } from './SupportWebsite/nijimado/nijimadofilter'
// import { lineTVfilter } from './SupportWebsite/lineTV/lineTVfilter'
import { hdfilter } from './SupportWebsite/holodex/hdfilter'
import './scss/index.scss'

/* 關閉vue-devtools */
Vue.config.devtools = reportMode
/* 關閉錯誤警告 */
Vue.config.debug = reportMode
;(function () {
  const isTopframe = window.top === window.self
  if (isTopframe) {
    console.log('top last update: ', GM_getValue('lastupdatetop', 0))
    GM_setValue('lastupdatetop', Date.now.toString())
  } else {
    console.log('frame last update: ', GM_getValue('lastupdateframe', 0))
    GM_setValue('lastupdateframe', Date.now.toString())
  }
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
