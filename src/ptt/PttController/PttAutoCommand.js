/**
 * @enum {number}
 * @readonly
 */
export const ThisFrame = Object.freeze({ skip: true, notSkip: false })

/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @typedef {{list, runAutoCommand}} PttAutoCommand
 */
export function PttAutoCommand () {
  return {
    list: [
      {
        reg: /您想刪除其他重複登入的連線嗎/,
        input: '',
        callback: () => {
          const inserttxt = this.state.deleteOtherConnection ? 'y\n' : 'n\n'
          this.insertText(inserttxt)
          return ThisFrame.skip
        }
      },
      { reg: /您要刪除以上錯誤嘗試的記錄嗎/, input: 'n\n' },
      {
        reg: /按任意鍵繼續/,
        input: '',
        callback: () => {
          const reg = /(◆ 此文章無內容|找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了|這一篇文章值|◆ 本文已過長, 禁止快速連續推文|◆ 對不起，您的文章或推文間隔太近囉！|《.+》看板設定|◆ 抱歉, 禁止推薦)/
          const result = this.match(reg)
          if (result) {
            return ThisFrame.notSkip
          } else {
            this.insertText('\n')
            return ThisFrame.skip
          }
        }
      },
      { reg: /動畫播放中\.\.\./, input: 'q' },
      {
        reg: /系統過載, 請稍後再來\.\.\./,
        input: '',
        callback: () => {
          this.state.serverfull = true
          if (this.state.lock) {
            this.taskManager.reset()
            this.msg.PostMessage('alert', {
              type: 0,
              msg: '系統過載, 請稍後再來...'
            })
            return ThisFrame.skip
          }
        }
      },
      { reg: /大富翁 排行榜|發表次數排行榜/, input: 'q' },
      { reg: /本日十大熱門話題/, input: 'q' },
      { reg: /本週五十大熱門話題/, input: 'q' },
      { reg: /每小時上站人次統計/, input: 'q' },
      { reg: /本站歷史 \.\.\.\.\.\.\./, input: 'q' },
      {
        reg: /看 板 {2}目錄數 {3}檔案數 {5}byte數 {3}總 分 {5}板 {3}主/,
        input: 'q'
      },
      { reg: /名次──────範本───────────次數/, input: 'q' },
      {
        reg: /鴻雁往返 {2}\(R\/y\)回信 \(x\)站內轉寄 \(d\/D\)刪信 \(\^P\)寄發新信/,
        input: 'q'
      },
      { reg: /您確定要離開【 批踢踢實業坊 】嗎\(Y\/N\)？/, input: 'n\n' },
      { reg: /【精華文章】/, input: 'q' },
      { reg: /【看板列表】/, input: 'q' },
      { reg: /【分類看板】/, input: 'q' },
      { reg: /【電子郵件】/, input: 'e' },
      { reg: /【聊天說話】/, input: 'e' },
      { reg: /【個人設定】/, input: 'e' },
      { reg: /【工具程式】/, input: 'e' },
      { reg: /【網路遊樂場】/, input: 'e' }
    ],
    runAutoCommand: () => {
      const commands = this.autoCommand.list
      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i]
        const result = this.match(cmd.reg)
        if (result) {
          if (showCommand) console.log('==execute AutoCommand:', [cmd])
          this.insertText(cmd.input)
          if (typeof cmd.callback !== 'undefined') {
            const args = cmd.args ? cmd.args : []
            return cmd.callback(...args)
          } else {
            return true
          }
        }
      }
      return false
    }
  }
}
