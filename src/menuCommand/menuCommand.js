import createCheckbox from './createCheckbox'
/**
 * @type {Command[]}
 * @typedef {import("./instanceMenuCommand").Command} Command
 */
const commandList = []
function unregisterAllCommand () {
  for (let i = 0; i < commandList.length; i++) {
    const command = commandList[i]
    GM_unregisterMenuCommand((+i + 1) + '）' + command.getCaption())
  }
}
function registerAllCommand () {
  for (let i = 0; i < commandList.length; i++) {
    const command = commandList[i]
    GM_registerMenuCommand((+i + 1) + '）' + command.getCaption(), () => onClick(command.callback))
  }
}
function onClick (callback) {
  unregisterAllCommand()
  const value = callback[0]()
  for (let i = 1; i < callback.length; i++) callback[i](value)
  registerAllCommand()
}
export default function menuCommand (siteName) {
  commandList.push(createCheckbox('enableExtention-' + siteName, `是否在${siteName}啟用(需重新整理)`, () => { }, true))
  commandList.push(createCheckbox('customPluginSetting-' + siteName, `在${siteName}獨立使用套件設定`, () => { }))
  registerAllCommand()
}
export function AddCommancCallback (index, callback) {
  commandList[index].callback.push(callback)
}
