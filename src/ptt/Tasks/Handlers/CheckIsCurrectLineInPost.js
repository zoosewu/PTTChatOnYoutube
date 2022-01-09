import PostData from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PttController/PttState.js'

/**
 * @typedef {object} HandlerResult
 * @property {boolean} pass is passed
 * @property {Function} callback call when false
 */

const gotoline = () => this.insertText(PostData.endLine + 1 + '.\n')

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {HandlerResult} result
 */
export default function () {
  const res = { pass: true, callback: gotoline }
  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    const lineResult = this.match(/目前顯示: 第 (\d+)~(\d+) 行/)
    const startLine = lineResult[1]
    let targetLine = PostData.endline - startLine + 1
    if (startLine < 5 && PostData.haveNormalInsideTitle) {
      targetLine += 1
    }
    if (targetLine < 1 || targetLine > 23 /* && Ptt.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) === null */) {
      res.pass = false
    }
  } else {
    if (reportMode) {
      console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', this.state.frame) // 禁止出現的例外狀況
    }
  }
  return res
}
