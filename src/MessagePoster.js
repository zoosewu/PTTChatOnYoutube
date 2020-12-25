export function MessagePoster() {
  this.targetorigin = "";
  this.ownerorigin = "";
  this.targetWindow = null;
  this.PostMessage = function (msg, data) {
    if (this.targetWindow !== null) {
      const d = { m: msg, d: data };
      this.targetWindow.postMessage(d, this.targetorigin);
      if (showPostMessage && msg !== "PlayerUpdate") { console.log(this.ownerorigin + " message posted to " + this.targetorigin, d); }
    }
  };
  this.onMessage = function (event) {
    // Check sender origin to be trusted
    if (event.origin !== this.targetorigin) return;
    const data = event.data;
    if (typeof (this[data.m]) == "function") {
      this[data.m].call(null, data.d);
    }
    if (showonMessage && data.m !== "PlayerUpdate") console.log(this.ownerorigin + " get message from " + this.targetorigin, this.event);
  };
  if (window.addEventListener) {
    console.log("addEventListener message");
    window.addEventListener("message", event => { this.onMessage.call(this, event); }, false);
  }
  else if (window.attachEvent) {
    console.log("addEventListener onmessage");
    window.attachEvent("onmessage", event => { this.onMessage.call(this, event); }, false);
  }
}
