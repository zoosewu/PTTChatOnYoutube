export function ChangeLog () {
  function GetPTTChangeLogURL () {
    return 'https://www.ptt.cc/bbs/C_Chat/M.1621163470.A.1DD.html'
  }

  function AddChangeLogInfo () {
    const changeLogInfo = {}

    changeLogInfo.v_2_8 = new Info()
    changeLogInfo.v_2_8.HoloTools.push('修復在新版HoloTools中無法使用的問題。')
    changeLogInfo.v_2_8.HoloTools.push('支援新版HoloTools聊天室開關、佈局切換。')
    changeLogInfo.v_2_8.HoloTools.push('修正開台數多時會擋住增加指定影片按鈕的問題。')
    changeLogInfo.v_2_8.HoloDex.push('支援嵌入式顯示模式，可以在分割中使用PTT聊天室並自訂大小、位置了。<br>詳細說明：<a href="https://github.com/crimsonmoon9/PTTChatOnYoutube/tree/feature/guide/homepage#holodex">github</a>')
    changeLogInfo.v_2_8.HoloDex.push('若嵌入模式發生錯誤，可以在重新整理後使用右上方控制列中的P按鈕切換到舊版顯示模式')
    changeLogInfo.v_2_8.版本.push('修復PTT新式游標在搜尋超過五位數文章數時會發生錯誤的問題。')
    changeLogInfo.v_2_8.版本.push('修復在同看板使用同標題搜尋時不會更新標題預覽及跳轉至聊天室的問題。')
    // changeLogInfo.v_2_8.版本.push('修復在PTT卡住後無法再使用標題搜尋功能的問題。')
    changeLogInfo.v_2_8.版本.push('支援回文、轉文的搜尋。')
    changeLogInfo.v_2_8.版本.push('修正若干css問題。')
    changeLogInfo.v_2_8.版本.push('修正網站原生對話框(如結帳頁面)會錯誤的問題。')

    changeLogInfo.v_2_7 = new Info()
    changeLogInfo.v_2_7.HoloTools.push('(舊版)在右上方控制列中新增<strong>PTT聊天室開關</strong>與<strong>切換顯示佈局按鈕</strong>。<br>')
    changeLogInfo.v_2_7.HoloTools.push('<p><b>PTT聊天室開關</b>：<br>&emsp;&emsp;現在可以在不用時完全隱藏PTT聊天室，回復佔用的空間。</p>')
    changeLogInfo.v_2_7.HoloTools.push('<p><b>切換顯示佈局按鈕</b>：<br>&emsp;&emsp;支援直立式螢幕顯示，將聊天室移到底部。</p>')
    changeLogInfo.v_2_7.版本.push('新增更新日誌，套件更新時會顯示更新資訊，並且可以點擊閱讀更多按鈕查看更新說明文章。')

    changeLogInfo.v_2_6 = new Info()
    changeLogInfo.v_2_6.版本.push('新增黑名單功能。')
    changeLogInfo.v_2_6.版本.push('新增標題搜尋功能。')
    changeLogInfo.v_2_6.HoloDex.push('支援HoloDex。')

    return changeLogInfo
  }

  const previousVersion = GM_getValue('previousVersion', '2.5.0').split('.')
  const nowVerion = GM_info.script.version.split('.')
  if (nowVerion[0] === previousVersion[0] && nowVerion[1] === previousVersion[1]) return
  class Info { constructor () { this.版本 = []; this.HoloDex = []; this.HoloTools = []; this.Twitch = []; this.Nijimado = []; this.Youtube = [] } }
  const allChangeLogInfo = AddChangeLogInfo()
  const changeLogInfo = GetChangeLogInfo(new Info(), +previousVersion[0], +previousVersion[1] + 1)
  const changeLogHTML = EncodeChangeLog(changeLogInfo)
  const PTTChangeLogURL = GetPTTChangeLogURL()

  // data-backdrop should be empty
  const modal = $(`
    <div id="PTTChangeLog" class="modal fade" data-backdrop="" data-keyboard="false" tabindex="-1" aria-hidden="true" style="color: #000; overflow: overlay;">
      <div class="modal-dialog modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">PTTChatOnYoutube更新日誌</h4>
          </div>
          <div class="modal-body">
              ${changeLogHTML}
          </div>
          <div class="modal-footer">
          <a href="${PTTChangeLogURL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" type="button">閱讀更多</a>
          <button type="button" class="btn btn-primary" data-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>`)
  $('#PTTChat').append(modal)
  $('#PTTChangeLog').modal('show')
  GM_setValue('previousVersion', GM_info.script.version)

  function GetChangeLogInfo (info, major, minor) {
    const newInfo = allChangeLogInfo['v_' + major + '_' + minor]
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
