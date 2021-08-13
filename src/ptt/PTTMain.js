import { Ptt } from './PttController/Ptt.js'
import { showalllog, showPTTscreen } from '../logsetting.js'
function OnUpdate () {
  if (showalllog) console.log('===OnUpdate start===')
  if (showalllog) console.log('Ptt.clearScreen()')
  Ptt.clearScreen()
  if (showalllog) console.log('Ptt.frame.update()')
  Ptt.frame.update()
  if (showalllog) console.log('==check autocommand.')
  const skipThisFrame = Ptt.autoCommand.runAutoCommand()
  if (!skipThisFrame) {
    if (showalllog) console.log('==check command.')
    Ptt.runCommand()
  }
  if (showPTTscreen) console.log('==Ptt screen shot:', Ptt.screen)
  if (showalllog) console.log('===OnUpdate end===')
}
// hook start
function hook (obj, key, cb) {
  const fn = obj[key].bind(obj)
  obj[key] = function (...args) {
    fn.apply(this, args)
    cb.apply(this, args)
  }
}
hook(unsafeWindow.console, 'log', t => {
  if (typeof t === 'string' && t === 'view update') {
    Ptt.state.lastUpdateTime = Date.now()
    Ptt.state.serverfull = false
    OnUpdate()
  }
})
// hook end
