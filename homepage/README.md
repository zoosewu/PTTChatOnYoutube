# Youtube聊天室顯示PTT推文

在Youtube的聊天室上面載入PTT推文。

實況紀錄設定好開台時間會自動計算影片當下的推文，重現影片播放當時討論串的討論狀況。

實況的話會定時載入新推文，並自動滾動到最下面。

![](https://raw.githubusercontent.com/zoosewu/PTTChatOnYoutube/master/images/samplemain.png "預覽圖")

## 如何開始使用

推薦使用violentmonkey腳本載入器，這是在chrome、firefox皆可使用的腳本載入程式。使用Tampermonkey及Greasymonkey不保證能正常運作。

腳本下載點請[點我](https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt)。

1.下載腳本後打開實況或實況紀錄，聊天室左上角會有一個P的按鈕，點開就能打開介面。

2.實況紀錄:請先設定開台時間，腳本會自動預設為發文之後才開台，所以實況18:00開台而討論串在18:04發文的話請另外勾選發文前已開台。
實況:請直接跳過此步驟。

3.輸入PTT帳號與密碼後登入
目前尚未廣泛測試，請大家第一次用的時候輸入錯的帳號密碼測試一下google會不會跳你的帳號被盜用，
如果有的話請回報給我。

4.輸入包含看板名稱的完整文章代碼。
(文章完整代碼獲得方法:在文章標題或文章內部鍵入大寫Q即可顯示複製)

4.文章讀取完成後會自動轉跳到聊天室介面，並且
實況紀錄:會自動計算並捲動到影片時間當下的推文。
實況:會自動每2.5秒重新載入一次推文，並直接捲動到最新推文。

如果離開網頁時有個視窗一閃而過，那是term.ptt.cc在登入後關閉視窗的警告動作，是正常現象。

想查看詳細的腳本介紹請[點我](https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage)。

想查看完整程式碼或是想要自己下載腳本測試修改請[點我](https://github.com/zoosewu/PTTChatOnYoutube/tree/master)。

有任何建議或是問題都可以[點我](https://github.com/zoosewu/PTTChatOnYoutube/issues)進入github issue回報，方便我追蹤進度。

如果你沒有github帳號，也可以依照[問題回報範例](https://github.com/zoosewu/PTTChatOnYoutube/blob/master/.github/ISSUE_TEMPLATE/bug-report.md)及[建議範例](https://github.com/zoosewu/PTTChatOnYoutube/blob/master/.github/ISSUE_TEMPLATE/feature-request.md)在PTT內私信給我(Zoosewu)。

## 腳本功能
全部都在前端計算，用你的瀏覽器撈資料再顯示出來。

紀錄重播功能
* 在Youtube實況紀錄顯示PTT推文。
* 設定好實況開台時間後會推算影片當下時間並重現影片播放當時討論串的討論狀況。

實況功能
* 在Youtube實況顯示PTT推文。
* 定時更新文章最新推文。

## 其他注意事項

**term.ptt.cc使用者注意須知**

    如果你是透過瀏覽器使用PTT，並且有安裝其他PTT的輔助腳本例如自動登入/自動跳過畫面的話，
    請在腳本最前面加上以下兩行程式碼，這是讓PTT如果不是在主視窗而是網頁內的元素時腳本就自動失效。
```js
let isTopframe = (window.top == window.self);
if (!isTopframe) throw "[Script Stopped: This script should run in top frame only.]";
```
新增完之後應該長這樣：
![在PTT腳本附加額外程式碼的正確位置](https://raw.githubusercontent.com/zoosewu/PTTChatOnYoutube/master/images/addscript.png "腳本間加程式碼示意圖")

**有時候P的按鈕沒有冒出來給我用**

    如果你是從youtube首頁或建議影片點進影片因為沒有重新載入頁面所以不會啟動。
    只要重新整理就能恢復正常了。

**如果出現奇怪的現象或是你想了解腳本實際運作的情況**

~~可以進入腳本說明欄並點開除錯模式，會顯示更完整的PTT畫面，更多插件資訊，以及測試用的假文章載入。~~

    插件測試版，所有測試功能都啟用以方便回報。

**我的瀏覽器說我的帳號被盜了**

    因為腳本本身是把你的帳號密碼傳給背景執行的PTT去登入，讀取帳號密碼欄位傳出去的行為有時候會被判定為盜帳號，

    剛開始開發的時候瀏覽器也一直說我被盜，但是開發到後面Google就沒有說了，**我完全不知道為什麼**，我當時害怕極了。

    本插件並且沒有架設任何伺服器去撈取資料，僅是單純的在你的前端開一個PTT幫你登入。

    並且所有程式碼都沒有做任何的壓縮或混淆，在greasyfork、github以及你的瀏覽器都可以查看完整的程式碼以供任何人檢視，

    如果對此插件還有疑慮的話請勿使用。

**影片沒有顯示聊天室 請問怎麼打開介面**

    目前只支援有聊天室的實況或實況紀錄 未來可能會支援沒有顯示聊天室的影片

**我直接用PTT畫面登入之後 它卻說我還沒登入**

    請避免手動操作PTT畫面裡的PTT以免造成爬蟲壞掉

**插件一直說PTT無回應**

    晚上為PTT使用尖峰時段，負載過大時PTT會不給連線，只能稍微等一下再重新嘗試。

**可以直接用插件推文嗎**

    未來會實作。

**插件的自動滾動有時候會壞掉**

    請到github issue回報給我，並詳述什麼情況下會壞掉，壞掉前最後一次滾動的樣子有沒有異常。

**載入聊天室之後整個網頁都很lag**

    請到github issue回報給我。

**我有其他疑問想問但是這邊沒有寫**

    請回報給我，或在PTT原串下面推文回應。

## 腳本預覽圖

![](https://raw.githubusercontent.com/zoosewu/PTTChatOnYoutube/master/images/sample1.png "關閉預覽圖")
![](https://raw.githubusercontent.com/zoosewu/PTTChatOnYoutube/master/images/sample2.png "預覽圖1")
![](https://raw.githubusercontent.com/zoosewu/PTTChatOnYoutube/master/images/sample3.png "預覽圖2")
![](https://raw.githubusercontent.com/zoosewu/PTTChatOnYoutube/master/images/sample4.png "預覽圖3")

## 聲明

本插件僅做PTT與Youtube的連線，除此之外並不會連到任何伺服器，所以不會蒐集任何關於你的資訊，當然也無法做資訊統整、幫你找今天討論串等方便的功能。

所有程式碼都沒有做任何的壓縮或混淆，在greasyfork、github以及你的瀏覽器都可以查看完整的程式碼以供任何人檢視，

請確保瀏覽實況或紀錄檔時，沒有任何其他PTT的腳本同時啟用。如果有的話請參閱完整網站說明並跟著操作。

本插件盡可能保證插件在操作PTT時的安全性，並盡可能避免帳號資訊在傳輸過程中被第三方所竊取。

任何使用插件的人士，須自行承擔一切風險，本人不會負責任何因使用此插件所造成的任何形式的損失。

使用本插件所造成任何形式的帳號損害，包含但不限於帳號遭到竊取、推文而招致水桶或帳號註銷，本人一概不負責。