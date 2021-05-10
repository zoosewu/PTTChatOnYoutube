
import { InitApp } from '../../app/appindex.js'
import { ChangeLog } from '../../ChangeLog.js'
import { ThemeCheck } from '../../library.js'

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
    if (reportmode) console.log('parent', parent)
    if (parent.length > 0 && iswatch) {
      const pluginwidth = GM_getValue('PluginWidth', 400)
      const pluginwidth0 = '0'
      if (/https:\/\/hololive\.jetri\.co\/#\/watch/.exec(iswatch)) {
        const liveControls = $('.live-controls')
        liveControls.css('width', 'auto')
        const datahash = Object.keys(liveControls.data())[0]
        const iconParent = $(`<div data-${datahash} class="live-control live-control-quad bg-300" type="button"></div>`)
        const icon = $(`<i data-${datahash} class="md-icon md-icon-font md-theme-${theme}" title="PTT">local_parking</i>`)
        iconParent.append(icon)
        liveControls.prepend(iconParent)
        let now = pluginwidth0
        let collapseStart = false
        let collapseEnd = true
        iconParent.on('click', function () {
          if (collapseEnd || !collapseStart) {
            if (now === '0') $('#PTTMain').collapse('show')
            else $('#PTTMain').collapse('hide')
            now = (now === pluginwidth0 ? pluginwidth : pluginwidth0)
            $('#pttchatparent').css('flex', '0 0 ' + now + 'px')
            const defaultTypesettingBtn = $(`.md-icon.md-icon-font:eq(${$('.md-icon.md-icon-font').length - 6})`)
            defaultTypesettingBtn.trigger('click')
          }
        })
        $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', function () { collapseStart = true; collapseEnd = false })
        $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', function () { collapseStart = false; collapseEnd = true })
      }
      const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>')
      const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>')
      const defaultVideo = $('.player-container.hasControls')
      const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ' + pluginwidth + 'px;position:relative;"></div>')
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
