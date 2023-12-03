import { FrameState } from 'PttController/PttState.js'
/**
 * @this {Ptt}
 */
function NotLogin () {
  this.msg.PostMessage('alert', { type: 0, msg: 'PTT尚未登入，請先登入。' })
  this.endTask()
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function CheckIsLogined () {
  const res = { pass: true, callback: NotLogin }
  if (this.state.frame === FrameState.login) {
    res.pass = false
  }
  return res
}
