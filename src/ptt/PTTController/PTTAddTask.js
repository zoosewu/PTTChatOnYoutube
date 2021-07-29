import { PTT } from './PTT.js'
import { FrameState } from './PTTState.js'
import { MessagePoster } from '../../MessagePoster.js'
import { reportmode } from '../../logsetting.js'

const Reconnect = () => {
  const disbtn = $('.btn.btn-danger[type=button]')
  if (disbtn && disbtn.length > 0) {
    disbtn[0].click()
    this.login = false
    this.state.serverfull = false
    this.state.screenUpdated = false
    this.state.frame = FrameState.login
    this.state.reconnectTime--
  }
}
const checkPTTAlive = () => {
  if (PTT.command === null) return
  const now = Date.now()
  if (now > PTT.state.lastUpdateTime + 10000) {
    MessagePoster.PostMessage('alert', { type: 0, msg: 'PTT無回應，請稍後再試，或重新整理頁面。' })
    PTT.unlock()
  } else {
    MessagePoster.PostMessage('alert', { type: 1, msg: '指令執行中......' })
    setTimeout(checkPTTAlive, 3500)
  }
}
const checkLock = () => {
  if (this.state.lock) {
    MessagePoster.PostMessage('alert', { type: 0, msg: '指令執行中，請稍後再試。' })
  }
  return this.state.lock
}
const checkServerFull = () => {
  if (this.state.serverfull) {
    MessagePoster.PostMessage('alert', { type: 0, msg: '系統過載, 請稍後再來...' })
  }
  return this.state.serverfull
}
export function PTTAddTask (fn, ...args) {
  Reconnect.apply(this)
  if (!checkLock.apply(this) && !checkServerFull.apply(this)) {
    this.lock()
    fn(...args)
    if (reportmode) console.log('AddTask', ...args)
    setTimeout(checkPTTAlive, 3500)
  }
}
