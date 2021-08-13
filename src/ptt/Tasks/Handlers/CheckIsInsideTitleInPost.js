import { Ptt } from '../../PTTController/Ptt.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PttController/PttState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
import { ReportMode } from '../../../logsetting.js'

const backToBoard = () => Ptt.insertText('qP')

const getTitleWithoutSpace = (result) => {
  return result[1].replace(/\s+$/g, '')
}
const getTheFirstThreeLine = () => {
  let s = ''
  for (let i = 0; i < 5 && i < Ptt.screen.length; i++) s += Ptt.screen[i]
  return s
}
const isPostCurrect = (insideTitle) => {
  return insideTitle === PostData.insideTitle
}
const updatePostDate = (insideTitle, isPostHaveNormalInsideTitle) => {
  PostData.insideTitle = insideTitle
  PostData.haveNormalInsideTitle = isPostHaveNormalInsideTitle
  const result = Ptt.screenHaveText(/時間 {2}(\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/)
  const postTime = result ? new Date(result[1]) : new Date(Date.now())
  PostData.postTime = postTime
}

export const CheckIsPostCurrectInsideTitle = () => {
  const res = { pass: true, callback: backToBoard }
  if (Ptt.state.frame === FrameState.firstPageofPost) {
    const isPostHaveNormalInsideTitle = Ptt.match(/ 標題 +(.+)/)
    let insideTitle = ''
    if (isPostHaveNormalInsideTitle) {
      insideTitle = getTitleWithoutSpace(isPostHaveNormalInsideTitle)
    } else {
      insideTitle = getTheFirstThreeLine()
    }
    if (PostData.isSamePost) {
      if (!isPostCurrect()) res.pass = false
    } else {
      updatePostDate(insideTitle, isPostHaveNormalInsideTitle !== null)
    }
  } else if (Ptt.state.frame === FrameState.board || Ptt.state.frame === FrameState.main) {
    if (ReportMode) console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', Ptt.state.frame) // 禁止出現的例外狀況
  }
  return res
}
