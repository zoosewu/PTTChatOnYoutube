export const PTTTaskManager = {
  lock: false,
  taskList: [],
  addTask: function (newTask) {
    if (!this.lock) {
      this.lock = true
      return newTask
    }
    this.taskList.push(newTask)
    return null
  },
  next: function () {
    if (this.taskList.length > 0) {
      return this.taskList.shift()
    }
    this.lock = false
    return null
  },
  reset: function () {
    this.lock = false
    this.taskList = []
  }
}
