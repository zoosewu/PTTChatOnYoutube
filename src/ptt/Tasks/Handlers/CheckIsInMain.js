import { FrameState } from 'PttController/PttState.js'

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function gotoMain () {
  this.insertText('q')
}
/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function CheckIsInMain () {
  const result = { pass: false, callback: gotoMain }
  if (this.state.frame === FrameState.main) {
    result.pass = true
  }
  return result
}
