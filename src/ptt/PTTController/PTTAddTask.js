import { Ptt } from './Ptt.js'
import { FrameState } from './PttState.js'
import { MessagePoster } from '../../MessagePoster.js'
import { ReportMode } from '../../logsetting.js'

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
const checkPttAlive = () => {
  if (Ptt.command === null) return
  const now = Date.now()
  if (now > Ptt.state.lastUpdateTime + 10000) {
    MessagePoster.PostMessage('alert', { type: 0, msg: 'Ptt無回應，請稍後再試，或重新整理頁面。' })
    Ptt.unlock()
  } else {
    MessagePoster.PostMessage('alert', { type: 1, msg: '指令執行中......' })
    setTimeout(checkPttAlive, 3500)
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
export function PttAddTask (fn, ...args) {
  Reconnect.apply(this)
  if (!checkLock.apply(this) && !checkServerFull.apply(this)) {
    this.lock()
    fn(...args)
    if (ReportMode) console.log('AddTask', ...args)
    setTimeout(checkPttAlive, 3500)
  }
}
