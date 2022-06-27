module.exports = {
  env: {
    browser: true
  },
  root: true,
  extends: ['plugin:vue/recommended', 'standard', 'eslint:recommended'],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'babel-eslint'
  },
  ignorePatterns: ['node_modules/*', 'dist/*', 'local/*'],
  globals: {
    $: 'readonly',
    Vue: 'readonly',
    Vuex: 'readonly',
    VueVirtualScroller: 'readonly',
    CryptoJS: 'readonly',
    filterXSS: 'readonly',
    unsafeWindow: 'readonly',
    top: 'readonly',
    GM_info: 'readonly',
    GM_setValue: 'readonly',
    GM_getValue: 'readonly',
    GM_deleteValue: 'readonly',
    GM_addValueChangeListener: 'readonly',
    GM_removeValueChangeListener: 'readonly',
    GM_registerMenuCommand: 'readonly',
    GM_unregisterMenuCommand: 'readonly',
    CustomEvent: 'readonly',
    getComputedStyle: 'readonly',
    reportMode: 'readonly',
    showAllLog: 'readonly',
    showPttScreen: 'readonly',
    showCommand: 'readonly',
    showMessage: 'readonly',
    showAlertMsg: 'readonly',
    defaultOpen: 'readonly',
    disablePttFrame: 'readonly',
    simulateIsStreaming: 'readonly',
    showScrollLog: 'readonly'

  }
}
