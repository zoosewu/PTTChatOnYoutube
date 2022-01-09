import PostData, { SearchType } from '../../MessagePosterData/PostData.js'
import { FrameState } from '../../PttController/PttState.js'
import { MessagePoster } from '../../../MessagePoster.js'

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function gotoPostByAID () {
  this.insertText('NPP#' + PostData.key + '\n')
}
const gotoPostByTitle = () => {
  this.insertText('NPP/' + PostData.key + '\n')
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
  if (this.match(/系列《.+》/)) {
    return { result: true, message: '' }
  } else {
    return {
      result: true,
      message: '文章標題錯誤，文章已消失或是你找錯看板了。'
    }
  }
}
const isPostAIDSearchResult = () => {
  if (
    this.match(/找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了/)
  ) {
    return {
      result: false,
      message: '文章AID錯誤，文章已消失或是你找錯看板了。'
    }
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

/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
  const res = { pass: true, callback: gotoPost }
  if (this.state.frame === FrameState.board) {
    if (PostData.isPostChecked) {
      const { result, message } = isPostSearchResult()
      if (result) {
        this.insertText('\n')
        res.pass = false
      } else {
        MessagePoster.PostMessage('alert', { type: 0, msg: message })
        if (reportMode) console.log(message, this, PostData)
        res.pass = false
        this.unlock()
      }
    }
  } else if (this.state.frame === FrameState.main) {
    if (reportMode) {
      console.log(
        '==IsPostCurrectInsideTitle error, Ptt.pagestate:',
        this.state.frame
      ) // 禁止出現的例外狀況
    }
  }
  return res
}
