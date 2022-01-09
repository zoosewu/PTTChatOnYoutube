import { PttState } from './PttState.js'
import { PttMatch } from './PttMatch.js'
import { PttTaskManager } from './PttTaskManager.js'
import { PttAutoCommand } from './PttAutoCommand.js'
import { PttFrame } from './PttFrame.js'
import { PttCheckState, checkPttAlive } from './PttCheckState.js'

/**
 * @typedef {import("../../MessagePoster").MessagePoster} MessagePoster
 * @param {MessagePoster} msg message poster
 * @returns {object} Ptt
 */
export function Ptt (msg) {
  if (typeof Ptt.cache === 'object') {
    console.log('return Ptt cache')
    return Ptt.cache
  }
  console.log('instance Ptt')
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

  // this.postData = new PostData()

  /** @type {PttAddTask} */
  this.addTask = function (newTask, ...args) {
    this.taskManager.addTask(newTask, ...args)
    if (PttCheckState.apply(this)) {
      this.lock()
      const task = this.taskManager.next()
      this.state.lastUpdateTime = Date.now()
      task.fn.apply(this, args)
      setTimeout(checkPttAlive.bind(this), 3500)
    }
  }
  this.endTask = function () {
    const task = this.taskManager.next()
    this.state.lastUpdateTime = Date.now()
    if (reportMode) console.log('AddTask', task.fn.name, task.args, this)
    task.fn.apply(this, task.args)
    setTimeout(checkPttAlive.bind(this), 3500)
  }
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
      if (showCommand) console.log('==set command', this.command)
    } else if (showCommand) { console.log('==set command error,already exist', this.command) }
  }
  this.replaceCommand = (reg, input, callback, ...args) => {
    if (!this.state.lock) return
    const lastCommand = this.command
    this.command = { reg, input, callback, args }
    if (showCommand) { console.log('==replace command', lastCommand, '=>', this.command) }
  }
  this.removeCommand = () => {
    if (showCommand) console.log('==remove command', this.command)
    this.command = null
  }
  this.removeAllTasks = () => {
    this.taskManager.reset()
  }
  this.runCommand = () => {
    if (!this.command) return
    const cmd = this.command
    if (cmd) {
      console.log('execute command:', cmd)
      cmd.fn.apply(this, ...cmd.args)
    }
  }
  this.insertText = str => {
    const t = this.window.document.querySelector('#t')
    const e = new CustomEvent('paste')
    if (reportMode) console.log(`insertText: "${str}"`)
    e.clipboardData = { getData: () => str }
    t.dispatchEvent(e)
  }
  Ptt.cache = this
}
