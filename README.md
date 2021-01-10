# PTTChatOnYoutube
在Youtube上面顯示PTT推文

## 如何開始開發

推薦使用violentmonkey，並使用chrome開發，Firefox無法載入本地檔案
在專案底下輸入 ```npm run watch-dev```，每次腳本存當都會自動更新腳本
在專案底下輸入 ```npm run watch-scss-map```，每次CSS存當都會自動更新腳本

###### Chrome更新腳本: 
管理擴充功能/套件->允許存取檔案位置打勾
在腳本更新網址輸入腳本路徑```file:///C:/.../public/PTTChatOnYt.user.js```

###### Firefox更新腳本: 
在專案底下輸入 ```npm run http```開啟本地伺服器
在腳本更新網址輸入伺服器腳本位置```http://127.0.0.1:8889/public/PTTChatOnYt.user.js```

設定好之後存檔完在violentmonkey設定那邊按一下更新就能測試

## 建議及回報

因為我本身是寫Unity C#，前後端都不太了解也不常碰js。

如果有任何建議或指教請歡迎討論或發PR。

## TODO List
#### App
- [ ] 修正自動滾動功能有時候會失敗的問題
- [ ] 彈幕版本
- [ ] 修正實況紀錄效能很差的問題，目前猜測是vue的監視功能__ob__導致

#### PTT
- [ ] 任務柱列功能

#### Script
- [ ] 把舊的功能搬到新的vue物件上面
- [ ] 透過vuex element資料傳輸 [vue教學](https://ithelp.ithome.com.tw/users/20107673/ironman/1470?page=1) [todolist範例](https://codepen.io/oddvalue/pen/dpBGpj) [todolist範例2](https://codepen.io/mkumaran/pen/vZgara?editors=1010)
- [ ] 根據網址撈實況開始時間[HoloStats](https://github.com/PoiScript/HoloStats/tree/master) [舊版api](https://holo.poi.cat/api/v3/streams_report?ids=skSmTEnAyGk&metrics=youtube_stream_viewer&start_at=0&end_at=0) [新版api](https://holo.poi.cat/api/v3/streams_report?ids=77OTDrqhN80&metrics=youtube_stream_viewer&start_at=0&end_at=0) [req測試](https://reqbin.com/)
- [ ] 測試[彩虹官網](https://niji-mado.web.app/home)的支援度，[彩虹的開台統計](https://2434analytics.com/rank/dailyView.html)

#### CSS 
- [ ] 確認插件在各網站的排版都正常且一樣

## 本專案授權

MIT License
Copyright (c) 2020-2021 zoosewu

## 使用的開源程式碼授權
[term.ptt.cc 自動登入](https://openuserjs.org/scripts/maple3142/term.ptt.cc_%E8%87%AA%E5%8B%95%E7%99%BB%E5%85%A5)
```
author       maple3142
namespace    https://blog.maple3142.net/
license      MIT
```
[enable-vue-devtools](https://github.com/52cik/enable-vue-devtools)
```
author       楼教主
MIT License
Copyright (c) 2019 楼教主
```