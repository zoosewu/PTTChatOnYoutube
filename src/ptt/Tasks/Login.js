import { Ptt } from '../PttController/Ptt.js'

const cryptkey = GM_getValue('cryptkey', Math.random())

let TryLogin
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
export function Login (data) {
  const decryptedId = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8)
  const decryptedPassword = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8)
  TryLogin = 2
  if (decryptedId !== '' && decryptedPassword !== '') {
    this.addTask(login, decryptedId, decryptedPassword, data.DeleteOtherConnect)
  } else {
    this.msg.PostMessage('alert', { type: 0, msg: '加密錯誤' })
  }
}
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function login (id, pw, DeleteOtherConnect) {
  console.log('login', Ptt, this, id, pw, DeleteOtherConnect)
  if (!this.state.login) {
    this.state.deleteOtherConnection = DeleteOtherConnect
    this.msg.PostMessage('alert', { type: 1, msg: '登入中' })
    const result = this.match(/請輸入代號，或以 guest 參觀，或以 new 註冊/)
    if (result) {
      if (TryLogin <= 0) { // 防止過度嘗試
        this.msg.PostMessage('alert', { type: 0, msg: '未知原因登入失敗。' })
        this.endTask()
        return
      } else {
        TryLogin--
      }
      this.insertText(id + '\n' + pw + '\n')
      this.command.set(checkLogin)
    } else {
      this.command.set(login, id, pw)
    }
  } else {
    this.msg.PostMessage('alert', { type: 0, msg: '已經登入，請勿重複登入。' })
    this.endTask()
  }
}

function checkLogin () {
  if (this.match(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
    this.msg.PostMessage('alert', { type: 0, msg: '登入失敗，帳號或密碼有誤。' })
    this.endTask()
  } else if (this.match(/上方為使用者心情點播留言區|【 精華公佈欄 】/)) {
    this.msg.PostMessage('alert', { type: 2, msg: '登入成功。' })
    this.state.login = true
    this.endTask()
  } else if (this.match(/登入中，請稍候\.\.\.|正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久|密碼正確！ 開始登入系統/)) {
    this.msg.PostMessage('alert', { type: 1, msg: '登入執行中，請稍候...' })
    this.command.set(checkLogin)
  } else {
    this.msg.PostMessage('alert', { type: 0, msg: '發生了未知錯誤，可能是因為保留連線導致被踢掉。' })
    console.log(this.state.screen)
    this.endTask()
  }
}
