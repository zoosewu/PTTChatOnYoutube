import { PTTState } from './PTTState.js'
import { PTTTaskManager } from './PTTTaskManager.js'
import { PTTMatch } from './PTTMatch.js'
import { PTTFrame } from './PTTFrame.js'
import { PTTAutoCommand } from './PTTAutoCommand.js'
import { showcommand, reportmode } from '../../logsetting.js'
import { PTTAddTask } from './PTTAddTask.js'
export const PTT = {
  command: null,
  state: PTTState,
  taskManager: PTTTaskManager,
  window: window, // 自動
  match: PTTMatch,
  autoCommand: PTTAutoCommand,
  frame: PTTFrame,
  addTask: PTTAddTask,
  lock: function () {
    this.state.lock = true
  },
  unlock: function () {
    this.state.lock = false
    this.command = null
  },
  clearScreen: () => {
    this.state.screenUpdated = false
    this.state.screen = []
  },
  setCommand: function (reg, input, callback, ...args) {
    if (!this.state.lock) return
    if (this.command === null) {
      this.command = { reg, input, callback, args }
      if (showcommand) console.log('==set command', this.command)
    } else if (showcommand) console.log('==set command error,already exist', this.command)
  },
  replaceCommand: function (reg, input, callback, ...args) {
    if (!this.state.lock) return
    const lastCommand = this.command
    this.command = { reg, input, callback, args }
    if (showcommand) console.log('==replace command', lastCommand, '=>', this.command)
  },
  removeCommand: function (reg, input, callback, ...args) {
    if (showcommand) console.log('==remove command', this.command)
    this.command = null
  },
  removeAllTasks: function () {
    this.taskManager.reset()
  },
  insertText: (() => {
    let t = PTT.wind.document.querySelector('#t')
    return str => {
      if (!t) t = PTT.wind.document.querySelector('#t')
      const e = new CustomEvent('paste')
      // debug用
      if (reportmode) console.log('insertText : "' + str + '"')
      e.clipboardData = { getData: () => str }
      t.dispatchEvent(e)
    }
  })(),
  runCommand: function () {
    const cmd = this.command
    if (typeof cmd !== 'undefined' && this.match(cmd.reg) != null) {
      this.setCommand = null
      if (showcommand) console.log('==execute command:', [cmd])
      this.insertText(cmd.input)
      if (typeof cmd.callback === 'function') {
        const args = cmd.args ? cmd.args : []
        cmd.callback(...args)
      }
    }
  }
}
