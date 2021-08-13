/* eslint-disable */
// 看不懂

function CheckTitleSame (_boardforsearch, _titleforsearch, task) {
  PTT.unlock()
  PTTPost.enteredAID = false
  PTTPost.enteredTitle = false
  PTTPost.buffer.title = PTTPost.searchingTitle.titleforsearch
  PTTPost.buffer.board = PTTPost.searchingTitle.boardforsearch
  msg.PostMessage('alert', { type: 1, msg: '搜尋中。' })
  PTTPost.searchingTitle.boardforsearch = _boardforsearch
  PTTPost.searchingTitle.titleforsearch = _titleforsearch
  PTTPost.searchingTitle.enteredsearchtitle = false
  PTTPost.searchingTitle.isend.insertP = false
  PTTPost.searchingTitle.isend.insert$ = false
  PTTPost.buffer.autofetch = false
  if (PTTPost.enableautofetchpost) PTTPost.buffer.autofetch = true
  PTTPost.enableautofetchpost = true
  if (PTT.pagestate === 1) {
    if (PTT.screenHaveText(/(> |●)\(M\)ail {9}【 私人信件區 】/)) insertText('c')// 隨意切畫面
    else insertText('m')// 隨意切畫面
  } else if (PTT.pagestate === 2) insertText('qP')
  else { // PTT.pagestate === 3 || 4
    insertText('qq')// 原本就在第一頁則直接退出
  }
  PTT.commands.add(/.*/, '', task)
}
function GetPostTitleTask () {
  RunTask(task.GetPostTitle, receiveTitle)
}