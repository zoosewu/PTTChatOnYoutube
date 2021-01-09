
//add global style
export function AddStyle(css) {
  const style = document.createElement('style');
  if (style.styleSheet) {
    ///好像都沒用到
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
  $('head')[0].appendChild(style);
}

//cryptkey
export function GenerateCryptKey() {
  let c = makeid(20 + Math.random() * 10);
  GM_setValue("cryptkey", c);
  return c;

  function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}

//左邊補0 右邊補0
export function paddingLeft(str, lenght) {
  str = str + "";
  if (str.length >= lenght)
    return str;
  else
    return paddingLeft("0" + str, lenght);
}
export function paddingRight(str, lenght) {
  str = str + "";
  if (str.length >= lenght)
    return str;
  else
    return paddingRight(str + "0", lenght);
}
//JSON轉換用
export function dateReviver(key, value) {
  if (typeof value === 'string') {
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
    if (a) {
      return new Date(+a[1], +a[2] - 1, +a[3], +a[4] + 8, +a[5], +a[6]);
    }
  }
  return value;
};

//对象深复制，不考虑循环引用的情况
function cloneObj(from) {
  return Object.keys(from).reduce((obj, key) => (obj[key] = clone(from[key]), obj), {});
}
//数组深复制，不考虑循环引用的情况
function cloneArr(from) {
  return from.map((n) => clone(n));
}
// 复制输入值
function clone(from) {
  if (from instanceof Array) {
    return cloneArr(from);
  } else if (from instanceof Object) {
    return cloneObj(from);
  } else {
    return (from);
  }
}