import { InitApp } from '../../app/appindex.js'

export function Initblank (messageposter) {
  const WhiteTheme = true
  // Check Theme

  const pluginwidth = GM_getValue('PluginWidth', 400)
  const Body = document.getElementsByTagName('BODY')[0]
  const container = document.createElement('div')
  container.id = 'container'
  container.classList.add('position-relative')
  container.setAttribute('style', 'width:' + pluginwidth + 'px;height:800px;')
  Body.prepend(container)
  // const blankcontainer = document.getElementById(`container`);
  InitApp([container], WhiteTheme, true, messageposter, true)
}
