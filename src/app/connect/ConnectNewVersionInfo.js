export let ConnectNewVersionInfo = {
  inject: ['nowPluginWidth'],
  data() {
    return {
      versionInfos: [],
    }
  },
  computed: {
    Classes: function () {
      if (this.nowPluginWidth < 399) return "px-0";
      else return "px-5";
    },
  },
  mounted() {
    let info;
    info = [
      "新增使用者自訂主題。",
      "(因為有時候偵測不到網站主題)",
      "偵測到imgur連結會自動補.png預覽",
    ];
    this.versionInfos.push(info);
    info = [
      "支援niji-mado。",
      "登入失敗可開啟刪除重複登入的功能。",
      "自訂套件寬度(特定網站可用)",
    ];
    this.versionInfos.push(info);
    info = [
      "支援Twitch。",
      "推文內的連結可以直接點開，圖片可以直接預覽。",
      "移除前三行的文章可以正常讀取，",
      "例如:#1W00ZXmh (LoL)。",
    ];
    this.versionInfos.push(info);
    info = [
      "新增套件長度、推文更新、字體尺寸、推文間隔。",
      "套件長度最大值現在可以到850。",
    ];
    this.versionInfos.push(info);
  },
  template: `<div class="mt-4 mb-1">
  <div :class="Classes">
    <h4 class="text-center my-1">近期改版</h4>
    <p class="text-center my-1">完整說明請到PTT搜尋YT聊天室顯示PTT推文</p>
    <div v-for="versionInfo in versionInfos">
      <hr class="mt-1 mb-2">
      <p class="mt-1 mb-0 px-1" v-for="info in versionInfo">{{info}}</p>
    </div>
  </div>
</div>`,
}