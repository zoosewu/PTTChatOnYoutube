export function MessagePoster() {
  this.targetorigin = "";
  this.ownorigin = "";
  this.targetWindow = null;
  this.PostMessage = function (msg, data) {
    if (this.targetWindow !== null) {
      const d = { m: msg, d: data };
      this.targetWindow.postMessage(d, this.targetorigin);
      if (showPostMessage) console.log(this.ownorigin + " message posted", d);
    }
  };
  this.onMessage = function (event) {
    // Check sender origin to be trusted
    if (event.origin !== msg.targetorigin) return;
    const data = event.data;
    if (showonMessage) console.log(msg.ownorigin + " onMessage", data);
    if (typeof (msg[data.m]) == "function") {
      msg[data.m].call(null, data.d);
    }
  };
  if (window.addEventListener) {
    window.addEventListener("message", this.onMessage, false);
  }
  else if (window.attachEvent) {
    window.attachEvent("onmessage", this.onMessage, false);
  }
}
