import { Ptt } from '../../PttController/Ptt.js'
import PostData from '../../MessagePosterData/PostData.js'
import { MessagePoster } from '../../../MessagePoster.js'

const searchTitle = () => {
  Ptt.insertText('NPP/' + PostData.key + '\n')
}

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
  const res = { pass: true, callback: searchTitle }
  if (Ptt.pagestate === 2) {
    /* if (!PTTPost.searchingTitle.enteredsearchtitle ) */ res.pass = false
    /* else { */
    if (Ptt.match(/看板《.+》/)) {
      if (reportMode) console.log('==searchfortitle error, title unavailable.')
      MessagePoster.PostMessage('alert', { type: 0, msg: '無此標題文章' })
      Ptt.unlock()
      return
      // }
    }
  }
  return res
}
