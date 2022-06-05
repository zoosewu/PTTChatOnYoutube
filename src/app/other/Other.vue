<template>
  <div
    id="PTTChat-contents-other-main"
    :class="Classes"
  >
    <other-title :title="'使用教學'" />
    <pre class="mt-1 mb-0 ml-5">
1.輸入帳號與密碼登入PTT
2.輸入包含看板名稱的AID或是搜尋功能找到想要的文章
3.最近的搜尋紀錄都會記錄在下拉式選單
  點選鎖頭可以將蒐尋紀錄永久保存
    </pre>
    <other-title :title="'文章搜尋功能'" />
    <pre class="mt-1 mb-0 ml-5">
搜尋規則為[看板名稱,搜尋指令+關鍵字,搜尋指令+關鍵字]
範例:C_Chat,/間直播,Z5
在C_Chat板搜尋標題含有"間直播"
且推文數5以上最新的一篇文章

最多可以搜尋兩次, 可以搜尋的種類有:
#:AID搜尋    /或?:標題搜尋 a:作者搜尋
Z:推文數搜尋  G:標記搜尋   A:稿酬搜尋
!:排除關鍵字(僅限第二次搜尋時使用)
    </pre>

    <other-title :title="'相關連結'" />
    <div class="text-center">
      <other-button
        :id="'home'"
        :href="'https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage'"
        :title="'腳本介紹'"
      />
      <other-button
        :id="'github'"
        :href="'https://github.com/zoosewu/PTTChatOnYoutube/tree/master'"
        :title="'Github'"
      />
      <other-button
        :id="'greasyfork'"
        :href="'https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt'"
        :title="'GreasyFork'"
      />
      <other-button
        :id="'donate'"
        :href="'https://qr.opay.tw/eZHf2'"
        :title="'贊助'"
      />
    </div>
    <other-title :title="'聲明'" />
    <pre class="text-center mt-1 mb-0">
本套件僅做PTT與Google的連線
除此之外並不會連到任何伺服器

所有程式碼都沒有做任何的壓縮或混淆
在greasyfork、github以及你的瀏覽器
都有完整的程式碼以供任何人檢視
請確保瀏覽實況或紀錄檔時
沒有任何其他PTT的腳本同時啟用
如果有的話請參閱完整網站說明並跟著操作

本套件盡可能保證套件在操作PTT時的安全性
並盡可能避免帳號資訊在傳輸過程中被第三方所竊取

任何使用套件的人士 須自行承擔一切風險
本人不會負責任何因使用此套件所造成的任何形式的損失

使用本套件所造成任何形式的帳號損害
包含但不限於帳號遭到竊取、推文而招致水桶或帳號註銷
本人一概不負責
Zoosewu
    </pre>
  </div>
</template>

<script>
import OtherTitle from './OtherTitle'
import OtherButton from './OtherButton'
export default {
  components: {
    'other-title': OtherTitle,
    'other-button': OtherButton
  },
  inject: ['nowPluginWidth'],
  computed: {
    Classes: function () {
      const classes = ['container']
      if (this.nowPluginWidth < 399) { classes.push('px-0') } else { classes.push('px-5') }
      return classes.join(' ')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
