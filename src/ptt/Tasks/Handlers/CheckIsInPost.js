import { Ptt } from '../../PttController/Ptt.js'
import { PostData, SearchType } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
import { ReportMode } from '../../../logsetting.js'
import { MessagePoster } from '../../../MessagePoster.js'
const gotoPostByAID = () => {
  Ptt.insertText('NPP#' + PostData.key + '\n')
}
const gotoPostByTitle = () => {
  Ptt.insertText('NPP/' + PostData.key + '\n')
}
const gotoPost = () => {
  PostData.isPostChecked = true
  if (PostData.searchType === SearchType.AID) {
    gotoPostByAID()
  } else if (PostData.searchType === SearchType.Title) {
    gotoPostByTitle()
  }
}
const isPostTitleSearchResult = () => {
  if (Ptt.match(/系列《.+》/)) {
    return { result: true, message: '' }
  } else {
    return { result: true, message: '文章標題錯誤，文章已消失或是你找錯看板了。' }
  }
}
const isPostAIDSearchResult = () => {
  if (Ptt.match(/找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了/)) {
    return { result: false, message: '文章AID錯誤，文章已消失或是你找錯看板了。' }
  } else {
    return { result: true, message: '' }
  }
}

const isPostSearchResult = () => {
  if (PostData.searchType === SearchType.AID) {
    isPostAIDSearchResult()
  } else if (PostData.searchType === SearchType.Title) {
    isPostTitleSearchResult()
  }
}
export const CheckIsPost = () => {
  const res = { pass: true, callback: gotoPost }
  if (Ptt.state.frame === FrameState.board) {
    if (PostData.isPostChecked) {
      const { result, message } = isPostSearchResult()
      if (result) {
        Ptt.insertText('\n')
        res.pass = false
      } else {
        MessagePoster.PostMessage('alert', { type: 0, msg: message })
        if (ReportMode) console.log(message, Ptt, PostData)
        res.pass = false
        Ptt.unlock()
      }
    }
  } else if (Ptt.state.frame === FrameState.main) {
    if (ReportMode) console.log('==IsPostCurrectInsideTitle error, Ptt.pagestate:', Ptt.state.frame) // 禁止出現的例外狀況
  }
  return res
}
