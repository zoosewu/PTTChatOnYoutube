import { FrameState } from 'PttController/PttState.js'

/**
 * @typedef {object} HandlerResult
 * @property {boolean} pass is passed
 * @property {Function} callback call when false
 */

function gotoline () {
  if (showAllLog)console.log('gotoline', this, this.postData, this.postData.endLine)
  this.insertText(this.postData.endLine + '.\n')
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {HandlerResult} result
 */
export default function CheckIsCurrectLineInPost () {
  const res = { pass: true, callback: gotoline }
  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    const lineResult = this.match(/目前顯示: 第 (\d+)~(\d+) 行/)
    const startLine = lineResult[1]
    let targetLine = this.postData.endLine - startLine + 1
    if (startLine < 5 && this.postData.haveNormalInsideTitle) {
      targetLine += 1
    }
    if (showAllLog)console.log('CheckIsCurrectLineInPost targetLine', targetLine)
    if (targetLine < 1 || targetLine > 23) {
      res.pass = false
    }
  } else {
    if (reportMode) {
      console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', this.state.frame) // 禁止出現的例外狀況
    }
  }
  return res
}
