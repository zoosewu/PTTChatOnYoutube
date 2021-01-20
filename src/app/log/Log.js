import LogItem from './LogItem.js';
import LogTitle from './LogTitle.js';
export let Log = {

  components: {
    "log-item": LogItem,
    "log-title": LogTitle,
  },
  template: `<div class="flex-grow-1 overflow-auto h-100 w-100 mx-0 row" id="PTTChat-contents-log-main" style="overscroll-behavior: contain;">
  <table class="table ptt-bg">
    <tbody class="ptt-text">
      <log-item item-title="PTT狀態" itemType="--pagestate"></log-item>
      
      <log-title title="文章資訊"></log-title>
      <log-item item-title="文章標題" item-type="postTitle" item-col-span="3"></log-item>
      <log-item item-title="文章看板" item-type="postBoard" second-item-title="文章代碼" second-item-type="postAID"></log-item>
      <log-item item-title="推文數" item-type="--postpushcount" second-item-title="結尾行數" second-item-type="postEndline"></log-item>
      <log-item item-title="發文時間" item-type="postDate" item-col-span="3"></log-item>
      <log-item item-title="最後推文時間" item-type="--postlastpushtime" item-col-span="3"></log-item>
      
      <log-title title="詳細資訊"></log-title>
      <log-item item-title="影片類型" item-type="--videotype" second-item-title="自動獲得推文" second-item-type="--isautogetpush"></log-item>
      <log-item item-title="主題顏色" item-type="--themecolor" second-item-title=" " second-item-type=""></log-item>
      <log-item item-title="預估開台時間" item-type="videoStartTime" item-col-span="3"></log-item>
      <log-item item-title="影片播放時間" item-type="videoPlayedTime" item-col-span="3"></log-item>
      <log-item item-title="影片當下時間" item-type="videoCurrentTime" item-col-span="3"></log-item>

      <log-title title="滾動狀態"></log-title>
      <log-item item-title="目標推文樓數" item-type="--pushindex" second-item-title="目標捲動高度" second-item-type="--targetscroll"></log-item>
      <log-item item-title="現在捲動高度" item-type="--nowscroll" second-item-title="上次捲動高度" second-item-type="--lastscroll"></log-item>

      <log-title title="近期訊息"></log-title>
    </tbody>
  </table>
</div>`,
}