/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @param {Function[]} HandlerList array of handlers
 * @param {Function} OnTaskFinishedCallBack call when task finish
 */
export function RunHandler (HandlerList, OnTaskFinishedCallBack) {
  if (reportMode)console.log('RunHandler', [HandlerList, OnTaskFinishedCallBack])
  for (let i = 0; i < HandlerList.length; i++) {
    const result = HandlerList[i].apply(this)
    if (result.pass === true) {
      if (reportMode) console.log('RunHandler pass, framestate:', this.state.frame, ', handler name:', HandlerList[i].name)
    }
    if (result.pass === false) {
      if (reportMode) console.log('RunHandler failed, framestate:', this.state.frame, ', handler name:', HandlerList[i].name)
      result.callback.apply(this)
      this.command.set(RunHandler, HandlerList, OnTaskFinishedCallBack)
      return
    }
  }
  if (OnTaskFinishedCallBack)OnTaskFinishedCallBack.apply(this)
  this.endTask()
}
