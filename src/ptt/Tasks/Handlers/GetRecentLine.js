import PostData from '../../MessagePosterData/PostData.js'
function gotoEndOfPost () {
  Ptt.insertText('G')
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
  const res = { pass: false, callback: gotoEndOfPost }
  if (Ptt.pagestate === 4 || Ptt.pagestate === 3) {
    const lineResult = Ptt.screenHaveText(
      /瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~(\d+) 行/
    )
    if (lineResult) {
      let targetline = +lineResult[1] - PostData.endline - 1
      if (targetline < 3) targetline = 3
      // console.log("==GetRecentLine, TotalLine, GotoLline", line[1], targetline);
      PostData.endline = targetline
      /* if (Ptt.pagestate === 4 || Ptt.pagestate === 3) */
      Ptt.insertText('qP') // insertText(PTTPost.endline + ".\n");
      res.pass = true
    }
  } else if (Ptt.pagestate === 1) {
    console.log('==GetPushTask error, Ptt.pagestate == 1.')
  } else if (Ptt.pagestate === 2) {
    console.log('==GetPushTask error, Ptt.pagestate == 2.')
  }
  return res
}
