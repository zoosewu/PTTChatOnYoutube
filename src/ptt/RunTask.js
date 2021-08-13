import { Ptt } from './PttController/Ptt.js'
import { ReportMode } from '../logsetting.js'

export const RunTask = (tasklist, finishBehavior) => {
  for (let i = 0; i < tasklist.length; i++) {
    const result = tasklist[i]()
    if (result.pass === true) if (ReportMode) console.log('RunTask pass, pagestate:', Ptt.pagestate, ', task name:', tasklist[i].name)
    if (result.pass === false) {
      if (ReportMode) console.log('RunTask failed, pagestate:', Ptt.pagestate, ', task name:', tasklist[i].name)
      result.callback()
      Ptt.commands.add(/.*/, '', RunTask, tasklist, finishBehavior)
      return
    }
  }
  finishBehavior()
}
