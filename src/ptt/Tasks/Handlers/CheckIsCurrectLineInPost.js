import { Ptt } from '../../PTTController/Ptt.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
import { ReportMode } from '../../../logsetting.js'

const gotoline = () => Ptt.insertText((PostData.endLine + 1) + '.\n')
export const ChekcIsPostCurrectLine = () => {
  const res = { pass: true, callback: gotoline }
  if (Ptt.state.frame === FrameState.firstPageofPost || Ptt.state.frame === FrameState.otherPageofPost) {
    const lineResult = Ptt.match(/目前顯示: 第 (\d+)~(\d+) 行/)
    const startLine = lineResult[1]
    let targetLine = PostData.endline - startLine + 1
    if (startLine < 5 && PostData.haveNormalInsideTitle) targetLine += 1
    if ((targetLine < 1 || targetLine > 23) /* && Ptt.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) === null */) res.pass = false
  } else if (Ptt.state.frame === FrameState.board || Ptt.state.frame === FrameState.main) {
    if (ReportMode) console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', Ptt.state.frame) // 禁止出現的例外狀況
  }
  return res
}
