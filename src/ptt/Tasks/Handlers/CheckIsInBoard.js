import PostData from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PttController/PttState.js'

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function gotoBoard () {
  this.insertText('s' + PostData.board + '\n')
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
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
    const reg = '看板《' + PostData.board + '》'
    const isCurrectBoard = this.match(reg)
    if (isCurrectBoard) result.pass = true
    return result
  }
  return result
}
