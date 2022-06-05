import { FrameState } from 'src/ptt/PttController/PttState.js'

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function SetNewComment () {
  const res = { pass: false, callback: () => {} }
  this.postData.TrySetNewComment++
  if (this.postData.TrySetNewComment > 6) {
    res.pass = true
    return res
  }
  if (this.state.frame === FrameState.otherPageofPost || this.state.frame === FrameState.firstPageofPost) {
    const result = this.match(/◆ 本文已過長, 禁止快速連續推文|◆ 對不起，您的文章或推文間隔太近囉！/)
    if (result) {
      if (showAllLog)console.log('本文已過長', result)
      this.msg.PostMessage('alert', { type: 0, msg: '推文遭暫時禁止。' })
      this.insertText('\nrG')
      this.postData.TrySetNewComment = 100
      return res
    }
    const commentText = this.postData.commentText + '\n'
    if (showAllLog)console.log('commentText', commentText, this.postData.commentText)
    const commentCheck = this.match(/(.+?): (.+?) +確定\[y\/N]:/)
    if (commentCheck) {
      if (showAllLog)console.log('(.+?): (.+?) +確定[y/N]', commentCheck)
      this.postData.commentText = ''
      this.recieveData.commentedText = commentCheck[2]
      this.msg.PostMessage('alert', { type: 2, msg: '推文成功。' })
      this.insertText('y\nr')
      this.postData.TrySetNewComment = 100
      return res
    }
    const commentType = this.match(/您覺得這篇文章/)
    if (commentType) {
      if (showAllLog)console.log('您覺得這篇文章', commentType)
      this.insertText('\n' + commentText)
      return res
    }
    const commentDirect = this.match(/時間太近, 使用|作者本人, 使用/)
    if (commentDirect) {
      if (showAllLog)console.log('時間太近, 使用|作者本人, 使用', commentDirect)
      this.insertText(commentText)
      return res
    }
    const uncomment = this.match(/瀏覽 第 .+ 頁 \( *(\d+)%\)/)
    if (uncomment) {
      if (showAllLog)console.log('瀏覽 第 .+ 頁', uncomment)
      this.insertText('%')
      return res
    }
  }
  return res
}
