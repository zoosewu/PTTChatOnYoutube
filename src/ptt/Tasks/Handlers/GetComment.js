const getComment = (content, commentResult) => {
  const commentData = {}
  commentData.type = commentResult[1]
  commentData.id = commentResult[2]
  commentData.content = content
  commentData.date = new Date(
    this.postData.postTime.getFullYear(),
    commentResult[4] - 1,
    commentResult[5],
    commentResult[6],
    commentResult[7]
  )
  return commentData
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function GetComment () {
  const lineResult = this.match(/目前顯示: 第 (\d+)~(\d+) 行/)
  const startLine = +lineResult[1]
  const endLine = +lineResult[2]
  let targetLine = this.postData.endline - startLine + 1
  if (startLine < 5 && this.postData.haveNormalInsideTitle) targetLine += 1
  const checkedLine = []
  // console.log("==GetPush from " + targetline + "to " + (Ptt.screen.length - 1));
  // console.log("==(pttstartline, pttendline, startline, endline, targetline): (" + PTTPost.startline + ", " + PTTPost.endline + ", " + startline + ", " + endline + ", " + targetline + ")");
  for (let i = targetLine; i < this.state.screen.length; i++) {
    const line = this.state.screen[i]
    const commentResult = /^(→ |推 |噓 )(.+?): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(
      line
    )
    if (commentResult != null) {
      let content = commentResult[3]
      const reg = /\s+$/g
      content = content.replace(reg, '')
      const comment = getComment(content, commentResult)
      this.recieveData.comments.push(comment)
      if (reportMode) checkedLine.push(i)
      if (reportMode) console.log('GetPush at line', i, content, line)
    } else if (reportMode) console.log('GetPush at line fail', i, line)
  }
  if (reportMode) {
    console.log('GetPush startline,', startLine, ', endline', this.postData.endLine, ', targetline', targetLine,
      ', checkedline', checkedLine, ', haveNormalTitle', this.postData.haveNormalInsideTitle)
  }
  // const percentresult = Ptt.match(/瀏覽 第 .+ 頁 \( *(\d+)%\)/)
  this.postData.startLine = startLine
  this.postData.endLine = endLine
  this.recieveData.endLine = endLine
  return { pass: true, callback: () => { } }
}
