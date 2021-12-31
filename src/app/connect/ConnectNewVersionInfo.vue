<template>
  <div class="mt-4 mb-1">
    <div :class="Classes">
      <h4 class="text-center my-1">
        近期改版
      </h4>
      <p class="text-center my-1">
        完整說明請到PTT搜尋YT聊天室顯示PTT推文
      </p>
      <div
        v-for="(versionInfo,index) in versionInfos"
        :key="index"
      >
        <hr class="mt-1 mb-2">
        <p
          v-for="(info,index2) in versionInfo"
          :key="index2"
          class="mt-1 mb-0 px-1"
          v-html="info"
        />
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable vue/no-v-html */
export default {
  inject: ['nowPluginWidth'],
  data () {
    return {
      versionInfos: []
    }
  },
  computed: {
    Classes: function () {
      if (this.nowPluginWidth < 399) return 'px-0'
      else return 'px-5'
    }
  },
  mounted () {
    let info
    info = [
      '新增更新日誌。',
      '新增切換顯示佈局。(holotools)',
      '新增PTT聊天室開關。(holotools)'
    ]
    this.versionInfos.push(info)
    info = [
      '支援Holodex。',
      '新增標題搜尋功能。',
      '改善holotools嵌入方式，現在可以點全部暫停上面的P隱藏套件並讓出占用的空間。',
      '修正推文失敗會導致自動更新推文失效的問題。'
    ]
    this.versionInfos.push(info)
    info = [
      '新增贊助訊息，喜歡這個套件歡迎<a id="other-btn-donations" href="https://qr.opay.tw/eZHf2" class="ptt-text" target="_blank" rel="noopener noreferrer" role="button"><u>點我贊助</u></a>。',
      '套件現階段還是不打算加入廣告。',
      '新增黑名單功能。'
    ]
    this.versionInfos.push(info)
    info = [
      '推文的Youtube連結現在也會顯示預覽圖了。',
      '新增按鈕一鍵重啟PTT。',
      '修正換串時不會換新聊天串的問題。',
      '修正連續換串(第三次以上)會壞掉的問題。',
      '推文的AID現在可以直接點擊搜尋該串推文。'
    ]
    this.versionInfos.push(info)
    info = [
      '實況紀錄現在會自動抓到開台時間了。',
      '減少推文造成的卡頓問題。'
    ]
    this.versionInfos.push(info)
  }
}
</script>

<style lang="scss">
</style>
