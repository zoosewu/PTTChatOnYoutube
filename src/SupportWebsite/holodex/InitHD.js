import { InitApp } from '../../app/appindex'
import { ChangeLog } from '../../ChangeLog'
import { ThemeCheck } from '../../library'
import { reportmode } from '../../logsetting'
const PluginMode = Object.freeze({ new: true, classic: false })
export function InitHD (messageposter) {
  if (reportmode) console.log('InitHD')

  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  const pluginMode = GM_getValue('PluginTypeHolodex', '1') === '1'

  let recentWatch = false
  let repositionTimer
  let observer
  let layoutObserver

  setInterval(() => {
    const url = /https:\/\/holodex\.net\/multiview/.exec(window.location.href)
    if (reportmode) console.log('url', url, 'recentWatch', recentWatch)
    if (!url) {
      recentWatch = false
    } else if (!recentWatch) {
      recentWatch = true
      initHolodex()
    }
  }, 1000)

  let iconSwitchPttVisible, iconSwitchMode, mainTimer
  function createControlIcon () {
    const liveControls = $(
      '.flex-grow-1.justify-end.d-flex.mv-toolbar-btn.align-center.no-btn-text'
    )
    const holodexStyle = $('body')
      .children()
      .eq(1)
      .hasClass('theme--light')
      ? '#757575'
      : '#F2F2F2'
    iconSwitchMode = $(
      `<button type="button" id="ptt-switch-btn" title="切換PTT顯示模式" style="width: 36px; margin: 4px; padding-top: 6px"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="${holodexStyle}"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg></button>`
    )
    iconSwitchPttVisible = $(
      '<button type="button" id="ptt-collapse-btn" title="展開/隱藏PTT聊天室" style="height: 36px; width: 36px; margin: 3px; font-size: 21px;">P</button>'
    )
    liveControls.prepend(iconSwitchPttVisible, iconSwitchMode)
    if (pluginMode === PluginMode.classic) {
      iconSwitchPttVisible.css('display', 'none')
    }
  }
  function initControlIcon () {
    initIconSwitchPTTvisible()
    initIconSwitchMode()
  }
  function initIconSwitchPTTvisible () {
    const pluginWidth = parseInt(GM_getValue('PluginWidth', 350), 10)
    let nowWidth = 0
    let collapseStart = false
    let collapseEnd = true
    iconSwitchPttVisible.on('click', () => {
      if (pluginMode === PluginMode.new) {
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
    $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', () => {
      collapseStart = true
      collapseEnd = false
    })
    $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', () => {
      collapseStart = false
      collapseEnd = true
    })
  }

  function initIconSwitchMode () {
    iconSwitchMode.on('click', () => {
      if (
        confirm(
          `切換為${pluginMode === PluginMode.new ? '新' : '舊'}版PTT顯示模式？`
        )
      ) {
        switchMode()
      }
    })
  }
  function switchMode () {
    switch (pluginMode) {
      case PluginMode.new:
        switchToNewMode()
        break
      case PluginMode.classic:
        switchToClassicMode()
        break
    }
    initPttChatStyle()
    if (reportmode) console.log('display mode changed')
  }
  function switchToClassicMode () {
    clearInterval(mainTimer)
    if (observer) observer.disconnect()
    $('[name="ptt-boot-btn"]').remove()
    iconSwitchPttVisible.css('display', 'block')
    GM_setValue('PluginTypeHolodex', '1')
  }
  function switchToNewMode () {
    iconSwitchPttVisible.css('display', 'none')
    $('#pttchatparent').css('flex', '0 0 0px')
    mainTimer = setInterval(appendPttEmbedBtn, 1000)
    GM_setValue('PluginTypeHolodex', '0')
  }
  function initPttChatStyle () {
    switch (pluginMode) {
      case PluginMode.classic:
        if ($('.vue-grid-layout #PTTChat').length === 0) {
          $('#PTTChat')
            .appendTo($('.vue-grid-layout'))
            .css('display', 'none')
        }
        break
      case PluginMode.new:
        if ($('#pttchatparent #PTTChat').length === 0) {
          $('#PTTChat').appendTo($('#pttchatparent'))
        }
        $('#PTTChat-contents').css(
          'height',
          `${GM_getValue('PluginHeight', 400)}`
        )
        $('#PTTChat-app').height('')
        $('#PTTChat')
          .addClass('w-100')
          .attr('style', '')
        break
    }
    $('#PTTMain').collapse('hide')
  }
  function initPttConstructure () {
    const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
    const defaultVideoHandler = $(
      '<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>'
    )
    const PTTChatHandler = $(
      '<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>'
    )
    const defaultVideo = $('.vue-grid-layout')
    const parent = defaultVideo.parent()

    parent.append(fakeparent)
    fakeparent.append(defaultVideoHandler)
    defaultVideoHandler.append(defaultVideo)
    PTTChatHandler.css('z-index', '5')
    fakeparent.append(PTTChatHandler)
  }
  function initHolodex () {
    if (reportmode) console.log('initHolodex')
    initPttConstructure()
    createControlIcon()
    initControlIcon()

    if ($('#PTTChat').length === 0) {
      InitApp($('#pttchatparent'), WhiteTheme, true, messageposter, true)
      ChangeLog()
      const pttFrame = $(
        '<div id="ptt-frame-parent" style="position: absolute; z-index: 6;"><iframe id="PTTframe" src="//term.ptt.cc/?url=https://holodex.net" style="display:none;">你的瀏覽器不支援iframe</iframe></div>'
      )
      $('.vue-grid-layout').append(pttFrame)
      listenPttFrameBtn()
      if (reportmode) console.log('create PTTChat instance in holodex')
    }
    mainTimer =
      GM_getValue('PluginTypeHolodex', '1') === '0'
        ? setInterval(appendPttEmbedBtn, 1000)
        : undefined
    if (reportmode) console.log('main initialize done')
  }

  function appendPttEmbedBtn () {
    const btnParentSet = $('.centered-btn')
    btnParentSet.each(index => {
      const btnParent = btnParentSet.eq(index)
      if (btnParent.find($('[name="ptt-boot-btn"]')).length !== 0) return
      const btn = btnParent
        .children()
        .eq(0)
        .clone()
      btn
        .attr({
          name: 'ptt-boot-btn',
          style:
            'background-color:rgb(130, 30, 150)!important;margin-top:8px;width:190px;'
        })
        .appendTo(btnParent)
      btn
        .find($('.v-btn__content'))
        .eq(0)
        .text('P')
        .css('font-size', '20px')
      btn.on('click', () => {
        const gridIndex = btn
          .parents()
          .eq(3)
          .index()
        btnParent
          .children()
          .eq(1)
          .children()
          .eq(1)
          .trigger('click')
        appendPtt2Cell(gridIndex)
        if (reportmode) console.log(`grid-#${gridIndex}-boot-button clicked`)
      })
    })
  }

  function appendPtt2Cell (gridIndex) {
    if ($('.vue-grid-layout #PTTChat').length === 0) {
      $('#PTTChat')
        .appendTo($('.vue-grid-layout'))
        .css('display', 'none')
    }
    const cell = $('.vue-grid-item').eq(gridIndex)
    const config = { attributes: true }
    if (observer) observer.disconnect()
    observer = new MutationObserver(() => {
      if (repositionTimer) clearTimeout(repositionTimer)
      repositionTimer = setTimeout(repositionPttChat, 10, cell)
    })
    observer.observe(cell[0], config)
    checkFilledWithVideo(cell)
  }

  /** @param {JQuery} parentCell */
  function repositionPttChat (parentCell) {
    const sheet = parentCell.find($('.mv-cell.v-sheet')).eq(0)
    const editMode = sheet.hasClass('edit-mode')
    const height = sheet.height()
    const width = sheet.width()

    let el = sheet[0]
    let x = 0
    let y = 0
    while (el.className !== 'vue-grid-layout') {
      x += el.offsetLeft - el.scrollLeft + el.clientLeft
      y += el.offsetTop - el.scrollLeft + el.clientTop
      el = el.offsetParent
    }

    $('#PTTChat-contents').height('')
    if (editMode) {
      $('#PTTChat').attr(
        'style',
        `z-index: 5; margin: ${y + 20}px 0px 0px ${x +
          20}px; width: ${width}px !important;`
      )
      $('#PTTChat-app').height(height - 68)
    } else {
      $('#PTTChat').attr(
        'style',
        `z-index: 5; margin: ${y}px 0px 0px ${x}px; width: ${width}px !important;`
      )
      $('#PTTChat-app').height(height - 24)
    }
    $('#PTTChat')
      .removeClass('w-100')
      .css('display', 'block')
    $('#PTTMain').collapse('show')
    checkCellRemoved(parentCell[0])
  }

  function checkCellRemoved (observeredNode) {
    if ($('.vue-grid-layout').length === 0) {
      setTimeout(checkCellRemoved, 10, observeredNode)
    } else {
      if (layoutObserver) layoutObserver.disconnect()
      layoutObserver = new MutationObserver(mutations => {
        mutations.forEach(el => {
          el.removedNodes.forEach(e => {
            if (e === observeredNode) hidePttChatInGrid()
          })
        })
      })
      const config = { childList: true }
      layoutObserver.observe($('.vue-grid-layout')[0], config)
    }
  }

  function hidePttChatInGrid () {
    if ($('.vue-grid-layout #PTTChat').length !== 0) {
      $('#PTTChat').css('display', 'none')
      $('#PTTMain').collapse('hide')
    }
    if (observer) observer.disconnect()
    if (reportmode) console.log('hide PTTChat')
  }

  function checkFilledWithVideo (cell) {
    if (cell.find($('.mv-frame.ma-auto')).length === 0) {
      setTimeout(checkFilledWithVideo, 1000, cell)
    } else {
      if (reportmode) console.log('cell fill with video, remove PTTChat')
      hidePttChatInGrid()
    }
  }

  function listenPttFrameBtn () {
    // get position recursively
    function repositionFrame () {
      let el = $('#PTTMainBtn')[0]
      let x = 0
      let y = 0
      while (el && el.className !== 'v-main__wrap') {
        x += el.offsetLeft - el.scrollLeft + el.clientLeft
        y += el.offsetTop - el.scrollLeft + el.clientTop
        // console.log(el)
        el = el.offsetParent
      }
      y =
        y +
        $('#PTTChat-navbar').height() -
        document.querySelector('.v-main__wrap .v-toolbar__content').offsetHeight
      const height = $('#PTTChat-app').height() - $('#PTTChat-navbar').height()
      const width = $('#PTTChat').width()
      $('#ptt-frame-parent').css('margin', `${y}px 0px 0px ${x}px`)
      $('#PTTframe').css({ height: `${height}px`, width: `${width}px` })

      // 轉場動畫 50ms
      if ($('#PTTChat-contents-PTT').width() === 0) {
        $('#PTTframe').css({ border: 'none', display: 'none' })
      } else $('#PTTframe').css({ border: 'revert', display: 'block' })

      if ($('#nav-item-PTT').hasClass('active')) {
        setTimeout(repositionFrame, 10)
      } else $('#PTTframe').css({ border: 'none', display: 'none' })
    }

    $('#nav-item-PTT')
      .off('click')
      .on('click', () => {
        setTimeout(repositionFrame, 100)
      })
  }
}
