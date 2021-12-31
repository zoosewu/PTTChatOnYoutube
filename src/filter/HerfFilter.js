import { InitPTT } from '../ptt/pttindex'

export function HerfFilter (msg, filters) {
  const isTopframe = window.top === window.self
  if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
    if (isTopframe) throw throwstring('PTT') // check script work in right frame
    // init msg
    msg.ownerorigin = 'https://term.ptt.cc'
    msg.targetorigin = /\?url=(.+?)\/?$/.exec(window.location.href)[1] // \?url=(https\:\/\/|http\:\/\/)(.+)
    msg.targetWindow = top
    // -----
    console.log('PTTChatOnYT PTT part started at ' + window.location.href)
    InitPTT(msg)
    console.log('PTTChatOnYT PTT part initialize finish.')
    // -----
    console.log('msg', msg)
  } else {
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i]
      if (filter.Reg.exec(window.location.href) !== null) {
        if (!isTopframe) throw throwstring(filter.Fullname) // check script work in right frame
        // init postmessage
        msg.targetorigin = 'https://term.ptt.cc'
        msg.ownerorigin = filter.ownerorigin
        // -----
        console.log(
          'PTTChatOnYT Script started at ' + filter.Fullname + ', href:',
          window.location.href
        )
        switch (document.readyState) {
          case 'complete':
            InitualizeScript(filter)
            break
          default:
            document.addEventListener('readystatechange', function () {
              if (document.readyState === 'complete') {
                InitualizeScript(filter)
              }
            })
            break
        }
        break
      }
    }
  }
  function InitualizeScript (filter) {
    filter.callback(msg)
    console.log('PTTChatOnYT initialize finished at', filter.Fullname)
  }
  function throwstring (site) {
    return 'PTTonYT Script Stopped: ' + site + ' should run in top frame'
  }
}
