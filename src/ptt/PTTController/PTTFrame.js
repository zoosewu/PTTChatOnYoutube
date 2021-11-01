import { Ptt } from './Ptt'
import { FrameState } from './PttState'
import { ReportMode } from '../../logsetting.js'

/**
 * @this {Ptt}
 * @typedef {{filters, update}} PttFrame
 */
export function PttFrame () {
  return {
    filters: [
      { reg: /請輸入代號，或以 guest 參觀，或以 new 註冊/, state: FrameState.login },
      { reg: /上方為使用者心情點播留言區|【 精華公佈欄 】/, state: FrameState.main },
      { reg: /《.+》看板設定】/, state: FrameState.boardInfo },
      { reg: /^\[←\]離開 \[→\]閱讀/, state: FrameState.board },
      { reg: /目前顯示: 第 01/, state: FrameState.firstPageofPost },
      { reg: /目前顯示: 第/, state: FrameState.otherPageofPost }
    ],
    update: () => {
      for (let i = 0; i < this.frame.filters; i++) {
        const filter = this.frame.filters[i]
        const result = this.match(filter.reg)
        if (result != null) {
          if (ReportMode) console.log('==page state:' + this.state.frame + '->' + filter.state, result)
          this.state.frame = filter.state
          if (this.state.frame > 1) this.state.reconnectTime = 10
          this.msg.PostMessage('PTTState', this.state.frame)
          return
        }
      }
    }
  }
}
