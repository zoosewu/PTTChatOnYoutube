# PTTChatOnYoutube
在Youtube上面顯示PTT推文
![](https://i.imgur.com/l3GfItu.png "預覽圖")
## 如何開始使用

推薦使用violentmonkey這是在chrome、firefox皆可使用的第三方插件掛載程式。使用Tampermonkey及Greasymonkey不保證能正常運作。

腳本下載點請[點我](https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt)。

下載後打開實況聊天室左上角會有一個P的按鈕，點開就能打開介面

輸入PTT帳號與密碼後登入，登入後輸入包含看板名稱的完整文章代碼
(文章完整代碼獲得方法:在文章標題或文章內部鍵入大寫Q即可顯示複製)

如果是實況紀錄的話輸入實況開始時間可以自動連結影片時間跟推聞時間

如果離開網頁時有個視窗一閃而過，那是term.ptt.cc在登入後關閉視窗的警告動作，是正常現象。

如果你想查看詳細的腳本介紹請[點我](https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage)。

如果你想查看完整程式碼或是想要自己下載腳本測試修改請[點我](https://github.com/zoosewu/PTTChatOnYoutube/tree/master)。

## 腳本功能
全部都在前端計算，用你的瀏覽器撈資料再顯示出來。

紀錄重播功能
* 在Youtube影片顯示PTT推文。
* 正確設定實況開始時間後會根據時間自動滾動當時的推文。

實況功能
* 在Youtube實況顯示PTT推文
* 即時更新文章最新推文。

## 其他注意事項
**請盡量避免其他violentmonkey腳本在Youtube上面運作，以避免衝突。**

**term.ptt.cc使用者注意須知**

如果你是透過瀏覽器使用PTT，並且有安裝其他PTT的輔助腳本例如自動登入/自動跳過畫面的話，請在腳本最前面加上以下幾行程式碼。
這是讓PTT不是主視窗而是背景執行時腳本就自動失效。
```
let isTopframe = (window.top == window.self);
if (!isTopframe) throw new Error("script stopped:Not Top Frame");
```
新增完之後應該長這樣：
![在PTT腳本附加額外程式碼的正確位置](https://i.imgur.com/DHwFxSY.png "腳本間加程式碼示意圖")

**本程式僅會在載入全新的youtube影片頁面的情況下會運作**

如果是從youtube首頁點進影片因為沒有重新載入頁面所以不會啟動。

**目前只支援有聊天室的實況或實況紀錄，暫時不支援沒有顯示聊天室的影片。**

**如果出現奇怪的現象或是你想了解腳本實際運作的情況**

可以進入腳本找到```const devmode = false;```改成```const devmode = true;```，會顯示更完整的資訊，更多除錯的功能，包含背景執行的PTT畫面。

**我的瀏覽器說我的帳號被盜了**

因為腳本本身是把你的帳號密碼傳給背景執行的PTT去登入，讀取帳號密碼欄位傳出去的行為有時候會被判定為盜帳號，

剛開始開發的時候瀏覽器也一直說我被盜，但是後面就沒有說了，**我完全不知道為什麼**。

本插件並且沒有架設任何伺服器去撈取資料，僅是單純的在你的前端開一個PTT幫你登入。

並且所有程式碼都沒有做任何的壓縮或混淆，在greasyfork、github以及你的瀏覽器都可以查看完整的程式碼以供任何人檢視，

如果對此插件還有疑慮的話請勿使用。



## 腳本預覽圖

![](https://i.imgur.com/xxYMYZ4.png "關閉預覽圖")
![](https://i.imgur.com/sM6GtWz.png "預覽圖1")
![](https://i.imgur.com/UwDHu7i.png "預覽圖2")
![](https://i.imgur.com/Xn87juc.png "預覽圖3")