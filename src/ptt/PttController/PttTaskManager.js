/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @typedef {{nowTask, taskList, add,  next, reset}} PttTaskManager
 */
export function PttTaskManager () {
  return {
    nowTask: null,
    taskList: [],
    add: (newTask, ...args) => {
      // console.trace('addtask', newTask, args)
      this.taskManager.taskList.push({ fn: newTask, args })
    },
    next: () => {
      this.taskManager.nowTask = this.taskManager.taskList.shift()
    },
    reset: () => {
      this.taskManager.taskList = []
      this.taskManager.nowTask = null
    }
  }
}
