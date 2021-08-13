import { Ptt } from '../../PttController/Ptt.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
const gotoBoard = () => {
  Ptt.insertText('s' + PostData.board + '\n')
}
export const CheckIsBoard = () => {
  const result = { pass: false, callback: gotoBoard }
  if (Ptt.state.frame === FrameState.firstPageofPost || Ptt.state.frame === FrameState.otherPageofPost) {
    result.pass = true
    return result
  } else if (Ptt.state.frame === FrameState.main) {
    return result
  } else if (Ptt.state.frame === FrameState.board) {
    const reg = '看板《' + PostData.board + '》'
    const isCurrectBoard = Ptt.match(reg)
    if (isCurrectBoard) result.pass = true
    return result
  }
  return result
}
