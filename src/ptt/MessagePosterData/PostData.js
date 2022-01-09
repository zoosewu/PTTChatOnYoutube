export const SearchType = Object.freeze({ none: 0, AID: 1, Title: 2 })
const PostData = {
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
  pushedComment: '',
  samePost: function () {
    this.isSamePost = true
    this.isPostChecked = false
    this.isBoadChecked = false
    this.TrySetNewComment = 0
    this.pushedComment = ''
  },
  reset: function () {
    this.board = ''
    this.key = ''
    this.outsideTitle = ''
    this.insideTitle = ''
    this.postTime = new Date()
    this.startLine = 0
    this.endLine = 0
    this.haveNormalInsideTitle = false // 普通標題會有第四行消失的問題
    this.searchType = SearchType.none
    this.isSamePost = false
    this.isPostChecked = false
    this.isBoadChecked = false
    this.TrySetNewComment = 0
    this.pushedComment = ''
  }
}
export default PostData
