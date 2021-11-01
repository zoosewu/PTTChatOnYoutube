import { Ptt } from '../../PttController/Ptt.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PttController/PttState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'

/**
 * @this {Ptt}
 */
function gotoBoard () {
  this.insertText('s' + PostData.board + '\n')
}

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
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
