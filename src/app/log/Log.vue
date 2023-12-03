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
          :item-title="'搜尋代碼'"
          :item-type="'postKey'"
          :item-col-span="3"
        />
        <log-item
          :item-title="'已獲取推文數'"
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

        <log-title :title="'影片資訊'" />
        <log-item
          :item-title="'影片類型'"
          :item-type="'videoType'"
          :second-item-title="''"
          :second-item-type="''"
        />
        <log-item
          :item-title="'開台時間'"
          :item-type="'videoStartTime'"
          :item-col-span="3"
        />
        <log-item
          :item-title="'關台時間'"
          :item-type="'videoEndTime'"
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
        <log-title title="套件狀態" />
        <log-item
          :item-title="'主題顏色'"
          :item-type="'themeColor'"
          :second-item-title="' '"
          :second-item-type="' '"
        />
        <log-item
          :item-title="'目標推文樓數'"
          :item-type="'commentIndex'"
          :second-item-title="'目標捲動高度'"
          :second-item-type="'targetScrollHeight'"
        />
      </tbody>
      <log-recent-alert />
    </table>
  </div>
</template>

<script>
import LogItem from './LogItem.vue'
import LogTitle from './LogTitle.vue'
import LogRecentAlert from './LogRecentAlert'
export default {
  components: {
    'log-item': LogItem,
    'log-title': LogTitle,
    'log-recent-alert': LogRecentAlert
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
