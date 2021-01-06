export let PTTAppNav = {
  mounted() {
    this.$store.dispatch('chatBtn', this.$refs.chatbtn);
  },
  template: `<ul id="PTTChat-navbar" class="nav nav-tabs justify-content-center" role="tablist">
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-Chat" data-toggle="tab" href="#PTTChat-contents-Chat"
      role="tab" aria-controls="PTTChat-contents-Chat" aria-selected="false" ref="chatbtn">聊天室</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent active" id="nav-item-Connect" data-toggle="tab"
      href="#PTTChat-contents-Connect" role="tab" aria-controls="PTTChat-contents-Connect" aria-selected="true">連線設定</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-other" data-toggle="tab" href="#PTTChat-contents-other"
      role="tab" aria-controls="PTTChat-contents-other" aria-selected="false">說明</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-PTT" data-toggle="tab" href="#PTTChat-contents-PTT"
      role="tab" aria-controls="PTTChat-contents-PTT" aria-selected="false">PTT畫面</a>
  </li>
  <li class="nav-item">
    <a class="nav-link ptt-text bg-transparent" id="nav-item-log" data-toggle="tab" href="#PTTChat-contents-log"
      role="tab" aria-controls="PTTChat-contents-log" aria-selected="false">log</a>
  </li>
  <li class="nav-item">
    <button class="nav-link ptt-text bg-transparent d-none" id="nav-item-TimeSet" type="button" data-toggle="collapse"
      data-target="#PTTChat-Time" aria-controls="PTTChat-Time" aria-expanded="false">時間</a>
  </li>
</ul>`,
}