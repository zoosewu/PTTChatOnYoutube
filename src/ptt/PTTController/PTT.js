import { PttState } from './PttState.js'
import { PttMatch } from './PttMatch.js'
import { PttTaskManager } from './PttTaskManager.js'
import { PttAutoCommand } from './PttAutoCommand.js'
import { PttFrame } from './PttFrame.js'
import { PttCheckState, checkPttAlive } from './PttCheckState.js'
import { PttCommand } from './PttCommand.js'
import PostData from '../MessagePosterData/PostData.js'
import RecieveData from '../MessagePosterData/RecieveData.js'
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

  /** @type {PttCommand} */
  this.command = PttCommand.apply(this)

  /** @type {PostData} */
  this.postData = PostData

  this.recieveData = new RecieveData()

  /** @type {PttAddTask} */
  this.addTask = function (newTask, ...args) {
    console.log('this.taskManager.nowTask', this.taskManager.nowTask)
    this.taskManager.add(newTask, ...args)
    if (!this.taskManager.nowTask) {
      this.runTask()
    }
  }
  this.runTask = function () {
    this.taskManager.next()
    const task = this.taskManager.nowTask
    console.log('runTask', task)
    if (!task) {
      this.unlock()
      return
    }
    const NormalState = PttCheckState.apply(this)
    if (NormalState) {
      this.state.lastUpdateTime = Date.now()
      task.fn.apply(this, task.args)
      setTimeout(checkPttAlive.bind(this), 3500)
    }
  }
  this.endTask = function () {
    const lasttask = this.taskManager.nowTask
    if (reportMode && lasttask) console.log('endTask', lasttask.fn.name, lasttask.args)
    this.runTask()
  }
  this.removeAllTasks = () => {
    this.taskManager.reset()
  }
  this.lock = () => {
    if (reportMode) console.log('Ptt lock')
    this.state.lock = true
  }
  this.unlock = () => {
    if (reportMode) console.log('Ptt unlock')
    this.state.lock = false
    this.command.cmd = null
  }
  this.clearScreen = () => {
    this.state.screenUpdated = false
    this.state.screen = []
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
