import { Ptt } from '../PttController/Ptt.js'
import RunTask from '../RunTask'
import CheckIsInBoard from './Handlers/CheckIsInBoard'
import CheckIsInPost from './Handlers/CheckIsInPost'
import CheckIsInsideTitleInPost from './Handlers/CheckIsInsideTitleInPost'
import GetComment from './Handlers/GetComment'
import CheckIsEndInPost from './Handlers/CheckIsEndInPost'
import CheckIsCurrectLineInPost from './Handlers/CheckIsCurrectLineInPost'
import RecieveData from '../MessagePosterData/RecieveData'
import { ShowAllLog } from '../../logsetting'

const getCommentByAidTaskList = [
  CheckIsInBoard,
  CheckIsInPost,
  CheckIsInsideTitleInPost,
  CheckIsCurrectLineInPost,
  GetComment,
  CheckIsEndInPost
]

/**
 * @this {Ptt}
 */
function recieveComments () {
  this.unlock()
  this.msg.PostMessage('alert', { type: 2, msg: '文章讀取完成。' })
  this.msg.PostMessage('newPush', RecieveData)
  if (ShowAllLog) console.log(RecieveData)
}

/**
 * @this {Ptt}
 */
export default function () {
  RunTask.apply(this, [getCommentByAidTaskList, recieveComments])
}
