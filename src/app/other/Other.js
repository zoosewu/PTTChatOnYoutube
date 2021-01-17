export let Other = {
  inject: ['nowPluginWidth'],
  computed: {
    Classes: function () {
      if (this.nowPluginWidth < 399) return "px-0";
      else return "px-5";
    },
  },
  template: `<div id="PTTChat-contents-other-main" :class="Classes">
  <h4 class="text-center mt-3 mb-1">使用教學</h4>
  <hr class="mt-1 mb-2">
  <p class="mt-1 mb-0">1.設定紀錄檔開始的時間(實況無須設定)</p>
  <p class="mt-1 mb-0">2.輸入帳號與密碼登入PTT</p>
  <p class="mt-1 mb-0">3.在你自己的PTT找到想要同步的文章</p>
  <p class="mt-1 mb-0">4.鍵入大寫Q複製文章完整AID(例#1W0MaOkF (C_Chat))</p>
  <p class="mt-1 mb-0">5.將複製的AID貼上並讀取文章</p>
  <h4 class="text-center mt-5 mb-1">相關連結</h4>
  <hr class="mt-1 mb-2">
  <div class="text-center">
    <a id="gfbtn" class="btn ptt-btnoutline m-2 "
      href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage" target="_blank" rel="noopener noreferrer"
      role="button">腳本介紹</a>
    <a id="gfbtn" class="btn ptt-btnoutline m-2" href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master"
      target="_blank" rel="noopener noreferrer" role="button">github</a>
    <a id="gfbtn" class="btn ptt-btnoutline m-2 " href="https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt"
      target="_blank" rel="noopener noreferrer" role="button">greasyfork</a>
  </div>
  <h4 class="text-center mt-5 mb-1">聲明</h4>
  <hr class="mt-1 mb-2">
  <p class="text-center mt-1 mb-0">本套件僅做PTT與Youtube的連線</p>
  <p class="text-center mt-1 mb-0">除此之外並不會連到任何伺服器</p>
  <p class="text-center mt-1 mb-0">所以不會蒐集任何關於你的資訊</p>
  <p class="text-center mt-1 mb-0">&nbsp;</p>
  <p class="text-center mt-1 mb-0">所有程式碼都沒有做任何的壓縮或混淆</p>
  <p class="text-center mt-1 mb-0">在greasyfork、github以及你的瀏覽器</p>
  <p class="text-center mt-1 mb-0">都有完整的程式碼以供任何人檢視</p>
  <p class="text-center mt-1 mb-0">&nbsp;</p>
  <p class="text-center mt-1 mb-0">請確保瀏覽實況或紀錄檔時</p>
  <p class="text-center mt-1 mb-0">沒有任何其他PTT的腳本同時啟用</p>
  <p class="text-center mt-1 mb-0">如果有的話請參閱完整網站說明並跟著操作</p>
  <p class="text-center mt-1 mb-0">&nbsp;</p>
  <p class="text-center mt-1 mb-0">本套件盡可能保證套件在操作PTT時的安全性</p>
  <p class="text-center mt-1 mb-0">並盡可能避免帳號資訊在傳輸過程中被第三方所竊取</p>
  <p class="text-center mt-1 mb-0">&nbsp;</p>
  <p class="text-center mt-1 mb-0">任何使用套件的人士 須自行承擔一切風險</p>
  <p class="text-center mt-1 mb-0">本人不會負責任何因使用此套件所造成的任何形式的損失</p>
  <p class="text-center mt-1 mb-0">&nbsp;</p>
  <p class="text-center mt-1 mb-0">使用本套件所造成任何形式的帳號損害</p>
  <p class="text-center mt-1 mb-0">包含但不限於帳號遭到竊取、推文而招致水桶或帳號註銷</p>
  <p class="text-center mt-1 mb-0">本人一概不負責</p>
  <p class="text-center mt-1 mb-0">&nbsp;</p>
  <p class="text-center mt-1 mb-0">Zoosewu</p>
</div>`,
}