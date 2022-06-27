import { FrameState } from './PttState'

/**
 * @typedef Filter
 * @property {Object} reg
 * @property {FrameState} state
 * @typedef PttFrame
 * @property {Filter[]} filters
 * @property {Function} update
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @return {PttFrame}
 */
export function PttFrame () {
  return {
    filters: [
      { reg: /請輸入代號，或以 guest 參觀，或以 new 註冊/, state: FrameState.login },
      { reg: /上方為使用者心情點播留言區|【 精華公佈欄 】/, state: FrameState.main },
      { reg: /《.+》看板設定/, state: FrameState.boardInfo },
      { reg: /^\[←\]離開 \[→\]閱讀/, state: FrameState.board },
      { reg: /目前顯示: 第 01/, state: FrameState.firstPageofPost },
      { reg: /目前顯示: 第/, state: FrameState.otherPageofPost }
    ],
    update: () => {
      for (let i = 0; i < this.frame.filters.length; i++) {
        const filter = this.frame.filters[i]
        const result = this.match(filter.reg)
        // console.log('this.match(', filter.reg, ')', result)
        if (result) {
          if (reportMode) console.log('==ptt.state.frame:' + this.state.frame + '->' + filter.state, result)
          this.state.frame = filter.state
          if (this.state.frame > 1) this.state.reconnectTime = 10
          this.msg.PostMessage('pttState', this.state.frame)
          return
        }
      }
    }
  }
}
