import InitApp from 'src/app/appindex'
import ChangeLog from 'src/ChangeLog'
import { ThemeCheck } from 'src/library'

export default function InitYT (messageposter, siteName) {
  const msg = messageposter
  // Check Theme
  const WhiteTheme = ThemeCheck('html', 'rgb(249, 249, 249)');

  (function CheckChatInstanced () {
    if (/www\.youtube\.com\/watch\?v=/.exec(window.location.href) === null) {
      if (showAllLog) console.log('not watch video.')
      setTimeout(CheckChatInstanced, 2000)
      return
    }
    const ChatContainer = $('ytd-live-chat-frame')
    const defaultChat = $('iframe', ChatContainer)
    const PTTApp = $('#PTTChat', ChatContainer)
    if (PTTApp.length > 0) {
      if (showAllLog) console.log('PTTApp already instanced.')
      setTimeout(CheckChatInstanced, 5000)
    } else if (defaultChat.length > 0) {
      if (showAllLog) console.log('PTTApp frame instance!')
      ChatContainer.css({ position: 'relative' })

      // 生出套件
      const isstream = checkvideotype()
      InitApp(ChatContainer, WhiteTheme, isstream, msg, siteName)
      ChangeLog()
      setTimeout(CheckChatInstanced, 5000)
    } else {
      if (showAllLog) console.log('watching video without chatroom.')
      setTimeout(CheckChatInstanced, 5000)
    }
  })()
  function checkvideotype () {
    const scriptTag = JSON.parse(document.getElementById('scriptTag').innerHTML)
    if (scriptTag.publication === undefined) {
      if (reportMode)console.log('scriptTag have no publication [is video]')
      return false
    } else {
      if (scriptTag.publication[0].endDate === undefined) {
        if (reportMode)console.log('scriptTag have no endDate [is streaming]')
        return true
      } else {
        if (reportMode)console.log('scriptTag have endDate [is end stream]')
        return false
      }
    }
    // const streambtncss = $('.ytp-live-badge').css('display')
    // console.log('streambtncss', streambtncss)
    // const logstr = ['$(\'.ytp-live-badge\').css("display")', streambtncss]
    // if (!simulateIsStreaming) {
    //   if (streambtncss === 'inline-block') {
    //     if (showAllLog)console.log('This video is streaming.', logstr)
    //     return true
    //     // $(`#PTTConnect-Time-Setting`).addClass('d-none');
    //   } else if (streambtncss === 'none') {
    //     if (showAllLog)console.log('This video is not streaming.', logstr)
    //     return false
    //   }
    // }
  }
}
