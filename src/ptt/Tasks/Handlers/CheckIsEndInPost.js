import { Ptt } from '../../PttController/Ptt.js'

/**
 *
 */
function gotonextpage () {
  this.insertText(' ')
}

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
  const res = { pass: false, callback: gotonextpage }
  if (
    (this.pagestate === 3 || this.pagestate === 4) &&
    this.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) !== null
  ) {
    res.pass = true
  } else if (this.pagestate === 1) {
    console.log('==PostPercentCheck error, PTT.pagestate == 1.')
  } else if (this.pagestate === 2) {
    console.log('==PostPercentCheck error, PTT.pagestate == 2.')
  }
  return res
}
