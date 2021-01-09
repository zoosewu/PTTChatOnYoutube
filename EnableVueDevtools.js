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

(function () {
  const showlog = true;
  if (!window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
    setTimeout(enableDevtools, 2000);
    if (showlog) console.log("no __VUE_DEVTOOLS_GLOBAL_HOOK__");
    return;
  }

  let isActivated = false;

  const getConstructor = el => {
    const vm = (el || 0).__vue__;
    if (vm) {
      return vm.constructor.super ? vm.constructor.super : vm.constructor;
    }
  };

  const getVue = () => {
    let Vue = window.Vue;

    if (!Vue) {
      Vue = getConstructor(document.getElementById('app'));
    }

    if (!Vue) {
      // 遍历 dom 读取可能的 vue 实例
      Vue = getConstructor([...document.body.querySelectorAll('div')].find(el => el.__vue__));
    }

    return Vue;
  };

  const enableDevtools = () => {
    if (isActivated) {
      //console.log("isActivated");
      return;
    }

    const Vue = getVue();

    if (!Vue) {
      if (showlog) console.log("No Vue instance.");
      return;
    }

    isActivated = true;

    Vue.config.devtools = true;
    window.__VUE_DEVTOOLS_GLOBAL_HOOK__.emit('init', Vue);
    if (showlog) console.log("Hook devtool!");

  };

  // enableDevtools();
  setTimeout(enableDevtools, 2000);
})();