import { Login } from './Tasks/Login'
import GetCommentByAID from './Tasks/GetCommentByAID'
import GetCommentByAnySearch from './Tasks/GetCommentByAnySearch'
import SetComment from './Tasks/SetComment'
/**
 * @typedef {import("./PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
export default function eventBind () {
  this.msg.login = data => bindEvent.apply(this, [Login, data])
  this.msg.getCommentByAID = data => bindEvent.apply(this, [GetCommentByAID, data])
  this.msg.getCommentByAnySearch = data => bindEvent.apply(this, [GetCommentByAnySearch, data])
  this.msg.setNewcomment = data => bindEvent.apply(this, [SetComment, data])
}
/**
 * @this {Ptt}
 */
function bindEvent (event, data) {
  if (this.state.lock) return
  this.lock()
  this.addTask(event, data)
}
