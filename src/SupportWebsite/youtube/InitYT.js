import InitApp from 'src/app/appindex'
import ChangeLog from 'src/ChangeLog'
import { ThemeCheck } from 'src/library'

export default function InitYT (messagePoster, siteName) {
  const msg = messagePoster
  // Check Theme
  const WhiteTheme = ThemeCheck('html', 'rgb(249, 249, 249)');

  (function CheckChatInstanced () {
    if (/www\.youtube\.com\/watch\?v=/.exec(window.location.href) === null) {
      if (showAllLog) console.log('not watch video.')
      setTimeout(CheckChatInstanced, 2000)
      return
    }
    // const ChatContainer = $('ytd-live-chat-frame')
    const ChatContainer = $('#chat-container')
    const defaultChat = $('iframe', ChatContainer)
    const PTTApp = $('#PTTChat', ChatContainer)
    if (PTTApp.length > 0) {
      if (showAllLog) console.log('PTTApp already instanced.')
      setTimeout(CheckChatInstanced, 5000)
    } else if (defaultChat.length > 0) {
      if (showAllLog) console.log('PTTApp frame instance!')
      ChatContainer.css({ position: 'relative' })

      // 生出套件
      const isStream = checkVideoType()
      InitApp(ChatContainer, WhiteTheme, isStream, msg, siteName)
      ChangeLog()
      setTimeout(CheckChatInstanced, 5000)
    } else {
      if (showAllLog) console.log('watching video without chatroom.')
      setTimeout(CheckChatInstanced, 5000)
    }
  })()
  function getScriptTag () {
    const scriptTagElement = document.getElementById('scriptTag')
    if (scriptTagElement == null) return
    const scriptTag = JSON.parse(scriptTagElement.innerHTML)
    return scriptTag
  }
  function checkVideoType () {
    const scriptTag = getScriptTag()
    if (scriptTag === undefined || scriptTag.publication === undefined) {
      if (reportMode) console.log('scriptTag have no publication [is video]')
      return false
    } else {
      if (scriptTag.publication[0].endDate === undefined) {
        if (reportMode) console.log('scriptTag have no endDate [is streaming]')
        return true
      } else {
        if (reportMode) console.log('scriptTag have endDate [is end stream]')
        return false
      }
    }
  }
}
