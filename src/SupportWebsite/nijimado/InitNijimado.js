import InitApp from 'src/app/appindex'
import ChangeLog from 'src/ChangeLog'
import { ThemeCheck } from 'src/library'

export default function InitNijimado (messageposter, siteName) {
  // Check Theme
  const WhiteTheme = ThemeCheck('mat-drawer-container', 'rgb(250, 250, 250)')

  let tryinsholotools = 20;
  (function ChechChatInstanced () {
    if (tryinsholotools >= 0) {
      TryInsChat()
      setTimeout(ChechChatInstanced, 1000)
    }
  })()
  function TryInsChat () {
    const parent = $('app-home.ng-star-inserted')
    if (reportMode) console.log('parent', parent)
    if (parent.length > 0) {
      const pluginwidth = GM_getValue('PluginWidth', 400)
      const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
      const defaultVideoHandler = $('<div id="videohandler" style="flex:1 1 auto;"></div>')
      const defaultVideo = $('[role="main"].content')
      const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ' + pluginwidth + 'px;position:relative;"></div>')
      parent.append(fakeparent)
      fakeparent.append(defaultVideoHandler)
      defaultVideoHandler.append(defaultVideo)
      fakeparent.append(PTTChatHandler)
      $('.reopen-toolbar').css({ 'z-index': '302' })
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, siteName, true)
      ChangeLog()
      tryinsholotools = -10
    } else {
      tryinsholotools--
    }
  }
}
