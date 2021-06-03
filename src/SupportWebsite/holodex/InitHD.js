
import { InitApp } from '../../app/appindex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'

export function InitHD (messageposter) {
  ChangeLog()
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250');
  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    const cells = $('.px-0.d-flex.flex-grow-1.align-stretch.mb-1.v-sheet')

    if (cells.length > 0) {
      for (let index = 0; index < cells.length; index++) {
        const cellButtonsParent = cells[index]
        const cell = cellButtonsParent.parentElement.parentElement.parentElement
        const customButton = $('.inspttbutton', cellButtonsParent)
        if (customButton.length === 0) {
          const originalButtons = $('button', cellButtonsParent)
          resizeOriginalButton(originalButtons)
          // originalButtons.css({ 'flex-basis': '33%', 'margin-right': '4px !important', 'margin-left': '4px !important' })
          const newButton = cloneCustomButton()
          newButton.appendTo(cellButtonsParent)
          newButton.on('click', e => { console.log('TryInsChat'); TryInsChat(cell) })
        }
      }
    }
  })()
  function resizeOriginalButton (buttons) {
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i]
      button.style.setProperty('flex-basis', '30%')
      button.style.setProperty('margin-right', '4px', 'important')
      button.style.setProperty('margin-left', '4px', 'important')
    }
  }
  function cloneCustomButton () {
    const button = $('.flex-grow-1.v-btn.v-btn--is-elevated.teal').clone()
    button.addClass('inspttbutton')
    button.removeClass('teal')
    button.css('background-color', '#4eaf40')
    return button
  }
  function TryInsChat (cell) {
    const PTTApp = $('#PTTChat')
    if (PTTApp.length > 0) {
      console.log('PTTApp already instanced.')
      return
    }
    $('.flex-grow-1.v-btn.v-btn--is-elevated.teal', cell)[0].click()
    setTimeout(() => {
      const PTTChatHandler = $('div[style="width: 100%; height: 100%;"]')
      PTTChatHandler.children().remove()
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, true)
      setTimeout(() => {
        const chat = $('#PTTChat')
        chat.removeAttr('style')
        chat.removeClass('position-absolute')
      }, 100)
    }, 50)
  }
}
