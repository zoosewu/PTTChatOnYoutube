import { PttState } from './PttState.js'
import { PttTaskManager } from './PttTaskManager.js'
import { PttMatch } from './PttMatch.js'
import { PttFrame } from './PttFrame.js'
import { PttAutoCommand } from './PttAutoCommand.js'
import { ShowCommand, ReportMode } from '../../logsetting.js'
import { PttAddTask } from './PttAddTask.js'
export const Ptt = {
  command: null,
  state: PttState,
  taskManager: PttTaskManager,
  window: window, // 自動
  match: PttMatch,
  autoCommand: PttAutoCommand,
  frame: PttFrame,
  addTask: PttAddTask,
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
      if (ShowCommand) console.log('==set command', this.command)
    } else if (ShowCommand) console.log('==set command error,already exist', this.command)
  },
  replaceCommand: function (reg, input, callback, ...args) {
    if (!this.state.lock) return
    const lastCommand = this.command
    this.command = { reg, input, callback, args }
    if (ShowCommand) console.log('==replace command', lastCommand, '=>', this.command)
  },
  removeCommand: function (reg, input, callback, ...args) {
    if (ShowCommand) console.log('==remove command', this.command)
    this.command = null
  },
  removeAllTasks: function () {
    this.taskManager.reset()
  },
  insertText: (() => {
    let t = Ptt.wind.document.querySelector('#t')
    return str => {
      if (!t) t = Ptt.wind.document.querySelector('#t')
      const e = new CustomEvent('paste')
      // debug用
      if (ReportMode) console.log('insertText : "' + str + '"')
      e.clipboardData = { getData: () => str }
      t.dispatchEvent(e)
    }
  })(),
  runCommand: function () {
    const cmd = this.command
    if (typeof cmd !== 'undefined' && this.match(cmd.reg) != null) {
      this.setCommand = null
      if (ShowCommand) console.log('==execute command:', [cmd])
      this.insertText(cmd.input)
      if (typeof cmd.callback === 'function') {
        const args = cmd.args ? cmd.args : []
        cmd.callback(...args)
      }
    }
  }
}
