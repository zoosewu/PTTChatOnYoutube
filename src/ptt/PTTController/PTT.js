import { MessagePoster } from '../../MessagePoster.js'
import { PttState } from './PttState.js'
import { PttMatch } from './PttMatch.js'
import { PttTaskManager } from './PttTaskManager.js'
import { PttAutoCommand } from './PttAutoCommand.js'
import { PttFrame } from './PttFrame.js'
import { ShowCommand, ReportMode } from '../../logsetting.js'
import { PttAddTask } from './PttAddTask.js'

/** @param {MessagePoster} msg */
export function Ptt (msg) {
  if (typeof Ptt.cache === 'object') return Ptt.cache

  this.msg = msg
  this.command = null
  this.window = window // 自動

  /** @type {PttState} */
  this.state = PttState()

  this.match = PttMatch

  /** @type {PttTaskManager} */
  this.taskManager = PttTaskManager.apply(this)

  /** @type {PttAutoCommand} */
  this.autoCommand = PttAutoCommand.apply(this)

  /** @type {PttFrame} */
  this.frame = PttFrame.apply(this)

  this.addTask = PttAddTask

  this.lock = () => {
    this.state.lock = true
  }
  this.unlock = () => {
    this.state.lock = false
    this.command = null
  }
  this.clearScreen = () => {
    this.state.screenUpdated = false
    this.state.screen = []
  }
  this.setCommand = (reg, input, callback, ...args) => {
    if (!this.state.lock) return
    if (!this.command) {
      this.command = { reg, input, callback, args }
      if (ShowCommand) console.log('==set command', this.command)
    } else if (ShowCommand) console.log('==set command error,already exist', this.command)
  }
  this.replaceCommand = (reg, input, callback, ...args) => {
    if (!this.state.lock) return
    const lastCommand = this.command
    this.command = { reg, input, callback, args }
    if (ShowCommand) console.log('==replace command', lastCommand, '=>', this.command)
  }
  this.removeCommand = () => {
    if (ShowCommand) console.log('==remove command', this.command)
    this.command = null
  }
  this.removeAllTasks = () => {
    this.taskManager.reset()
  }
  this.insertText = str => {
    const t = this.window.document.querySelector('#t')
    const e = new CustomEvent('paste')
    if (ReportMode) console.log(`insertText: "${str}"`)
    e.clipboardData = { getData: () => str }
    t.dispatchEvent(e)
  }
  this.runCommand = () => {
    this.command = this.taskManager.next()
    if (!this.command) return
    console.log(this.taskManager.taskList)
    const cmd = this.command
    if (cmd) {
      console.log('==execute command:', cmd)
      cmd.fn(...cmd.args)
    }
  }
  Ptt.cache = this
}
