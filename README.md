# PTTChatOnYoutube
在Youtube上面顯示PTT推文

## 如何開始開發

編輯腳本:
>1. 推薦使用violentmonkey，並使用chrome開發，Firefox無法載入本地檔案。
>2. 管理擴充功能/套件->允許存取檔案位置打勾
>3. 新建腳本並將開頭註解的\=\=UserScript\=\=部分貼進去
>4. 將@require file://E:\\*\Main.user.js 路徑改成你的檔案位置
>5. 用你習慣的IDE打開腳本並修改Main.user.js腳本

所有的腳本最終都會合併到Main.user.js發佈，發佈前會設置正確的版號並刪除開發用的```@require file://E:\\*\Main.user.js```

PTTConnect部分可以單獨在term.ptt.cc測試

min檔為VScode插件Minify自動生成，以避免.js太冗長

預覽腳本效果:
>1. 儲存檔案
>2. 儲存violentmonkey腳本(沒有作任何更動也要儲存，否則會讀取瀏覽器內的快取不會重新載入腳本)
>3. 重新整理網頁，violentmonkey會讀取完標頭後載入本地檔案。

## 建議及回報

因為我本身是寫Unity、C#，前後端都不太了解也不常碰js。如果有任何建議或指教請歡迎提供討論。

## TODO List
#### Holotools
- [ ] 新增對Holotools的支援

#### Youtube
- [ ] 修正自動滾動功能有時候會失敗的問題
- [ ] 修正自動滾在第一則推文或最後一則推文有可能會怪怪的問題
- [ ] 彈幕版本

#### PTT
- [ ] 將更詳細的PTT目前狀態做判定及記錄，避免腳本操作意外出錯
- [ ] 推文功能
- [ ] 任務柱列功能
- [ ] 修正PTT有時候會爆炸沒處理到的問題
- [ ] 修正實況模式中，自動更新推文有時候會跑到別的文章去導致失敗的問題

#### Script
- [ ] 導入nodejs 
- [ ] 導入userscript-builder 
- [ ] 根據userscript-builder 將腳本根據功能拆分 方便功能檢視以及多工協作
- [ ] 將程式重構，把變數跟函式拆分得更乾淨
- [ ] 導入bootstrap 客製化css參數

目前暫時不接受任何的PR，

在未來導入userscript-builder將功能拆分之後非常歡迎貢獻code