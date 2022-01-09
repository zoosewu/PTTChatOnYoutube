/* eslint-disable */
function gotoend () {
  if (
    !PTTPost.searchingTitle.isend.insertP ||
    !PTTPost.searchingTitle.isend.insert$
  ) {
    if (!PTTPost.searchingTitle.isend.insertP) {
      insertText('P')
      PTTPost.searchingTitle.isend.insertP = true
    } else if (!PTTPost.searchingTitle.isend.insert$) {
      insertText('$')
      PTTPost.searchingTitle.isend.insert$ = true
    }
  } else insertText('G')
}

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */
export default function () {
  const res = { pass: true, callback: gotoend }
  if (this.pagestate === 2) {
    if (
      !PTTPost.searchingTitle.isend.insertP ||
      !PTTPost.searchingTitle.isend.insert$
    )
      res.pass = false
    else {
      const reg = /^(>|●).+(□|R:|轉)/
      const posttitle = this.match(reg)
      let title = ''
      if (posttitle) {
        PTTPost.haveNormalTitle = true
        if (ReportMode) console.log('==set haveNormalTitle true', posttitle)
        title = posttitle.input.replace(/\s+$/g, '').substr(30)
        if (title[0] === '□') title = title.substr(1)
      }
      if (title === '' || title === null) res.pass = false
      else PTTPost.searchingTitle.titlefetched = title
    }
  }
  return res
}
