import { PTT } from './PTTController/PTT.js'
import { showalllog, showPTTscreen } from '../logsetting.js'
function OnUpdate () {
  if (showalllog) console.log('===OnUpdate start===')
  if (showalllog) console.log('PTT.clearScreen()')
  PTT.clearScreen()
  if (showalllog) console.log('PTT.frame.update()')
  PTT.frame.update()
  if (showalllog) console.log('==check autocommand.')
  const skipThisFrame = PTT.autoCommand.runAutoCommand()
  if (!skipThisFrame) {
    if (showalllog) console.log('==check command.')
    PTT.runCommand()
  }
  if (showPTTscreen) console.log('==PTT screen shot:', PTT.screen)
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
    PTT.state.lastUpdateTime = Date.now()
    PTT.state.serverfull = false
    OnUpdate()
  }
})
// hook end
