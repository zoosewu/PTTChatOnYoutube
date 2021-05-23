
import { InitApp } from '../../app/appindex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'

export function InitHD (messageposter) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250')

  // run app instance loop
  let waswatch
  let iswatch
  let tryinsholotools = 20;

  (function ChechChatInstanced () {
    setTimeout(ChechChatInstanced, 1000)
    const watchcheck = /https:\/\/holodex\.net\/multiview/.exec(window.location.href)
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
    // const parent = $(`.v-main__wrap`);
    const parent = $('.vue-grid-layout').parent()
    if (reportmode) console.log('parent', parent)
    if (parent.length > 0 && iswatch) {
      const pluginwidth = GM_getValue('PluginWidth', 400)
      const pluginheight = GM_getValue('PluginHeight', 400)
      const pluginportraitheight = GM_getValue('PluginPortraitHeight', 250)
      const pluginwidth0 = '0'
      const liveControls = $('.flex-grow-1.justify-end.d-flex.mv-toolbar-btn.align-center.no-btn-text')
      const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
      const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>')
      const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>')
      // const defaultVideo = $(`.vue-grid-layout`).parent();
      const defaultVideo = $('.vue-grid-layout')
      const iconPTT = $('<button type="button" title="PTT" style="height: 36px; width: 36px; margin: 0px 4px 0px 4px; font-size: 21px;">P</button>')
      const iconFlex = $('<button type="button" title="切換PTT顯示佈局" style="height: 36px; width: 36px; margin-right: 4px; margin-left: 4px;padding-top: 6px;padding-bottom: 0px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"></path></svg></button>')
      liveControls.prepend(iconPTT, iconFlex)
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
          else if (enablePortaitMode) defaultVideo.height(containerHeight - pluginportraitheight)
          isChatOnen = !isChatOnen
        }
      })
      iconFlex.on('click', function () {
        if (isChatOnen) {
          if ($('#fakeparent').hasClass('flex-row')) {
            $('#fakeparent').removeClass('flex-row').addClass('flex-column')
            defaultVideo.height(containerHeight - pluginportraitheight)
            $('#PTTChat-contents').height(pluginportraitheight - 35)
          } else {
            $('#fakeparent').removeClass('flex-column').addClass('flex-row')
            defaultVideo.height(containerHeight)
            $('#PTTChat-contents').height(pluginheight)
          }
          enablePortaitMode = !enablePortaitMode
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
}
