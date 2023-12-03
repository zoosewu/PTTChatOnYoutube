/**
 *
 */
export default function ChangeLog () {
  /**
   * @returns {string} newest post in ptt
   */
  function GetPTTChangeLogURL () {
    return 'https://www.ptt.cc/bbs/C_Chat/M.1654439165.A.725.html'
  }

  /**
   * @returns {object} object of change log
   */
  function AddChangeLogInfo () {
    const changeLogInfo = {}
    changeLogInfo.v_3_2 = new Info()
    changeLogInfo.v_3_2.版本.push(`
大家好，好久不見：

套件已經許久沒更新，其中一個很大的原因就是現在功能改動跟修復太過困難。
從最初僅有雛形的1.0版，後來使用Vue框架全部重寫，然後也將爬蟲部分重寫以方便新增推文功能，
現在已經到了3.0版。

老實說這個套件我自己的使用量已經不多，因為自己看實況的習慣有一些改變。
但是我還是很喜歡這個套件，也了解這個套件有很多人需要，我也希望這個套件能讓更多人受惠。

所以我會再進行一次前端架構重寫並推出4.0版，讓未來錯誤修復及新功能的擴充上能更加方便。
重寫的這段時間我也會先針對過去遺留下來的問題進行修正。如果有長期以來的bug一直都存在，
請再麻煩到github回應一下issue或是站內信給我，讓我了解問題還持續存在。

非常感謝大家能支持這個套件。

Zoo`)

    changeLogInfo.v_3_2.版本.push('修正作業系統不是使用台灣時區，觀看紀錄檔時間會對不上的問題。')

    changeLogInfo.v_3_1 = new Info()
    changeLogInfo.v_3_1.Youtube.push('修正Youtube實況尚未開始時如果有預告影片會導致套件判斷錯誤的問題(Koyori及Roboko)。')
    changeLogInfo.v_3_1.Youtube.push('修正按鈕會消失的情況。')
    changeLogInfo.v_3_1.版本.push('修正推文有時候沒有反應的問題，增加推文時的回饋。')
    changeLogInfo.v_3_1.版本.push('修正黑名單沒有輸入任何內容會無法顯示聊天室的錯誤。')
    changeLogInfo.v_3_1.版本.push('修正Firefox新模式的推文會超出介面的問題。')
    changeLogInfo.v_3_1.版本.push('修正關閉灰色漸變功能沒有產生效果的問題。')
    changeLogInfo.v_3_1.Twitch.push('修正套件會被原生介面擋住的問題。')
    changeLogInfo.v_3_1.HoloDex.push('修正新模式沒辦法使用的問題。')

    changeLogInfo.v_3_0 = new Info()
    changeLogInfo.v_3_0.版本.push('使用新的搜尋功能，可以搜尋標題、AID、作者、推文數、稿酬、標記等。\n舊版的AID(#1WHqSb2l (C_Chat))依然可以使用。')
    changeLogInfo.v_3_0.版本.push('修正版主ID+版標太常導致看板名稱消失後就會無法辨識看板的問題。')
    changeLogInfo.v_3_0.版本.push('現在可以套件關閉對特定網站的支援了。')
    changeLogInfo.v_3_0.版本.push('現在可以對每個網站做套件設定了。')
    changeLogInfo.v_3_0.版本.push('修正firefox無法使用的問題。')
    changeLogInfo.v_3_0.版本.push('現在可以針對推文的關鍵字做黑名單了，只要推文內容包含關鍵字就不會顯示。')
    changeLogInfo.v_3_0.版本.push('修正log頁籤的內容，現在可以正確的顯示套件的各項資訊了。')

    changeLogInfo.v_2_9 = new Info()
    changeLogInfo.v_2_9.HoloDex.push('修正holodex改版造成套件失效的問題。')

    changeLogInfo.v_2_8 = new Info()
    changeLogInfo.v_2_8.HoloTools.push('修復在新版HoloTools中無法使用的問題。')
    changeLogInfo.v_2_8.HoloTools.push('支援新版HoloTools聊天室開關、佈局切換。')
    changeLogInfo.v_2_8.HoloTools.push('修正開台數多時會擋住增加指定影片按鈕的問題。')
    changeLogInfo.v_2_8.HoloDex.push('支援嵌入式顯示模式，可以在分割中使用PTT聊天室並自訂大小、位置了。<br>詳細說明：<a href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage#holodex" target="_blank">github</a>')
    changeLogInfo.v_2_8.HoloDex.push('在右上方控制列中新增新舊版PTT聊天室切換開關。')
    changeLogInfo.v_2_8.版本.push('修復PTT新式游標在搜尋超過五位數文章數時會發生錯誤的問題。')
    changeLogInfo.v_2_8.版本.push('修復在同看板使用同標題搜尋時不會更新標題預覽及跳轉至聊天室的問題。')
    changeLogInfo.v_2_8.版本.push('修復在PTT卡住後無法再使用標題搜尋功能的問題。')
    changeLogInfo.v_2_8.版本.push('支援回文、轉文的搜尋。')
    changeLogInfo.v_2_8.版本.push('修正若干css問題。')
    changeLogInfo.v_2_8.版本.push('修正網站原生對話框(如結帳頁面)會錯誤的問題。')
    changeLogInfo.v_2_8.版本.push('現在會完全隱藏被黑名單ID的推文了。')

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

  const previousVersion = GM_getValue('previousVersion', '2.9.0').split('.')
  const nowVerion = GM_info.script.version.split('.')
  GM_setValue('previousVersion', GM_info.script.version)
  if (nowVerion[0] <= previousVersion[0] && nowVerion[1] <= previousVersion[1]) return
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

  /**
   * @param {object} info ..
   * @param {string} major major version number
   * @param {string} minor minor version number
   * @returns {object} Logs to show
   */
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
  /**
   * @param {object} log ..
   * @returns {string} HTML data with Logs
   */
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
