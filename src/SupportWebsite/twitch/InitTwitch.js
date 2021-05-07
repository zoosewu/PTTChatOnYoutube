
import { InitApp } from '../../app/appindex.js'
import { ThemeCheck } from '../../library.js'

export function InitTwitch(messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('body', 'rgb(247, 247, 248)');

  // run app instance loop
  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    TryInsChat()
  })()
  function TryInsChat () {
    const parent = $('section.chat-room')
    if (reportmode) console.log('parent', parent)
    if (parent.length > 0) {
      const PTTApp = $('#PTTChat', parent)
      if (PTTApp.length < 1) {
        if (reportmode) console.log('InitApp')
        InitApp(parent, WhiteTheme, true, messageposter)
      }
    }
  }
}
