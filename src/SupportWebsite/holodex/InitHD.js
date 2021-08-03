
import { InitApp } from '../../app/appindex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'

export function InitHD (messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  let pttBootBtnCount = 0
  let count = 0
  let execTime = 0
  let wasWatch = false
  let resizeTimer
  let resizeObserver

  // watch if window size changed
  $(window).on('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      checkOriginDeleteBtn()
      if (reportmode) console.log('window size change')
    }, 500)
  })

  function checkOriginDeleteBtn () {
    const deleteBtnSvg = $('.v-toolbar__content').find($('path[d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"]'))
    if (deleteBtnSvg.length === 1) {
      const originDeleteBtn = deleteBtnSvg.parents().eq(3)
      if ($('#fake-menu-delete-btn').length === 0) {
        const fakeDeleteBtn = originDeleteBtn.clone()
        fakeDeleteBtn.attr({ id: 'fake-menu-delete-btn', title: '清除播放清單' })
        fakeDeleteBtn.insertAfter(originDeleteBtn)
        fakeDeleteBtn.on('click', () => {
          if ($('#pttchatparent').find($('#PTTChat')).length === 0) {
            $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
            $('#PTTMain').collapse('hide')
            $('[name="pttchat-parent"]').remove()
          }
          originDeleteBtn.trigger('click')
          if (reportmode) console.log('clear playlist')
        })
        originDeleteBtn.css('display', 'none')
      } else {
        if (reportmode) console.warn('couldn\'t detect original delete btn.')
        $('.v-toolbar__content').find($('path[d="M7 3H5V9H7V3M19 3H17V13H19V3M3 13H5V21H7V13H9V11H3V13M15 7H13V3H11V7H9V9H15V7M11 21H13V11H11V21M15 15V17H17V21H19V17H21V15H15Z"]')).parents().eq(3).css('display', 'block')
        $('#fake-menu-delete-btn').css('display', 'none')
      }
    } else if (deleteBtnSvg.length === 2) {
      $('#fake-menu-delete-btn').css('display', 'block')
      deleteBtnSvg.eq(0).parents().eq(3).css('display', 'none')
    }
  }

  const t = setInterval(() => {
    if (/https:\/\/holodex\.net\/multiview/.exec(window.location.href)) {
      if (!wasWatch) {
        wasWatch = true
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

        // 0: new; 1: old;
        if (GM_getValue('PluginTypeHolodex', '0') === '0') {
          iconPTT.css('display', 'none')
        }

        let nowWidth = 0
        let collapseStart = false
        let collapseEnd = true
        iconPTT.on('click', () => {
          if (GM_getValue('PluginTypeHolodex', '0') === '1') {
            if ($('#PTTChat').length === 0) {
              InitApp(PTTChatHandler, WhiteTheme, true, messageposter, true)
              ChangeLog()
              $('<div id="ptt-frame-parent" style="position: absolute;"><iframe id="PTTframe" src="//term.ptt.cc/?url=https://holodex.net" style="display: none;width: 340px;height: 190px;">你的瀏覽器不支援 iframe</iframe></div>').appendTo($('#holotoolsvideohandler').children().eq(0))
            }
            if (collapseEnd || !collapseStart) {
              if (nowWidth === 0) {
                $('#PTTMain').collapse('show')
                nowWidth = pluginWidth
              } else {
                $('#PTTMain').collapse('hide')
                nowWidth = 0
              }
              $('#pttchatparent').css('flex', '0 0 ' + nowWidth + 'px')
            }
          }
        })
        iconSwitch.on('click', () => {
          if (confirm(`切換為${GM_getValue('PluginTypeHolodex', '0') === '0' ? '舊' : '新'}版PTT顯示模式？`)) {
            if (GM_getValue('PluginTypeHolodex', '0') === '0') {
              clearInterval(mainTimer)
              if (resizeObserver) resizeObserver.disconnect()
              iconPTT.css('display', 'block')
              $('#PTTChat-contents').css('height', `${GM_getValue('PluginHeight', 400)}`)
              $('#PTTChat-app').css('height', '')
              if ($('#PTTChat').length !== 0) {
                $('#PTTChat').css('display', 'block').appendTo($('#pttchatparent'))
                $('#PTTMain').collapse('hide')
                $('[name="pttchat-parent"]').remove()
              }
              $('[name="ptt-boot-btn"]').remove()
              GM_setValue('PluginTypeHolodex', '1')
              listenPttFrameBtn()
            } else {
              iconPTT.css('display', 'none')
              $('#pttchatparent').css('flex', '0 0 0px')
              if ($('#PTTChat').length !== 0) {
                $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
                $('#PTTMain').collapse('hide')
              }
              GM_setValue('PluginTypeHolodex', '0')
              pttBootBtnCount = 0
              mainTimer = setInterval(() => {
                appendPttEmbedBtn()
                checkAutoRemove()
                if (overrideSetting.length === 0) checkOverrideSetting()
              }, 1000)
            }
          }
        })
        $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', () => { collapseStart = true; collapseEnd = false })
        $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', () => { collapseStart = false; collapseEnd = true })
        parent.append(fakeparent)
        fakeparent.append(defaultVideoHandler)
        defaultVideoHandler.append(defaultVideo)
        PTTChatHandler.css('z-index', '5')
        fakeparent.append(PTTChatHandler)

        // substitute origin delete button
        checkOriginDeleteBtn()

        if (++execTime === 20) {
          console.error('Couldn\'t initialize PTTChat on Holodex.')
          clearInterval(t)
          execTime = 0
        }

        function appendPttEmbedBtn () {
          const btnParentSet = $('.mx-6.thin-scroll-bar.d-flex.flex-grow-1.flex-shrink-1.align-center.justify-center')
          if (btnParentSet.length > pttBootBtnCount) {
            btnParentSet.each(index => {
              const btnParent = btnParentSet.eq(index)
              if (btnParent.find($('[name="ptt-boot-btn"]')).length === 0) {
                if (!(btnParent.children().eq(0).hasClass('d-flex'))) {
                  btnParent.prepend($('<div class="d-flex"></div>').prepend(btnParent.children().eq(0), btnParent.children().eq(1)))
                  btnParent.css('flex-direction', 'column')
                }
                btnParent.children().eq(0).children().eq(1).clone().attr({ id: `ptt-boot-btn-${count}`, name: 'ptt-boot-btn', style: 'background-color: rgb(150, 0, 180) !important;margin-top: 10px;width: 165px;' }).appendTo(btnParent)
                btnParent.children().eq(1).find('path').attr('d', 'M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z')
                const currentBtn = $(`#ptt-boot-btn-${count}`)
                currentBtn.on('click', () => {
                  const gridIndex = currentBtn.parents().eq(3).index()
                  btnParent.children().eq(0).children().eq(1).trigger('click')
                  installPTT(gridIndex)
                })
                count++
              }
            })
          }
          pttBootBtnCount = btnParentSet.length
        }

        function checkAutoRemove () {
          if ($('.vue-grid-item').length === 3) {
            if ($('.vue-grid-item').eq(0).find($('#fake-grid-item-delete-btn')).length === 0) {
              const originBtn = $('.vue-grid-item').eq(0).find($('path[d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z"]')).parents().eq(3)
              if (originBtn.length !== 0) {
                const fakeDeleteBtn = originBtn.clone().attr('id', 'fake-grid-item-delete-btn')
                originBtn.parent().append(fakeDeleteBtn)
                originBtn.css('display', 'none')
                fakeDeleteBtn.off('click').on('click', () => {
                  if ($('#pttchatparent').find($('#PTTChat')).length === 0) {
                    $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
                    $('#PTTMain').collapse('hide')
                    $('[name="pttchat-parent"]').remove()
                  }
                  originBtn.trigger('click')
                })
              }
            }
          }
        }

        let overrideSetting = $()
        function checkOverrideSetting () {
          overrideSetting = $('[role="document"]').find($('span.v-btn__content')).eq(0).parent()
          const fakeOverrideSetting = overrideSetting.clone().insertAfter(overrideSetting)
          overrideSetting.css('display', 'none')
          fakeOverrideSetting.on('click', () => {
            if ($('#pttchatparent').find($('#PTTChat')).length === 0) {
              $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
              $('#PTTMain').collapse('hide')
              $('[name="pttchat-parent"]').remove()
            }
            overrideSetting.trigger('click')
          })
        }

        let mainTimer = GM_getValue('PluginTypeHolodex', '0') === '0'
          ? setInterval(() => {
            appendPttEmbedBtn()
            checkAutoRemove()
            if (overrideSetting.length === 0) checkOverrideSetting()
          }, 1000)
          : setInterval(() => { }, 60000)
      }
    } else {
      wasWatch = false
    }
  }, 1000)

  function installPTT (gridIndex) {
    const t = setInterval(() => {
      const gridParent = $('.vue-grid-layout').children().eq(gridIndex)
      if (gridParent.has($('.cell-content').length !== 0)) {
        gridParent.children().eq(0).children().eq(1).css('position', 'relative').prepend($('<div name="pttchat-parent" style="height: 100%;width: 100%;position: absolute;z-index: 6;"></div>'))
        if ($('#PTTChat').length === 0) {
          InitApp(gridParent.children().eq(0).children().eq(1).children().eq(0), WhiteTheme, true, messageposter, true)
          ChangeLog()
          $('<div id="ptt-frame-parent" style="position: absolute;"><iframe id="PTTframe" src="//term.ptt.cc/?url=https://holodex.net" style="display: none;width: 340px;height: 190px;">你的瀏覽器不支援 iframe</iframe></div>').appendTo($('#holotoolsvideohandler').children().eq(0))
        } else {
          const pttChatParent = $('#PTTChat').parent('[name="pttchat-parent"]')
          $('#PTTChat').appendTo(gridParent.children().eq(0).children().eq(1).children().eq(0)).css('display', 'block')
          pttChatParent.remove()
        }

        const chatBtn = gridParent.find($('span:contains("Chat")')).parent()
        $('#PTTChat-app').css('height', $('#PTTChat').parent().css('height'))
        $('#PTTChat-contents').css('height', '')
        if (chatBtn.css('background-color') === 'rgb(240, 98, 146)') {
          chatBtn.trigger('click')
        }
        listenEditBtn(gridParent)
        checkFilledVideo(gridParent)
        listenPttFrameBtn()
        $('#PTTMainBtn').on('click', () => {
          $('[name="pttchat-parent"]').css('z-index', $('[name="pttchat-parent"]').css('z-index') === 'auto' ? '6' : 'auto')
        })
        if (resizeObserver) resizeObserver.disconnect()
        resizeObserver = new ResizeObserver(entries => {
          $('#PTTChat-app').css('height', entries[0].contentRect.height)
        })
        resizeObserver.observe(document.getElementById('PTTChat').parentNode)
        $('#PTTMain').collapse('show')
        clearInterval(t)
      }
      if (++execTime > 20) {
        console.error('Couldn\'t install PTT.')
        clearInterval(t)
        execTime = 0
      }
    }, 200)
  }

  function listenPttFrameBtn () {
    const t = setInterval(() => {
      if ($('#nav-item-PTT').length !== 0) {
        $('#nav-item-PTT').off('click').on('click', () => {
          let el = $('#PTTMainBtn')[0]
          let x = 0; let y = 0
          while (el) {
            x += el.offsetLeft - el.scrollLeft + el.clientLeft
            y += el.offsetTop - el.scrollLeft + el.clientTop
            el = el.offsetParent
          }
          y -= 35
          const height = $('#PTTChat-app').height() - 30
          const width = $('#PTTChat-app').width()
          $('#ptt-frame-parent').css('margin', `${y}px 0px 0px ${x}px`).css('z-index', 6)
          $('#PTTframe').css('display', 'block').css({ height: `${height}px`, width: `${width}px` })
          const t = () => {
            setTimeout(() => {
              if ($('#PTTChat-contents-PTT').width() !== 0) setTimeout(t, 200)
              else {
                $('#ptt-frame-parent').css('z-index', -1)
                $('#PTTframe').css('display', 'none')
              }
            }, 200)
          }
          t()
        })
        clearInterval(t)
      }
    }, 200)
  }

  function listenEditBtn (gridParent) {
    const t = setInterval(() => {
      const editBtn = gridParent.find($('path[d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z"]')).parents().eq(3)
      if (editBtn) {
        editBtn.off('click').on('click', () => {
          if (gridParent.find($('#PTTChat')).length !== 0) {
            if ($('#nav-item-PTT').hasClass('active')) {
              $('#ptt-frame-parent').css('z-index', -1)
              $('#PTTframe').css('display', 'none')
              $('#nav-item-Connect').trigger('click')
            }
            const cellContent = gridParent.children().eq(0).children().eq(1)
            const px = cellContent.css('padding-left')
            const pt = cellContent.css('padding-top')
            const pb = cellContent.css('padding-bottom')
            cellContent.children().eq(0).css({ height: `calc(100% - ${pt} - ${pb})`, width: `calc(100% - ${px} - ${px})` })
            listenCtrlBtn(gridParent)
          }
        })
        clearInterval(t)
      }
    }, 200)
  }

  function listenCtrlBtn (gridParent) {
    const t = setInterval(() => {
      const btnParent = gridParent.find($('.cell-control')).children().eq(0)
      if (btnParent) {
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
            gridParent.children().eq(0).children().eq(1).children().eq(0).css({ height: '100%', width: '100%' })
            $('#PTTChat-app').css('height', $('#PTTChat').parent().css('height'))
            listenEditBtn(gridParent)
          }
        })
        fakeBackBtn.on('click', () => {
          if (gridParent.find($('#PTTChat')).length !== 0) {
            $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
            $('#PTTMain').collapse('hide')
            $('[name="pttchat-parent"]').remove()
          }
          originBackBtn.trigger('click')
        })
        fakeDeleteBtn.on('click', () => {
          if (gridParent.find($('#PTTChat')).length !== 0) {
            $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
            $('#PTTMain').collapse('hide')
            $('[name="pttchat-parent"]').remove()
          }
          originDeleteBtn.trigger('click')
        })
        clearInterval(t)
      }
    }, 200)
  }

  function checkFilledVideo (gridParent) {
    const t = setInterval(() => {
      if (gridParent.has($('.mv-frame.ma-auto')).length !== 0) {
        if (gridParent.find($('#PTTChat')).length !== 0) {
          $('#PTTChat').appendTo($('#fakeparent')).css('display', 'none')
          $('#PTTMain').collapse('hide')
          $('[name="pttchat-parent"]').remove()
        }
        clearInterval(t)
      }
    }, 1000)
  }
}
