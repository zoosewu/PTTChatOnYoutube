import { Ptt } from './Ptt.js'
import { FrameState } from './PttState.js'
import { ReportMode } from '../../logsetting.js'

/** @this {Ptt} */
const Reconnect = function () {
  const disbtn = $('.btn.btn-danger[type=button]')
  if (disbtn && disbtn.length > 0) {
    disbtn[0].click()
    this.state.login = false
    this.state.serverfull = false
    this.state.screenUpdated = false
    this.state.frame = FrameState.login
    this.state.reconnectTime--
  }
}

/** @this {Ptt} */
const checkPttAlive = function () {
  if (!this.command) return

  const now = Date.now()
  if (now > this.state.lastUpdateTime + 10000) {
    this.msg.PostMessage('alert', { type: 0, msg: 'Ptt無回應，請稍後再試，或重新整理頁面。' })
    this.unlock()
  } else {
    this.msg.PostMessage('alert', { type: 1, msg: '指令執行中......' })
    setTimeout(checkPttAlive, 3500)
  }
}

/** @this {Ptt} */
const checkLock = function () {
  if (this.state.lock) {
    this.msg.PostMessage('alert', { type: 0, msg: '指令執行中，請稍後再試。' })
  }
  return this.state.lock
}

/** @this {Ptt} */
const checkServerFull = function () {
  if (this.state.serverfull) {
    this.msg.PostMessage('alert', { type: 0, msg: '系統過載, 請稍後再來...' })
  }
  return this.state.serverfull
}

/** @this {Ptt} */
export function PttAddTask (fn, ...args) {
  Reconnect.apply(this)
  if (!checkLock.apply(this) && !checkServerFull.apply(this)) {
    this.lock()
    this.state.lastUpdateTime = Date.now()
    if (ReportMode) console.log('AddTask', fn.name, args)
    fn(...args)
    setTimeout(() => {
      checkPttAlive.apply(this)
    }, 3500)
  }
}
