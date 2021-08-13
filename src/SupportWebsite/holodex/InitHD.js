
import { InitApp } from '../../app/AppIndex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'
import { ReportMode } from '../../logsetting.js'

export function InitHD (messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  // run app instance loop
  let waswatch
  let iswatch
  let tryinsholotools = 20;

  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    const watchcheck = /https:\/\/holodex\.net\/multiview/.exec(window.location.href)
    if (watchcheck) iswatch = watchcheck[0]
    else iswatch = false
    if (waswatch !== iswatch && iswatch) {
      tryinsholotools = 20
    }
    if (tryinsholotools >= 0) {
      TryInsChat()
    }
    waswatch = iswatch
  })()
  function TryInsChat () {
    // const parent = $(`.v-main__wrap`);
    const parent = $('.vue-grid-layout').parent()
    if (ReportMode) console.log('parent', parent)
    if (parent.length > 0 && iswatch) {
      const pluginwidth = GM_getValue('PluginWidth', 400)
      const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
      const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>')
      // const defaultVideo = $(`.vue-grid-layout`).parent();
      const defaultVideo = $('.vue-grid-layout')

      const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ' + pluginwidth + 'px;position:relative;"></div>')
      parent.append(fakeparent)
      fakeparent.append(defaultVideoHandler)
      defaultVideoHandler.append(defaultVideo)
      fakeparent.append(PTTChatHandler)
      $('.reopen-toolbar').css({ 'z-index': '302' })
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, true)
      ChangeLog()
      tryinsholotools = -10
    } else {
      tryinsholotools--
    }
  }
}
