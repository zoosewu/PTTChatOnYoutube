import { RunHandler } from './HandlerRunner'
import CheckIsInMain from './Handlers/CheckIsInMain'

const GotoMainTaskList = [
  () => { console.log('run GotoMainTaskList'); return { pass: true } },
  CheckIsInMain
]

/**
 * @this {Ptt}
 */
export default function () {
  this.addTask(RunHandler, GotoMainTaskList)
}