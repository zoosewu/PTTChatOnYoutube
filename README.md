PTTChatOnYoutube - 在Youtube上顯示PTT推文
========================================
![GitHub license](https://img.shields.io/github/license/zoosewu/pttchatonyoutube)
[![Code style](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![GitHub package.json version](https://img.shields.io/github/package-json/v/zoosewu/pttchatonyoutube?style=plastic)

[![GitHub release (latest SemVer)](https://img.shields.io/github/v/release/zoosewu/pttchatonyoutube?sort=semver)](https://greasyfork.org/zh-TW/scripts/418469-pttchatonyoutube)
![GitHub Release Date](https://img.shields.io/github/release-date/zoosewu/pttchatonyoutube)
## 如何開始開發

在專案底下輸入 ```npm install``` 安裝開發環境，VSCode設定請開啟 ```"javascript.format.insertSpaceBeforeFunctionParenthesis": true```

推薦使用violentmonkey，並使用chrome開發，Firefox無法載入本地檔案

在專案底下輸入 ```npm run watch-dev```，每次腳本存檔都會自動更新腳本

在專案底下輸入 ```npm run watch-scss```，每次css存檔都會自動更新腳本

如果需要追蹤scss，可以使用 ```npm run watch-scss-map```就會生成帶map檔的css，但是限定http使用。

腳本更新依照下面步驟操作之後存檔完在violentmonkey設定那邊按一下更新就能測試


###### Chrome: 
管理擴充功能/套件->允許存取檔案位置打勾

在腳本更新網址輸入腳本路徑```file:///C:/.../publish/PTTChatOnYt.user.js```

###### Firefox: 
在專案底下輸入 ```npm run http```開啟本地伺服器

在腳本更新網址輸入伺服器腳本位置```http://127.0.0.1:8889/publish/PTTChatOnYt.user.js```

### Coding Style:

程式碼使用StandardJS及eslint-plugin-vue確保程式碼風格，並且會在commit之前做檢查，可以手動執行```npm run lint```確認有沒有錯誤及警告。

安裝eslint以在pre-commit前檢查```npm i -g eslint```

[![Standard - JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

###### VSCode
```設定請開啟 "javascript.format.insertSpaceBeforeFunctionParenthesis": true```

## 建議及回報

因為我本身是寫Unity C#，前後端都不太了解也不常碰js。

如果有任何建議或指教請歡迎討論或發PR。

## TODO List
#### App
- [ ] 彈幕版本

#### PTT
- [ ] 任務柱列功能

#### Script
- [ ] 透過vuex element資料傳輸 [vue教學](https://ithelp.ithome.com.tw/users/20107673/ironman/1470?page=1) [todolist範例](https://codepen.io/oddvalue/pen/dpBGpj) [todolist範例2](https://codepen.io/mkumaran/pen/vZgara?editors=1010)
- [ ] 根據網址撈實況開始時間[HoloStats](https://github.com/PoiScript/HoloStats/tree/master) [舊版api](https://holo.poi.cat/api/v3/streams_report?ids=skSmTEnAyGk&metrics=youtube_stream_viewer&start_at=0&end_at=0) [新版api](https://holo.poi.cat/api/v3/streams_report?ids=77OTDrqhN80&metrics=youtube_stream_viewer&start_at=0&end_at=0) [req測試](https://reqbin.com/)
- [ ] 測試[彩虹官網](https://niji-mado.web.app/home)的支援度，[彩虹的開台統計](https://2434analytics.com/rank/dailyView.html)

#### CSS 
- [ ] 確認套件在各網站的排版都正常且一樣

## 贊助

如果你覺得這個套件好用，歡迎[點我](https://qr.opay.tw/eZHf2)贊助或使用下方QR Code。

[![](https://payment.opay.tw/Upload/Broadcaster/2303549/QRcode/QRCode_C65AA1C8A89CB53AF4D93286E44468BF.png "贊助連結")](https://qr.opay.tw/eZHf2)

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
