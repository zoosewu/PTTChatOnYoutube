import { FrameState } from '../../PttController/PttState.js'
function gotonextpage () {
  this.insertText(' ')
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function CheckIsEndInPost () {
  const res = { pass: false, callback: gotonextpage }
  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    console.log('CheckIsEndInPost', this.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/))
    if (this.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) !== null) {
      res.pass = true
    }
  } else {
    console.log('==PostPercentCheck error, PTT.pagestate == ', this.state.frame)
  }
  return res
}
