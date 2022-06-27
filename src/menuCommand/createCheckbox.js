
import instanceMenuCommand from './instanceMenuCommand'

/**
 * @param {Boolean} value
 * @returns String
 */
function getCheckboxEmoji (value) {
  return value ? '☑ ' : '☐ '
}

/**
 * @typedef {import("./instanceMenuCommand").Command} Command
 * @param {String} settingName
 * @param {String} caption
 * @param {Function} callback
 * @param {Boolean} defaultvalue
 * @returns Command
 */
export default function checkboxElement (settingName, caption, callback, defaultvalue = false) {
  const pre = 'menuCommand-'
  let value = GM_getValue(pre + settingName, defaultvalue)
  function getCaption () {
    return getCheckboxEmoji(value) + caption
  }
  function onClick () {
    value = !value
    GM_setValue(pre + settingName, value)
    callback(value)
    return value
  }
  return instanceMenuCommand(getCaption, onClick)
}
