import { ConnectNewVersionInfoElement } from './ConnectNewVersionInfo/ConnectNewVersionInfoElement.js';
export let ConnectNewVersionInfo = {
  inject: ['pluginWidth'],
  data() {
    return {
      versionInfo: [],
    }
  },
  computed: {
    Classes: function () {
      if (this.pluginWidth < 399) return "px-0";
      else return "px-5";
    },
  },
  mounted() {
    let info;
    info = [
      "支援Twitch",
      "推文內的連結可以直接點開，圖片可以直接預覽",
      "移除前三行的文章可以正常讀取。",
      "例如:#1W00ZXmh (LoL)",
    ];
    this.versionInfo.push(info);
    info = [
      "新增套件長度、推文更新、字體尺寸、推文間隔",
      "套件長度最大值現在可以到850",
    ];
    this.versionInfo.push(info);
  },
  components: {
    "connect-new-version-info-element": ConnectNewVersionInfoElement,
  },
  template: `<div class="mt-4 mb-1">
  <div :class="Classes">
    <h4 class="text-center my-1">近期改版</h4>
    <p class="text-center my-1">完整說明請到PTT搜尋YT聊天室顯示PTT推文</p>
    <connect-new-version-info-element :items="items" v-for="items in versionInfo"></connect-new-version-info-element>
  </div>
</div>`,
}