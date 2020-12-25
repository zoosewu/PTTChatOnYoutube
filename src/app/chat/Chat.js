import ChatTimeSetting from './ChatTimeSetting.js';

export let Chat = {
  template: `<!-------- 開台時間 -------->
  <div id="PTTChat-Time" class="ptttext pttbg p-2 position-absolute w-100 d-none" style="z-index:400;">
    <ChatTimeSetting></ChatTimeSetting>
  </div>
  <!-------- 聊天室 -------->
  <div class="flex-grow-1 overflow-auto mh-100 row" id="PTTChat-contents-Chat-main" style="overscroll-behavior: contain;">
    <ul id="PTTChat-contents-Chat-pushes" class="col mb-0"> </ul>
    <div id="PTTChat-contents-Chat-btn" class="position-absolute d-none"
      style="z-index:400; bottom:5%; left: 50%; -ms-transform: translateX(-50%); transform: translateX(-50%);">
      <button id="AutoScroll" class="btn btn-primary" type="button">自動滾動</button>
    </div>
  </div>`,
  components: {
    "ChatTimeSetting": ChatTimeSetting
  }
}