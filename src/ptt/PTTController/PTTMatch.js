import { Ptt } from './PTT'

/**
 * @this {Ptt}
 * @param {string | RegExp} pattern
 * @param {string} flags
 * @returns {RegExpExecArray|undefined}
 */
export function PttMatch (pattern, flags = undefined) {
  let result
  const reg = GetReg(pattern, flags)
  if (!this.state.screenUpdated) {
    const sElement = $("[data-type='bbsline']", this.window.document)
    for (let i = 0; i < sElement.length; i++) {
      const txt = sElement[i].textContent
      this.state.screen.push(txt)
      if (!result) result = reg.exec(txt)
    }
    this.state.screenUpdated = true
    return result
  } else {
    for (let i = 0; i < this.state.screen.length; i++) {
      const txt = this.state.screen[i]
      result = reg.exec(txt)
      if (result) return result
    }
  }
}

/**
 * @param pattern
 * @param flags
 */
function GetReg (pattern, flags) {
  if (flags) return new RegExp(pattern, flags)
  if (typeof pattern.exec === 'function') return pattern
  return new RegExp(pattern)
}
