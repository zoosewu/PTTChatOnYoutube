
// cryptkey
export function GenerateCryptKey () {
  const c = makeid(20 + Math.random() * 10)
  GM_setValue('cryptkey', c)
  return c

  function makeid (length) {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}

// 左邊補0 右邊補0
export function paddingLeft (str, lenght) {
  str = str + ''
  if (str.length >= lenght) { return str } else { return paddingLeft('0' + str, lenght) }
}
export function paddingRight (str, lenght) {
  str = str + ''
  if (str.length >= lenght) { return str } else { return paddingRight(str + '0', lenght) }
}
// JSON轉換用
export function dateReviver (key, value) {
  if (typeof value === 'string') {
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value)
    if (a) {
      return new Date(+a[1], +a[2] - 1, +a[3], +a[4] + 8, +a[5], +a[6])
    }
  }
  return value
}

// 对象深复制，不考虑循环引用的情况
function cloneObj (from) {
  /* eslint-disable no-sequences */
  // eslint-disable-next-line no-return-assign
  return Object.keys(from).reduce((obj, key) => (obj[key] = clone(from[key]), obj), {})
  /* eslint-enable no-sequences */
}

// 数组深复制，不考虑循环引用的情况
function cloneArr (from) {
  return from.map((n) => clone(n))
}

// 复制输入值
export function clone (from) {
  if (from instanceof Array) {
    return cloneArr(from)
  } else if (from instanceof Object) {
    return cloneObj(from)
  } else {
    return (from)
  }
}

export function ThemeCheck (CSSSelector, WhiteThemeColor) {
  const element = document.querySelector(CSSSelector)
  // console.log("ThemeCheck element", element);
  const bgcolor = getComputedStyle(element).backgroundColor
  // console.log("ThemeCheck bgcolor", bgcolor);
  console.log("Theme color check: website bgcolor is '" + bgcolor + "', WhiteThemeColor is '" + WhiteThemeColor + "', whitetheme =", bgcolor.indexOf(WhiteThemeColor) >= 0)
  return bgcolor.indexOf(WhiteThemeColor) >= 0
}
