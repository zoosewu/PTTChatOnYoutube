import { FrameState } from '../../PttController/PttState.js'
import { MessagePoster } from '../../../MessagePoster.js'
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function searchTitle () {
  this.insertText('NPP/' + this.state.key + '\n')
}

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function SearchTitle () {
  const res = { pass: true, callback: searchTitle }
  if (this.state.frame === FrameState.board) {
    /* if (!PTTPost.searchingTitle.enteredsearchtitle ) */ res.pass = false
    /* else { */
    if (this.match(/看板《.+》/)) {
      if (reportMode) console.log('==searchfortitle error, title unavailable.')
      MessagePoster.PostMessage('alert', { type: 0, msg: '無此標題文章' })
      this.endTask()
      return
    }
  }
  return res
}
