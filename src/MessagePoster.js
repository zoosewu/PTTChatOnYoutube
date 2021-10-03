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
        this.ownerorigin + ' message posted to ' + this.targetorigin,
        d
      )
    }
  }
  this.onMessage = function (event) {
    // Check sender origin to be trusted
    console.log(this.ownerorigin, 'onMessage origin:', event.origin, 'targetorigin:', this.targetorigin, 'same origin:', event.origin === this.targetorigin, 'data:', event.data, event)
    if (event.origin !== this.targetorigin) return

    const data = event.data
    console.log('typeof (this[data.m])', typeof this[data.m])
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
