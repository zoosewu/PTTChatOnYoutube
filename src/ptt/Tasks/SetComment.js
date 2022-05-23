/* eslint-disable */
import { RunTask } from '../RunTask.js'
import { CheckIsInBoard } from './Handlers/CheckIsInBoard.js'
import { CheckIsInPost } from './Handlers/CheckIsInPost.js'
import { CheckIsInsideTitleInPost } from './Handlers/CheckIsInsideTitleInPost.js'
import { SetNewComment } from './Handlers/SetNewComment.js'
import { MessagePoster } from 'src/MessagePoster.js'
import PostData from '../../PostData.js'
import RecieveData from '../MessagePosterData/RecieveData.js'

const setCommentTaskList = [
  CheckIsInBoard,
  CheckIsInPost,
  CheckIsInsideTitleInPost,
  SetNewComment
]
const recieveNewPush = () => {
  const receiveData = new RecieveData()
  receiveData.pushedComment = PostData.pushComment
  MessagePoster.PostMessage('pushedText', receiveData.pushedComment)
  if (showAllLog) console.log(PostData)
  GetPush(PostData.key, PTTPost.board, PTTPost.endLine, GetPushTask)
}
export const SetComment = pushtext => {
  let allowedchar = 24
  let addedtext = ''
  let trytime = 7
  while (trytime >= 0 && allowedchar > 0 && pushtext.length > 0) {
    const addtextreg = '(.{0,' + allowedchar + '})(.*)' // (.{0,24})(.*)
    const result = new RegExp(addtextreg).exec(pushtext)
    addedtext += result[1]
    const halfchar = addedtext.match(/[A-Za-z0-9_ :/\\.?=%]/g)
    const halfcount = halfchar ? halfchar.length : 0
    allowedchar = parseInt((48 - addedtext.length * 2 + halfcount) / 2)
    pushtext = result[2]
    if (reportMode) {
      console.log(
        'SetNewPushTask Text Reg==',
        addedtext.length * 2,
        '==',
        halfcount,
        '==',
        halfchar
      )
      console.log(
        'SetNewPushTask Text Reg==',
        addedtext,
        '==',
        pushtext,
        '==',
        allowedchar,
        '==',
        result
      )
    }
    trytime--
  }
  PTTPost.key = addedtext
  RunTask.apply(this, [setCommentTaskList, recieveNewPush])
}
