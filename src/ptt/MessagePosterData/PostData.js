export const SearchType = Object.freeze({ none: 0, AID: 1, Title: 2 })

const PostDataOriginal = {
  board: '',
  key: '',
  outsideTitle: '',
  insideTitle: '',
  postTime: new Date(),
  startLine: 0,
  endLine: 0,
  haveNormalInsideTitle: false, // 普通標題會有第四行消失的問題
  searchType: SearchType.none,
  isSamePost: false,
  isPostChecked: false,
  isBoadChecked: false,
  TrySetNewComment: 0,
  pushedComment: ''
}
export const PostData = {
  ...PostDataOriginal
}
export const SetPostDataSamePost = () => {
  PostData.isSamePost = true
  PostData.isPostChecked = false
  PostData.isBoadChecked = false
  PostData.TrySetNewComment = 0
  PostData.pushedComment = ''
}
export const ResetPostData = () => {
  PostData.board = PostDataOriginal.board
  PostData.key = PostDataOriginal.key
  PostData.outsideTitle = PostDataOriginal.outsideTitle
  PostData.insideTitle = PostDataOriginal.insideTitle
  PostData.postTime = PostDataOriginal.postTime
  PostData.startline = PostDataOriginal.startline
  PostData.endline = PostDataOriginal.endline
  PostData.searchType = PostDataOriginal.searchType
  PostData.isSamePost = PostDataOriginal.isSamePost
  PostData.isPostChecked = PostDataOriginal.isPostChecked
  PostData.isBoadChecked = PostDataOriginal.isBoadChecked
  PostData.TrySetNewComment = PostDataOriginal.TrySetNewComment
  PostData.pushedComment = PostDataOriginal.pushedComment
}
