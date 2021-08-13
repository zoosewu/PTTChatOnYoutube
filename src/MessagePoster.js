import { ShowPostMessage, ShowOnMessage, ReportMode } from './logsetting.js'

export function MessagePoster () {
  this.targetorigin = ''
  this.ownerorigin = ''
  this.targetWindow = null
  this.PostMessage = function (msg, data) {
    if (this.targetWindow === null) return

    const d = { m: msg, d: data }
    this.targetWindow.postMessage(d, this.targetorigin)
    if (ShowPostMessage && msg !== 'PlayerUpdate') { console.log(this.ownerorigin + ' message posted to ' + this.targetorigin, d) }
  }
  this.onMessage = function (event) {
    // Check sender origin to be trusted
    if (event.origin !== this.targetorigin) return

    const data = event.data
    // console.log('typeof (this[data.m])', typeof (this[data.m]))
    if (typeof (this[data.m]) === 'function') {
      this[data.m].call(null, data.d)
    }
    if (ShowOnMessage && data.m !== 'PlayerUpdate') console.log(this.ownerorigin + ' get message from ' + this.targetorigin, data)
  }
  if (window.addEventListener) {
    if (ReportMode) console.log('addEventListener message')
    /* eslint-disable no-useless-call */
    window.addEventListener('message', event => { this.onMessage.call(this, event) }, false)
  } else if (window.attachEvent) {
    if (ReportMode) console.log('addEventListener onmessage')
    window.attachEvent('onmessage', event => { this.onMessage.call(this, event) }, false)
    /* eslint-enable no-useless-call */
  }
}
