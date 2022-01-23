import { FrameState } from '../../PttController/PttState.js'

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function gotoBoard () {
  this.insertText('s' + this.postData.board + '\n')
}

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function CheckIsInBoard () {
  console.log('CheckIsInBoard this', this)
  const result = { pass: false, callback: gotoBoard }
  if (
    this.state.frame === FrameState.firstPageofPost ||
    this.state.frame === FrameState.otherPageofPost
  ) {
    result.pass = true
    return result
  } else if (this.state.frame === FrameState.main) {
    return result
  } else if (this.state.frame === FrameState.board) {
    const reg = '看板《' + this.postData.board + '》'
    const isCurrectBoard = this.match(reg)
    if (isCurrectBoard) result.pass = true
    return result
  }
  return result
}
