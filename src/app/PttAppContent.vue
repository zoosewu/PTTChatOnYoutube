<template>
  <div
    id="PTTChat-contents"
    class="tab-content ptt-text h-100"
  >
    <!-------- 聊天室 -------->
    <div
      id="PTTChat-contents-Chat"
      class="tab-pane h-100 w-100 mx-0 position-relative fade"
      role="tabpanel"
      aria-labelledby="nav-item-Chat"
    >
      <PTTApp-Chat />
    </div>
    <!-------- 連線設定 -------->
    <div
      id="PTTChat-contents-Connect"
      class="tab-pane h-100 w-100 mx-0 row fade show active"
      role="tabpanel"
      aria-labelledby="nav-item-Connect"
    >
      <PTTApp-Connect />
      <PTTApp-Alert />
    </div>
    <!-------- 其他 -------->
    <div
      id="PTTChat-contents-other"
      class="tab-pane h-100 w-100 mx-0 bg-transparent overflow-auto row fade"
      role="tabpanel"
      aria-labelledby="nav-item-other"
    >
      <PTTApp-Other />
    </div>
    <!-------- PTT畫面 -------->
    <div
      id="PTTChat-contents-PTT"
      class="tab-pane h-100 row fade"
      role="tabpanel"
      aria-labelledby="nav-item-PTT"
    >
      <PTTApp-PTT />
    </div>
    <!-------- Log -------->
    <div
      id="PTTChat-contents-log"
      class="tab-pane h-100 w-100 mx-0 fade"
      role="tabpanel"
      aria-labelledby="nav-item-log"
      style="overscroll-behavior: contain;"
    >
      <PTTApp-Log />
    </div>
  </div>
</template>

<script>
import Chat from './chat/Chat'
import Connect from './connect/Connect.vue'
import ConnectAlert from './connect/ConnectAlert.vue'
import Other from './other/Other.vue'
import PTTScreen from './ptt/PttScreen.vue'
import Log from './log/Log.vue'

export default {
  components: {
    'PTTApp-Chat': Chat,
    'PTTApp-Alert': ConnectAlert,
    'PTTApp-Connect': Connect,
    'PTTApp-Other': Other,
    'PTTApp-PTT': PTTScreen,
    'PTTApp-Log': Log
  }
}
</script>

<style lang="scss" scoped>
#PTTChat-contents{
  overflow:hidden auto;
}
</style>
