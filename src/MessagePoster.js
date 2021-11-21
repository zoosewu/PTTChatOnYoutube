import { showMessage } from './logsetting'
export function MessagePoster () {
  this.targetorigin = ''
  this.ownerorigin = ''
  this.targetWindow = null
  this.PostMessage = function (msg, data) {
    if (this.targetWindow === null) return

    const d = { m: msg, d: data }
    this.targetWindow.postMessage(d, this.targetorigin)
    if (showMessage && msg !== 'PlayerUpdate') {
      console.log(
        this.ownerorigin + ' posted message to ' + this.targetorigin,
        d
      )
    }
  }
  this.onMessage = function (event) {
    // Check sender origin to be trusted
    if (event.origin !== this.targetorigin) return
    const data = event.data
    console.log('typeof (this[data.m])', typeof this[data.m])
    console.log('data.m', data.d)
    if (typeof this[data.m] === 'function') {
      this[data.m].call(null, data.d)
    }
    if (showMessage && data.m !== 'PlayerUpdate') {
      console.log(
        this.ownerorigin + ' get message from ' + this.targetorigin,
        data
      )
    }
  }
  if (window.addEventListener) {
    if (showMessage) console.log('addEventListener message')
    /* eslint-disable no-useless-call */
    window.addEventListener(
      'message',
      event => {
        this.onMessage.call(this, event)
      },
      false
    )
  } else if (window.attachEvent) {
    if (showMessage) console.log('addEventListener onmessage')
    window.attachEvent(
      'onmessage',
      event => {
        this.onMessage.call(this, event)
      },
      false
    )
    /* eslint-enable no-useless-call */
  }
}
