export function ChangeLog () {
  if (GM_info.script.version !== GM_getValue('previousVersion', '0.0.0')) {
    GM_setValue('previousVersion', GM_info.script.version)
    const changelog = `
    <div style="margin: 5px 0px">
      <b>版本：</b>${GM_info.script.version}
    </div>
    <div style="margin: 5px 0px">
      <b>HoloDex：</b>
      <ul style="margin: 2px 0px;padding-left: 30px;">
        <li>支援HoloDex。</li>
      </ul>
    </div>
    <div style="margin: 5px 0px">
      <b>HoloTools：</b>
      <ul style="margin: 2px 0px;padding-left: 30px;">
        <li>新增按鈕在右上方控制列中，可以關閉聊天室讓出空間(限舊版)。</li>
      </ul>
    </div>
    `
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
