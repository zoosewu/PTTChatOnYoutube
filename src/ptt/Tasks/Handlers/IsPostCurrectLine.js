import { PTT } from '../../PTTController/PTT.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
import { reportmode } from '../../../logsetting.js'

const gotoline = () => PTT.insertText((PostData.endLine + 1) + '.\n')
export const IsPostCurrectLine = () => {
  const res = { pass: true, callback: gotoline }
  if (PTT.state.frame === FrameState.firstPageofPost || PTT.state.frame === FrameState.otherPageofPost) {
    const lineResult = PTT.match(/目前顯示: 第 (\d+)~(\d+) 行/)
    const startLine = lineResult[1]
    let targetLine = PostData.endline - startLine + 1
    if (startLine < 5 && PostData.haveNormalInsideTitle) targetLine += 1
    if ((targetLine < 1 || targetLine > 23) /* && PTT.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) === null */) res.pass = false
  } else if (PTT.state.frame === FrameState.board || PTT.state.frame === FrameState.main) {
    if (reportmode) console.log('==IsPostCurrectInsideTitle error, PTT.pagestate:', PTT.state.frame) // 禁止出現的例外狀況
  }
  return res
}
