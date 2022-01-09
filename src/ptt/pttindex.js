import { Ptt } from './PttController/Ptt.js'
import eventBind from './eventBind.js'
/**
 * @param {import('../MessagePoster').MessagePoster} messagePoster
 */
export function InitPTT (messagePoster) {
  const ptt = new Ptt(messagePoster)
  function OnUpdate () {
    if (showAllLog) console.log('===OnUpdate start===')
    if (showAllLog) console.log('Ptt.clearScreen()')
    ptt.clearScreen()
    if (showAllLog) console.log('Ptt.frame.update()')
    ptt.frame.update()
    if (showAllLog) console.log('runAutoCommand()')
    const skipThisFrame = ptt.autoCommand.runAutoCommand()
    if (!skipThisFrame) {
      if (showAllLog) console.log('runCommand()')
      ptt.runCommand()
    }
    if (showPttScreen) console.log('==Ptt screen shot:', ptt.state.screen)
    if (showAllLog) console.log('===OnUpdate end===')
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
  eventBind(ptt)
}
