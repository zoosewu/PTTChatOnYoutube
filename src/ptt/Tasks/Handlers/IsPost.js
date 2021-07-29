import { PTT } from '../../PTTController/PTT.js'
import { PostData, SearchType } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PTTController/PTTState.js'
// import { RecieveData } from '../../MessagePosterData/RecieveData.js'
import { reportmode } from '../../../logsetting.js'
import { MessagePoster } from '../../../MessagePoster.js'
const gotoPostByAID = () => {
  PTT.insertText('NPP#' + PostData.key + '\n')
}
const gotoPostByTitle = () => {
  PTT.insertText('NPP/' + PostData.key + '\n')
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
  if (PTT.match(/系列《.+》/)) {
    return { result: true, message: '' }
  } else {
    return { result: true, message: '文章標題錯誤，文章已消失或是你找錯看板了。' }
  }
}
const isPostAIDSearchResult = () => {
  if (PTT.match(/找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了/)) {
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
export const IsPost = () => {
  const res = { pass: true, callback: gotoPost }
  if (PTT.state.frame === FrameState.board) {
    if (PostData.isPostChecked) {
      const { result, message } = isPostSearchResult()
      if (result) {
        PTT.insertText('\n')
        res.pass = false
      } else {
        MessagePoster.PostMessage('alert', { type: 0, msg: message })
        if (reportmode) console.log(message, PTT, PostData)
        res.pass = false
        PTT.unlock()
      }
    }
  } else if (PTT.state.frame === FrameState.main) {
    if (reportmode) console.log('==IsPostCurrectInsideTitle error, PTT.pagestate:', PTT.state.frame) // 禁止出現的例外狀況
  }
  return res
}
