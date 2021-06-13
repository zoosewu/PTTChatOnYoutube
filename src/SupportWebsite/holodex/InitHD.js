
import { InitApp } from '../../app/appindex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'

export function InitHD (messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  // run app instance loop
  const watchcheck = /https:\/\/holodex\.net\/multiview/.exec(window.location.href)
  let pttBootBtnCount = 0; let count = 0
  if (watchcheck) {
    setInterval(() => {
      const btnParentSet = $('.px-0.d-flex.flex-grow-1.align-stretch.mb-1')
      if (btnParentSet.length > pttBootBtnCount) {
        btnParentSet.each(function (index) {
          const btnParent = btnParentSet.eq(index)
          if (!(btnParent.children().eq(0).hasClass('d-flex'))) {
            btnParent.css('flex-direction', 'column')
            btnParent.children().eq(1).clone().attr({ id: 'pttBootBtn', ins: `${count}` }).appendTo(btnParent).attr('style', 'background-color: rgb(150, 0, 180) !important').css({ 'margin-top': '15px', 'flex-basis': '100%', padding: '6px 0px', 'max-width': '608px' })
            btnParent.children().eq(2).find('path').attr('d', 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z')
            btnParent.prepend($('<div class="d-flex"></div>').prepend(btnParent.children().eq(0), btnParent.children().eq(1)))
            console.log(count)
            const currentBtn = $(`#pttBootBtn[ins="${count}"]`)
            currentBtn.on('click', function () {
              console.log('click')
              if ($('#PTTChat').length === 0) {
                const gridIndex = currentBtn.parents().eq(4).index()
                btnParent.children().eq(0).children().eq(1).trigger('click')
                installPTT(gridIndex)
              }
            })
            count++
          }
        })
      }
      pttBootBtnCount = btnParentSet.length
    }, 1000)
  }
  function installPTT (gridIndex) {
    const t = setInterval(() => {
      if ($('#PTTChat').length === 0) {
        const gridParent = $('.vue-grid-layout').children().eq(gridIndex)
        if (gridParent.has($('.cell-content'))) {
          gridParent.children().children().eq(1).css('position', 'relative').prepend($('<div style="height: 100%; width: 100%; position: absolute;"></div>'))
          InitApp(gridParent.children().children().eq(1).children().eq(0), WhiteTheme, true, messageposter, true)
          ChangeLog()
          const chatBtn = gridParent.find($('span:contains("Chat")')).parent()
          $('#PTTChat').addClass('h-100').css('background', 'transparent')
          $('#PTTMain').removeClass('position-absolute')
          $('#PTTChat-contents').css('height', '')
          if (chatBtn.css('background-color') !== 'rgb(39, 39, 39)') {
            chatBtn.trigger('click')
          }
          $('#PTTMainBtn').on('click', function () {
            const originChat = gridParent.children().children().eq(1).children().eq(1)
            const h = $('#PTTChat').parent().height()
            if (originChat.css('z-index') === '-1') {
              $('#PTTMain').removeClass('h-100').css('max-height', h + 'px')
              $('#PTTChat-app').removeClass('h-100').css('max-height', h + 'px')
              originChat.css('z-index', '0')
            } else {
              $('#PTTMain').css('max-height', h + 'px')
              $('#PTTChat-app').css('max-height', h + 'px')
              $('#PTTMain').on('shown.bs.collapse', function () {
                $('#PTTMain').addClass('h-100').css('max-height', '')
                $('#PTTChat-app').addClass('h-100').css('max-height', '')
              })
              originChat.css('z-index', '-1')
            }
          })
          listenEditBtn(gridParent)
          $('#PTTMainBtn').trigger('click')
          clearInterval(t)
        }
      }
    }, 200)
  }
  function listenEditBtn (gridParent) {
    const t = setInterval(() => {
      const editBtn = gridParent.find($('path[d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"]')).parents().eq(3)
      if (editBtn) {
        editBtn.on('click', function () {
          const cellContent = gridParent.children().children().eq(1)
          const px = cellContent.css('padding-left')
          const pt = cellContent.css('padding-top')
          const pb = cellContent.css('padding-bottom')
          cellContent.children().eq(0).css({ height: `calc(100% - ${pt} - ${pb})`, width: `calc(100% - ${px} - ${px})` })
          listenCtrlBtn(gridParent)
        })
        clearInterval(t)
      }
    }, 200)
  }
  function listenCtrlBtn (gridParent) {
    const t = setInterval(() => {
      const btnParent = gridParent.find($('.cell-control')).children()
      if (btnParent) {
        btnParent.children().eq(0).attr({ disabled: 'true', title: '鎖定：PTT運行中', style: 'background-color: rgb(150, 150, 150) !important' })
        btnParent.children().eq(1).on('click', function () {
          gridParent.children().children().eq(1).children().eq(0).css({ height: '100%', width: '100%' })
          listenEditBtn(gridParent)
        })
        clearInterval(t)
      }
    }, 200)
  }
}
