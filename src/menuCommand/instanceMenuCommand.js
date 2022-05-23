/**
 * @typedef Command
 * @property {Function} getCaption
 * @property {Function[]} callback
 *
 * @param {Function} getCaption
 * @param {Function[]} callback
 * @returns Command
 */
export default function instanceMenuCommand (getCaption, callback) {
  let cb = callback
  if (!Array.isArray(callback))cb = [callback]
  return { getCaption: getCaption, callback: cb }
}
