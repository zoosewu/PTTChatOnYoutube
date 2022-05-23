import { FrameState } from '../PttController/PttState'
import { RunHandler } from './HandlerRunner'
import GotoMain from './GotoMain'
import CheckIsInBoard from './Handlers/CheckIsInBoard'
import CheckIsCurrectPost from './Handlers/CheckIsCurrectPost'
import CheckIsInsideTitleInPost from './Handlers/CheckIsInsideTitleInPost'
import GetComment from './Handlers/GetComment'
import CheckIsEndInPost from './Handlers/CheckIsEndInPost'
import CheckIsCurrectLineInPost from './Handlers/CheckIsCurrectLineInPost'
import RecieveData from '../MessagePosterData/RecieveData'
import GetRecentLine from './Handlers/GetRecentLine'

const GetCommentByLineTaskList = [
  () => { console.log('run GetCommentByLineTaskList'); return { pass: true } },
  CheckIsInBoard,
  CheckIsCurrectPost,
  CheckIsInsideTitleInPost,
  CheckIsCurrectLineInPost,
  GetComment,
  CheckIsEndInPost
]

const GetRecentLineTaskList = [
  () => { console.log('run GetRecentLineTaskList'); return { pass: true } },
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
  this.msg.PostMessage('newPush', this.recieveData)
  if (reportMode) console.log(this.recieveData)
}
/**
 * @this {Ptt}
 */
function GetCommentByLine () {
  console.log('GetCommentByLine')
  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    this.insertText('q')
  }
  this.insertText('q')
  this.addTask(RunHandler, GetCommentByLineTaskList, recieveComments)
}
/**
 * @typedef {import("../MessagePosterData/PostData").PostData} PostData
 * @this {Ptt}
 * @param {PostData} data PostData
 */
export default function (data) {
  console.log('GetCommentByAnySearch', data)
  if (this.postData.board === data.board && this.postData.key === data.key) {
    this.postData.samePost()
  } else {
    const result = /^ *([#/?aZGA][^,]+?) *(?:, *([#/?aZGA!].+))? *$/.exec(data.key)
    if (!result) return
    let key = result[1]
    console.log(result.length, result)
    if (result.length > 2 && result[2]) key += '\n' + result[2]
    this.postData.reset()
    this.postData.board = data.board
    this.postData.key = key
    if (data.startline) this.postData.endLine = data.startline
  }
  this.recieveData = new RecieveData()
  this.recieveData.board = data.board
  this.recieveData.key = data.key
  if (!this.postData.samePost)GotoMain.apply(this)
  if (data.recent) {
    this.addTask(RunHandler, GetRecentLineTaskList)
  }
  this.addTask(GetCommentByLine)
}
