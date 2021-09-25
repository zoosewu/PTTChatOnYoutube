import { ShowAllLog, ShowPttScreen } from '../logsetting.js'
import { Ptt } from './PttController/Ptt.js'
import { Login } from './Tasks/Login.js'

/**
 * @param messagePoster
 */
export function InitPTT (messagePoster) {
  const ptt = new Ptt(messagePoster)
  /**
   *
   */
  function OnUpdate () {
    if (ShowAllLog) console.log('===OnUpdate start===')
    if (ShowAllLog) console.log('Ptt.clearScreen()')
    ptt.clearScreen()
    if (ShowAllLog) console.log('Ptt.frame.update()')
    ptt.frame.update()
    if (ShowAllLog) console.log('==check autocommand.')
    const skipThisFrame = ptt.autoCommand.runAutoCommand()
    if (!skipThisFrame) {
      if (ShowAllLog) console.log('==check command.')
      ptt.runCommand()
    }
    if (ShowPttScreen) console.log('==Ptt screen shot:', ptt.state.screen)
    if (ShowAllLog) console.log('===OnUpdate end===')
  }
  /**
   * @param obj
   * @param key
   * @param cb
   */
  function hook (obj, key, cb) {
    const fn = obj[key].bind(obj)
    obj[key] = function (...args) {
      fn.apply(this, args)
      cb.apply(this, args)
    }
  }
  hook(unsafeWindow.console, 'log', t => {
    if (t === 'view update') {
      ptt.state.lastUpdateTime = Date.now()
      ptt.state.serverfull = false
      OnUpdate()
    }
  })
  ptt.msg.login = Login
}
