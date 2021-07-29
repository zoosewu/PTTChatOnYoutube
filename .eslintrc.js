module.exports = {
  root: true,
  env: {
    node: true,
    jest: true,
    browser: true
  },
  extends: [
    // add more generic rulesets here, such as:
    'plugin:vue/recommended',
    'standard'
  ],
  rules: {
    "no-global-assign": [
      "error",
      {
        "exceptions": [
          "appinscount"
        ]
      }
    ]
  },
  globals: {
    "$": "readonly",
    "Vue": "readonly",
    "Vuex": "readonly",
    "VueVirtualScroller": "readonly",
    "CryptoJS": "readonly",
    "filterXSS": "readonly",
    "unsafeWindow": "readonly",
    "top": "readonly",
    "GM_info": "readonly",
    "GM_setValue": "readonly",
    "GM_getValue": "readonly",
    "CustomEvent": "readonly",
    "getComputedStyle": "readonly",
    "defaultopen": "readonly",
    "disablepttframe": "readonly",
    "simulateisstreaming": "readonly",
    "appinscount": "readonly",
    "cryptkey": "readonly"
  },
  "ignorePatterns": [
    ".eslintrc.js",
    "src/logsetting.js",
    "src/SupportWebsite/lineTV/InitlineTV.js"
  ]
}
