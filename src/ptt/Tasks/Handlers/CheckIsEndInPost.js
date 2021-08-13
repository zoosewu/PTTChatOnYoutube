/* eslint-disable */
function gotonextpage () { insertText(' ') }
function PostPercentCheck () {
  const res = { pass: false, callback: gotonextpage }
  if ((PTT.pagestate === 3 || PTT.pagestate === 4) && PTT.screenHaveText(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/) !== null) {
    res.pass = true
  } else if (PTT.pagestate === 1) console.log('==PostPercentCheck error, PTT.pagestate == 1.')
  else if (PTT.pagestate === 2) console.log('==PostPercentCheck error, PTT.pagestate == 2.')
  return res
}