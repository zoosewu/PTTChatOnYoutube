# PTTChatOnYoutube
在Youtube上面顯示PTT推文

## 如何開始使用

推薦使用violentmonkey，無論chrome、firefox皆可使用，Tampermonkey及Greasymonkey不保證能正常運作。

腳本下載點請[點我](https://greasyfork.org/zh-TW)。

如果離開網頁時有個視窗一閃而過，那是term.ptt.cc在登入後關閉視窗的警告動作，是正常現象。

如果出現奇怪的現象，可以進入腳本找到```const devmode = false;```改成```const devmode = true;```會顯示更完整的資訊，包含PTT畫面。

如果你也想參與專案或是想查看我的程式碼請[點我](https://greasyfork.org/zh-TW)。

## 腳本功能
全部都在前端計算，用你的瀏覽器撈資料再顯示出來。

紀錄重播功能
* 在Youtube影片顯示PTT推文。
* 正確設定實況開始時間後會根據時間自動滾動當時的推文。

實況功能
* 在Youtube實況顯示PTT推文
* 即時更新文章最新推文。




## 特別注意
請盡量避免其他violentmonkey腳本在Youtube上面運作，如果爆炸了我不知道怎麼修。

如果你是透過瀏覽器使用PTT，並且有安裝PTT的輔助腳本，請在腳本最前面加上以下幾行程式碼。
```
let isTopframe = (window.top == window.self);
if (!isTopframe) throw new Error("script stopped:Not Top Frame");
```
![在PTT腳本附加額外程式碼的正確位置](https://i.imgur.com/DHwFxSY.png "腳本間加程式碼示意圖")

目前只支援有聊天室的實況或紀錄，未來考慮加入沒有顯示聊天室的影片

## 腳本預覽圖

![](https://i.imgur.com/xxYMYZ4.png "關閉預覽圖")
![](https://i.imgur.com/sM6GtWz.png "預覽圖1")
![](https://i.imgur.com/UwDHu7i.png "預覽圖2")
![](https://i.imgur.com/Xn87juc.png "預覽圖3")