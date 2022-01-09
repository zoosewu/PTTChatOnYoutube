import { Ptt } from './PttController/Ptt.js'
function OnUpdate () {
  if (showAllLog) console.log('===OnUpdate start===')
  if (showAllLog) console.log('Ptt.clearScreen()')
  Ptt.clearScreen()
  if (showAllLog) console.log('Ptt.frame.update()')
  Ptt.frame.update()
  if (showAllLog) console.log('==check autocommand.')
  const skipThisFrame = Ptt.autoCommand.runAutoCommand()
  if (!skipThisFrame) {
    if (showAllLog) console.log('==check command.')
    Ptt.runCommand()
  }
  if (showPttScreen) console.log('==Ptt screen shot:', Ptt.screen)
  if (showAllLog) console.log('===OnUpdate end===')
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
