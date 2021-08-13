/* eslint-disable */
let TryLogin = 0
function Login (id, pw, DeleteOtherConnect) {
  msg.PostMessage('alert', { type: 1, msg: '登入中' })
  if (!PTT.login) {
    PTT.DeleteOtherConnect = DeleteOtherConnect
    const logincheck = () => {
      if (PTT.screenHaveText(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
        msg.PostMessage('alert', { type: 0, msg: '登入失敗，帳號或密碼有誤。' })
        PTT.unlock()
      } else if (PTT.screenHaveText(/上方為使用者心情點播留言區|【 精華公佈欄 】/)) {
        msg.PostMessage('alert', { type: 2, msg: '登入成功。' })
        PTT.login = true
        PTT.unlock()
        // testcode
        /* (() => {
          PTTLockCheck(GetPostPush, `#1VobIvqM (C_Chat)`);
          insertText("x");
        })(); */
      } else if (PTT.screenHaveText(/登入中，請稍候\.\.\.|正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久|密碼正確！ 開始登入系統/)) {
        PTT.commands.add(/.*/, '', logincheck)
      } else {
        msg.PostMessage('alert', { type: 0, msg: '發生了未知錯誤，可能是因為保留連線導致被踢掉。' })
        console.log(PTT.screen)
        PTT.unlock()
      }
    }
    const result = PTT.screenHaveText(/請輸入代號，或以 guest 參觀，或以 new 註冊/)
    if (result) {
      if (TryLogin <= 0) { // 防止過度嘗試
        msg.PostMessage('alert', { type: 0, msg: '未知原因登入失敗。' })
        PTT.unlock()
        return
      } else TryLogin--
      insertText(id + '\n' + pw + '\n')
      PTT.commands.add(/.*/, '', logincheck)
    } else {
      PTT.commands.add(/.*/, '', Login, id, pw)
    }
  } else {
    msg.PostMessage('alert', { type: 0, msg: '已經登入，請勿重複登入。' })
    PTT.unlock()
  }
}
