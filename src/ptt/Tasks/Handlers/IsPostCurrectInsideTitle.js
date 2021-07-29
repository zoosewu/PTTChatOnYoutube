import { PTT } from '../../PTTController/PTT.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
import { reportmode } from '../../../logsetting.js'

const backToBoard = () => PTT.insertText('qP')

const getTitleWithoutSpace = (result) => {
  return result[1].replace(/\s+$/g, '')
}
const getTheFirstThreeLine = () => {
  let s = ''
  for (let i = 0; i < 5 && i < PTT.screen.length; i++) s += PTT.screen[i]
  return s
}
const isPostCurrect = (insideTitle) => {
  return insideTitle === PostData.insideTitle
}
const updatePostDate = (insideTitle, isPostHaveNormalInsideTitle) => {
  PostData.insideTitle = insideTitle
  PostData.haveNormalInsideTitle = isPostHaveNormalInsideTitle
  const result = PTT.screenHaveText(/時間 {2}(\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/)
  const postTime = result ? new Date(result[1]) : new Date(Date.now())
  PostData.postTime = postTime
}

export const IsPostCurrectInsideTitle = () => {
  const res = { pass: true, callback: backToBoard }
  if (PTT.state.frame === FrameState.firstPageofPost) {
    const isPostHaveNormalInsideTitle = PTT.match(/ 標題 +(.+)/)
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
  } else if (PTT.state.frame === FrameState.board || PTT.state.frame === FrameState.main) {
    if (reportmode) console.log('==IsPostCurrectInsideTitle error, PTT.pagestate:', PTT.state.frame) // 禁止出現的例外狀況
  }
  return res
}
