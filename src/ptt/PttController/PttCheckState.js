import { FrameState } from './PttState.js'

/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function Reconnect () {
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
/**
 * @this {Ptt}
 */
export function checkPttAlive () {
  const now = Date.now()
  if (now > this.state.lastUpdateTime + 10000) {
    this.msg.PostMessage('alert', { type: 0, msg: 'Ptt無回應，請稍後再試，或重新啟動PTT。' })
    this.removeAllTasks()
    this.command.remove()
  } else {
    this.msg.PostMessage('alert', { type: 1, msg: '指令執行中......' })
  }
}

/**
 * @this {Ptt}
 */
function checkServerFull () {
  if (this.state.serverfull) { this.msg.PostMessage('alert', { type: 0, msg: '系統過載, 請稍後再來...' }) }
  return this.state.serverfull
}

/**
 * @this {Ptt}
 */
export function PttCheckState (fn, ...args) {
  Reconnect.apply(this)
  if (!checkServerFull.apply(this)) {
    return true
  }
  return false
}
