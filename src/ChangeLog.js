export function ChangeLog () {
  const nowVerion = GM_info.script.version
  if (nowVerion !== GM_getValue('previousVersion', '0.0.0')) {
    GM_setValue('previousVersion', nowVerion)
    const msg = {
      版本: [
        '新增黑名單功能。',
        '新增標題搜尋功能。'
      ],
      HoloDex: [
        '支援HoloDex。'
      ],
      HoloTools: [
        '新增按鈕在右上方控制列中，可以關閉聊天室讓出空間(限舊版)。'
      ],
      Twitch: [],
      Nijimado: [],
      Youtube: []
    }
    let changelog = ''
    for (const key in msg) {
      if (msg[key].length !== 0) {
        let tmp = ''
        for (let index = 0; index < msg[key].length; index++) {
          tmp = String.prototype.concat(tmp, `<li>${msg[key][index]}</li>`)
        }
        changelog = String.prototype.concat(changelog, `<div style="margin: 5px 0px"><b>${key}：</b>`)
        if (key === '版本') changelog = String.prototype.concat(changelog, `${nowVerion}`)
        changelog = String.prototype.concat(changelog, '<ul style="margin: 2px 0px;padding-left: 30px;">', tmp, '</ul></div>')
      }
    }
    const modal = $(`
    <div id="PTTChangeLog" class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-hidden="true" style="color: #000">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">PTTChatOnYoutube更新日誌</h4>
          </div>
          <div class="modal-body">
              ${changelog}
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" data-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>`)
    $('body').append(modal)
    $('#PTTChangeLog').modal('show')
  }
}
