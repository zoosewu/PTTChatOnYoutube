import { Login } from './Tasks/Login'
import GetCommentByAID from './Tasks/GetCommentByAID'
/**
 * @typedef {import("./PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
export default function eventBind () {
  console.log('eventBind')
  this.msg.login = Login.bind(this)
  this.msg.getCommentByAID = GetCommentByAID.bind(this)
}
