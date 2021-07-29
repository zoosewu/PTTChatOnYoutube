import { PTT } from '../../PTTController/PTT.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
const gotoBoard = () => {
  PTT.insertText('s' + PostData.board + '\n')
}
export const IsBoard = () => {
  const result = { pass: false, callback: gotoBoard }
  if (PTT.state.frame === FrameState.firstPageofPost || PTT.state.frame === FrameState.otherPageofPost) {
    result.pass = true
    return result
  } else if (PTT.state.frame === FrameState.main) {
    return result
  } else if (PTT.state.frame === FrameState.board) {
    const reg = '看板《' + PostData.board + '》'
    const isCurrectBoard = PTT.screenHaveText(reg)
    if (isCurrectBoard) result.pass = true
    return result
  }
  return result
}
