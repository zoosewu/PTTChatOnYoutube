// ==UserScript==
// @name         Enable Vue.js devtools
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  强制启用 Vue.js devtools 开发者工具
// @author       楼教主,zoosewu
// @match        *://*/*
// @run-at       document-end
// @grant        none
// ==/UserScript==
const isTopframe = (window.top === window.self)
// eslint-disable-next-line no-throw-literal
if (!isTopframe) throw '[Script Stopped: Vue.js devtools should run in top frame only.]'

const showlog = true
let isActivated = false

const getConstructor = el => {
  const vm = (el || 0).__vue__
  if (vm) {
    return vm.constructor.super ? vm.constructor.super : vm.constructor
  }
}

const getVue = () => {
  let Vue = window.Vue

  if (!Vue) {
    const tmpVue = getConstructor(document.getElementById('app'))
    if (tmpVue && tmpVue.config) Vue = tmpVue
    if (showlog && Vue) console.log('get Vue by app', Vue)
  }

  if (!Vue) {
    // 遍历 dom 读取可能的 vue 实例
    const tmpVue = getConstructor([...document.body.querySelectorAll('div')].find(el => el.__vue__))
    if (tmpVue && tmpVue.config) Vue = tmpVue
    if (showlog && Vue) console.log('get Vue by __vue__', Vue)
  }
  return Vue
}
function enableDevtools () {
  if (isActivated) {
    // console.log("isActivated");
    return
  }

  const Vue = getVue()

  if (!Vue) {
    if (showlog) console.log('No Vue instance.')
    setTimeout(enableDevtools, 2000)
    return
  }

  console.log({ Vue })
  Vue.config.devtools = true
  window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', Vue)
  isActivated = true
  if (showlog) console.log('Hook devtool!', [Vue])
};

(function () {
  if (!window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    if (showlog) console.log('no __VUE_DEVTOOLS_GLOBAL_HOOK__')
  }

  // enableDevtools();
  setTimeout(enableDevtools, 2000)
})()
