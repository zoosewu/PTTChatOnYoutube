import { InitPTT } from '../ptt/pttindex'
import menuCommand from 'menuCommand/menuCommand'
import insertGa from 'src/ga/index'
/**
 * @param {MessagePoster} msg
 * @param {Filter} filter
 */
function InitializeScript (msg, filter) {
  filter.callback(msg, filter.siteName)
  console.log('PTTChatOnYT initialize finished at', filter.siteName)
}
function throwstring (site) {
  return 'PTTonYT Script Stopped: ' + site + ' should run in top frame'
}
/**
 * @param {MessagePoster} msg
 */
function InitializePtt (msg) {
  // init msg
  msg.ownerorigin = 'https://term.ptt.cc'
  msg.targetorigin = /\?url=(.+?)\/?$/.exec(window.location.href)[1] // \?url=(https\:\/\/|http\:\/\/)(.+)
  msg.targetWindow = top
  // -----
  console.log('PTTChatOnYT PTT part started at ' + window.location.href)
  InitPTT(msg)
  console.log('PTTChatOnYT PTT part initialize finish.')
  // -----
}
/**
 * @param {MessagePoster} msg
 * @param {Filter} filter
 */
function InitializeWebsite (msg, filter) {
  // init postmessage
  msg.targetorigin = 'https://term.ptt.cc'
  msg.ownerorigin = filter.ownerOrigin
  // init menu command
  menuCommand(filter.siteName)
  insertGa()
  const isEnable = GM_getValue('menuCommand-enableExtention-' + filter.siteName, true)
  if (!isEnable) {
    console.log('PTTChatOnYT Script disabled by user at ' + filter.siteName + ', href:', window.location.href)
    return
  }
  // -----
  console.log('PTTChatOnYT Script started at ' + filter.siteName + ', href:', window.location.href)
  console.log('ownerorigin ' + filter.ownerOrigin)
  switch (document.readyState) {
    case 'complete':
      InitializeScript(msg, filter)
      break
    default:
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') { InitializeScript(msg, filter) }
      })
      break
  }
}
/**
 * @typedef {import("../MessagePoster").MessagePoster} MessagePoster
 * @typedef {import("./InsFilter").Filter} Filter
 * @param {MessagePoster} msg
 * @param {Filter[]} filters
 */
export default function HerfFilter (msg, filters) {
  const isTopframe = window.top === window.self
  if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
    if (isTopframe) throw throwstring('PTT') // check script work in right frame
    InitializePtt(msg)
  } else {
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i]
      if (filter.siteRegExp.exec(window.location.href) === null) continue
      if (!isTopframe) throw throwstring(filter.siteName) // check script work in right frame
      InitializeWebsite(msg, filter)
      break
    }
  }
}
