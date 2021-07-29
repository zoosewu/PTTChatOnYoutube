export const PTTMatch = (pattern, flags) => {
  let result = null
  const reg = PTTMatch_GetReg(pattern, flags)
  if (!this.state.screenUpdated) {
    const sElement = $("[data-type='bbsline']", this.window.document)
    for (let i = 0; i < sElement.length; i++) {
      const txt = sElement[i].textContent
      this.screen.push(txt)
      if (result === null) result = reg.exec(txt)
    }
    this.state.screenUpdated = true
    return result
  } else {
    for (let i = 0; i < this.screen.length; i++) {
      const txt = this.screen[i]
      result = reg.exec(txt)
      if (result !== null) return result
    }
    return null
  }
}

// eslint-disable-next-line camelcase
function PTTMatch_GetReg (pattern, flags = 'i') {
  if (typeof pattern.exec === 'function') return pattern
  return new RegExp(pattern, flags)
}
