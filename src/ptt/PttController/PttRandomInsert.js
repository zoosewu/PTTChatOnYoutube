import { FrameState } from './PttState'
const insertEvent = [
  { frame: FrameState.otherPageofPost, fn: function () { this.insertText('qq') } },
  { frame: FrameState.firstPageofPost, fn: function () { this.insertText('qq') } },
  {
    frame: FrameState.main,
    /** @this {Ptt} */
    fn: function () {
      let text = 'f'
      if (this.match(/(●|> )(F)avorite/))text = 'p'
      this.insertText(text)
    }
  },
  { frame: FrameState.boardInfo, fn: function () { this.insertText('q') } },
  { frame: FrameState.board, fn: function () { this.insertText('p') } }
]

/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 */
export function PttRandomInsert () {
  console.log('PttRandomInsert', this.state.isInsertedText, !this.state.lock)
  if (this.state.isInsertedText || !this.state.lock) return
  for (let i = 0; i < insertEvent.length; i++) {
    const event = insertEvent[i]
    if (this.state.frame === event.frame) {
      event.fn.apply(this)
      return
    }
  }
}
