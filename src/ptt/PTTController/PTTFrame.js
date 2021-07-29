import { FrameState } from './PTTState'
import { MessagePoster } from '../../MessagePoster.js'
import { reportmode } from '../../logsetting.js'

export const PTTFrame = {
  filters: [
    { reg: /請輸入代號，或以 guest 參觀，或以 new 註冊/, state: FrameState.login },
    { reg: /上方為使用者心情點播留言區|【 精華公佈欄 】/, state: FrameState.main },
    { reg: /《.+》看板設定】/, state: FrameState.boardInfo },
    { reg: /^\[←\]離開 \[→\]閱讀/, state: FrameState.board },
    { reg: /目前顯示: 第 01/, state: FrameState.firstPageofPost },
    { reg: /目前顯示: 第/, state: FrameState.otherPageofPost }
  ],
  update: function () {
    for (let i = 0; i < this.pagestatefilter.length; i++) {
      const filter = this.frame.filters[i]
      const result = this.match(filter.reg)
      if (result != null) {
        if (reportmode) console.log('==page state:' + this.state.frame + '->' + filter.state, result)
        this.state.frame = filter.state
        if (this.state.frame > 1) this.state.ReconnectTime = 10
        MessagePoster.PostMessage('PTTState', this.state.frame)
        return
      }
    }
  }
}
