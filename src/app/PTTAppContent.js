import Chat from './chat/Chat.js'
import Connect from './connect/Connect.js'
import ConnectAlert from './connect/ConnectAlert.js'
import Other from './other/Other.js'
import PTTScreen from './ptt/PTTScreen.js'
import Log from './log/Log.js'

export const PTTAppContent = {
  components: {
    'PTTApp-Chat': Chat,
    'PTTApp-Alert': ConnectAlert,
    'PTTApp-Connect': Connect,
    'PTTApp-Other': Other,
    'PTTApp-PTT': PTTScreen,
    'PTTApp-Log': Log
  },
  computed: {
    updateheight () {
      return {
        height: this.$store.getters.getPluginHeight + 'px',
        overflow: 'hidden overlay'
      }
    }
  },
  template: `<div id="PTTChat-contents" class="tab-content ptt-text" v-bind:style="updateheight">
  <!-------- 聊天室 -------->
  <div class="tab-pane h-100 w-100 mx-0 position-relative fade" id="PTTChat-contents-Chat" role="tabpanel"
    aria-labelledby="nav-item-Chat">
    <PTTApp-Chat></PTTApp-Chat>
  </div>
  <!-------- 連線設定 -------->
  <div class="tab-pane h-100 w-100 mx-0 row fade show active" id="PTTChat-contents-Connect" role="tabpanel"
    aria-labelledby="nav-item-Connect">
    <PTTApp-Connect></PTTApp-Connect>
    <PTTApp-Alert></PTTApp-Alert>
  </div>
  <!-------- 其他 -------->
  <div class="tab-pane h-100 w-100 mx-0 bg-transparent overflow-auto row fade" id="PTTChat-contents-other" role="tabpanel"
    aria-labelledby="nav-item-other">
    <PTTApp-Other></PTTApp-Other>
  </div>
  <!-------- PTT畫面 -------->
  <div class="tab-pane h-100 row fade" id="PTTChat-contents-PTT" role="tabpanel" aria-labelledby="nav-item-PTT">
    <PTTApp-PTT></PTTApp-PTT>
  </div>
  <!-------- Log -------->
  <div class="tab-pane h-100 w-100 mx-0 fade" id="PTTChat-contents-log" role="tabpanel" aria-labelledby="nav-item-log"
    style="overscroll-behavior: contain;">
    <PTTApp-Log></PTTApp-Log>
  </div>
</div>`
}
