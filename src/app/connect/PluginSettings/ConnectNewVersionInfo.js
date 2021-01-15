export let ConnectNewVersionInfo = {
  inject: ['pluginWidth'],
  computed: {
    Classes: function () {
      if (this.pluginWidth < 399) return "px-0";
      else return "px-5";
    },
  },
  template: `<div :class="Classes">
  <h4 class="text-center my-1">近期改版</h4>
  <p class="text-center my-1">完整說明請到PTT搜尋YT聊天室顯示PTT推文</p>
  <hr class="mt-1 mb-2">
  <p class="mt-1 mb-0">支援Twitch</p>
  <p class="mt-1 mb-0">推文內的連結可以直接點開，圖片可以直接預覽</p>
  <p class="mt-1 mb-0">移除前三行的文章可以正常讀取。</p>
  <p class="mt-1 mb-0">例如:#1W00ZXmh (LoL)</p>
  <hr class="mt-1 mb-2">
  <p class="mt-1 mb-0">新增套件長度、推文更新、字體尺寸、推文間隔</p>
  <p class="mt-1 mb-0">套件長度最大值現在可以到850</p>
</div>`,
}