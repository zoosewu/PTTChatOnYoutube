
import { InitApp } from '../../app/appindex'
import { ChangeLog } from '../../ChangeLog'
import { ThemeCheck } from '../../library'
import { reportmode } from '../../logsetting'

export function InitHT (messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  // run app instance loop
  let waswatch
  let iswatch
  let tryinsholotools = 20;

  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    const watchcheck = /https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(window.location.href) || /https:\/\/hololive\.jetri\.co\/#\/watch/.exec(window.location.href)
    if (watchcheck) iswatch = watchcheck[0]
    else iswatch = false
    if (waswatch !== iswatch && iswatch) {
      tryinsholotools = 20
    }
    if (tryinsholotools >= 0) {
      TryInsChat()
    }
    waswatch = iswatch
  })()
  function TryInsChat () {
    const parent = $('.container-watch')
    const theme = $('html:eq(0)').hasClass('md-theme-hololight') ? 'hololight' : 'holodark'
    const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
    const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>')
    const defaultVideo = $('.player-container.hasControls')
    const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>')
    if (reportmode) console.log('parent', parent)
    if (parent.length > 0 && iswatch) {
      const pluginwidth = GM_getValue('PluginWidth', 400)
      const pluginheight = GM_getValue('PluginHeight', 400)
      const pluginportraitheight = GM_getValue('PluginPortraitHeight', 400)
      const pluginwidth0 = '0'
      const liveControls = $('.live-controls')
      liveControls.css('width', 'auto')
      const datahash = Object.keys(liveControls.data())[0]
      const iconParent = $(`<div data-${datahash} class="live-control live-control-double bg-300" type="button"></div>`)
      const iconFlex = $(`<div data-${datahash} class="live-control-button"><i data-${datahash} class="md-icon md-icon-font md-theme-${theme}" title="切換PTT顯示佈局">library_books</i></div>`)
      const iconPTT = $(`<div data-${datahash} class="live-control-button"><i data-${datahash} class="md-icon md-icon-font md-theme-${theme}" title="PTT">local_parking</i></div>`)
      iconParent.append(iconFlex, iconPTT)
      liveControls.prepend(iconParent)
      if (/https:\/\/hololive\.jetri\.co\/#\/watch/.exec(iswatch)) {
        $('.md-layout.live-videos').css({ 'margin-right': '-40px', 'padding-right': '40px' })
      } else if ((/https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(iswatch))) {
        $('.md-layout.live-videos').css({ 'max-width': 'calc(100% - 385px)' })
      }
      let now = pluginwidth0
      let collapseStart = false
      let collapseEnd = true
      let isChatOnen = false
      let enablePortaitMode = false
      const containerHeight = defaultVideo.height()

      iconPTT.on('click', function () {
        if (collapseEnd || !collapseStart) {
          if (now === '0') {
            $('#PTTMainBtn').css('display', 'block')
            $('#PTTMain').collapse('show')
          } else {
            $('#PTTMainBtn').css('display', 'none')
            $('#PTTMain').collapse('hide')
          }
          now = (now === pluginwidth0 ? pluginwidth : pluginwidth0)
          $('#pttchatparent').css('flex', '0 0 ' + now + 'px')
          if (enablePortaitMode && isChatOnen) defaultVideo.height(containerHeight)
          else if (enablePortaitMode) {
            defaultVideo.height(containerHeight - pluginportraitheight)
          }
          defaultSetting()
          isChatOnen = !isChatOnen
        }
      })
      iconFlex.on('click', function () {
        if (isChatOnen) {
          if ($('#fakeparent').hasClass('flex-row')) {
            parent.css('overflow', 'visible')
            $('#fakeparent').removeClass('flex-row').addClass('flex-column')
            defaultVideo.height(containerHeight - pluginportraitheight)
            $('#PTTChat-contents').height(pluginportraitheight - 35)
          } else {
            parent.css('overflow', 'hidden')
            $('#fakeparent').removeClass('flex-column').addClass('flex-row')
            defaultVideo.height(containerHeight)
            $('#PTTChat-contents').height(pluginheight)
          }
          enablePortaitMode = !enablePortaitMode
          defaultSetting()
        }
      })
      $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', function () { collapseStart = true; collapseEnd = false })
      $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', function () { collapseStart = false; collapseEnd = true })
      parent.append(fakeparent)
      fakeparent.append(defaultVideoHandler)
      defaultVideoHandler.append(defaultVideo)
      fakeparent.append(PTTChatHandler)
      $('.reopen-toolbar').css({ 'z-index': '302' })
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, true)
      ChangeLog()
      tryinsholotools = -10
    } else {
      tryinsholotools--
    }
  }
  function defaultSetting () {
    if (/https:\/\/hololive\.jetri\.co\/#\/watch/.exec(iswatch)) {
      const defaultHTDisplaySettingBtn = $(`.md-icon.md-icon-font:eq(${$('.md-icon.md-icon-font').length - 6})`)
      defaultHTDisplaySettingBtn.trigger('click')
    } else if ((/https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(iswatch))) {
      const defaultHTDisplaySettingList = $(`.md-icon.md-icon-font:eq(${$('.md-icon.md-icon-font').length - 6})`)
      defaultHTDisplaySettingList.trigger('click')
      setTimeout(() => {
        const defaultHTDisplaySettingBtn = $('.preset-preview').eq(0)
        defaultHTDisplaySettingBtn.trigger('click')
      }, 100)
    }
  }
}
