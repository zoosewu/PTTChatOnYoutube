import { RunHandler } from './HandlerRunner'
import CheckIsInBoard from './Handlers/CheckIsInBoard'
import CheckIsInPost from './Handlers/CheckIsInPost'
import CheckIsInsideTitleInPost from './Handlers/CheckIsInsideTitleInPost'
import GetComment from './Handlers/GetComment'
import CheckIsEndInPost from './Handlers/CheckIsEndInPost'
import CheckIsCurrectLineInPost from './Handlers/CheckIsCurrectLineInPost'
import RecieveData from '../MessagePosterData/RecieveData'
import GetRecentLine from './Handlers/GetRecentLine'

const GetCommentByAIDTaskList = [
  CheckIsInBoard,
  CheckIsInPost,
  CheckIsInsideTitleInPost,
  CheckIsCurrectLineInPost,
  GetComment,
  CheckIsEndInPost
]

const GetCommentByRecentTaskList = [
  CheckIsInBoard,
  CheckIsInPost,
  CheckIsInsideTitleInPost,
  CheckIsCurrectLineInPost,
  CheckIsEndInPost,
  GetRecentLine
]

/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function recieveComments () {
  this.endTask()
  this.msg.PostMessage('alert', { type: 2, msg: '文章讀取完成。' })
  this.msg.PostMessage('newPush', this.recieveData)
  if (reportMode) console.log(this.recieveData)
}

/**
 * @this {Ptt}
 */
export default function (data) {
  console.log('GetCommentByAID', data)
  if (this.postData.board === data.board && this.postData.key === data.key) {
    this.postData.samePost()
  } else {
    this.postData.reset()
    this.postData.board = data.board
    this.postData.key = data.key
  }
  this.recieveData = new RecieveData()
  this.recieveData.board = data.board
  this.recieveData.key = data.key
  if (data.recent) {
    this.postData.key = data.key
    this.addTask(RunHandler, GetCommentByRecentTaskList)
  }
  this.addTask(RunHandler, GetCommentByAIDTaskList, recieveComments)
}
