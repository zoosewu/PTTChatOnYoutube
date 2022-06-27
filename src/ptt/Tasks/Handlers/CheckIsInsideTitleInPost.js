import { FrameState } from 'PttController/PttState.js'

function backToBoard () {
  this.insertText('qq')
}

function getTitleWithoutSpace (result) {
  return result[1].replace(/\s+$/g, '')
}
function getTheFirstThreeLine () {
  let s = ''
  for (let i = 0; i < 5 && i < this.state.screen.length; i++) s += this.state.screen[i]
  return s
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function CheckIsInsideTitleInPost () {
  const res = { pass: true, callback: backToBoard }
  if (this.state.frame === FrameState.firstPageofPost) {
    const isPostHaveNormalInsideTitle = this.match(/ 標題 +(.+)/)
    let insideTitle = ''
    if (isPostHaveNormalInsideTitle) {
      insideTitle = getTitleWithoutSpace(isPostHaveNormalInsideTitle)
    } else {
      insideTitle = getTheFirstThreeLine.apply(this)
    }
    if (this.postData.isSamePost) {
      if (!insideTitle === this.postData.insideTitle) {
        res.pass = false
      }
    } else {
      this.postData.insideTitle = insideTitle
      this.postData.haveNormalInsideTitle = isPostHaveNormalInsideTitle !== null
      const result = this.match(/時間 {2}(\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/)
      if (showAllLog)console.log('this.postData.postTime', result)
      this.postData.postTime = result ? new Date(result[1]) : new Date(Date.now())
    }
    this.recieveData.title = this.postData.insideTitle
    this.recieveData.date = this.postData.postTime
  } else if (this.state.frame === FrameState.otherPageofPost && this.postData.insideTitle !== '') {
    res.pass = true
  } else {
    if (reportMode) {
      console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', this.state.frame) // 禁止出現的例外狀況
    }
    res.pass = false
  }
  if (showAllLog)console.log('this.state.frame', this.state.frame, 'this.postData.insideTitle', this.postData.insideTitle)
  return res
}
