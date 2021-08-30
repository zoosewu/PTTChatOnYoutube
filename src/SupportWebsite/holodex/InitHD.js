
import { InitApp } from '../../app/appindex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'

export function InitHD (messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  let recentWatch = false
  let resizeTimer
  let resizeObserver
  let overrideBtn

  // watch if window size changed
  $(window).on('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      checkOriginMenuBtn()
      if (reportmode) console.log('window size change')
    }, 500)
  })

  setInterval(() => {
    const url = /https:\/\/holodex\.net\/multiview/.exec(window.location.href)
    if (!url) recentWatch = false
    else if (!recentWatch) initHolodex()
  }, 1000)

  function initHolodex () {
    const pluginWidth = parseInt(GM_getValue('PluginWidth', 350), 10)
    const liveControls = $('.flex-grow-1.justify-end.d-flex.mv-toolbar-btn.align-center.no-btn-text')
    const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
    const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>')
    const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>')
    const defaultVideo = $('.vue-grid-layout')
    const parent = defaultVideo.parent()
    const holodexStyle = $('body').children().eq(1).hasClass('theme--light') ? '#757575' : '#F2F2F2'
    const iconSwitch = $(`<button type="button" id="ptt-switch-btn" title="切換PTT顯示模式" style="width: 36px; margin: 4px; padding-top: 6px"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="${holodexStyle}"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg></button>`)
    const iconPTT = $('<button type="button" id="ptt-collapse-btn" title="展開/隱藏PTT聊天室" style="height: 36px; width: 36px; margin: 4px; font-size: 21px;">P</button>')
    liveControls.prepend(iconPTT, iconSwitch)
    parent.append(fakeparent)
    fakeparent.append(defaultVideoHandler)
    defaultVideoHandler.append(defaultVideo)
    PTTChatHandler.css('z-index', '5')
    fakeparent.append(PTTChatHandler)
    if (GM_getValue('PluginTypeHolodex', '1') === '0') iconPTT.css('display', 'none')

    let nowWidth = 0
    let collapseStart = false
    let collapseEnd = true
    iconPTT.on('click', () => {
      if ($('#pttchatparent #PTTChat').length === 0) $('#PTTChat').css('display', 'block').appendTo($('#pttchatparent'))
      if (GM_getValue('PluginTypeHolodex', '1') === '1') {
        if (collapseEnd || !collapseStart) {
          if (nowWidth === 0) {
            $('#PTTMain').collapse('show')
            nowWidth = pluginWidth
          } else {
            $('#PTTMain').collapse('hide')
            nowWidth = 0
          }
          $('#pttchatparent').css('flex', `0 0 ${nowWidth}px`)
        }
      }
      if (reportmode) console.log('hide PTT')
    })
    $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', () => { collapseStart = true; collapseEnd = false })
    $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', () => { collapseStart = false; collapseEnd = true })

    iconSwitch.on('click', () => {
      if (confirm(`切換為${GM_getValue('PluginTypeHolodex', '1') === '0' ? '舊' : '新'}版PTT顯示模式？`)) {
        if (GM_getValue('PluginTypeHolodex', '1') === '0') {
          clearInterval(mainTimer)

          iconPTT.css('display', 'block')
          $('#PTTChat-contents').css('height', `${GM_getValue('PluginHeight', 400)}`)
          $('#PTTChat-app').css('height', '')

          if ($('#PTTChat').length !== 0) initPttChatPosition()
          $('[name="ptt-boot-btn"]').remove()
          GM_setValue('PluginTypeHolodex', '1')
        } else {
          iconPTT.css('display', 'none')
          $('#pttchatparent').css('flex', '0 0 0px')
          initPttChatPosition()
          GM_setValue('PluginTypeHolodex', '0')
          mainTimer = embedProcedure()
        }
      }
      if (reportmode) console.log('display mode changed')
    })

    function embedProcedure () {
      const t = setInterval(() => {
        appendPttEmbedBtn()
        checkAutoRemove()
        if (!overrideBtn || overrideBtn.length === 0) checkOverrideSettingBtn()
      }, 1000)
      return t
    }

    let mainTimer = GM_getValue('PluginTypeHolodex', '1') === '0'
      ? embedProcedure()
      : undefined

    recentWatch = true
    initPttChatPosition()
    checkOriginMenuBtn()
    if (reportmode) console.log('main initialize done')
  }

  function checkOriginMenuBtn () {
    function replaceOriginalMenuBtn (id, svg, title, coverSvg = undefined) {
      const btnSvg = $(`.v-toolbar__content path[d="${svg}"]`)
      if (btnSvg.length === 1) {
        const originalBtn = btnSvg.parents().eq(3)
        if ($(`#fake-menu-${id}-btn`).length === 0) {
          const fakeBtn = originalBtn.clone().attr({ id: `fake-menu-${id}-btn`, title: title })
          fakeBtn.insertAfter(originalBtn)
          originalBtn.css('display', 'none')
          fakeBtn.off('click').on('click', () => {
            if ($('#pttchatparent #PTTChat').length === 0) initPttChatPosition()
            originalBtn.trigger('click')
            if (reportmode) console.log(title)
          })
        } else {
          if (reportmode) console.warn('couldn\'t detect original btn.')
          if (coverSvg) $(`.v-toolbar__content path[d="${coverSvg}"]`).parents().eq(3).css('display', 'block')
          $(`#fake-menu-${id}-btn`).css('display', 'none')
        }
      } else if (btnSvg.length === 2) {
        const fakeBtn = $(`#fake-menu-${id}-btn`)
        fakeBtn.css('display', 'block')
        const originalBtn = btnSvg.parent().parent().parent().parent().not(fakeBtn)
        originalBtn.css('display', 'none')

        if (!coverSvg) {
          fakeBtn.off('click').on('click', () => {
            if ($('#pttchatparent #PTTChat').length === 0) initPttChatPosition()
            originalBtn.trigger('click')
            if (reportmode) console.log(title)
          })
        }
      }
    }

    replaceOriginalMenuBtn(
      'delete',
      'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z',
      '清除播放清單',
      'M7 3H5V9H7V3M19 3H17V13H19V3M3 13H5V21H7V13H9V11H3V13M15 7H13V3H11V7H9V9H15V7M11 21H13V11H11V21M15 15V17H17V21H19V17H21V15H15Z'
    )
    replaceOriginalMenuBtn(
      'defaultLayout',
      'M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2M4,4V11H11V4H4M4,20H11V13H4V20M20,20V13H13V20H20M20,4H13V11H20V4Z',
      '預設佈局'
    )
  }

  function initPttChatPosition () {
    if ($('#PTTChat').length === 0) {
      InitApp($('#pttchatparent'), WhiteTheme, true, messageposter, true)
      ChangeLog()
      const pttFrame = $('<div id="ptt-frame-parent" style="position: absolute;"><iframe id="PTTframe" src="//term.ptt.cc/?url=https://holodex.net" style="display:none;">你的瀏覽器不支援iframe</iframe></div>')
      $('.vue-grid-layout').append(pttFrame)
      listenPttFrameBtn()
      if (reportmode) console.log('create PTTChat instance in holodex')
    } else {
      $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
      $('#PTTMain').collapse('hide')
      const chatParent = $('[name="pttchat-parent"]')
      if (chatParent.length !== 0) chatParent.remove()
      if (resizeObserver) resizeObserver.disconnect()
      if (reportmode) console.log('PTTChat reposition')
    }
  }

  function appendPttEmbedBtn () {
    const btnParentSet = $('.mx-6.thin-scroll-bar.d-flex.flex-grow-1.flex-shrink-1.align-center.justify-center')
    btnParentSet.each(index => {
      const btnParent = btnParentSet.eq(index)
      if (btnParent.find($('[name="ptt-boot-btn"]')).length === 0) {
        if (!btnParent.children().eq(0).hasClass('d-flex')) {
          btnParent.prepend($('<div class="d-flex"></div>').prepend(btnParent.children()))
          btnParent.css('flex-direction', 'column')
        }
        const btn = btnParent.children().eq(0).children().eq(1).clone().attr({ name: 'ptt-boot-btn', style: 'background-color:rgb(150, 0, 180)!important;margin-top:10px;width:165px;' }).appendTo(btnParent)
        btn.find('path').attr('d', 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z')
        btn.on('click', () => {
          const gridIndex = btn.parents().eq(3).index()
          btnParent.children().eq(0).children().eq(1).trigger('click')
          appendPtt2Cell(gridIndex)
          if (reportmode) console.log(`grid-#${gridIndex}-boot-button clicked`)
        })
      }
    })
  }

  function checkAutoRemove () {
    const gridItems = $('.vue-grid-item')
    gridItems.each(index => {
      const item = gridItems.eq(index)
      if (item.find($('.mv-frame.ma-auto')).length === 0) return
      if (item.find($('[name="fake-grid-item-delete-btn"]')).length !== 0) return
      const originBtn = item.find($('path[d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"]')).parents().eq(3)
      if (originBtn.length !== 0) {
        const fakeDeleteBtn = originBtn.clone().attr('name', 'fake-grid-item-delete-btn')
        fakeDeleteBtn.insertAfter(originBtn)
        originBtn.css('display', 'none')
        fakeDeleteBtn.off('click').on('click', () => {
          if ($('#pttchatparent #PTTChat').length === 0) initPttChatPosition()
          originBtn.trigger('click')
          if (reportmode) console.log('auto remove')
        })
      }
    })
  }

  function appendPtt2Cell (gridIndex) {
    const gridParent = $('.vue-grid-layout').children().eq(gridIndex)
    const cellContent = gridParent.find($('.cell-content'))
    const cellControl = gridParent.find($('.cell-control'))
    if (cellContent.length === 0) setTimeout(appendPtt2Cell, 250, gridIndex)
    else {
      cellContent.css('position', 'relative').prepend($('<div name="pttchat-parent" style="height: 100%;width: 100%;position: absolute;z-index: 6;"></div>'))
      const pttChatParent = $('#PTTChat').parent('[name="pttchat-parent"]')
      $('#PTTChat').appendTo(cellContent.children().eq(0)).css('display', 'block')
      if (pttChatParent.length !== 0) pttChatParent.remove()

      const chatBtn = cellControl.find($('path[d="M20,2H4C2.9,2,2,2.9,2,4v18l4-4h14c1.1,0,2-0.9,2-2V4C22,2.9,21.1,2,20,2zM9.9,10.8v3.8h-2v-3.8L5.1,6.6h2.4l1.4,2.2 l1.4-2.2h2.4L9.9,10.8zM18.9,8.6h-2v6h-2v-6h-2v-2h6V8.6z"]')).parents().eq(3)
      if (chatBtn.css('background-color') === 'rgb(240, 98, 146)') {
        chatBtn.trigger('click')
      }

      $('#PTTChat-app').css('height', $('#PTTChat').parent().css('height'))
      $('#PTTChat-contents').css('height', '')
      $('#PTTMainBtn').off('click').on('click', () => $('[name="pttchat-parent"]').css('z-index', $('[name="pttchat-parent"]').css('z-index') === 'auto' ? '6' : 'auto'))

      if (resizeObserver) resizeObserver.disconnect()
      resizeObserver = new ResizeObserver(entries => {
        $('#PTTChat-app').css('height', entries[0].contentRect.height)
      })
      resizeObserver.observe(document.getElementById('PTTChat').parentNode)

      listenEditBtn(gridParent)
      checkFilledVideo(gridParent)
      $('#PTTMain').collapse('show')
    }
  }

  function listenPttFrameBtn () {
    $('#nav-item-PTT').off('click').on('click', () => {
      setTimeout(repositionFrame, 100)

      // get position recursively
      function repositionFrame () {
        let el = $('#PTTMainBtn')[0]
        let x = 0
        let y = 0
        while (el) {
          x += el.offsetLeft - el.scrollLeft + el.clientLeft
          y += el.offsetTop - el.scrollLeft + el.clientTop
          el = el.offsetParent
        }
        y -= 35
        const height = $('#PTTChat-app').height() - 30
        const width = $('#PTTChat-app').width()
        $('#ptt-frame-parent').css('margin', `${y}px 0px 0px ${x}px`).css('z-index', 6)
        $('#PTTframe').css({ display: 'block', height: `${height}px`, width: `${width}px` })

        if ($('#PTTChat-contents-PTT').width() === 0) $('#PTTframe').css('border', 'none')
        else $('#PTTframe').css('border', 'revert')

        if ($('#nav-item-PTT').hasClass('active')) setTimeout(repositionFrame, 100)
        else {
          $('#ptt-frame-parent').css('z-index', -1)
          $('#PTTframe').css('display', 'none')
        }
      }
    })
  }

  function listenEditBtn (gridParent) {
    const editBtn = gridParent.find($('path[d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"]')).parents().eq(3)
    if (editBtn.length === 0) setTimeout(listenEditBtn, 250, gridParent)
    else {
      editBtn.off('click').on('click', () => {
        if (gridParent.find($('#PTTChat')).length !== 0) {
          const cellContent = gridParent.children().eq(0).children().eq(1)
          const px = cellContent.css('padding-left')
          const pt = cellContent.css('padding-top')
          const pb = cellContent.css('padding-bottom')
          cellContent.children().eq(0).css({ height: `calc(100% - ${pt} - ${pb})`, width: `calc(100% - ${px} - ${px})` })
          listenCtrlBtn(gridParent)
        }
      })
    }
  }

  function listenCtrlBtn (gridParent) {
    const btnParent = gridParent.find($('.cell-control')).children().eq(0)
    if (btnParent.length === 0) setTimeout(listenCtrlBtn, 250, gridParent)
    else {
      const originBackBtn = btnParent.children().eq(0)
      const fakeBackBtn = originBackBtn.clone()
      const originDeleteBtn = btnParent.children().eq(2)
      const fakeDeleteBtn = originDeleteBtn.clone()
      const confirmBtn = btnParent.children().eq(1)
      originBackBtn.css('display', 'none')
      originDeleteBtn.css('display', 'none')
      fakeBackBtn.insertAfter(originBackBtn)
      fakeDeleteBtn.insertAfter(originDeleteBtn)
      confirmBtn.off('click').on('click', () => {
        if (gridParent.find($('#PTTChat')).length !== 0) {
          gridParent.find($('[name="pttchat-parent"]')).css({ height: '100%', width: '100%' })
          $('#PTTChat-app').css('height', $('#PTTChat').parent().css('height'))
          listenEditBtn(gridParent)
        }
      })
      fakeBackBtn.off('click').on('click', () => {
        if (gridParent.find($('#PTTChat')) !== 0) initPttChatPosition()
        originBackBtn.trigger('click')
      })
      fakeDeleteBtn.off('click').on('click', () => {
        if (gridParent.find($('#PTTChat')).length !== 0) initPttChatPosition()
        originDeleteBtn.trigger('click')
      })
    }
  }

  function checkFilledVideo (gridParent) {
    if (gridParent.find($('.mv-frame.ma-auto')).length === 0) setTimeout(checkFilledVideo, 1000, gridParent)
    else if (gridParent.find($('#PTTChat')).length !== 0) {
      if (reportmode) console.log('cell fill with video, remove PTTChat')
      initPttChatPosition()
    }
  }

  function checkOverrideSettingBtn () {
    overrideBtn = $('[role="document"] span.v-btn__content').eq(0).parent()
    if (overrideBtn.length === 0) return
    const fakeOverrideBtn = overrideBtn.clone()
    fakeOverrideBtn.insertAfter(overrideBtn)
    overrideBtn.css('display', 'none')
    fakeOverrideBtn.off('click').on('click', () => {
      if ($('#pttchatparent #PTTChat').length === 0) initPttChatPosition()
      overrideBtn.trigger('click')
    })
  }
}
