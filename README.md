# PTTChatOnYoutube
在Youtube上面顯示PTT推文

## 如何開始開發
編輯腳本:
>1. 推薦使用violentmonkey，無論chrome、firefox皆可使用
>2. 管理擴充功能/套件->允許存取檔案位置打勾
>3. 新建腳本並將\=\=UserScript\=\=的部分貼進去
>4. 將@require file://E:\\*\Main.user.js 路徑改成你的檔案位置
>5. 用你習慣的IDE打開腳本並修改腳本

PTTConnect部分可以單獨在term.ptt.cc測試
min檔為VScode插件Minify自動生成，以避免.js太冗長

預覽腳本效果:
>1. 儲存檔案
>2. 儲存violentmonkey腳本(沒有作任何更動也要儲存)
>3. 重新整理網頁，你的修改應該會產生效果。

## TODO List
#### Youtube
- [ ] 自動滾動功能有時候會失敗
- [ ] 自動滾在第一則推紋或最後一則推文有可能會怪怪的

#### PTT
- [ ] 推文功能
- [ ] 任務柱列功能
- [ ] PTT有時候會爆炸 確保爆炸的時候可以重啟

####Script
- [ ] 將主腳本、Youtube腳本及PTT腳本拆成三部分然後動態連結在一起
- [ ] 新版檢測
- [ ] 更簡單易用的log功能，需有無log、使用者回報用log、開發用log、全顯示log
- [ ] 尋找更好的資料傳輸方式