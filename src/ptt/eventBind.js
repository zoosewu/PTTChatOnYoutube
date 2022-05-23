import { Login } from './Tasks/Login'
import GetCommentByAID from './Tasks/GetCommentByAID'
import GetCommentByAnySearch from './Tasks/GetCommentByAnySearch'
/**
 * @typedef {import("./PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
export default function eventBind () {
  this.msg.login = Login.bind(this)
  this.msg.getCommentByAID = GetCommentByAID.bind(this)
  this.msg.getCommentByAnySearch = GetCommentByAnySearch.bind(this)
}
