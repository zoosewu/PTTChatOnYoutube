import { FrameState } from '../PttController/PttState'
import { RunHandler } from './HandlerRunner'
import GotoMain from './GotoMain'
import CheckIsLogined from './Handlers/CheckIsLogined'
import CheckIsInBoard from './Handlers/CheckIsInBoard'
import CheckIsCurrectPost from './Handlers/CheckIsCurrectPost'
import CheckIsInsideTitleInPost from './Handlers/CheckIsInsideTitleInPost'
import GetComment from './Handlers/GetComment'
import CheckIsEndInPost from './Handlers/CheckIsEndInPost'
import CheckIsCurrectLineInPost from './Handlers/CheckIsCurrectLineInPost'
import RecieveData from '../MessagePosterData/RecieveData'
import GetRecentLine from './Handlers/GetRecentLine'

const GetCommentByLineTaskList = [
  () => { if (reportMode) console.log('run GetCommentByLineTaskList'); return { pass: true } },
  CheckIsLogined,
  CheckIsInBoard,
  CheckIsCurrectPost,
  CheckIsInsideTitleInPost,
  CheckIsCurrectLineInPost,
  GetComment,
  CheckIsEndInPost
]

const GetRecentLineTaskList = [
  () => { if (reportMode) console.log('run GetRecentLineTaskList'); return { pass: true } },
  CheckIsLogined,
  CheckIsInBoard,
  CheckIsCurrectPost,
  CheckIsInsideTitleInPost,
  GetRecentLine
]

/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function recieveComments () {
  this.endTask()
  this.msg.PostMessage('alert', { type: 2, msg: '文章讀取完成。' })
  this.msg.PostMessage('newComment', this.recieveData)
  if (reportMode) console.log(this.recieveData)
}
/**
 * @this {Ptt}
 */
function GetCommentByLine () {
  if (showAllLog) console.log('GetCommentByLine')
  if (this.state.frame === FrameState.otherPageofPost) {
    this.insertText('qr')
  }
  this.addTask(RunHandler, GetCommentByLineTaskList, recieveComments)
  this.endTask()
}
/**
 * @this {Ptt}
 */
export default function (data) {
  if (reportMode) console.log('GetCommentByAnySearch', data)
  const result = /^ *([#/?aZGA][^,]+?) *(?:, *([#/?aZGA!].+))? *$/.exec(data.key)
  if (!result) return
  let key = result[1]
  if (result.length > 2 && result[2]) key += '\n' + result[2]
  if (this.postData.board === data.board && this.postData.key === key) {
    this.postData.samePost()
  } else {
    this.postData.reset()
    this.postData.board = data.board
    this.postData.key = key
    if (data.startLine) this.postData.endLine = data.startLine
    GotoMain.apply(this)
  }

  this.recieveData = new RecieveData()
  this.recieveData.board = data.board
  this.recieveData.key = data.key
  if (data.recent) {
    this.addTask(RunHandler, GetRecentLineTaskList)
  }
  this.addTask(GetCommentByLine)
  this.msg.PostMessage('alert', { type: 1, msg: '文章讀取中。' })
  const res = CheckIsEndInPost.apply(this)
  if (res.pass && !(this.state.frame === FrameState.firstPageofPost)) this.insertText('qr')
  this.command.set(() => { this.endTask() })
}
