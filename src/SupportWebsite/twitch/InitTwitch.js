
import InitApp from 'src/app/appindex'
import ChangeLog from 'src/ChangeLog'
import { ThemeCheck } from 'src/library'

export default function InitTwitch (messageposter, siteName) {
  // Check Theme
  const WhiteTheme = ThemeCheck('body', 'rgb(247, 247, 248)');

  // run app instance loop
  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    TryInsChat()
  })()
  function TryInsChat () {
    const parent = $('section.chat-room')
    if (reportMode) console.log('parent', parent)
    if (parent.length > 0) {
      const PTTApp = $('#PTTChat', parent)
      if (PTTApp.length < 1) {
        InitApp(parent, WhiteTheme, true, messageposter, siteName)
        ChangeLog()
      }
    }
  }
}
