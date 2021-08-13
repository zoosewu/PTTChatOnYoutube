import { Ptt } from '../../PTTController/Ptt.js'
import { PostData } from '../../MessagePosterData/PostData.js'
import { MessagePoster } from '../../../MessagePoster.js'
import { ReportMode } from '../../../logsetting.js'

const searchTitle = () => {
  Ptt.insertText('NPP/' + PostData.key + '\n')
}
export const SearchTitle = () => {
  const res = { pass: true, callback: searchTitle }
  if (Ptt.pagestate === 2) {
    /* if (!PTTPost.searchingTitle.enteredsearchtitle ) */ res.pass = false
    /* else { */
    if (Ptt.match(/看板《.+》/)) {
      if (ReportMode) console.log('==searchfortitle error, title unavailable.')
      MessagePoster.PostMessage('alert', { type: 0, msg: '無此標題文章' })
      Ptt.unlock()
      return
      // }
    }
  }
  return res
}
