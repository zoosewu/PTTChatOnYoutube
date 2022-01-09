import RunHandler from '../RunHandler'
import CheckIsInBoard from './Handlers/CheckIsInBoard'
import CheckIsInPost from './Handlers/CheckIsInPost'
import CheckIsInsideTitleInPost from './Handlers/CheckIsInsideTitleInPost'
import GetComment from './Handlers/GetComment'
import CheckIsEndInPost from './Handlers/CheckIsEndInPost'
import CheckIsCurrectLineInPost from './Handlers/CheckIsCurrectLineInPost'
import RecieveData from '../MessagePosterData/RecieveData'

const getCommentByAidTaskList = [
  CheckIsInBoard,
  CheckIsInPost,
  CheckIsInsideTitleInPost,
  CheckIsCurrectLineInPost,
  GetComment,
  CheckIsEndInPost
]

/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function recieveComments () {
  this.unlock()
  this.msg.PostMessage('alert', { type: 2, msg: '文章讀取完成。' })
  this.msg.PostMessage('newPush', RecieveData)
  if (showAllLog) console.log(RecieveData)
}

/**
 * @this {Ptt}
 */
export default function (data) {
  console.log('GetCommentByAID', data)
  this.addTask(RunHandler, getCommentByAidTaskList, recieveComments)
}
