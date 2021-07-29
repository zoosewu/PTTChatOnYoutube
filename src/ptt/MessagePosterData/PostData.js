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
  isBoadCheckerd: false
}

export const PostData = {
  reset: {
    newPost: () => {
      this.board = PostDataOriginal.board
      this.key = PostDataOriginal.key
      this.outsideTitle = PostDataOriginal.outsideTitle
      this.insideTitle = PostDataOriginal.insideTitle
      this.postTime = PostDataOriginal.postTime
      this.startline = PostDataOriginal.startline
      this.endline = PostDataOriginal.endline
      this.searchType = PostDataOriginal.searchType
      this.isSamePost = PostDataOriginal.isSamePost
      this.isPostChecked = PostDataOriginal.isPostChecked
      this.isBoadCheckerd = PostDataOriginal.isBoadCheckerd
    },
    samePost: () => {
      this.isSamePost = true
      this.isPostChecked = false
      this.isBoadCheckerd = false
    }
  },
  ...PostDataOriginal
}
