import { FrameState } from 'PttController/PttState.js'

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function gotoPost () {
  this.insertText('NPP' + this.postData.key + '\nSqr')
}

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function CheckIsCurrectPost () {
  const res = { pass: true, callback: gotoPost }
  if (this.state.frame === FrameState.board) {
    res.pass = false
  } else if (this.state.frame === FrameState.main) {
    if (reportMode) {
      console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', this.state.frame) // 禁止出現的例外狀況
    }
  }
  return res
}
