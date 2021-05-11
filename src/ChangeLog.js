export function ChangeLog () {
  function AddChangeLogInfo () {
    const changeLogInfo = {}

    changeLogInfo.v_2_7 = new Info()
    changeLogInfo.v_2_7.版本.push('2.7')

    changeLogInfo.v_2_6 = new Info()
    changeLogInfo.v_2_6.版本.push('新增黑名單功能。')
    changeLogInfo.v_2_6.版本.push('新增標題搜尋功能。')
    changeLogInfo.v_2_6.HoloDex.push('支援HoloDex。')
    changeLogInfo.v_2_6.HoloTools.push('新增按鈕在右上方控制列中，可以關閉聊天室讓出空間(限舊版)。')
    return changeLogInfo
  }

  const previousVersion = GM_getValue('previousVersion', '2.5.0').split('.')
  const nowVerion = GM_info.script.version.split('.')
  if (nowVerion[0] === previousVersion[0] && nowVerion[1] === previousVersion[1]) return
  class Info { constructor () { this.版本 = []; this.HoloDex = []; this.HoloTools = []; this.Twitch = []; this.Nijimado = []; this.Youtube = [] } }
  const ChangeLogInfo = AddChangeLogInfo()

  const changeLog = GetChangeLogInfo(new Info(), +previousVersion[0], +previousVersion[1] + 1)
  const changeLogHTML = EncodeChangeLog(changeLog)
  console.log('Version', previousVersion, nowVerion)
  console.log(ChangeLogInfo)
  console.log(changeLog)
  console.log(changeLogHTML)
  const modal = $(`
    <div id="PTTChangeLog" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-hidden="true" style="color: #000">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">PTTChatOnYoutube更新日誌</h4>
          </div>
          <div class="modal-body">
              ${changeLogHTML}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>`)
  $('body').append(modal)
  $('#PTTChangeLog').modal('show')
  GM_setValue('previousVersion', GM_info.script.version)

  function GetChangeLogInfo (info, major, minor) {
    const newInfo = ChangeLogInfo['v_' + major + '_' + minor]
    console.log('GetChangeLogInfo', info, major, minor, newInfo)
    if (+minor > nowVerion[1] && +major > nowVerion[0]) return info
    if (newInfo !== undefined) {
      for (const key in newInfo) {
        info[key] = info[key].concat(newInfo[key])
      }
    }
    if ((+minor + 1) <= nowVerion[1]) return GetChangeLogInfo(info, +major, +minor + 1)
    if ((+major + 1) <= nowVerion[0]) return GetChangeLogInfo(info, +major + 1, 0)
    return info
  }

  function EncodeChangeLog (log) {
    let logHTML = ''
    for (const key in log) {
      if (log[key].length !== 0) {
        let tmp = ''
        for (let index = 0; index < log[key].length; index++) {
          tmp = String.prototype.concat(tmp, `<li>${log[key][index]}</li>`)
        }
        logHTML = String.prototype.concat(logHTML, `<div style="margin: 5px 0px"><b>${key}：</b>`)
        if (key === '版本') logHTML = String.prototype.concat(logHTML, `${GM_info.script.version}`)
        logHTML = String.prototype.concat(logHTML, '<ul style="margin: 2px 0px;padding-left: 30px;">', tmp, '</ul></div>')
      }
    }
    return logHTML
  }
}
