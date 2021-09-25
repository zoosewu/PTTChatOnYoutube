import { ptt } from '../PTTController/PTT.js'

cryptkey = GM_getValue('cryptkey', Math.random())

export const Login = (data) => {
  const decryptedId = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8)
  const decryptedPassword = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8)
  TryLogin = 2
  ptt.addTask(login, decryptedId, decryptedPassword, data.DeleteOtherConnect)
}

let TryLogin
const login = (id, pw, DeleteOtherConnect) => {
  if (!ptt.state.login) {
    ptt.state.deleteOtherConnection = DeleteOtherConnect
    ptt.msg.PostMessage('alert', { type: 1, msg: '登入中' })

    const checkLogin = () => {
      if (ptt.match(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
        ptt.msg.PostMessage('alert', { type: 0, msg: '登入失敗，帳號或密碼有誤。' })
        ptt.unlock()
      } else if (ptt.match(/上方為使用者心情點播留言區|【 精華公佈欄 】/)) {
        ptt.msg.PostMessage('alert', { type: 2, msg: '登入成功。' })
        ptt.state.login = true
        ptt.unlock()
      } else if (ptt.match(/登入中，請稍候\.\.\.|正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久|密碼正確！ 開始登入系統/)) {
        ptt.taskManager.addTask(checkLogin)
      } else {
        ptt.msg.PostMessage('alert', { type: 0, msg: '發生了未知錯誤，可能是因為保留連線導致被踢掉。' })
        console.log(ptt.state.screen)
        ptt.unlock()
      }
    }
    const result = ptt.match(/請輸入代號，或以 guest 參觀，或以 new 註冊/)
    if (result) {
      if (TryLogin <= 0) { // 防止過度嘗試
        ptt.msg.PostMessage('alert', { type: 0, msg: '未知原因登入失敗。' })
        ptt.unlock()
        return
      } else TryLogin--
      ptt.insertText(id + '\n' + pw + '\n')
      ptt.taskManager.addTask(checkLogin)
    } else {
      ptt.taskManager.addTask(login, id, pw)
    }
  } else {
    ptt.msg.PostMessage('alert', { type: 0, msg: '已經登入，請勿重複登入。' })
    ptt.unlock()
  }
}
