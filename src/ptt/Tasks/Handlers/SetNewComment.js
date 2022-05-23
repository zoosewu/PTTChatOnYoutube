/* eslint-disable */
import { Ptt } from 'PttController/Ptt.js'
import PostData from '../../MessagePosterData/PostData.js'
import { MessagePoster } from '../../../MessagePoster.js'

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function SetNewComment() {
  const res = { pass: false, callback: () => {} }
  PostData.TrySetNewComment++
  if (PostData.TrySetNewComment > 4) {
    res.pass = true
    return res
  }
  if (Ptt.pagestate === 4 || Ptt.pagestate === 3) {
    const pushcd = Ptt.match(
      /◆ 本文已過長, 禁止快速連續推文|◆ 對不起，您的文章或推文間隔太近囉！/
    )
    if (pushcd) {
      MessagePoster.PostMessage('alert', { type: 0, msg: '推文遭暫時禁止。' })
      res.pass = true
      return res
    }
    const pushtext = PTTPost.setpush + '\n'
    const pushcheck = PTT.screenHaveText(/(.+?): (.+?) +確定\[y\/N]:/)
    if (pushcheck) {
      console.log('pushcheck')
      PTTPost.setpush = ''
      PTTPost.pushedtext = pushcheck[2]
      insertText('y\n\nG')
      res.pass = true
      msg.PostMessage('alert', { type: 2, msg: '推文成功。' })
      return res
    }
    const pushtype = PTT.screenHaveText(/您覺得這篇文章/)
    if (pushtype) {
      console.log('pushtype')
      insertText('\n' + pushtext)
      return res
    }
    const pushdirect = PTT.screenHaveText(/時間太近, 使用|作者本人, 使用/)
    if (pushdirect) {
      console.log('pushdirect', pushdirect)
      insertText(pushtext)
      return res
    }
    const unpush = PTT.screenHaveText(/瀏覽 第 .+ 頁 \( *(\d+)%\)/)
    if (unpush) {
      console.log('unpush')
      insertText('%')
      return res
    }
  } else if (PTT.pagestate === 1)
    console.log('==GetPushTask error, PTT.pagestate == 1.')
  else if (PTT.pagestate === 2)
    console.log('==GetPushTask error, PTT.pagestate == 2.')
  return res
}
