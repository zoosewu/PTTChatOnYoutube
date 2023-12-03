import InitApp from 'src/app/appindex'
import ChangeLog from 'src/ChangeLog'

export default function Initblank (messageposter, siteName) {
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
  InitApp([container], WhiteTheme, true, messageposter, siteName, true)
  ChangeLog()
}
