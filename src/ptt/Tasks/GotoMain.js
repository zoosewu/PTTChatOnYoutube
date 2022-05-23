import { RunHandler } from './HandlerRunner'
import CheckIsInMain from './Handlers/CheckIsInMain'

const GotoMainTaskList = [
  () => { console.log('run GotoMainTaskList'); return { pass: true } },
  CheckIsInMain
]

/**
 * @typedef {import("../MessagePosterData/PostData").PostData} PostData
 * @this {Ptt}
 * @param {PostData} data PostData
 */
export default function (data) {
  this.addTask(RunHandler, GotoMainTaskList)
}
