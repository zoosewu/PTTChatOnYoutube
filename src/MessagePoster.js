import { ShowPostMessage, ShowOnMessage, ReportMode } from './logsetting.js'

/**
 * @param attachedWindow
 * @param targetOrigin
 * @param ownerOrigin
 */
export function MessagePoster (
  attachedWindow,
  targetOrigin,
  ownerOrigin = undefined
) {
  this.attachedWindow = attachedWindow
  this.targetOrigin = targetOrigin
  this.ownerOrigin = ownerOrigin
  this.PostMessage = (msg, data) => {
    if (this.attachedWindow === null) return

    const message = { m: msg, d: data }
    this.attachedWindow.postMessage(message, this.targetOrigin)
    if (ShowPostMessage && msg !== 'PlayerUpdate') {
      console.log(
        `${this.ownerOrigin} message posted to ${this.targetOrigin}`,
        message
      )
    }
  }

  // private method
  const onMessage = event => {
    // Check sender origin to be trusted
    if (event.origin !== this.targetOrigin) {
      return
    }

    const data = event.data
    if (ReportMode) console.log(`typeof this[data.m]: ${typeof this[data.m]}`)
    if (ShowOnMessage && data.m !== 'PlayerUpdate') {
      console.log(
        `${this.ownerOrigin} got message from ${this.targetOrigin}`,
        data
      )
    }
    if (typeof this[data.m] === 'function') {
      this[data.m](data.d)
    }
  }

  if (window.addEventListener) {
    /* eslint-disable no-useless-call */
    window.addEventListener('message', onMessage, false)
    if (ReportMode) console.log('addEventListener message')
  } else if (window.attachEvent) {
    window.attachEvent('onmessage', onMessage)
    if (ReportMode) console.log('attachEvent onmessage')
    /* eslint-enable no-useless-call */
  }
}
