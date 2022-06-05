function getComment (content, commentResult) {
  const commentData = {}
  commentData.type = commentResult[1]
  commentData.id = commentResult[2]
  commentData.content = content
  commentData.date = new Date(this.postData.postTime.getFullYear(), commentResult[4] - 1, commentResult[5], commentResult[6], commentResult[7])
  if (commentData.date.getTime() - this.postData.postTime.getTime() < -1000 * 60 * 60 * 24 * 360)commentData.date.setFullYear(commentData.date.getFullYear() + 1)
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
  let targetLine = this.postData.endLine - startLine + 1
  if (startLine < 5 && this.postData.haveNormalInsideTitle) targetLine += 1
  if (showAllLog)console.log('GetComment at', startLine, 'to', endLine, 'endline:', this.postData.endLine, 'targetline:', targetLine)
  const checkedLine = []
  for (let i = targetLine; i < this.state.screen.length; i++) {
    const line = this.state.screen[i]
    const commentResult = /^(→ |推 |噓 )(.+?): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(line)
    if (commentResult != null) {
      let content = commentResult[3]
      const reg = /\s+$/g
      content = content.replace(reg, '')
      // console.log('GetComment', this)
      const comment = getComment.apply(this, [content, commentResult])
      this.recieveData.comments.push(comment)
      if (reportMode) checkedLine.push(i)
      // if (reportMode) console.log('GetComment at line', i, content, line)
    } /* else if (reportMode) console.log('GetComment at line fail', i, line) */
  }
  if (reportMode) {
    console.log('GetComment, startLine:', startLine, ', endline:', this.postData.endLine, ', targetline:', targetLine,
      ', checkedline:', checkedLine, ', haveNormalTitle:', this.postData.haveNormalInsideTitle)
  }
  // const percentresult = Ptt.match(/瀏覽 第 .+ 頁 \( *(\d+)%\)/)
  this.postData.startLine = startLine
  this.postData.endLine = endLine
  this.recieveData.endLine = endLine
  return { pass: true, callback: () => { } }
}
