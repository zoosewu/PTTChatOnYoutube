
import InitApp from 'src/app/appindex'
import ChangeLog from 'src/ChangeLog'
import { ThemeCheck } from 'src/library'

export default function InitLOLEsports (messageposter, siteName) {
  // Check Theme
  const WhiteTheme = false;

  // run app instance loop
  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    TryInsChat()
  })()
  function TryInsChat () {
    const parent = $('.upper')
    if (reportMode) console.log('parent', parent)
    if (parent.length > 0) {
      const PTTApp = $('#PTTChat', parent)
      if (PTTApp.length < 1) {
        const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
        const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>')
        const defaultVideo = $('.VideoPlayer')
        const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>')

        parent.append(fakeparent)
        fakeparent.append(defaultVideoHandler)
        defaultVideoHandler.append(defaultVideo)
        fakeparent.append(PTTChatHandler)

        InitApp(PTTChatHandler, WhiteTheme, true, messageposter, siteName)
        ChangeLog()
      }
    }
  }
}
