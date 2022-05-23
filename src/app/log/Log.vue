<template>
  <div
    id="PTTChat-contents-log-main"
    class="flex-grow-1 overflow-auto h-100 w-100 mx-0 row"
    style="overscroll-behavior: contain;"
  >
    <table class="table ptt-bg">
      <tbody class="ptt-text">
        <log-item
          :item-title="'PTT狀態'"
          :item-type="'pttState'"
        />

        <log-title :title="'文章資訊'" />
        <log-item
          :item-title="'文章標題'"
          :item-type="'postTitle'"
          :item-col-span="3"
        />
        <log-item
          :item-title="'文章看板'"
          :item-type="'postBoard'"
          :second-item-title="'文章代碼'"
          :second-item-type="'postKey'"
        />
        <log-item
          :item-title="'推文數'"
          :item-type="'postCommentCount'"
          :second-item-title="'結尾行數'"
          :second-item-type="'postEndLine'"
        />
        <log-item
          :item-title="'發文時間'"
          :item-type="'postDate'"
          :item-col-span="3"
        />
        <log-item
          :item-title="'最後推文時間'"
          :item-type="'postLastCommentTime'"
          :item-col-span="3"
        />

        <log-title :title="'詳細資訊'" />
        <log-item
          :item-title="'影片類型'"
          :item-type="'videoType'"
          :second-item-title="'自動獲得推文'"
          :second-item-type="'isAutoGetComment'"
        />
        <log-item
          :item-title="'主題顏色'"
          :item-type="'themeColor'"
          :second-item-title="' '"
          :second-item-type="' '"
        />
        <log-item
          :item-title="'預估開台時間'"
          :item-type="'videoStartTime'"
          :item-col-span="3"
        />
        <log-item
          :item-title="'影片播放時間'"
          :item-type="'videoPlayedTime'"
          :item-col-span="3"
        />
        <log-item
          :item-title="'影片當下時間'"
          :item-type="'videoCurrentTime'"
          :item-col-span="3"
        />

        <log-title title="滾動狀態" />
        <log-item
          :item-title="'目標推文樓數'"
          :item-type="'commentIndex'"
          :second-item-title="'目標捲動高度'"
          :second-item-type="'targetScrollHeight'"
        />
        <log-title :title="'近期訊息'" />
      </tbody>
    </table>
  </div>
</template>

<script>
import LogItem from './LogItem.vue'
import LogTitle from './LogTitle.vue'
export default {
  components: {
    'log-item': LogItem,
    'log-title': LogTitle
  },
  inject: ['msg'],
  mounted () {
    this.msg.updateLog = (data) => {
      if (showAlertMsg) { console.log('updateLog', data) }
      this.$store.dispatch('updateLog', data)
    }
  }
}
</script>

<style lang="scss" scoped></style>
