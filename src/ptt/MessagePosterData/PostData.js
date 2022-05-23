export const PostData = {
  /** @type {string} */
  board: '',
  /** @type {Boolean} */
  isCurrectboard: false,
  /** @type {string} */
  key: '',
  /** @type {string} */
  outsideTitle: '',
  /** @type {string} */
  insideTitle: '',
  /** @type {Date} */
  postTime: new Date(),
  /** @type {Number} */
  startLine: 0,
  /** @type {Number} */
  endLine: 0,
  /** @type {Boolean} */
  haveNormalInsideTitle: false, // 普通標題會有第四行消失的問題
  /** @type {Boolean} */
  isSamePost: false,
  /** @type {Number} */
  TrySetNewComment: 0,
  /** @type {string} */
  pushedComment: '',
  samePost: function () {
    this.isSamePost = true
    this.TrySetNewComment = 0
    this.pushedComment = ''
  },
  reset: function () {
    this.board = ''
    this.isCurrectboard = false
    this.key = ''
    this.outsideTitle = ''
    this.insideTitle = ''
    this.postTime = new Date()
    this.startLine = 0
    this.endLine = 0
    this.haveNormalInsideTitle = false // 普通標題會有第四行消失的問題
    this.isSamePost = false
    this.TrySetNewComment = 0
    this.pushedComment = ''
  }
}
export default PostData
