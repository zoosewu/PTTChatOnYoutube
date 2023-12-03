const pkg = require('../package.json')
module.exports = {
  license: pkg.license,
  'name:zh-TW': 'Youtube聊天室顯示PTT推文',
  namespace: 'https://github.com/zoosewu/PTTChatOnYoutube',
  'description:zh-tw': '連結PTT推文到Youtube聊天室  讓你簡單追實況搭配推文',
  match: [
    'https://www.youtube.com/*',
    'https://youtu.be/*',
    'https://term.ptt.cc/*',
    'https://hololive.jetri.co/*',
    'https://www.twitch.tv/*',
    'https://niji-mado.web.app/home',
    'https://lin.ee/*',
    'https://blank.org/*',
    'https://holodex.net/*',
    'https://lolesports.com/*'
  ],
  grant: [
    'GM_xmlhttpRequest',
    'GM_info',
    'unsafeWindow',
    'GM_getValue',
    'GM_setValue',
    'GM_deleteValue',
    'GM_addValueChangeListener',
    'GM_removeValueChangeListener',
    'GM_registerMenuCommand',
    'GM_unregisterMenuCommand'
  ],
  'run-at': 'document-idle',
  require: [
    'https://code.jquery.com/jquery-3.5.1.slim.min.js',
    'https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js',
    'https://cdn.jsdelivr.net/npm/xss@1.0.8/dist/xss.js',
    'https://cdn.jsdelivr.net/npm/@akryuminfinitum/vue-virtual-scroller@1.0.11-canary.2/dist/vue-virtual-scroller.min.js'
  ],
  homepageURL:
    'https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage',
  downloadURL:
    'https://greasyfork.org/scripts/418469-pttchatonyt/code/PttChatOnYt.user.js',
  updateURL:
    'https://greasyfork.org/scripts/418469-pttchatonyt/code/PttChatOnYt.user.js'
}
