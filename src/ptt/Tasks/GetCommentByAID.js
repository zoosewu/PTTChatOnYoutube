/* eslint-disable */
const getCommentByAidTaskList = [boardcheck, PostCheck, PotsTitleCheck, PostLineCheck, PostPercentCheck]
const recievePushes = () => {
  PTT.unlock()
  msg.PostMessage('alert', { type: 2, msg: '文章讀取完成。' })
  msg.PostMessage('newPush', PTTPost)
  if (ShowAllLog) console.log(PTTPost)
}

export const GetCommentByAid = () => {
  RunTask(getCommentByAidTaskList, recieveComments)
}
