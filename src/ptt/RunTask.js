import { ReportMode } from '../logsetting.js'
/**
 * @param {Function[]} HandlerList array of handlers
 * @param {Function} OnTaskFinishedCallBack call when task finish
 */
function RunTask (HandlerList, OnTaskFinishedCallBack) {
  for (let i = 0; i < HandlerList.length; i++) {
    const result = HandlerList[i]()
    if (result.pass === true) {
      if (ReportMode) {
        console.log(
          'RunTask pass, pagestate:',
          this.pagestate,
          ', task name:',
          HandlerList[i].name
        )
      }
    }
    if (result.pass === false) {
      if (ReportMode) {
        console.log(
          'RunTask failed, pagestate:',
          this.pagestate,
          ', task name:',
          HandlerList[i].name
        )
      }
      result.callback.apply(this)
      this.commands.add(/.*/, '', RunTask, HandlerList, OnTaskFinishedCallBack)
      return
    }
  }
  OnTaskFinishedCallBack.apply(this)
}
export default RunTask
