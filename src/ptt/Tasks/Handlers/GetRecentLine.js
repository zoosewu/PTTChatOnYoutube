import { FrameState } from '../../PttController/PttState.js'
function gotoEndOfPost () {
  this.insertText('G')
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function GetRecentLine () {
  const res = { pass: false, callback: gotoEndOfPost }
  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    const lineResult = this.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~(\d+) 行/)
    if (lineResult) {
      let targetline = +lineResult[1] - this.postData.endline - 1
      if (targetline < 3) targetline = 3
      // console.log("==GetRecentLine, TotalLine, GotoLline", line[1], targetline);
      this.postData.endline = targetline
      /* if (Ptt.pagestate === 4 || Ptt.pagestate === 3) */
      this.insertText('qP') // insertText(PTTPost.endline + ".\n");
      res.pass = true
    }
  } else {
    console.log('==GetPushTask error, Ptt.pagestate ==', this.state.frame)
  }
  return res
}
