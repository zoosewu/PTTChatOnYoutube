// ==UserScript==
// @name              pttchatonyoutube
// @version           3.0.0
// @author            Zoosewu, crimsonmoon9
// @description       Connect ptt pushes to youtube chatroom
// @match             https://www.youtube.com/*
// @match             https://youtu.be/*
// @match             https://term.ptt.cc/*
// @match             https://hololive.jetri.co/*
// @match             https://www.twitch.tv/*
// @match             https://niji-mado.web.app/home
// @match             https://lin.ee/*
// @match             https://blank.org/*
// @match             https://holodex.net/*
// @license           MIT
// @name:zh-TW        Youtube聊天室顯示PTT推文
// @namespace         https://github.com/zoosewu/PTTChatOnYoutube
// @description:zh-tw 連結PTT推文到Youtube聊天室  讓你簡單追實況搭配推文
// @grant             GM_xmlhttpRequest
// @grant             GM_info
// @grant             unsafeWindow
// @grant             GM_getValue
// @grant             GM_setValue
// @grant             GM_deleteValue
// @grant             GM_addValueChangeListener
// @grant             GM_registerMenuCommand
// @grant             GM_unregisterMenuCommand
// @run-at            document-idle
// @require           https://code.jquery.com/jquery-3.5.1.slim.min.js
// @require           https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js
// @require           https://cdn.jsdelivr.net/npm/bootstrap@4.5.3/dist/js/bootstrap.min.js
// @require           https://cdnjs.cloudflare.com/ajax/libs/crypto-js/3.1.2/rollups/aes.js
// @require           https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js
// @require           https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js
// @require           https://cdn.jsdelivr.net/npm/xss@1.0.8/dist/xss.js
// @require           https://cdn.jsdelivr.net/npm/@akryuminfinitum/vue-virtual-scroller@1.0.11-canary.2/dist/vue-virtual-scroller.min.js
// @homepageURL       https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage
// @downloadURL       https://greasyfork.org/scripts/418469-pttchatonyt/code/PttChatOnYt.user.js
// @updateURL         https://greasyfork.org/scripts/418469-pttchatonyt/code/PttChatOnYt.user.js
// ==/UserScript==

/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 25);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
// eslint-disable-next-line func-names
module.exports = function (cssWithMappingToString) {
  var list = []; // return the list of modules as css string

  list.toString = function toString() {
    return this.map(function (item) {
      var content = cssWithMappingToString(item);

      if (item[2]) {
        return "@media ".concat(item[2], " {").concat(content, "}");
      }

      return content;
    }).join("");
  }; // import a list of modules into the list
  // eslint-disable-next-line func-names


  list.i = function (modules, mediaQuery, dedupe) {
    if (typeof modules === "string") {
      // eslint-disable-next-line no-param-reassign
      modules = [[null, modules, ""]];
    }

    var alreadyImportedModules = {};

    if (dedupe) {
      for (var i = 0; i < this.length; i++) {
        // eslint-disable-next-line prefer-destructuring
        var id = this[i][0];

        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }

    for (var _i = 0; _i < modules.length; _i++) {
      var item = [].concat(modules[_i]);

      if (dedupe && alreadyImportedModules[item[0]]) {
        // eslint-disable-next-line no-continue
        continue;
      }

      if (mediaQuery) {
        if (!item[2]) {
          item[2] = mediaQuery;
        } else {
          item[2] = "".concat(mediaQuery, " and ").concat(item[2]);
        }
      }

      list.push(item);
    }
  };

  return list;
};

/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "default", function() { return /* binding */ addStylesClient; });

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/listToStyles.js
/**
 * Translates the list format produced by css-loader into something
 * easier to manipulate.
 */
function listToStyles (parentId, list) {
  var styles = []
  var newStyles = {}
  for (var i = 0; i < list.length; i++) {
    var item = list[i]
    var id = item[0]
    var css = item[1]
    var media = item[2]
    var sourceMap = item[3]
    var part = {
      id: parentId + ':' + i,
      css: css,
      media: media,
      sourceMap: sourceMap
    }
    if (!newStyles[id]) {
      styles.push(newStyles[id] = { id: id, parts: [part] })
    } else {
      newStyles[id].parts.push(part)
    }
  }
  return styles
}

// CONCATENATED MODULE: ./node_modules/vue-style-loader/lib/addStylesClient.js
/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
  Modified by Evan You @yyx990803
*/



var hasDocument = typeof document !== 'undefined'

if (typeof DEBUG !== 'undefined' && DEBUG) {
  if (!hasDocument) {
    throw new Error(
    'vue-style-loader cannot be used in a non-browser environment. ' +
    "Use { target: 'node' } in your Webpack config to indicate a server-rendering environment."
  ) }
}

/*
type StyleObject = {
  id: number;
  parts: Array<StyleObjectPart>
}

type StyleObjectPart = {
  css: string;
  media: string;
  sourceMap: ?string
}
*/

var stylesInDom = {/*
  [id: number]: {
    id: number,
    refs: number,
    parts: Array<(obj?: StyleObjectPart) => void>
  }
*/}

var head = hasDocument && (document.head || document.getElementsByTagName('head')[0])
var singletonElement = null
var singletonCounter = 0
var isProduction = false
var noop = function () {}
var options = null
var ssrIdKey = 'data-vue-ssr-id'

// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
// tags it will allow on a page
var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\b/.test(navigator.userAgent.toLowerCase())

function addStylesClient (parentId, list, _isProduction, _options) {
  isProduction = _isProduction

  options = _options || {}

  var styles = listToStyles(parentId, list)
  addStylesToDom(styles)

  return function update (newList) {
    var mayRemove = []
    for (var i = 0; i < styles.length; i++) {
      var item = styles[i]
      var domStyle = stylesInDom[item.id]
      domStyle.refs--
      mayRemove.push(domStyle)
    }
    if (newList) {
      styles = listToStyles(parentId, newList)
      addStylesToDom(styles)
    } else {
      styles = []
    }
    for (var i = 0; i < mayRemove.length; i++) {
      var domStyle = mayRemove[i]
      if (domStyle.refs === 0) {
        for (var j = 0; j < domStyle.parts.length; j++) {
          domStyle.parts[j]()
        }
        delete stylesInDom[domStyle.id]
      }
    }
  }
}

function addStylesToDom (styles /* Array<StyleObject> */) {
  for (var i = 0; i < styles.length; i++) {
    var item = styles[i]
    var domStyle = stylesInDom[item.id]
    if (domStyle) {
      domStyle.refs++
      for (var j = 0; j < domStyle.parts.length; j++) {
        domStyle.parts[j](item.parts[j])
      }
      for (; j < item.parts.length; j++) {
        domStyle.parts.push(addStyle(item.parts[j]))
      }
      if (domStyle.parts.length > item.parts.length) {
        domStyle.parts.length = item.parts.length
      }
    } else {
      var parts = []
      for (var j = 0; j < item.parts.length; j++) {
        parts.push(addStyle(item.parts[j]))
      }
      stylesInDom[item.id] = { id: item.id, refs: 1, parts: parts }
    }
  }
}

function createStyleElement () {
  var styleElement = document.createElement('style')
  styleElement.type = 'text/css'
  head.appendChild(styleElement)
  return styleElement
}

function addStyle (obj /* StyleObjectPart */) {
  var update, remove
  var styleElement = document.querySelector('style[' + ssrIdKey + '~="' + obj.id + '"]')

  if (styleElement) {
    if (isProduction) {
      // has SSR styles and in production mode.
      // simply do nothing.
      return noop
    } else {
      // has SSR styles but in dev mode.
      // for some reason Chrome can't handle source map in server-rendered
      // style tags - source maps in <style> only works if the style tag is
      // created and inserted dynamically. So we remove the server rendered
      // styles and inject new ones.
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  if (isOldIE) {
    // use singleton mode for IE9.
    var styleIndex = singletonCounter++
    styleElement = singletonElement || (singletonElement = createStyleElement())
    update = applyToSingletonTag.bind(null, styleElement, styleIndex, false)
    remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true)
  } else {
    // use multi-style-tag mode in all other cases
    styleElement = createStyleElement()
    update = applyToTag.bind(null, styleElement)
    remove = function () {
      styleElement.parentNode.removeChild(styleElement)
    }
  }

  update(obj)

  return function updateStyle (newObj /* StyleObjectPart */) {
    if (newObj) {
      if (newObj.css === obj.css &&
          newObj.media === obj.media &&
          newObj.sourceMap === obj.sourceMap) {
        return
      }
      update(obj = newObj)
    } else {
      remove()
    }
  }
}

var replaceText = (function () {
  var textStore = []

  return function (index, replacement) {
    textStore[index] = replacement
    return textStore.filter(Boolean).join('\n')
  }
})()

function applyToSingletonTag (styleElement, index, remove, obj) {
  var css = remove ? '' : obj.css

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = replaceText(index, css)
  } else {
    var cssNode = document.createTextNode(css)
    var childNodes = styleElement.childNodes
    if (childNodes[index]) styleElement.removeChild(childNodes[index])
    if (childNodes.length) {
      styleElement.insertBefore(cssNode, childNodes[index])
    } else {
      styleElement.appendChild(cssNode)
    }
  }
}

function applyToTag (styleElement, obj) {
  var css = obj.css
  var media = obj.media
  var sourceMap = obj.sourceMap

  if (media) {
    styleElement.setAttribute('media', media)
  }
  if (options.ssrId) {
    styleElement.setAttribute(ssrIdKey, obj.id)
  }

  if (sourceMap) {
    // https://developer.chrome.com/devtools/docs/javascript-debugging
    // this makes source maps inside style tags work properly in Chrome
    css += '\n/*# sourceURL=' + sourceMap.sources[0] + ' */'
    // http://stackoverflow.com/a/26603875
    css += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + ' */'
  }

  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild)
    }
    styleElement.appendChild(document.createTextNode(css))
  }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectNewVersion_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(4);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectNewVersion_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectNewVersion_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectNewVersion_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),
/* 4 */
/***/ (function(module, exports) {

//
//
//
//
//
//
//
//
//
//
//
//

/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, "a", function() { return /* reexport */ render; });
__webpack_require__.d(__webpack_exports__, "b", function() { return /* reexport */ staticRenderFns; });

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectNewVersion.vue?vue&type=template&id=12f89555&
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "a",
    {
      staticClass: "btn ptt-btnoutline m-2 d-none",
      attrs: {
        id: "updatebtn",
        href: "https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt",
        target: "_blank",
        rel: "noopener noreferrer",
        role: "button",
      },
    },
    [_vm._v("檢測到新版本")]
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectNewVersion.vue?vue&type=template&id=12f89555&


/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(14);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("1723df36", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(16);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("c67317e6", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(18);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("46abab8c", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(20);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("1b56a820", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(22);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("0d50daf5", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _ConnectNewVersion_vue_vue_type_template_id_12f89555___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);
/* harmony import */ var _ConnectNewVersion_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3);
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(0);





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[/* default */ "a"])(
  _ConnectNewVersion_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _ConnectNewVersion_vue_vue_type_template_id_12f89555___WEBPACK_IMPORTED_MODULE_0__[/* render */ "a"],
  _ConnectNewVersion_vue_vue_type_template_id_12f89555___WEBPACK_IMPORTED_MODULE_0__[/* staticRenderFns */ "b"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/app/connect/PluginSettings/ConnectNewVersion.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),
/* 12 */
/***/ (function(module, exports) {

Vue.component('ChatItemMsg', {
  props: {
    msgs: {
      type: String,
      required: true
    },
    style: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      parsedmsg: []
    };
  },

  computed: {
    msgList: function () {
      return this.msgs;
    },
    ...Vuex.mapGetters(['getFontsize', 'previewImage'])
  },

  beforeDestroy() {
    this.msgList.forEach(element => {
      if (element.islink && this.previewImage === element.string) this.$store.dispatch('previewImage', '');
    });
  },

  render: function (createElement) {
    return createElement('p', {
      class: {
        'ptt-chat-msg': true,
        'mb-0': true,
        'mx-2': true
      },
      style: this.style
    }, this.msgList.map(data => {
      if (!data.islink) return data.string;
      return createElement('a', {
        class: {
          'ptt-chat-msg': true
        },
        attrs: {
          href: data.string,
          target: '_blank',
          rel: 'noopener noreferrer'
        },
        on: {
          mouseover: () => {
            /* console.log("onmouseover", data.string); */
            this.$store.dispatch('previewImage', data.string);
          },
          mouseleave: () => {
            /* console.log("onmouseout", data.string); */
            this.$store.dispatch('previewImage', '');
          }
        }
      }, data.string);
    }));
  }
});

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectAlertItem_vue_vue_type_style_index_0_id_e3224c1e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectAlertItem_vue_vue_type_style_index_0_id_e3224c1e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectAlertItem_vue_vue_type_style_index_0_id_e3224c1e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "div[data-v-e3224c1e]{pointer-events:none}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectAlert_vue_vue_type_style_index_0_id_0caf7f3e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectAlert_vue_vue_type_style_index_0_id_0caf7f3e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_ConnectAlert_vue_vue_type_style_index_0_id_0caf7f3e_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 16 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "#PTTChat-contents-Connect-alert[data-v-0caf7f3e]{top:-100%;z-index:400;pointer-events:none}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttScreenIframe_vue_vue_type_style_index_0_id_6ae2e06c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttScreenIframe_vue_vue_type_style_index_0_id_6ae2e06c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttScreenIframe_vue_vue_type_style_index_0_id_6ae2e06c_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "iframe[data-v-6ae2e06c]{zoom:1.65;z-index:351;-moz-transform:scale(1)}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttApp_vue_vue_type_style_index_0_id_3692ac10_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttApp_vue_vue_type_style_index_0_id_3692ac10_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttApp_vue_vue_type_style_index_0_id_3692ac10_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "div[data-v-3692ac10]{z-index:301}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttAppButton_vue_vue_type_style_index_0_id_3700bc4a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(10);
/* harmony import */ var _node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttAppButton_vue_vue_type_style_index_0_id_3700bc4a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_vue_style_loader_index_js_node_modules_css_loader_dist_cjs_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_sass_loader_dist_cjs_js_node_modules_vue_loader_lib_index_js_vue_loader_options_PttAppButton_vue_vue_type_style_index_0_id_3700bc4a_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "a[data-v-3700bc4a]{z-index:400 !important}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(24);
if(content.__esModule) content = content.default;
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var add = __webpack_require__(2).default
var update = add("c260c498", content, false, {});
// Hot Module Replacement
if(false) {}

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0__);
// Imports

var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_0___default()(function(i){return i[1]});
// Module
___CSS_LOADER_EXPORT___.push([module.i, "#PTTChat *{all:revert}#PTTChat .vue-recycle-scroller{position:relative}#PTTChat .vue-recycle-scroller.direction-vertical:not(.page-mode){overflow-y:auto}#PTTChat .vue-recycle-scroller.direction-horizontal:not(.page-mode){overflow-x:auto}#PTTChat .vue-recycle-scroller.direction-horizontal{display:-webkit-box;display:-ms-flexbox;display:flex}#PTTChat .vue-recycle-scroller__slot{-webkit-box-flex:1;-ms-flex:auto 0 0px;flex:auto 0 0}#PTTChat .vue-recycle-scroller__item-wrapper{-webkit-box-flex:1;-ms-flex:1;flex:1;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;position:relative}#PTTChat .vue-recycle-scroller.ready .vue-recycle-scroller__item-view{position:absolute;top:0;left:0;will-change:transform}#PTTChat .vue-recycle-scroller.direction-vertical .vue-recycle-scroller__item-wrapper{width:100%}#PTTChat .vue-recycle-scroller.direction-horizontal .vue-recycle-scroller__item-wrapper{height:100%}#PTTChat .vue-recycle-scroller.ready.direction-vertical .vue-recycle-scroller__item-view{width:100%}#PTTChat .vue-recycle-scroller.ready.direction-horizontal .vue-recycle-scroller__item-view{height:100%}#PTTChat .resize-observer[data-v-b329ee4c]{position:absolute;top:0;left:0;z-index:-1;width:100%;height:100%;border:none;background-color:transparent;pointer-events:none;display:block;overflow:hidden;opacity:0}#PTTChat .resize-observer[data-v-b329ee4c] object{display:block;position:absolute;top:0;left:0;height:100%;width:100%;overflow:hidden;pointer-events:none;z-index:-1}#PTTChat :root{--blue: #007bff;--indigo: #6610f2;--purple: #6f42c1;--pink: #e83e8c;--red: #dc3545;--orange: #fd7e14;--yellow: #ffc107;--green: #28a745;--teal: #20c997;--cyan: #17a2b8;--white: #fff;--gray: #6c757d;--gray-dark: #343a40;--primary: #007bff;--secondary: #6c757d;--success: #28a745;--info: #17a2b8;--warning: #ffc107;--danger: #dc3545;--light: #f8f9fa;--dark: #343a40;--breakpoint-xs: 0;--breakpoint-sm: 576px;--breakpoint-md: 768px;--breakpoint-lg: 992px;--breakpoint-xl: 1200px;--font-family-sans-serif: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", \"Liberation Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\";--font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace}#PTTChat *,#PTTChat *::before,#PTTChat *::after{box-sizing:border-box}#PTTChat html{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0)}#PTTChat article,#PTTChat aside,#PTTChat figcaption,#PTTChat figure,#PTTChat footer,#PTTChat header,#PTTChat hgroup,#PTTChat main,#PTTChat nav,#PTTChat section{display:block}#PTTChat body{margin:0;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",\"Liberation Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";font-size:12px;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}#PTTChat [tabindex=\"-1\"]:focus:not(:focus-visible){outline:0 !important}#PTTChat hr{box-sizing:content-box;height:0;overflow:visible}#PTTChat h1,#PTTChat h2,#PTTChat h3,#PTTChat h4,#PTTChat h5,#PTTChat h6{margin-top:0;margin-bottom:5px}#PTTChat p{margin-top:0;margin-bottom:1rem}#PTTChat abbr[title],#PTTChat abbr[data-original-title]{text-decoration:underline;text-decoration:underline dotted;cursor:help;border-bottom:0;text-decoration-skip-ink:none}#PTTChat address{margin-bottom:1rem;font-style:normal;line-height:inherit}#PTTChat ol,#PTTChat ul,#PTTChat dl{margin-top:0;margin-bottom:1rem}#PTTChat ol ol,#PTTChat ul ul,#PTTChat ol ul,#PTTChat ul ol{margin-bottom:0}#PTTChat dt{font-weight:700}#PTTChat dd{margin-bottom:.5rem;margin-left:0}#PTTChat blockquote{margin:0 0 1rem}#PTTChat b,#PTTChat strong{font-weight:bolder}#PTTChat small{font-size:80%}#PTTChat sub,#PTTChat sup{position:relative;font-size:75%;line-height:0;vertical-align:baseline}#PTTChat sub{bottom:-.25em}#PTTChat sup{top:-.5em}#PTTChat a{color:#007bff;text-decoration:none;background-color:transparent}#PTTChat a:hover{color:#0056b3;text-decoration:underline}#PTTChat a:not([href]):not([class]){color:inherit;text-decoration:none}#PTTChat a:not([href]):not([class]):hover{color:inherit;text-decoration:none}#PTTChat pre,#PTTChat code,#PTTChat kbd,#PTTChat samp{font-family:SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace;font-size:1em}#PTTChat pre{margin-top:0;margin-bottom:1rem;overflow:auto;-ms-overflow-style:scrollbar}#PTTChat figure{margin:0 0 1rem}#PTTChat img{vertical-align:middle;border-style:none}#PTTChat svg{overflow:hidden;vertical-align:middle}#PTTChat table{border-collapse:collapse}#PTTChat caption{padding-top:7.5px;padding-bottom:7.5px;color:#6c757d;text-align:left;caption-side:bottom}#PTTChat th{text-align:inherit;text-align:-webkit-match-parent}#PTTChat label{display:inline-block;margin-bottom:.5rem}#PTTChat button{border-radius:0}#PTTChat button:focus:not(:focus-visible){outline:0}#PTTChat input,#PTTChat button,#PTTChat select,#PTTChat optgroup,#PTTChat textarea{margin:0;font-family:inherit;font-size:inherit;line-height:inherit}#PTTChat button,#PTTChat input{overflow:visible}#PTTChat button,#PTTChat select{text-transform:none}#PTTChat [role=\"button\"]{cursor:pointer}#PTTChat select{word-wrap:normal}#PTTChat button,#PTTChat [type=\"button\"],#PTTChat [type=\"reset\"],#PTTChat [type=\"submit\"]{-webkit-appearance:button}#PTTChat button:not(:disabled),#PTTChat [type=\"button\"]:not(:disabled),#PTTChat [type=\"reset\"]:not(:disabled),#PTTChat [type=\"submit\"]:not(:disabled){cursor:pointer}#PTTChat button::-moz-focus-inner,#PTTChat [type=\"button\"]::-moz-focus-inner,#PTTChat [type=\"reset\"]::-moz-focus-inner,#PTTChat [type=\"submit\"]::-moz-focus-inner{padding:0;border-style:none}#PTTChat input[type=\"radio\"],#PTTChat input[type=\"checkbox\"]{box-sizing:border-box;padding:0}#PTTChat textarea{overflow:auto;resize:vertical}#PTTChat fieldset{min-width:0;padding:0;margin:0;border:0}#PTTChat legend{display:block;width:100%;max-width:100%;padding:0;margin-bottom:.5rem;font-size:1.5rem;line-height:inherit;color:inherit;white-space:normal}#PTTChat progress{vertical-align:baseline}#PTTChat [type=\"number\"]::-webkit-inner-spin-button,#PTTChat [type=\"number\"]::-webkit-outer-spin-button{height:auto}#PTTChat [type=\"search\"]{outline-offset:-2px;-webkit-appearance:none}#PTTChat [type=\"search\"]::-webkit-search-decoration{-webkit-appearance:none}#PTTChat ::-webkit-file-upload-button{font:inherit;-webkit-appearance:button}#PTTChat output{display:inline-block}#PTTChat summary{display:list-item;cursor:pointer}#PTTChat template{display:none}#PTTChat [hidden]{display:none !important}#PTTChat{font-family:sans-serif;line-height:1.15;-webkit-text-size-adjust:100%;-webkit-tap-highlight-color:rgba(0,0,0,0)}#PTTChat{margin:0;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",\"Liberation Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";font-size:12px;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}#PTTChat h1,#PTTChat h2,#PTTChat h3,#PTTChat h4,#PTTChat h5,#PTTChat h6,#PTTChat .h1,#PTTChat .h2,#PTTChat .h3,#PTTChat .h4,#PTTChat .h5,#PTTChat .h6{margin-bottom:5px;font-weight:500;line-height:1.2}#PTTChat h1,#PTTChat .h1{font-size:30px}#PTTChat h2,#PTTChat .h2{font-size:24px}#PTTChat h3,#PTTChat .h3{font-size:21px}#PTTChat h4,#PTTChat .h4{font-size:18px}#PTTChat h5,#PTTChat .h5{font-size:15px}#PTTChat h6,#PTTChat .h6{font-size:12px}#PTTChat .lead{font-size:15px;font-weight:300}#PTTChat .display-1{font-size:6rem;font-weight:300;line-height:1.2}#PTTChat .display-2{font-size:5.5rem;font-weight:300;line-height:1.2}#PTTChat .display-3{font-size:4.5rem;font-weight:300;line-height:1.2}#PTTChat .display-4{font-size:3.5rem;font-weight:300;line-height:1.2}#PTTChat hr{margin-top:10px;margin-bottom:10px;border:0;border-top:1px solid rgba(0,0,0,0.1)}#PTTChat small,#PTTChat .small{font-size:80%;font-weight:400}#PTTChat mark,#PTTChat .mark{padding:.2em;background-color:#fcf8e3}#PTTChat .list-unstyled{padding-left:0;list-style:none}#PTTChat .list-inline{padding-left:0;list-style:none}#PTTChat .list-inline-item{display:inline-block}#PTTChat .list-inline-item:not(:last-child){margin-right:.5rem}#PTTChat .initialism{font-size:90%;text-transform:uppercase}#PTTChat .blockquote{margin-bottom:10px;font-size:15px}#PTTChat .blockquote-footer{display:block;font-size:80%;color:#6c757d}#PTTChat .blockquote-footer::before{content:\"\\2014\\00A0\"}#PTTChat .container,#PTTChat .container-fluid,#PTTChat .container-sm,#PTTChat .container-md,#PTTChat .container-lg,#PTTChat .container-xl{width:100%;padding-right:15px;padding-left:15px;margin-right:auto;margin-left:auto}@media (min-width: 576px){#PTTChat .container,#PTTChat .container-sm{max-width:540px}}@media (min-width: 768px){#PTTChat .container,#PTTChat .container-sm,#PTTChat .container-md{max-width:720px}}@media (min-width: 992px){#PTTChat .container,#PTTChat .container-sm,#PTTChat .container-md,#PTTChat .container-lg{max-width:960px}}@media (min-width: 1200px){#PTTChat .container,#PTTChat .container-sm,#PTTChat .container-md,#PTTChat .container-lg,#PTTChat .container-xl{max-width:1140px}}#PTTChat .row{display:flex;flex-wrap:wrap;margin-right:-15px;margin-left:-15px}#PTTChat .no-gutters{margin-right:0;margin-left:0}#PTTChat .no-gutters>.col,#PTTChat .no-gutters>[class*=\"col-\"]{padding-right:0;padding-left:0}#PTTChat .col-1,#PTTChat .col-2,#PTTChat .col-3,#PTTChat .col-4,#PTTChat .col-5,#PTTChat .col-6,#PTTChat .col-7,#PTTChat .col-8,#PTTChat .col-9,#PTTChat .col-10,#PTTChat .col-11,#PTTChat .col-12,#PTTChat .col,#PTTChat .col-auto,#PTTChat .col-sm-1,#PTTChat .col-sm-2,#PTTChat .col-sm-3,#PTTChat .col-sm-4,#PTTChat .col-sm-5,#PTTChat .col-sm-6,#PTTChat .col-sm-7,#PTTChat .col-sm-8,#PTTChat .col-sm-9,#PTTChat .col-sm-10,#PTTChat .col-sm-11,#PTTChat .col-sm-12,#PTTChat .col-sm,#PTTChat .col-sm-auto,#PTTChat .col-md-1,#PTTChat .col-md-2,#PTTChat .col-md-3,#PTTChat .col-md-4,#PTTChat .col-md-5,#PTTChat .col-md-6,#PTTChat .col-md-7,#PTTChat .col-md-8,#PTTChat .col-md-9,#PTTChat .col-md-10,#PTTChat .col-md-11,#PTTChat .col-md-12,#PTTChat .col-md,#PTTChat .col-md-auto,#PTTChat .col-lg-1,#PTTChat .col-lg-2,#PTTChat .col-lg-3,#PTTChat .col-lg-4,#PTTChat .col-lg-5,#PTTChat .col-lg-6,#PTTChat .col-lg-7,#PTTChat .col-lg-8,#PTTChat .col-lg-9,#PTTChat .col-lg-10,#PTTChat .col-lg-11,#PTTChat .col-lg-12,#PTTChat .col-lg,#PTTChat .col-lg-auto,#PTTChat .col-xl-1,#PTTChat .col-xl-2,#PTTChat .col-xl-3,#PTTChat .col-xl-4,#PTTChat .col-xl-5,#PTTChat .col-xl-6,#PTTChat .col-xl-7,#PTTChat .col-xl-8,#PTTChat .col-xl-9,#PTTChat .col-xl-10,#PTTChat .col-xl-11,#PTTChat .col-xl-12,#PTTChat .col-xl,#PTTChat .col-xl-auto{position:relative;width:100%;padding-right:15px;padding-left:15px}#PTTChat .col{flex-basis:0;flex-grow:1;max-width:100%}#PTTChat .row-cols-1>*{flex:0 0 100%;max-width:100%}#PTTChat .row-cols-2>*{flex:0 0 50%;max-width:50%}#PTTChat .row-cols-3>*{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .row-cols-4>*{flex:0 0 25%;max-width:25%}#PTTChat .row-cols-5>*{flex:0 0 20%;max-width:20%}#PTTChat .row-cols-6>*{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-auto{flex:0 0 auto;width:auto;max-width:100%}#PTTChat .col-1{flex:0 0 8.33333%;max-width:8.33333%}#PTTChat .col-2{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-3{flex:0 0 25%;max-width:25%}#PTTChat .col-4{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .col-5{flex:0 0 41.66667%;max-width:41.66667%}#PTTChat .col-6{flex:0 0 50%;max-width:50%}#PTTChat .col-7{flex:0 0 58.33333%;max-width:58.33333%}#PTTChat .col-8{flex:0 0 66.66667%;max-width:66.66667%}#PTTChat .col-9{flex:0 0 75%;max-width:75%}#PTTChat .col-10{flex:0 0 83.33333%;max-width:83.33333%}#PTTChat .col-11{flex:0 0 91.66667%;max-width:91.66667%}#PTTChat .col-12{flex:0 0 100%;max-width:100%}#PTTChat .order-first{order:-1}#PTTChat .order-last{order:13}#PTTChat .order-0{order:0}#PTTChat .order-1{order:1}#PTTChat .order-2{order:2}#PTTChat .order-3{order:3}#PTTChat .order-4{order:4}#PTTChat .order-5{order:5}#PTTChat .order-6{order:6}#PTTChat .order-7{order:7}#PTTChat .order-8{order:8}#PTTChat .order-9{order:9}#PTTChat .order-10{order:10}#PTTChat .order-11{order:11}#PTTChat .order-12{order:12}#PTTChat .offset-1{margin-left:8.33333%}#PTTChat .offset-2{margin-left:16.66667%}#PTTChat .offset-3{margin-left:25%}#PTTChat .offset-4{margin-left:33.33333%}#PTTChat .offset-5{margin-left:41.66667%}#PTTChat .offset-6{margin-left:50%}#PTTChat .offset-7{margin-left:58.33333%}#PTTChat .offset-8{margin-left:66.66667%}#PTTChat .offset-9{margin-left:75%}#PTTChat .offset-10{margin-left:83.33333%}#PTTChat .offset-11{margin-left:91.66667%}@media (min-width: 576px){#PTTChat .col-sm{flex-basis:0;flex-grow:1;max-width:100%}#PTTChat .row-cols-sm-1>*{flex:0 0 100%;max-width:100%}#PTTChat .row-cols-sm-2>*{flex:0 0 50%;max-width:50%}#PTTChat .row-cols-sm-3>*{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .row-cols-sm-4>*{flex:0 0 25%;max-width:25%}#PTTChat .row-cols-sm-5>*{flex:0 0 20%;max-width:20%}#PTTChat .row-cols-sm-6>*{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-sm-auto{flex:0 0 auto;width:auto;max-width:100%}#PTTChat .col-sm-1{flex:0 0 8.33333%;max-width:8.33333%}#PTTChat .col-sm-2{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-sm-3{flex:0 0 25%;max-width:25%}#PTTChat .col-sm-4{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .col-sm-5{flex:0 0 41.66667%;max-width:41.66667%}#PTTChat .col-sm-6{flex:0 0 50%;max-width:50%}#PTTChat .col-sm-7{flex:0 0 58.33333%;max-width:58.33333%}#PTTChat .col-sm-8{flex:0 0 66.66667%;max-width:66.66667%}#PTTChat .col-sm-9{flex:0 0 75%;max-width:75%}#PTTChat .col-sm-10{flex:0 0 83.33333%;max-width:83.33333%}#PTTChat .col-sm-11{flex:0 0 91.66667%;max-width:91.66667%}#PTTChat .col-sm-12{flex:0 0 100%;max-width:100%}#PTTChat .order-sm-first{order:-1}#PTTChat .order-sm-last{order:13}#PTTChat .order-sm-0{order:0}#PTTChat .order-sm-1{order:1}#PTTChat .order-sm-2{order:2}#PTTChat .order-sm-3{order:3}#PTTChat .order-sm-4{order:4}#PTTChat .order-sm-5{order:5}#PTTChat .order-sm-6{order:6}#PTTChat .order-sm-7{order:7}#PTTChat .order-sm-8{order:8}#PTTChat .order-sm-9{order:9}#PTTChat .order-sm-10{order:10}#PTTChat .order-sm-11{order:11}#PTTChat .order-sm-12{order:12}#PTTChat .offset-sm-0{margin-left:0}#PTTChat .offset-sm-1{margin-left:8.33333%}#PTTChat .offset-sm-2{margin-left:16.66667%}#PTTChat .offset-sm-3{margin-left:25%}#PTTChat .offset-sm-4{margin-left:33.33333%}#PTTChat .offset-sm-5{margin-left:41.66667%}#PTTChat .offset-sm-6{margin-left:50%}#PTTChat .offset-sm-7{margin-left:58.33333%}#PTTChat .offset-sm-8{margin-left:66.66667%}#PTTChat .offset-sm-9{margin-left:75%}#PTTChat .offset-sm-10{margin-left:83.33333%}#PTTChat .offset-sm-11{margin-left:91.66667%}}@media (min-width: 768px){#PTTChat .col-md{flex-basis:0;flex-grow:1;max-width:100%}#PTTChat .row-cols-md-1>*{flex:0 0 100%;max-width:100%}#PTTChat .row-cols-md-2>*{flex:0 0 50%;max-width:50%}#PTTChat .row-cols-md-3>*{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .row-cols-md-4>*{flex:0 0 25%;max-width:25%}#PTTChat .row-cols-md-5>*{flex:0 0 20%;max-width:20%}#PTTChat .row-cols-md-6>*{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-md-auto{flex:0 0 auto;width:auto;max-width:100%}#PTTChat .col-md-1{flex:0 0 8.33333%;max-width:8.33333%}#PTTChat .col-md-2{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-md-3{flex:0 0 25%;max-width:25%}#PTTChat .col-md-4{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .col-md-5{flex:0 0 41.66667%;max-width:41.66667%}#PTTChat .col-md-6{flex:0 0 50%;max-width:50%}#PTTChat .col-md-7{flex:0 0 58.33333%;max-width:58.33333%}#PTTChat .col-md-8{flex:0 0 66.66667%;max-width:66.66667%}#PTTChat .col-md-9{flex:0 0 75%;max-width:75%}#PTTChat .col-md-10{flex:0 0 83.33333%;max-width:83.33333%}#PTTChat .col-md-11{flex:0 0 91.66667%;max-width:91.66667%}#PTTChat .col-md-12{flex:0 0 100%;max-width:100%}#PTTChat .order-md-first{order:-1}#PTTChat .order-md-last{order:13}#PTTChat .order-md-0{order:0}#PTTChat .order-md-1{order:1}#PTTChat .order-md-2{order:2}#PTTChat .order-md-3{order:3}#PTTChat .order-md-4{order:4}#PTTChat .order-md-5{order:5}#PTTChat .order-md-6{order:6}#PTTChat .order-md-7{order:7}#PTTChat .order-md-8{order:8}#PTTChat .order-md-9{order:9}#PTTChat .order-md-10{order:10}#PTTChat .order-md-11{order:11}#PTTChat .order-md-12{order:12}#PTTChat .offset-md-0{margin-left:0}#PTTChat .offset-md-1{margin-left:8.33333%}#PTTChat .offset-md-2{margin-left:16.66667%}#PTTChat .offset-md-3{margin-left:25%}#PTTChat .offset-md-4{margin-left:33.33333%}#PTTChat .offset-md-5{margin-left:41.66667%}#PTTChat .offset-md-6{margin-left:50%}#PTTChat .offset-md-7{margin-left:58.33333%}#PTTChat .offset-md-8{margin-left:66.66667%}#PTTChat .offset-md-9{margin-left:75%}#PTTChat .offset-md-10{margin-left:83.33333%}#PTTChat .offset-md-11{margin-left:91.66667%}}@media (min-width: 992px){#PTTChat .col-lg{flex-basis:0;flex-grow:1;max-width:100%}#PTTChat .row-cols-lg-1>*{flex:0 0 100%;max-width:100%}#PTTChat .row-cols-lg-2>*{flex:0 0 50%;max-width:50%}#PTTChat .row-cols-lg-3>*{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .row-cols-lg-4>*{flex:0 0 25%;max-width:25%}#PTTChat .row-cols-lg-5>*{flex:0 0 20%;max-width:20%}#PTTChat .row-cols-lg-6>*{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-lg-auto{flex:0 0 auto;width:auto;max-width:100%}#PTTChat .col-lg-1{flex:0 0 8.33333%;max-width:8.33333%}#PTTChat .col-lg-2{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-lg-3{flex:0 0 25%;max-width:25%}#PTTChat .col-lg-4{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .col-lg-5{flex:0 0 41.66667%;max-width:41.66667%}#PTTChat .col-lg-6{flex:0 0 50%;max-width:50%}#PTTChat .col-lg-7{flex:0 0 58.33333%;max-width:58.33333%}#PTTChat .col-lg-8{flex:0 0 66.66667%;max-width:66.66667%}#PTTChat .col-lg-9{flex:0 0 75%;max-width:75%}#PTTChat .col-lg-10{flex:0 0 83.33333%;max-width:83.33333%}#PTTChat .col-lg-11{flex:0 0 91.66667%;max-width:91.66667%}#PTTChat .col-lg-12{flex:0 0 100%;max-width:100%}#PTTChat .order-lg-first{order:-1}#PTTChat .order-lg-last{order:13}#PTTChat .order-lg-0{order:0}#PTTChat .order-lg-1{order:1}#PTTChat .order-lg-2{order:2}#PTTChat .order-lg-3{order:3}#PTTChat .order-lg-4{order:4}#PTTChat .order-lg-5{order:5}#PTTChat .order-lg-6{order:6}#PTTChat .order-lg-7{order:7}#PTTChat .order-lg-8{order:8}#PTTChat .order-lg-9{order:9}#PTTChat .order-lg-10{order:10}#PTTChat .order-lg-11{order:11}#PTTChat .order-lg-12{order:12}#PTTChat .offset-lg-0{margin-left:0}#PTTChat .offset-lg-1{margin-left:8.33333%}#PTTChat .offset-lg-2{margin-left:16.66667%}#PTTChat .offset-lg-3{margin-left:25%}#PTTChat .offset-lg-4{margin-left:33.33333%}#PTTChat .offset-lg-5{margin-left:41.66667%}#PTTChat .offset-lg-6{margin-left:50%}#PTTChat .offset-lg-7{margin-left:58.33333%}#PTTChat .offset-lg-8{margin-left:66.66667%}#PTTChat .offset-lg-9{margin-left:75%}#PTTChat .offset-lg-10{margin-left:83.33333%}#PTTChat .offset-lg-11{margin-left:91.66667%}}@media (min-width: 1200px){#PTTChat .col-xl{flex-basis:0;flex-grow:1;max-width:100%}#PTTChat .row-cols-xl-1>*{flex:0 0 100%;max-width:100%}#PTTChat .row-cols-xl-2>*{flex:0 0 50%;max-width:50%}#PTTChat .row-cols-xl-3>*{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .row-cols-xl-4>*{flex:0 0 25%;max-width:25%}#PTTChat .row-cols-xl-5>*{flex:0 0 20%;max-width:20%}#PTTChat .row-cols-xl-6>*{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-xl-auto{flex:0 0 auto;width:auto;max-width:100%}#PTTChat .col-xl-1{flex:0 0 8.33333%;max-width:8.33333%}#PTTChat .col-xl-2{flex:0 0 16.66667%;max-width:16.66667%}#PTTChat .col-xl-3{flex:0 0 25%;max-width:25%}#PTTChat .col-xl-4{flex:0 0 33.33333%;max-width:33.33333%}#PTTChat .col-xl-5{flex:0 0 41.66667%;max-width:41.66667%}#PTTChat .col-xl-6{flex:0 0 50%;max-width:50%}#PTTChat .col-xl-7{flex:0 0 58.33333%;max-width:58.33333%}#PTTChat .col-xl-8{flex:0 0 66.66667%;max-width:66.66667%}#PTTChat .col-xl-9{flex:0 0 75%;max-width:75%}#PTTChat .col-xl-10{flex:0 0 83.33333%;max-width:83.33333%}#PTTChat .col-xl-11{flex:0 0 91.66667%;max-width:91.66667%}#PTTChat .col-xl-12{flex:0 0 100%;max-width:100%}#PTTChat .order-xl-first{order:-1}#PTTChat .order-xl-last{order:13}#PTTChat .order-xl-0{order:0}#PTTChat .order-xl-1{order:1}#PTTChat .order-xl-2{order:2}#PTTChat .order-xl-3{order:3}#PTTChat .order-xl-4{order:4}#PTTChat .order-xl-5{order:5}#PTTChat .order-xl-6{order:6}#PTTChat .order-xl-7{order:7}#PTTChat .order-xl-8{order:8}#PTTChat .order-xl-9{order:9}#PTTChat .order-xl-10{order:10}#PTTChat .order-xl-11{order:11}#PTTChat .order-xl-12{order:12}#PTTChat .offset-xl-0{margin-left:0}#PTTChat .offset-xl-1{margin-left:8.33333%}#PTTChat .offset-xl-2{margin-left:16.66667%}#PTTChat .offset-xl-3{margin-left:25%}#PTTChat .offset-xl-4{margin-left:33.33333%}#PTTChat .offset-xl-5{margin-left:41.66667%}#PTTChat .offset-xl-6{margin-left:50%}#PTTChat .offset-xl-7{margin-left:58.33333%}#PTTChat .offset-xl-8{margin-left:66.66667%}#PTTChat .offset-xl-9{margin-left:75%}#PTTChat .offset-xl-10{margin-left:83.33333%}#PTTChat .offset-xl-11{margin-left:91.66667%}}#PTTChat .table{width:100%;margin-bottom:10px;color:#212529}#PTTChat .table th,#PTTChat .table td{padding:7.5px;vertical-align:top;border-top:1px solid #dee2e6}#PTTChat .table thead th{vertical-align:bottom;border-bottom:2px solid #dee2e6}#PTTChat .table tbody+tbody{border-top:2px solid #dee2e6}#PTTChat .table-sm th,#PTTChat .table-sm td{padding:3px}#PTTChat .table-bordered{border:1px solid #dee2e6}#PTTChat .table-bordered th,#PTTChat .table-bordered td{border:1px solid #dee2e6}#PTTChat .table-bordered thead th,#PTTChat .table-bordered thead td{border-bottom-width:2px}#PTTChat .table-borderless th,#PTTChat .table-borderless td,#PTTChat .table-borderless thead th,#PTTChat .table-borderless tbody+tbody{border:0}#PTTChat .table-striped tbody tr:nth-of-type(odd){background-color:rgba(0,0,0,0.05)}#PTTChat .table-hover tbody tr:hover{color:#212529;background-color:rgba(0,0,0,0.075)}#PTTChat .table-primary,#PTTChat .table-primary>th,#PTTChat .table-primary>td{background-color:#b8daff}#PTTChat .table-primary th,#PTTChat .table-primary td,#PTTChat .table-primary thead th,#PTTChat .table-primary tbody+tbody{border-color:#7abaff}#PTTChat .table-hover .table-primary:hover{background-color:#9fcdff}#PTTChat .table-hover .table-primary:hover>td,#PTTChat .table-hover .table-primary:hover>th{background-color:#9fcdff}#PTTChat .table-secondary,#PTTChat .table-secondary>th,#PTTChat .table-secondary>td{background-color:#d6d8db}#PTTChat .table-secondary th,#PTTChat .table-secondary td,#PTTChat .table-secondary thead th,#PTTChat .table-secondary tbody+tbody{border-color:#b3b7bb}#PTTChat .table-hover .table-secondary:hover{background-color:#c8cbcf}#PTTChat .table-hover .table-secondary:hover>td,#PTTChat .table-hover .table-secondary:hover>th{background-color:#c8cbcf}#PTTChat .table-success,#PTTChat .table-success>th,#PTTChat .table-success>td{background-color:#c3e6cb}#PTTChat .table-success th,#PTTChat .table-success td,#PTTChat .table-success thead th,#PTTChat .table-success tbody+tbody{border-color:#8fd19e}#PTTChat .table-hover .table-success:hover{background-color:#b1dfbb}#PTTChat .table-hover .table-success:hover>td,#PTTChat .table-hover .table-success:hover>th{background-color:#b1dfbb}#PTTChat .table-info,#PTTChat .table-info>th,#PTTChat .table-info>td{background-color:#bee5eb}#PTTChat .table-info th,#PTTChat .table-info td,#PTTChat .table-info thead th,#PTTChat .table-info tbody+tbody{border-color:#86cfda}#PTTChat .table-hover .table-info:hover{background-color:#abdde5}#PTTChat .table-hover .table-info:hover>td,#PTTChat .table-hover .table-info:hover>th{background-color:#abdde5}#PTTChat .table-warning,#PTTChat .table-warning>th,#PTTChat .table-warning>td{background-color:#ffeeba}#PTTChat .table-warning th,#PTTChat .table-warning td,#PTTChat .table-warning thead th,#PTTChat .table-warning tbody+tbody{border-color:#ffdf7e}#PTTChat .table-hover .table-warning:hover{background-color:#ffe8a1}#PTTChat .table-hover .table-warning:hover>td,#PTTChat .table-hover .table-warning:hover>th{background-color:#ffe8a1}#PTTChat .table-danger,#PTTChat .table-danger>th,#PTTChat .table-danger>td{background-color:#f5c6cb}#PTTChat .table-danger th,#PTTChat .table-danger td,#PTTChat .table-danger thead th,#PTTChat .table-danger tbody+tbody{border-color:#ed969e}#PTTChat .table-hover .table-danger:hover{background-color:#f1b0b7}#PTTChat .table-hover .table-danger:hover>td,#PTTChat .table-hover .table-danger:hover>th{background-color:#f1b0b7}#PTTChat .table-light,#PTTChat .table-light>th,#PTTChat .table-light>td{background-color:#fdfdfe}#PTTChat .table-light th,#PTTChat .table-light td,#PTTChat .table-light thead th,#PTTChat .table-light tbody+tbody{border-color:#fbfcfc}#PTTChat .table-hover .table-light:hover{background-color:#ececf6}#PTTChat .table-hover .table-light:hover>td,#PTTChat .table-hover .table-light:hover>th{background-color:#ececf6}#PTTChat .table-dark,#PTTChat .table-dark>th,#PTTChat .table-dark>td{background-color:#c6c8ca}#PTTChat .table-dark th,#PTTChat .table-dark td,#PTTChat .table-dark thead th,#PTTChat .table-dark tbody+tbody{border-color:#95999c}#PTTChat .table-hover .table-dark:hover{background-color:#b9bbbe}#PTTChat .table-hover .table-dark:hover>td,#PTTChat .table-hover .table-dark:hover>th{background-color:#b9bbbe}#PTTChat .table-active,#PTTChat .table-active>th,#PTTChat .table-active>td{background-color:rgba(0,0,0,0.075)}#PTTChat .table-hover .table-active:hover{background-color:rgba(0,0,0,0.075)}#PTTChat .table-hover .table-active:hover>td,#PTTChat .table-hover .table-active:hover>th{background-color:rgba(0,0,0,0.075)}#PTTChat .table .thead-dark th{color:#fff;background-color:#343a40;border-color:#454d55}#PTTChat .table .thead-light th{color:#495057;background-color:#e9ecef;border-color:#dee2e6}#PTTChat .table-dark{color:#fff;background-color:#343a40}#PTTChat .table-dark th,#PTTChat .table-dark td,#PTTChat .table-dark thead th{border-color:#454d55}#PTTChat .table-dark.table-bordered{border:0}#PTTChat .table-dark.table-striped tbody tr:nth-of-type(odd){background-color:rgba(255,255,255,0.05)}#PTTChat .table-dark.table-hover tbody tr:hover{color:#fff;background-color:rgba(255,255,255,0.075)}@media (max-width: 575.98px){#PTTChat .table-responsive-sm{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}#PTTChat .table-responsive-sm>.table-bordered{border:0}}@media (max-width: 767.98px){#PTTChat .table-responsive-md{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}#PTTChat .table-responsive-md>.table-bordered{border:0}}@media (max-width: 991.98px){#PTTChat .table-responsive-lg{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}#PTTChat .table-responsive-lg>.table-bordered{border:0}}@media (max-width: 1199.98px){#PTTChat .table-responsive-xl{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}#PTTChat .table-responsive-xl>.table-bordered{border:0}}#PTTChat .table-responsive{display:block;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch}#PTTChat .table-responsive>.table-bordered{border:0}#PTTChat .form-control{display:block;width:100%;height:add(1.5, add(7.5px, 2px, false));padding:3.75px 7.5px;font-size:12px;font-weight:400;line-height:1.5;color:#495057;background-color:#fff;background-clip:padding-box;border:1px solid #ced4da;border-radius:2.5px;transition:border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out}@media (prefers-reduced-motion: reduce){#PTTChat .form-control{transition:none}}#PTTChat .form-control::-ms-expand{background-color:transparent;border:0}#PTTChat .form-control:focus{color:#495057;background-color:#fff;border-color:#80bdff;outline:0;box-shadow:0 0 0 2px rgba(0,123,255,0.25)}#PTTChat .form-control::placeholder{color:#6c757d;opacity:1}#PTTChat .form-control:disabled,#PTTChat .form-control[readonly]{background-color:#e9ecef;opacity:1}#PTTChat input[type=\"date\"].form-control,#PTTChat input[type=\"time\"].form-control,#PTTChat input[type=\"datetime-local\"].form-control,#PTTChat input[type=\"month\"].form-control{appearance:none}#PTTChat select.form-control:-moz-focusring{color:transparent;text-shadow:0 0 0 #495057}#PTTChat select.form-control:focus::-ms-value{color:#495057;background-color:#fff}#PTTChat .form-control-file,#PTTChat .form-control-range{display:block;width:100%}#PTTChat .col-form-label{padding-top:4.75px;padding-bottom:4.75px;margin-bottom:0;font-size:inherit;line-height:1.5}#PTTChat .col-form-label-lg{padding-top:4px;padding-bottom:4px;font-size:15px;line-height:1.5}#PTTChat .col-form-label-sm{padding-top:3.5px;padding-bottom:3.5px;font-size:10.5px;line-height:18px}#PTTChat .form-control-plaintext{display:block;width:100%;padding:3.75px 0;margin-bottom:0;font-size:12px;line-height:1.5;color:#212529;background-color:transparent;border:solid transparent;border-width:1px 0}#PTTChat .form-control-plaintext.form-control-sm,#PTTChat .form-control-plaintext.form-control-lg{padding-right:0;padding-left:0}#PTTChat .form-control-sm{height:add(18px, add(5px, 2px, false));padding:2.5px .5rem;font-size:10.5px;line-height:18px;border-radius:2.5px}#PTTChat .form-control-lg{height:add(1.5, add(6px, 2px, false));padding:3px 10px;font-size:15px;line-height:1.5;border-radius:2.5px}#PTTChat select.form-control[size],#PTTChat select.form-control[multiple]{height:auto}#PTTChat textarea.form-control{height:auto}#PTTChat .form-group{margin-bottom:1rem}#PTTChat .form-text{display:block;margin-top:.25rem}#PTTChat .form-row{display:flex;flex-wrap:wrap;margin-right:-5px;margin-left:-5px}#PTTChat .form-row>.col,#PTTChat .form-row>[class*=\"col-\"]{padding-right:5px;padding-left:5px}#PTTChat .form-check{position:relative;display:block;padding-left:1.25rem}#PTTChat .form-check-input{position:absolute;margin-top:.3rem;margin-left:-1.25rem}#PTTChat .form-check-input[disabled] ~ .form-check-label,#PTTChat .form-check-input:disabled ~ .form-check-label{color:#6c757d}#PTTChat .form-check-label{margin-bottom:0}#PTTChat .form-check-inline{display:inline-flex;align-items:center;padding-left:0;margin-right:.75rem}#PTTChat .form-check-inline .form-check-input{position:static;margin-top:0;margin-right:.3125rem;margin-left:0}#PTTChat .valid-feedback{display:none;width:100%;margin-top:.25rem;font-size:80%;color:#28a745}#PTTChat .valid-tooltip{position:absolute;top:100%;left:0;z-index:5;display:none;max-width:100%;padding:.25rem .5rem;margin-top:.1rem;font-size:10.5px;line-height:1.5;color:#fff;background-color:rgba(40,167,69,0.9);border-radius:2.5px}.form-row>.col>#PTTChat .valid-tooltip,.form-row>[class*=\"col-\"]>#PTTChat .valid-tooltip{left:5px}.was-validated #PTTChat:valid ~ .valid-feedback,.was-validated #PTTChat:valid ~ .valid-tooltip,#PTTChat.is-valid ~ .valid-feedback,#PTTChat.is-valid ~ .valid-tooltip{display:block}.was-validated #PTTChat .form-control:valid,#PTTChat .form-control.is-valid{border-color:#28a745;padding-right:add(1.5, 7.5px) !important;background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right add(.375, 1.875px) center;background-size:add(.75, 3.75px) add(.75, 3.75px)}.was-validated #PTTChat .form-control:valid:focus,#PTTChat .form-control.is-valid:focus{border-color:#28a745;box-shadow:0 0 0 2px rgba(40,167,69,0.25)}.was-validated #PTTChat select.form-control:valid,#PTTChat select.form-control.is-valid{padding-right:30px !important;background-position:right 15px center}.was-validated #PTTChat textarea.form-control:valid,#PTTChat textarea.form-control.is-valid{padding-right:add(1.5, 7.5px);background-position:top add(.375, 1.875px) right add(.375, 1.875px)}.was-validated #PTTChat .custom-select:valid,#PTTChat .custom-select.is-valid{border-color:#28a745;padding-right:add(7.5px, 23.125px) !important;background:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") right 7.5px center/8px 10px no-repeat,#fff url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e\") center right 17.5px/add(.75, 3.75px) add(.75, 3.75px) no-repeat}.was-validated #PTTChat .custom-select:valid:focus,#PTTChat .custom-select.is-valid:focus{border-color:#28a745;box-shadow:0 0 0 2px rgba(40,167,69,0.25)}.was-validated #PTTChat .form-check-input:valid ~ .form-check-label,#PTTChat .form-check-input.is-valid ~ .form-check-label{color:#28a745}.was-validated #PTTChat .form-check-input:valid ~ .valid-feedback,.was-validated #PTTChat .form-check-input:valid ~ .valid-tooltip,#PTTChat .form-check-input.is-valid ~ .valid-feedback,#PTTChat .form-check-input.is-valid ~ .valid-tooltip{display:block}.was-validated #PTTChat .custom-control-input:valid ~ .custom-control-label,#PTTChat .custom-control-input.is-valid ~ .custom-control-label{color:#28a745}.was-validated #PTTChat .custom-control-input:valid ~ .custom-control-label::before,#PTTChat .custom-control-input.is-valid ~ .custom-control-label::before{border-color:#28a745}.was-validated #PTTChat .custom-control-input:valid:checked ~ .custom-control-label::before,#PTTChat .custom-control-input.is-valid:checked ~ .custom-control-label::before{border-color:#34ce57;background-color:#34ce57}.was-validated #PTTChat .custom-control-input:valid:focus ~ .custom-control-label::before,#PTTChat .custom-control-input.is-valid:focus ~ .custom-control-label::before{box-shadow:0 0 0 2px rgba(40,167,69,0.25)}.was-validated #PTTChat .custom-control-input:valid:focus:not(:checked) ~ .custom-control-label::before,#PTTChat .custom-control-input.is-valid:focus:not(:checked) ~ .custom-control-label::before{border-color:#28a745}.was-validated #PTTChat .custom-file-input:valid ~ .custom-file-label,#PTTChat .custom-file-input.is-valid ~ .custom-file-label{border-color:#28a745}.was-validated #PTTChat .custom-file-input:valid:focus ~ .custom-file-label,#PTTChat .custom-file-input.is-valid:focus ~ .custom-file-label{border-color:#28a745;box-shadow:0 0 0 2px rgba(40,167,69,0.25)}#PTTChat .invalid-feedback{display:none;width:100%;margin-top:.25rem;font-size:80%;color:#dc3545}#PTTChat .invalid-tooltip{position:absolute;top:100%;left:0;z-index:5;display:none;max-width:100%;padding:.25rem .5rem;margin-top:.1rem;font-size:10.5px;line-height:1.5;color:#fff;background-color:rgba(220,53,69,0.9);border-radius:2.5px}.form-row>.col>#PTTChat .invalid-tooltip,.form-row>[class*=\"col-\"]>#PTTChat .invalid-tooltip{left:5px}.was-validated #PTTChat:invalid ~ .invalid-feedback,.was-validated #PTTChat:invalid ~ .invalid-tooltip,#PTTChat.is-invalid ~ .invalid-feedback,#PTTChat.is-invalid ~ .invalid-tooltip{display:block}.was-validated #PTTChat .form-control:invalid,#PTTChat .form-control.is-invalid{border-color:#dc3545;padding-right:add(1.5, 7.5px) !important;background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\");background-repeat:no-repeat;background-position:right add(.375, 1.875px) center;background-size:add(.75, 3.75px) add(.75, 3.75px)}.was-validated #PTTChat .form-control:invalid:focus,#PTTChat .form-control.is-invalid:focus{border-color:#dc3545;box-shadow:0 0 0 2px rgba(220,53,69,0.25)}.was-validated #PTTChat select.form-control:invalid,#PTTChat select.form-control.is-invalid{padding-right:30px !important;background-position:right 15px center}.was-validated #PTTChat textarea.form-control:invalid,#PTTChat textarea.form-control.is-invalid{padding-right:add(1.5, 7.5px);background-position:top add(.375, 1.875px) right add(.375, 1.875px)}.was-validated #PTTChat .custom-select:invalid,#PTTChat .custom-select.is-invalid{border-color:#dc3545;padding-right:add(7.5px, 23.125px) !important;background:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='4' height='5' viewBox='0 0 4 5'%3e%3cpath fill='%23343a40' d='M2 0L0 2h4zm0 5L0 3h4z'/%3e%3c/svg%3e\") right 7.5px center/8px 10px no-repeat,#fff url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e\") center right 17.5px/add(.75, 3.75px) add(.75, 3.75px) no-repeat}.was-validated #PTTChat .custom-select:invalid:focus,#PTTChat .custom-select.is-invalid:focus{border-color:#dc3545;box-shadow:0 0 0 2px rgba(220,53,69,0.25)}.was-validated #PTTChat .form-check-input:invalid ~ .form-check-label,#PTTChat .form-check-input.is-invalid ~ .form-check-label{color:#dc3545}.was-validated #PTTChat .form-check-input:invalid ~ .invalid-feedback,.was-validated #PTTChat .form-check-input:invalid ~ .invalid-tooltip,#PTTChat .form-check-input.is-invalid ~ .invalid-feedback,#PTTChat .form-check-input.is-invalid ~ .invalid-tooltip{display:block}.was-validated #PTTChat .custom-control-input:invalid ~ .custom-control-label,#PTTChat .custom-control-input.is-invalid ~ .custom-control-label{color:#dc3545}.was-validated #PTTChat .custom-control-input:invalid ~ .custom-control-label::before,#PTTChat .custom-control-input.is-invalid ~ .custom-control-label::before{border-color:#dc3545}.was-validated #PTTChat .custom-control-input:invalid:checked ~ .custom-control-label::before,#PTTChat .custom-control-input.is-invalid:checked ~ .custom-control-label::before{border-color:#e4606d;background-color:#e4606d}.was-validated #PTTChat .custom-control-input:invalid:focus ~ .custom-control-label::before,#PTTChat .custom-control-input.is-invalid:focus ~ .custom-control-label::before{box-shadow:0 0 0 2px rgba(220,53,69,0.25)}.was-validated #PTTChat .custom-control-input:invalid:focus:not(:checked) ~ .custom-control-label::before,#PTTChat .custom-control-input.is-invalid:focus:not(:checked) ~ .custom-control-label::before{border-color:#dc3545}.was-validated #PTTChat .custom-file-input:invalid ~ .custom-file-label,#PTTChat .custom-file-input.is-invalid ~ .custom-file-label{border-color:#dc3545}.was-validated #PTTChat .custom-file-input:invalid:focus ~ .custom-file-label,#PTTChat .custom-file-input.is-invalid:focus ~ .custom-file-label{border-color:#dc3545;box-shadow:0 0 0 2px rgba(220,53,69,0.25)}#PTTChat .form-inline{display:flex;flex-flow:row wrap;align-items:center}#PTTChat .form-inline .form-check{width:100%}@media (min-width: 576px){#PTTChat .form-inline label{display:flex;align-items:center;justify-content:center;margin-bottom:0}#PTTChat .form-inline .form-group{display:flex;flex:0 0 auto;flex-flow:row wrap;align-items:center;margin-bottom:0}#PTTChat .form-inline .form-control{display:inline-block;width:auto;vertical-align:middle}#PTTChat .form-inline .form-control-plaintext{display:inline-block}#PTTChat .form-inline .input-group,#PTTChat .form-inline .custom-select{width:auto}#PTTChat .form-inline .form-check{display:flex;align-items:center;justify-content:center;width:auto;padding-left:0}#PTTChat .form-inline .form-check-input{position:relative;flex-shrink:0;margin-top:0;margin-right:.25rem;margin-left:0}#PTTChat .form-inline .custom-control{align-items:center;justify-content:center}#PTTChat .form-inline .custom-control-label{margin-bottom:0}}#PTTChat .btn{display:inline-block;font-weight:400;color:#212529;text-align:center;vertical-align:middle;user-select:none;background-color:transparent;border:1px solid transparent;padding:3.75px 7.5px;font-size:12px;line-height:1.5;border-radius:2.5px;transition:color 0.15s ease-in-out,background-color 0.15s ease-in-out,border-color 0.15s ease-in-out,box-shadow 0.15s ease-in-out}@media (prefers-reduced-motion: reduce){#PTTChat .btn{transition:none}}#PTTChat .btn:hover{color:#212529;text-decoration:none}#PTTChat .btn:focus,#PTTChat .btn.focus{outline:0;box-shadow:0 0 0 2px rgba(0,123,255,0.25)}#PTTChat .btn.disabled,#PTTChat .btn:disabled{opacity:.65}#PTTChat .btn:not(:disabled):not(.disabled){cursor:pointer}#PTTChat a.btn.disabled,#PTTChat fieldset:disabled a.btn{pointer-events:none}#PTTChat .btn-primary{color:#fff;background-color:#007bff;border-color:#007bff}#PTTChat .btn-primary:hover{color:#fff;background-color:#0069d9;border-color:#0062cc}#PTTChat .btn-primary:focus,#PTTChat .btn-primary.focus{color:#fff;background-color:#0069d9;border-color:#0062cc;box-shadow:0 0 0 2px rgba(38,143,255,0.5)}#PTTChat .btn-primary.disabled,#PTTChat .btn-primary:disabled{color:#fff;background-color:#007bff;border-color:#007bff}#PTTChat .btn-primary:not(:disabled):not(.disabled):active,#PTTChat .btn-primary:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-primary.dropdown-toggle{color:#fff;background-color:#0062cc;border-color:#005cbf}#PTTChat .btn-primary:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-primary:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-primary.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(38,143,255,0.5)}#PTTChat .btn-secondary{color:#fff;background-color:#6c757d;border-color:#6c757d}#PTTChat .btn-secondary:hover{color:#fff;background-color:#5a6268;border-color:#545b62}#PTTChat .btn-secondary:focus,#PTTChat .btn-secondary.focus{color:#fff;background-color:#5a6268;border-color:#545b62;box-shadow:0 0 0 2px rgba(130,138,145,0.5)}#PTTChat .btn-secondary.disabled,#PTTChat .btn-secondary:disabled{color:#fff;background-color:#6c757d;border-color:#6c757d}#PTTChat .btn-secondary:not(:disabled):not(.disabled):active,#PTTChat .btn-secondary:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-secondary.dropdown-toggle{color:#fff;background-color:#545b62;border-color:#4e555b}#PTTChat .btn-secondary:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-secondary:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-secondary.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(130,138,145,0.5)}#PTTChat .btn-success{color:#fff;background-color:#28a745;border-color:#28a745}#PTTChat .btn-success:hover{color:#fff;background-color:#218838;border-color:#1e7e34}#PTTChat .btn-success:focus,#PTTChat .btn-success.focus{color:#fff;background-color:#218838;border-color:#1e7e34;box-shadow:0 0 0 2px rgba(72,180,97,0.5)}#PTTChat .btn-success.disabled,#PTTChat .btn-success:disabled{color:#fff;background-color:#28a745;border-color:#28a745}#PTTChat .btn-success:not(:disabled):not(.disabled):active,#PTTChat .btn-success:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-success.dropdown-toggle{color:#fff;background-color:#1e7e34;border-color:#1c7430}#PTTChat .btn-success:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-success:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-success.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(72,180,97,0.5)}#PTTChat .btn-info{color:#fff;background-color:#17a2b8;border-color:#17a2b8}#PTTChat .btn-info:hover{color:#fff;background-color:#138496;border-color:#117a8b}#PTTChat .btn-info:focus,#PTTChat .btn-info.focus{color:#fff;background-color:#138496;border-color:#117a8b;box-shadow:0 0 0 2px rgba(58,176,195,0.5)}#PTTChat .btn-info.disabled,#PTTChat .btn-info:disabled{color:#fff;background-color:#17a2b8;border-color:#17a2b8}#PTTChat .btn-info:not(:disabled):not(.disabled):active,#PTTChat .btn-info:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-info.dropdown-toggle{color:#fff;background-color:#117a8b;border-color:#10707f}#PTTChat .btn-info:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-info:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-info.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(58,176,195,0.5)}#PTTChat .btn-warning{color:#212529;background-color:#ffc107;border-color:#ffc107}#PTTChat .btn-warning:hover{color:#212529;background-color:#e0a800;border-color:#d39e00}#PTTChat .btn-warning:focus,#PTTChat .btn-warning.focus{color:#212529;background-color:#e0a800;border-color:#d39e00;box-shadow:0 0 0 2px rgba(222,170,12,0.5)}#PTTChat .btn-warning.disabled,#PTTChat .btn-warning:disabled{color:#212529;background-color:#ffc107;border-color:#ffc107}#PTTChat .btn-warning:not(:disabled):not(.disabled):active,#PTTChat .btn-warning:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-warning.dropdown-toggle{color:#212529;background-color:#d39e00;border-color:#c69500}#PTTChat .btn-warning:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-warning:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-warning.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(222,170,12,0.5)}#PTTChat .btn-danger{color:#fff;background-color:#dc3545;border-color:#dc3545}#PTTChat .btn-danger:hover{color:#fff;background-color:#c82333;border-color:#bd2130}#PTTChat .btn-danger:focus,#PTTChat .btn-danger.focus{color:#fff;background-color:#c82333;border-color:#bd2130;box-shadow:0 0 0 2px rgba(225,83,97,0.5)}#PTTChat .btn-danger.disabled,#PTTChat .btn-danger:disabled{color:#fff;background-color:#dc3545;border-color:#dc3545}#PTTChat .btn-danger:not(:disabled):not(.disabled):active,#PTTChat .btn-danger:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-danger.dropdown-toggle{color:#fff;background-color:#bd2130;border-color:#b21f2d}#PTTChat .btn-danger:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-danger:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-danger.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(225,83,97,0.5)}#PTTChat .btn-light{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}#PTTChat .btn-light:hover{color:#212529;background-color:#e2e6ea;border-color:#dae0e5}#PTTChat .btn-light:focus,#PTTChat .btn-light.focus{color:#212529;background-color:#e2e6ea;border-color:#dae0e5;box-shadow:0 0 0 2px rgba(216,217,219,0.5)}#PTTChat .btn-light.disabled,#PTTChat .btn-light:disabled{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}#PTTChat .btn-light:not(:disabled):not(.disabled):active,#PTTChat .btn-light:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-light.dropdown-toggle{color:#212529;background-color:#dae0e5;border-color:#d3d9df}#PTTChat .btn-light:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-light:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-light.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(216,217,219,0.5)}#PTTChat .btn-dark{color:#fff;background-color:#343a40;border-color:#343a40}#PTTChat .btn-dark:hover{color:#fff;background-color:#23272b;border-color:#1d2124}#PTTChat .btn-dark:focus,#PTTChat .btn-dark.focus{color:#fff;background-color:#23272b;border-color:#1d2124;box-shadow:0 0 0 2px rgba(82,88,93,0.5)}#PTTChat .btn-dark.disabled,#PTTChat .btn-dark:disabled{color:#fff;background-color:#343a40;border-color:#343a40}#PTTChat .btn-dark:not(:disabled):not(.disabled):active,#PTTChat .btn-dark:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-dark.dropdown-toggle{color:#fff;background-color:#1d2124;border-color:#171a1d}#PTTChat .btn-dark:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-dark:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-dark.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(82,88,93,0.5)}#PTTChat .btn-outline-primary{color:#007bff;border-color:#007bff}#PTTChat .btn-outline-primary:hover{color:#fff;background-color:#007bff;border-color:#007bff}#PTTChat .btn-outline-primary:focus,#PTTChat .btn-outline-primary.focus{box-shadow:0 0 0 2px rgba(0,123,255,0.5)}#PTTChat .btn-outline-primary.disabled,#PTTChat .btn-outline-primary:disabled{color:#007bff;background-color:transparent}#PTTChat .btn-outline-primary:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-primary:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-primary.dropdown-toggle{color:#fff;background-color:#007bff;border-color:#007bff}#PTTChat .btn-outline-primary:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-primary:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-primary.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(0,123,255,0.5)}#PTTChat .btn-outline-secondary{color:#6c757d;border-color:#6c757d}#PTTChat .btn-outline-secondary:hover{color:#fff;background-color:#6c757d;border-color:#6c757d}#PTTChat .btn-outline-secondary:focus,#PTTChat .btn-outline-secondary.focus{box-shadow:0 0 0 2px rgba(108,117,125,0.5)}#PTTChat .btn-outline-secondary.disabled,#PTTChat .btn-outline-secondary:disabled{color:#6c757d;background-color:transparent}#PTTChat .btn-outline-secondary:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-secondary:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-secondary.dropdown-toggle{color:#fff;background-color:#6c757d;border-color:#6c757d}#PTTChat .btn-outline-secondary:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-secondary:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-secondary.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(108,117,125,0.5)}#PTTChat .btn-outline-success{color:#28a745;border-color:#28a745}#PTTChat .btn-outline-success:hover{color:#fff;background-color:#28a745;border-color:#28a745}#PTTChat .btn-outline-success:focus,#PTTChat .btn-outline-success.focus{box-shadow:0 0 0 2px rgba(40,167,69,0.5)}#PTTChat .btn-outline-success.disabled,#PTTChat .btn-outline-success:disabled{color:#28a745;background-color:transparent}#PTTChat .btn-outline-success:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-success:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-success.dropdown-toggle{color:#fff;background-color:#28a745;border-color:#28a745}#PTTChat .btn-outline-success:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-success:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-success.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(40,167,69,0.5)}#PTTChat .btn-outline-info{color:#17a2b8;border-color:#17a2b8}#PTTChat .btn-outline-info:hover{color:#fff;background-color:#17a2b8;border-color:#17a2b8}#PTTChat .btn-outline-info:focus,#PTTChat .btn-outline-info.focus{box-shadow:0 0 0 2px rgba(23,162,184,0.5)}#PTTChat .btn-outline-info.disabled,#PTTChat .btn-outline-info:disabled{color:#17a2b8;background-color:transparent}#PTTChat .btn-outline-info:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-info:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-info.dropdown-toggle{color:#fff;background-color:#17a2b8;border-color:#17a2b8}#PTTChat .btn-outline-info:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-info:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-info.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(23,162,184,0.5)}#PTTChat .btn-outline-warning{color:#ffc107;border-color:#ffc107}#PTTChat .btn-outline-warning:hover{color:#212529;background-color:#ffc107;border-color:#ffc107}#PTTChat .btn-outline-warning:focus,#PTTChat .btn-outline-warning.focus{box-shadow:0 0 0 2px rgba(255,193,7,0.5)}#PTTChat .btn-outline-warning.disabled,#PTTChat .btn-outline-warning:disabled{color:#ffc107;background-color:transparent}#PTTChat .btn-outline-warning:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-warning:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-warning.dropdown-toggle{color:#212529;background-color:#ffc107;border-color:#ffc107}#PTTChat .btn-outline-warning:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-warning:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-warning.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(255,193,7,0.5)}#PTTChat .btn-outline-danger{color:#dc3545;border-color:#dc3545}#PTTChat .btn-outline-danger:hover{color:#fff;background-color:#dc3545;border-color:#dc3545}#PTTChat .btn-outline-danger:focus,#PTTChat .btn-outline-danger.focus{box-shadow:0 0 0 2px rgba(220,53,69,0.5)}#PTTChat .btn-outline-danger.disabled,#PTTChat .btn-outline-danger:disabled{color:#dc3545;background-color:transparent}#PTTChat .btn-outline-danger:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-danger:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-danger.dropdown-toggle{color:#fff;background-color:#dc3545;border-color:#dc3545}#PTTChat .btn-outline-danger:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-danger:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-danger.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(220,53,69,0.5)}#PTTChat .btn-outline-light{color:#f8f9fa;border-color:#f8f9fa}#PTTChat .btn-outline-light:hover{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}#PTTChat .btn-outline-light:focus,#PTTChat .btn-outline-light.focus{box-shadow:0 0 0 2px rgba(248,249,250,0.5)}#PTTChat .btn-outline-light.disabled,#PTTChat .btn-outline-light:disabled{color:#f8f9fa;background-color:transparent}#PTTChat .btn-outline-light:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-light:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-light.dropdown-toggle{color:#212529;background-color:#f8f9fa;border-color:#f8f9fa}#PTTChat .btn-outline-light:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-light:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-light.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(248,249,250,0.5)}#PTTChat .btn-outline-dark{color:#343a40;border-color:#343a40}#PTTChat .btn-outline-dark:hover{color:#fff;background-color:#343a40;border-color:#343a40}#PTTChat .btn-outline-dark:focus,#PTTChat .btn-outline-dark.focus{box-shadow:0 0 0 2px rgba(52,58,64,0.5)}#PTTChat .btn-outline-dark.disabled,#PTTChat .btn-outline-dark:disabled{color:#343a40;background-color:transparent}#PTTChat .btn-outline-dark:not(:disabled):not(.disabled):active,#PTTChat .btn-outline-dark:not(:disabled):not(.disabled).active,.show>#PTTChat .btn-outline-dark.dropdown-toggle{color:#fff;background-color:#343a40;border-color:#343a40}#PTTChat .btn-outline-dark:not(:disabled):not(.disabled):active:focus,#PTTChat .btn-outline-dark:not(:disabled):not(.disabled).active:focus,.show>#PTTChat .btn-outline-dark.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(52,58,64,0.5)}#PTTChat .btn-link{font-weight:400;color:#007bff;text-decoration:none}#PTTChat .btn-link:hover{color:#0056b3;text-decoration:underline}#PTTChat .btn-link:focus,#PTTChat .btn-link.focus{text-decoration:underline}#PTTChat .btn-link:disabled,#PTTChat .btn-link.disabled{color:#6c757d;pointer-events:none}#PTTChat .btn-lg,#PTTChat .btn-group-lg>.btn{padding:3px 10px;font-size:15px;line-height:1.5;border-radius:2.5px}#PTTChat .btn-sm,#PTTChat .btn-group-sm>.btn{padding:2.5px .5rem;font-size:10.5px;line-height:18px;border-radius:2.5px}#PTTChat .btn-block{display:block;width:100%}#PTTChat .btn-block+.btn-block{margin-top:.5rem}#PTTChat input[type=\"submit\"].btn-block,#PTTChat input[type=\"reset\"].btn-block,#PTTChat input[type=\"button\"].btn-block{width:100%}#PTTChat .fade{transition:opacity 0.15s linear}@media (prefers-reduced-motion: reduce){#PTTChat .fade{transition:none}}#PTTChat .fade:not(.show){opacity:0}#PTTChat .collapse:not(.show){display:none}#PTTChat .collapsing{position:relative;height:0;overflow:hidden;transition:height 0.35s ease}@media (prefers-reduced-motion: reduce){#PTTChat .collapsing{transition:none}}#PTTChat .dropup,#PTTChat .dropright,#PTTChat .dropdown,#PTTChat .dropleft{position:relative}#PTTChat .dropdown-toggle{white-space:nowrap}#PTTChat .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";border-top:.3em solid;border-right:.3em solid transparent;border-bottom:0;border-left:.3em solid transparent}#PTTChat .dropdown-toggle:empty::after{margin-left:0}#PTTChat .dropdown-menu{position:absolute;top:100%;left:0;z-index:1000;display:none;float:left;min-width:10rem;padding:.5rem 0;margin:.125rem 0 0;font-size:12px;color:#212529;text-align:left;list-style:none;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,0.15);border-radius:2.5px}#PTTChat .dropdown-menu-left{right:auto;left:0}#PTTChat .dropdown-menu-right{right:0;left:auto}@media (min-width: 576px){#PTTChat .dropdown-menu-sm-left{right:auto;left:0}#PTTChat .dropdown-menu-sm-right{right:0;left:auto}}@media (min-width: 768px){#PTTChat .dropdown-menu-md-left{right:auto;left:0}#PTTChat .dropdown-menu-md-right{right:0;left:auto}}@media (min-width: 992px){#PTTChat .dropdown-menu-lg-left{right:auto;left:0}#PTTChat .dropdown-menu-lg-right{right:0;left:auto}}@media (min-width: 1200px){#PTTChat .dropdown-menu-xl-left{right:auto;left:0}#PTTChat .dropdown-menu-xl-right{right:0;left:auto}}#PTTChat .dropup .dropdown-menu{top:auto;bottom:100%;margin-top:0;margin-bottom:.125rem}#PTTChat .dropup .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";border-top:0;border-right:.3em solid transparent;border-bottom:.3em solid;border-left:.3em solid transparent}#PTTChat .dropup .dropdown-toggle:empty::after{margin-left:0}#PTTChat .dropright .dropdown-menu{top:0;right:auto;left:100%;margin-top:0;margin-left:.125rem}#PTTChat .dropright .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\";border-top:.3em solid transparent;border-right:0;border-bottom:.3em solid transparent;border-left:.3em solid}#PTTChat .dropright .dropdown-toggle:empty::after{margin-left:0}#PTTChat .dropright .dropdown-toggle::after{vertical-align:0}#PTTChat .dropleft .dropdown-menu{top:0;right:100%;left:auto;margin-top:0;margin-right:.125rem}#PTTChat .dropleft .dropdown-toggle::after{display:inline-block;margin-left:.255em;vertical-align:.255em;content:\"\"}#PTTChat .dropleft .dropdown-toggle::after{display:none}#PTTChat .dropleft .dropdown-toggle::before{display:inline-block;margin-right:.255em;vertical-align:.255em;content:\"\";border-top:.3em solid transparent;border-right:.3em solid;border-bottom:.3em solid transparent}#PTTChat .dropleft .dropdown-toggle:empty::after{margin-left:0}#PTTChat .dropleft .dropdown-toggle::before{vertical-align:0}#PTTChat .dropdown-menu[x-placement^=\"top\"],#PTTChat .dropdown-menu[x-placement^=\"right\"],#PTTChat .dropdown-menu[x-placement^=\"bottom\"],#PTTChat .dropdown-menu[x-placement^=\"left\"]{right:auto;bottom:auto}#PTTChat .dropdown-divider{height:0;margin:5px 0;overflow:hidden;border-top:1px solid #e9ecef}#PTTChat .dropdown-item{display:block;width:100%;padding:.25rem 1.5rem;clear:both;font-weight:400;color:#212529;text-align:inherit;white-space:nowrap;background-color:transparent;border:0}#PTTChat .dropdown-item:hover,#PTTChat .dropdown-item:focus{color:#16181b;text-decoration:none;background-color:#e9ecef}#PTTChat .dropdown-item.active,#PTTChat .dropdown-item:active{color:#fff;text-decoration:none;background-color:#007bff}#PTTChat .dropdown-item.disabled,#PTTChat .dropdown-item:disabled{color:#adb5bd;pointer-events:none;background-color:transparent}#PTTChat .dropdown-menu.show{display:block}#PTTChat .dropdown-header{display:block;padding:.5rem 1.5rem;margin-bottom:0;font-size:10.5px;color:#6c757d;white-space:nowrap}#PTTChat .dropdown-item-text{display:block;padding:.25rem 1.5rem;color:#212529}#PTTChat .btn-group,#PTTChat .btn-group-vertical{position:relative;display:inline-flex;vertical-align:middle}#PTTChat .btn-group>.btn,#PTTChat .btn-group-vertical>.btn{position:relative;flex:1 1 auto}#PTTChat .btn-group>.btn:hover,#PTTChat .btn-group-vertical>.btn:hover{z-index:1}#PTTChat .btn-group>.btn:focus,#PTTChat .btn-group>.btn:active,#PTTChat .btn-group>.btn.active,#PTTChat .btn-group-vertical>.btn:focus,#PTTChat .btn-group-vertical>.btn:active,#PTTChat .btn-group-vertical>.btn.active{z-index:1}#PTTChat .btn-toolbar{display:flex;flex-wrap:wrap;justify-content:flex-start}#PTTChat .btn-toolbar .input-group{width:auto}#PTTChat .btn-group>.btn:not(:first-child),#PTTChat .btn-group>.btn-group:not(:first-child){margin-left:-1px}#PTTChat .btn-group>.btn:not(:last-child):not(.dropdown-toggle),#PTTChat .btn-group>.btn-group:not(:last-child)>.btn{border-top-right-radius:0;border-bottom-right-radius:0}#PTTChat .btn-group>.btn:not(:first-child),#PTTChat .btn-group>.btn-group:not(:first-child)>.btn{border-top-left-radius:0;border-bottom-left-radius:0}#PTTChat .dropdown-toggle-split{padding-right:5.625px;padding-left:5.625px}#PTTChat .dropdown-toggle-split::after,.dropup #PTTChat .dropdown-toggle-split::after,.dropright #PTTChat .dropdown-toggle-split::after{margin-left:0}.dropleft #PTTChat .dropdown-toggle-split::before{margin-right:0}#PTTChat .btn-sm+.dropdown-toggle-split,#PTTChat .btn-group-sm>.btn+.dropdown-toggle-split{padding-right:.375rem;padding-left:.375rem}#PTTChat .btn-lg+.dropdown-toggle-split,#PTTChat .btn-group-lg>.btn+.dropdown-toggle-split{padding-right:7.5px;padding-left:7.5px}#PTTChat .btn-group-vertical{flex-direction:column;align-items:flex-start;justify-content:center}#PTTChat .btn-group-vertical>.btn,#PTTChat .btn-group-vertical>.btn-group{width:100%}#PTTChat .btn-group-vertical>.btn:not(:first-child),#PTTChat .btn-group-vertical>.btn-group:not(:first-child){margin-top:-1px}#PTTChat .btn-group-vertical>.btn:not(:last-child):not(.dropdown-toggle),#PTTChat .btn-group-vertical>.btn-group:not(:last-child)>.btn{border-bottom-right-radius:0;border-bottom-left-radius:0}#PTTChat .btn-group-vertical>.btn:not(:first-child),#PTTChat .btn-group-vertical>.btn-group:not(:first-child)>.btn{border-top-left-radius:0;border-top-right-radius:0}#PTTChat .btn-group-toggle>.btn,#PTTChat .btn-group-toggle>.btn-group>.btn{margin-bottom:0}#PTTChat .btn-group-toggle>.btn input[type=\"radio\"],#PTTChat .btn-group-toggle>.btn input[type=\"checkbox\"],#PTTChat .btn-group-toggle>.btn-group>.btn input[type=\"radio\"],#PTTChat .btn-group-toggle>.btn-group>.btn input[type=\"checkbox\"]{position:absolute;clip:rect(0, 0, 0, 0);pointer-events:none}#PTTChat .nav{display:flex;flex-wrap:wrap;padding-left:0;margin-bottom:0;list-style:none}#PTTChat .nav-link{display:block;padding:5px 10px}#PTTChat .nav-link:hover,#PTTChat .nav-link:focus{text-decoration:none}#PTTChat .nav-link.disabled{color:#6c757d;pointer-events:none;cursor:default}#PTTChat .nav-tabs{border-bottom:1px solid #dee2e6}#PTTChat .nav-tabs .nav-link{margin-bottom:-1px;border:1px solid transparent;border-top-left-radius:2.5px;border-top-right-radius:2.5px}#PTTChat .nav-tabs .nav-link:hover,#PTTChat .nav-tabs .nav-link:focus{border-color:#e9ecef #e9ecef #dee2e6}#PTTChat .nav-tabs .nav-link.disabled{color:#6c757d;background-color:transparent;border-color:transparent}#PTTChat .nav-tabs .nav-link.active,#PTTChat .nav-tabs .nav-item.show .nav-link{color:#495057;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat .nav-tabs .dropdown-menu{margin-top:-1px;border-top-left-radius:0;border-top-right-radius:0}#PTTChat .nav-pills .nav-link{border-radius:2.5px}#PTTChat .nav-pills .nav-link.active,#PTTChat .nav-pills .show>.nav-link{color:#fff;background-color:#007bff}#PTTChat .nav-fill>.nav-link,#PTTChat .nav-fill .nav-item{flex:1 1 auto;text-align:center}#PTTChat .nav-justified>.nav-link,#PTTChat .nav-justified .nav-item{flex-basis:0;flex-grow:1;text-align:center}#PTTChat .tab-content>.tab-pane{display:none}#PTTChat .tab-content>.active{display:block}#PTTChat .navbar{position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;padding:5px 10px}#PTTChat .navbar .container,#PTTChat .navbar .container-fluid,#PTTChat .navbar .container-sm,#PTTChat .navbar .container-md,#PTTChat .navbar .container-lg,#PTTChat .navbar .container-xl{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between}#PTTChat .navbar-brand{display:inline-block;padding-top:2.75px;padding-bottom:2.75px;margin-right:10px;font-size:15px;line-height:inherit;white-space:nowrap}#PTTChat .navbar-brand:hover,#PTTChat .navbar-brand:focus{text-decoration:none}#PTTChat .navbar-nav{display:flex;flex-direction:column;padding-left:0;margin-bottom:0;list-style:none}#PTTChat .navbar-nav .nav-link{padding-right:0;padding-left:0}#PTTChat .navbar-nav .dropdown-menu{position:static;float:none}#PTTChat .navbar-text{display:inline-block;padding-top:5px;padding-bottom:5px}#PTTChat .navbar-collapse{flex-basis:100%;flex-grow:1;align-items:center}#PTTChat .navbar-toggler{padding:.25rem .75rem;font-size:15px;line-height:1;background-color:transparent;border:1px solid transparent;border-radius:2.5px}#PTTChat .navbar-toggler:hover,#PTTChat .navbar-toggler:focus{text-decoration:none}#PTTChat .navbar-toggler-icon{display:inline-block;width:1.5em;height:1.5em;vertical-align:middle;content:\"\";background:50% / 100% 100% no-repeat}#PTTChat .navbar-nav-scroll{max-height:75vh;overflow-y:auto}@media (max-width: 575.98px){#PTTChat .navbar-expand-sm>.container,#PTTChat .navbar-expand-sm>.container-fluid,#PTTChat .navbar-expand-sm>.container-sm,#PTTChat .navbar-expand-sm>.container-md,#PTTChat .navbar-expand-sm>.container-lg,#PTTChat .navbar-expand-sm>.container-xl{padding-right:0;padding-left:0}}@media (min-width: 576px){#PTTChat .navbar-expand-sm{flex-flow:row nowrap;justify-content:flex-start}#PTTChat .navbar-expand-sm .navbar-nav{flex-direction:row}#PTTChat .navbar-expand-sm .navbar-nav .dropdown-menu{position:absolute}#PTTChat .navbar-expand-sm .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}#PTTChat .navbar-expand-sm>.container,#PTTChat .navbar-expand-sm>.container-fluid,#PTTChat .navbar-expand-sm>.container-sm,#PTTChat .navbar-expand-sm>.container-md,#PTTChat .navbar-expand-sm>.container-lg,#PTTChat .navbar-expand-sm>.container-xl{flex-wrap:nowrap}#PTTChat .navbar-expand-sm .navbar-nav-scroll{overflow:visible}#PTTChat .navbar-expand-sm .navbar-collapse{display:flex !important;flex-basis:auto}#PTTChat .navbar-expand-sm .navbar-toggler{display:none}}@media (max-width: 767.98px){#PTTChat .navbar-expand-md>.container,#PTTChat .navbar-expand-md>.container-fluid,#PTTChat .navbar-expand-md>.container-sm,#PTTChat .navbar-expand-md>.container-md,#PTTChat .navbar-expand-md>.container-lg,#PTTChat .navbar-expand-md>.container-xl{padding-right:0;padding-left:0}}@media (min-width: 768px){#PTTChat .navbar-expand-md{flex-flow:row nowrap;justify-content:flex-start}#PTTChat .navbar-expand-md .navbar-nav{flex-direction:row}#PTTChat .navbar-expand-md .navbar-nav .dropdown-menu{position:absolute}#PTTChat .navbar-expand-md .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}#PTTChat .navbar-expand-md>.container,#PTTChat .navbar-expand-md>.container-fluid,#PTTChat .navbar-expand-md>.container-sm,#PTTChat .navbar-expand-md>.container-md,#PTTChat .navbar-expand-md>.container-lg,#PTTChat .navbar-expand-md>.container-xl{flex-wrap:nowrap}#PTTChat .navbar-expand-md .navbar-nav-scroll{overflow:visible}#PTTChat .navbar-expand-md .navbar-collapse{display:flex !important;flex-basis:auto}#PTTChat .navbar-expand-md .navbar-toggler{display:none}}@media (max-width: 991.98px){#PTTChat .navbar-expand-lg>.container,#PTTChat .navbar-expand-lg>.container-fluid,#PTTChat .navbar-expand-lg>.container-sm,#PTTChat .navbar-expand-lg>.container-md,#PTTChat .navbar-expand-lg>.container-lg,#PTTChat .navbar-expand-lg>.container-xl{padding-right:0;padding-left:0}}@media (min-width: 992px){#PTTChat .navbar-expand-lg{flex-flow:row nowrap;justify-content:flex-start}#PTTChat .navbar-expand-lg .navbar-nav{flex-direction:row}#PTTChat .navbar-expand-lg .navbar-nav .dropdown-menu{position:absolute}#PTTChat .navbar-expand-lg .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}#PTTChat .navbar-expand-lg>.container,#PTTChat .navbar-expand-lg>.container-fluid,#PTTChat .navbar-expand-lg>.container-sm,#PTTChat .navbar-expand-lg>.container-md,#PTTChat .navbar-expand-lg>.container-lg,#PTTChat .navbar-expand-lg>.container-xl{flex-wrap:nowrap}#PTTChat .navbar-expand-lg .navbar-nav-scroll{overflow:visible}#PTTChat .navbar-expand-lg .navbar-collapse{display:flex !important;flex-basis:auto}#PTTChat .navbar-expand-lg .navbar-toggler{display:none}}@media (max-width: 1199.98px){#PTTChat .navbar-expand-xl>.container,#PTTChat .navbar-expand-xl>.container-fluid,#PTTChat .navbar-expand-xl>.container-sm,#PTTChat .navbar-expand-xl>.container-md,#PTTChat .navbar-expand-xl>.container-lg,#PTTChat .navbar-expand-xl>.container-xl{padding-right:0;padding-left:0}}@media (min-width: 1200px){#PTTChat .navbar-expand-xl{flex-flow:row nowrap;justify-content:flex-start}#PTTChat .navbar-expand-xl .navbar-nav{flex-direction:row}#PTTChat .navbar-expand-xl .navbar-nav .dropdown-menu{position:absolute}#PTTChat .navbar-expand-xl .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}#PTTChat .navbar-expand-xl>.container,#PTTChat .navbar-expand-xl>.container-fluid,#PTTChat .navbar-expand-xl>.container-sm,#PTTChat .navbar-expand-xl>.container-md,#PTTChat .navbar-expand-xl>.container-lg,#PTTChat .navbar-expand-xl>.container-xl{flex-wrap:nowrap}#PTTChat .navbar-expand-xl .navbar-nav-scroll{overflow:visible}#PTTChat .navbar-expand-xl .navbar-collapse{display:flex !important;flex-basis:auto}#PTTChat .navbar-expand-xl .navbar-toggler{display:none}}#PTTChat .navbar-expand{flex-flow:row nowrap;justify-content:flex-start}#PTTChat .navbar-expand>.container,#PTTChat .navbar-expand>.container-fluid,#PTTChat .navbar-expand>.container-sm,#PTTChat .navbar-expand>.container-md,#PTTChat .navbar-expand>.container-lg,#PTTChat .navbar-expand>.container-xl{padding-right:0;padding-left:0}#PTTChat .navbar-expand .navbar-nav{flex-direction:row}#PTTChat .navbar-expand .navbar-nav .dropdown-menu{position:absolute}#PTTChat .navbar-expand .navbar-nav .nav-link{padding-right:.5rem;padding-left:.5rem}#PTTChat .navbar-expand>.container,#PTTChat .navbar-expand>.container-fluid,#PTTChat .navbar-expand>.container-sm,#PTTChat .navbar-expand>.container-md,#PTTChat .navbar-expand>.container-lg,#PTTChat .navbar-expand>.container-xl{flex-wrap:nowrap}#PTTChat .navbar-expand .navbar-nav-scroll{overflow:visible}#PTTChat .navbar-expand .navbar-collapse{display:flex !important;flex-basis:auto}#PTTChat .navbar-expand .navbar-toggler{display:none}#PTTChat .navbar-light .navbar-brand{color:rgba(0,0,0,0.9)}#PTTChat .navbar-light .navbar-brand:hover,#PTTChat .navbar-light .navbar-brand:focus{color:rgba(0,0,0,0.9)}#PTTChat .navbar-light .navbar-nav .nav-link{color:rgba(0,0,0,0.5)}#PTTChat .navbar-light .navbar-nav .nav-link:hover,#PTTChat .navbar-light .navbar-nav .nav-link:focus{color:rgba(0,0,0,0.7)}#PTTChat .navbar-light .navbar-nav .nav-link.disabled{color:rgba(0,0,0,0.3)}#PTTChat .navbar-light .navbar-nav .show>.nav-link,#PTTChat .navbar-light .navbar-nav .active>.nav-link,#PTTChat .navbar-light .navbar-nav .nav-link.show,#PTTChat .navbar-light .navbar-nav .nav-link.active{color:rgba(0,0,0,0.9)}#PTTChat .navbar-light .navbar-toggler{color:rgba(0,0,0,0.5);border-color:rgba(0,0,0,0.1)}#PTTChat .navbar-light .navbar-toggler-icon{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280,0,0,0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")}#PTTChat .navbar-light .navbar-text{color:rgba(0,0,0,0.5)}#PTTChat .navbar-light .navbar-text a{color:rgba(0,0,0,0.9)}#PTTChat .navbar-light .navbar-text a:hover,#PTTChat .navbar-light .navbar-text a:focus{color:rgba(0,0,0,0.9)}#PTTChat .navbar-dark .navbar-brand{color:#fff}#PTTChat .navbar-dark .navbar-brand:hover,#PTTChat .navbar-dark .navbar-brand:focus{color:#fff}#PTTChat .navbar-dark .navbar-nav .nav-link{color:rgba(255,255,255,0.5)}#PTTChat .navbar-dark .navbar-nav .nav-link:hover,#PTTChat .navbar-dark .navbar-nav .nav-link:focus{color:rgba(255,255,255,0.75)}#PTTChat .navbar-dark .navbar-nav .nav-link.disabled{color:rgba(255,255,255,0.25)}#PTTChat .navbar-dark .navbar-nav .show>.nav-link,#PTTChat .navbar-dark .navbar-nav .active>.nav-link,#PTTChat .navbar-dark .navbar-nav .nav-link.show,#PTTChat .navbar-dark .navbar-nav .nav-link.active{color:#fff}#PTTChat .navbar-dark .navbar-toggler{color:rgba(255,255,255,0.5);border-color:rgba(255,255,255,0.1)}#PTTChat .navbar-dark .navbar-toggler-icon{background-image:url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%28255,255,255,0.5%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e\")}#PTTChat .navbar-dark .navbar-text{color:rgba(255,255,255,0.5)}#PTTChat .navbar-dark .navbar-text a{color:#fff}#PTTChat .navbar-dark .navbar-text a:hover,#PTTChat .navbar-dark .navbar-text a:focus{color:#fff}#PTTChat .card{position:relative;display:flex;flex-direction:column;min-width:0;word-wrap:break-word;background-color:#fff;background-clip:border-box;border:1px solid rgba(0,0,0,0.125);border-radius:2.5px}#PTTChat .card>hr{margin-right:0;margin-left:0}#PTTChat .card>.list-group{border-top:inherit;border-bottom:inherit}#PTTChat .card>.list-group:first-child{border-top-width:0;border-top-left-radius:1.5px;border-top-right-radius:1.5px}#PTTChat .card>.list-group:last-child{border-bottom-width:0;border-bottom-right-radius:1.5px;border-bottom-left-radius:1.5px}#PTTChat .card>.card-header+.list-group,#PTTChat .card>.list-group+.card-footer{border-top:0}#PTTChat .card-body{flex:1 1 auto;min-height:1px;padding:12.5px}#PTTChat .card-title{margin-bottom:7.5px}#PTTChat .card-subtitle{margin-top:-3.75px;margin-bottom:0}#PTTChat .card-text:last-child{margin-bottom:0}#PTTChat .card-link:hover{text-decoration:none}#PTTChat .card-link+.card-link{margin-left:12.5px}#PTTChat .card-header{padding:7.5px 12.5px;margin-bottom:0;background-color:rgba(0,0,0,0.03);border-bottom:1px solid rgba(0,0,0,0.125)}#PTTChat .card-header:first-child{border-radius:1.5px 1.5px 0 0}#PTTChat .card-footer{padding:7.5px 12.5px;background-color:rgba(0,0,0,0.03);border-top:1px solid rgba(0,0,0,0.125)}#PTTChat .card-footer:last-child{border-radius:0 0 1.5px 1.5px}#PTTChat .card-header-tabs{margin-right:-6.25px;margin-bottom:-7.5px;margin-left:-6.25px;border-bottom:0}#PTTChat .card-header-pills{margin-right:-6.25px;margin-left:-6.25px}#PTTChat .card-img-overlay{position:absolute;top:0;right:0;bottom:0;left:0;padding:1.25rem;border-radius:1.5px}#PTTChat .card-img,#PTTChat .card-img-top,#PTTChat .card-img-bottom{flex-shrink:0;width:100%}#PTTChat .card-img,#PTTChat .card-img-top{border-top-left-radius:1.5px;border-top-right-radius:1.5px}#PTTChat .card-img,#PTTChat .card-img-bottom{border-bottom-right-radius:1.5px;border-bottom-left-radius:1.5px}#PTTChat .card-deck .card{margin-bottom:15px}@media (min-width: 576px){#PTTChat .card-deck{display:flex;flex-flow:row wrap;margin-right:-15px;margin-left:-15px}#PTTChat .card-deck .card{flex:1 0 0%;margin-right:15px;margin-bottom:0;margin-left:15px}}#PTTChat .card-group>.card{margin-bottom:15px}@media (min-width: 576px){#PTTChat .card-group{display:flex;flex-flow:row wrap}#PTTChat .card-group>.card{flex:1 0 0%;margin-bottom:0}#PTTChat .card-group>.card+.card{margin-left:0;border-left:0}#PTTChat .card-group>.card:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}#PTTChat .card-group>.card:not(:last-child) .card-img-top,#PTTChat .card-group>.card:not(:last-child) .card-header{border-top-right-radius:0}#PTTChat .card-group>.card:not(:last-child) .card-img-bottom,#PTTChat .card-group>.card:not(:last-child) .card-footer{border-bottom-right-radius:0}#PTTChat .card-group>.card:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}#PTTChat .card-group>.card:not(:first-child) .card-img-top,#PTTChat .card-group>.card:not(:first-child) .card-header{border-top-left-radius:0}#PTTChat .card-group>.card:not(:first-child) .card-img-bottom,#PTTChat .card-group>.card:not(:first-child) .card-footer{border-bottom-left-radius:0}}#PTTChat .card-columns .card{margin-bottom:7.5px}@media (min-width: 576px){#PTTChat .card-columns{column-count:3;column-gap:1.25rem;orphans:1;widows:1}#PTTChat .card-columns .card{display:inline-block;width:100%}}#PTTChat .accordion{overflow-anchor:none}#PTTChat .accordion>.card{overflow:hidden}#PTTChat .accordion>.card:not(:last-of-type){border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}#PTTChat .accordion>.card:not(:first-of-type){border-top-left-radius:0;border-top-right-radius:0}#PTTChat .accordion>.card>.card-header{border-radius:0;margin-bottom:-1px}#PTTChat .alert{position:relative;padding:7.5px 12.5px;margin-bottom:1rem;border:1px solid transparent;border-radius:2.5px}#PTTChat .alert-heading{color:inherit}#PTTChat .alert-link{font-weight:700}#PTTChat .alert-dismissible{padding-right:43px}#PTTChat .alert-dismissible .close{position:absolute;top:0;right:0;z-index:2;padding:7.5px 12.5px;color:inherit}#PTTChat .alert-primary{color:#004085;background-color:#cce5ff;border-color:#b8daff}#PTTChat .alert-primary hr{border-top-color:#9fcdff}#PTTChat .alert-primary .alert-link{color:#002752}#PTTChat .alert-secondary{color:#383d41;background-color:#e2e3e5;border-color:#d6d8db}#PTTChat .alert-secondary hr{border-top-color:#c8cbcf}#PTTChat .alert-secondary .alert-link{color:#202326}#PTTChat .alert-success{color:#155724;background-color:#d4edda;border-color:#c3e6cb}#PTTChat .alert-success hr{border-top-color:#b1dfbb}#PTTChat .alert-success .alert-link{color:#0b2e13}#PTTChat .alert-info{color:#0c5460;background-color:#d1ecf1;border-color:#bee5eb}#PTTChat .alert-info hr{border-top-color:#abdde5}#PTTChat .alert-info .alert-link{color:#062c33}#PTTChat .alert-warning{color:#856404;background-color:#fff3cd;border-color:#ffeeba}#PTTChat .alert-warning hr{border-top-color:#ffe8a1}#PTTChat .alert-warning .alert-link{color:#533f03}#PTTChat .alert-danger{color:#721c24;background-color:#f8d7da;border-color:#f5c6cb}#PTTChat .alert-danger hr{border-top-color:#f1b0b7}#PTTChat .alert-danger .alert-link{color:#491217}#PTTChat .alert-light{color:#818182;background-color:#fefefe;border-color:#fdfdfe}#PTTChat .alert-light hr{border-top-color:#ececf6}#PTTChat .alert-light .alert-link{color:#686868}#PTTChat .alert-dark{color:#1b1e21;background-color:#d6d8d9;border-color:#c6c8ca}#PTTChat .alert-dark hr{border-top-color:#b9bbbe}#PTTChat .alert-dark .alert-link{color:#040505}#PTTChat .media{display:flex;align-items:flex-start}#PTTChat .media-body{flex:1}#PTTChat .close{float:right;font-size:18px;font-weight:700;line-height:1;color:#000;text-shadow:0 1px 0 #fff;opacity:.5}#PTTChat .close:hover{color:#000;text-decoration:none}#PTTChat .close:not(:disabled):not(.disabled):hover,#PTTChat .close:not(:disabled):not(.disabled):focus{opacity:.75}#PTTChat button.close{padding:0;background-color:transparent;border:0}#PTTChat a.close.disabled{pointer-events:none}#PTTChat .modal-open{overflow:hidden}#PTTChat .modal-open .modal{overflow-x:hidden;overflow-y:auto}#PTTChat .modal{position:fixed;top:0;left:0;z-index:1050;display:none;width:100%;height:100%;overflow:hidden;outline:0}#PTTChat .modal-dialog{position:relative;width:auto;margin:.5rem;pointer-events:none}.modal.fade #PTTChat .modal-dialog{transition:transform 0.3s ease-out;transform:translate(0, -50px)}@media (prefers-reduced-motion: reduce){.modal.fade #PTTChat .modal-dialog{transition:none}}.modal.show #PTTChat .modal-dialog{transform:none}.modal.modal-static #PTTChat .modal-dialog{transform:scale(1.02)}#PTTChat .modal-dialog-scrollable{display:flex;max-height:calc(100% - 1rem)}#PTTChat .modal-dialog-scrollable .modal-content{max-height:calc(100vh - 1rem);overflow:hidden}#PTTChat .modal-dialog-scrollable .modal-header,#PTTChat .modal-dialog-scrollable .modal-footer{flex-shrink:0}#PTTChat .modal-dialog-scrollable .modal-body{overflow-y:auto}#PTTChat .modal-dialog-centered{display:flex;align-items:center;min-height:calc(100% - 1rem)}#PTTChat .modal-dialog-centered::before{display:block;height:calc(100vh - 1rem);height:min-content;content:\"\"}#PTTChat .modal-dialog-centered.modal-dialog-scrollable{flex-direction:column;justify-content:center;height:100%}#PTTChat .modal-dialog-centered.modal-dialog-scrollable .modal-content{max-height:none}#PTTChat .modal-dialog-centered.modal-dialog-scrollable::before{content:none}#PTTChat .modal-content{position:relative;display:flex;flex-direction:column;width:100%;pointer-events:auto;background-color:#fff;background-clip:padding-box;border:1px solid rgba(0,0,0,0.2);border-radius:2.5px;outline:0}#PTTChat .modal-backdrop{position:fixed;top:0;left:0;z-index:1040;width:100vw;height:100vh;background-color:#000}#PTTChat .modal-backdrop.fade{opacity:0}#PTTChat .modal-backdrop.show{opacity:.5}#PTTChat .modal-header{display:flex;align-items:flex-start;justify-content:space-between;padding:1rem 1rem;border-bottom:1px solid #dee2e6;border-top-left-radius:1.5px;border-top-right-radius:1.5px}#PTTChat .modal-header .close{padding:1rem 1rem;margin:-1rem -1rem -1rem auto}#PTTChat .modal-title{margin-bottom:0;line-height:1.5}#PTTChat .modal-body{position:relative;flex:1 1 auto;padding:1rem}#PTTChat .modal-footer{display:flex;flex-wrap:wrap;align-items:center;justify-content:flex-end;padding:.75rem;border-top:1px solid #dee2e6;border-bottom-right-radius:1.5px;border-bottom-left-radius:1.5px}#PTTChat .modal-footer>*{margin:.25rem}#PTTChat .modal-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}@media (min-width: 576px){#PTTChat .modal-dialog{max-width:500px;margin:1.75rem auto}#PTTChat .modal-dialog-scrollable{max-height:calc(100% - 3.5rem)}#PTTChat .modal-dialog-scrollable .modal-content{max-height:calc(100vh - 3.5rem)}#PTTChat .modal-dialog-centered{min-height:calc(100% - 3.5rem)}#PTTChat .modal-dialog-centered::before{height:calc(100vh - 3.5rem);height:min-content}#PTTChat .modal-sm{max-width:300px}}@media (min-width: 992px){#PTTChat .modal-lg,#PTTChat .modal-xl{max-width:800px}}@media (min-width: 1200px){#PTTChat .modal-xl{max-width:1140px}}#PTTChat .align-baseline{vertical-align:baseline !important}#PTTChat .align-top{vertical-align:top !important}#PTTChat .align-middle{vertical-align:middle !important}#PTTChat .align-bottom{vertical-align:bottom !important}#PTTChat .align-text-bottom{vertical-align:text-bottom !important}#PTTChat .align-text-top{vertical-align:text-top !important}#PTTChat .bg-primary{background-color:#007bff !important}#PTTChat a.bg-primary:hover,#PTTChat a.bg-primary:focus,#PTTChat button.bg-primary:hover,#PTTChat button.bg-primary:focus{background-color:#0062cc !important}#PTTChat .bg-secondary{background-color:#6c757d !important}#PTTChat a.bg-secondary:hover,#PTTChat a.bg-secondary:focus,#PTTChat button.bg-secondary:hover,#PTTChat button.bg-secondary:focus{background-color:#545b62 !important}#PTTChat .bg-success{background-color:#28a745 !important}#PTTChat a.bg-success:hover,#PTTChat a.bg-success:focus,#PTTChat button.bg-success:hover,#PTTChat button.bg-success:focus{background-color:#1e7e34 !important}#PTTChat .bg-info{background-color:#17a2b8 !important}#PTTChat a.bg-info:hover,#PTTChat a.bg-info:focus,#PTTChat button.bg-info:hover,#PTTChat button.bg-info:focus{background-color:#117a8b !important}#PTTChat .bg-warning{background-color:#ffc107 !important}#PTTChat a.bg-warning:hover,#PTTChat a.bg-warning:focus,#PTTChat button.bg-warning:hover,#PTTChat button.bg-warning:focus{background-color:#d39e00 !important}#PTTChat .bg-danger{background-color:#dc3545 !important}#PTTChat a.bg-danger:hover,#PTTChat a.bg-danger:focus,#PTTChat button.bg-danger:hover,#PTTChat button.bg-danger:focus{background-color:#bd2130 !important}#PTTChat .bg-light{background-color:#f8f9fa !important}#PTTChat a.bg-light:hover,#PTTChat a.bg-light:focus,#PTTChat button.bg-light:hover,#PTTChat button.bg-light:focus{background-color:#dae0e5 !important}#PTTChat .bg-dark{background-color:#343a40 !important}#PTTChat a.bg-dark:hover,#PTTChat a.bg-dark:focus,#PTTChat button.bg-dark:hover,#PTTChat button.bg-dark:focus{background-color:#1d2124 !important}#PTTChat .bg-white{background-color:#fff !important}#PTTChat .bg-transparent{background-color:transparent !important}#PTTChat .border{border:1px solid #dee2e6 !important}#PTTChat .border-top{border-top:1px solid #dee2e6 !important}#PTTChat .border-right{border-right:1px solid #dee2e6 !important}#PTTChat .border-bottom{border-bottom:1px solid #dee2e6 !important}#PTTChat .border-left{border-left:1px solid #dee2e6 !important}#PTTChat .border-0{border:0 !important}#PTTChat .border-top-0{border-top:0 !important}#PTTChat .border-right-0{border-right:0 !important}#PTTChat .border-bottom-0{border-bottom:0 !important}#PTTChat .border-left-0{border-left:0 !important}#PTTChat .border-primary{border-color:#007bff !important}#PTTChat .border-secondary{border-color:#6c757d !important}#PTTChat .border-success{border-color:#28a745 !important}#PTTChat .border-info{border-color:#17a2b8 !important}#PTTChat .border-warning{border-color:#ffc107 !important}#PTTChat .border-danger{border-color:#dc3545 !important}#PTTChat .border-light{border-color:#f8f9fa !important}#PTTChat .border-dark{border-color:#343a40 !important}#PTTChat .border-white{border-color:#fff !important}#PTTChat .rounded-sm{border-radius:2.5px !important}#PTTChat .rounded{border-radius:2.5px !important}#PTTChat .rounded-top{border-top-left-radius:2.5px !important;border-top-right-radius:2.5px !important}#PTTChat .rounded-right{border-top-right-radius:2.5px !important;border-bottom-right-radius:2.5px !important}#PTTChat .rounded-bottom{border-bottom-right-radius:2.5px !important;border-bottom-left-radius:2.5px !important}#PTTChat .rounded-left{border-top-left-radius:2.5px !important;border-bottom-left-radius:2.5px !important}#PTTChat .rounded-lg{border-radius:2.5px !important}#PTTChat .rounded-circle{border-radius:50% !important}#PTTChat .rounded-pill{border-radius:50rem !important}#PTTChat .rounded-0{border-radius:0 !important}#PTTChat .clearfix::after{display:block;clear:both;content:\"\"}#PTTChat .d-none{display:none !important}#PTTChat .d-inline{display:inline !important}#PTTChat .d-inline-block{display:inline-block !important}#PTTChat .d-block{display:block !important}#PTTChat .d-table{display:table !important}#PTTChat .d-table-row{display:table-row !important}#PTTChat .d-table-cell{display:table-cell !important}#PTTChat .d-flex{display:flex !important}#PTTChat .d-inline-flex{display:inline-flex !important}@media (min-width: 576px){#PTTChat .d-sm-none{display:none !important}#PTTChat .d-sm-inline{display:inline !important}#PTTChat .d-sm-inline-block{display:inline-block !important}#PTTChat .d-sm-block{display:block !important}#PTTChat .d-sm-table{display:table !important}#PTTChat .d-sm-table-row{display:table-row !important}#PTTChat .d-sm-table-cell{display:table-cell !important}#PTTChat .d-sm-flex{display:flex !important}#PTTChat .d-sm-inline-flex{display:inline-flex !important}}@media (min-width: 768px){#PTTChat .d-md-none{display:none !important}#PTTChat .d-md-inline{display:inline !important}#PTTChat .d-md-inline-block{display:inline-block !important}#PTTChat .d-md-block{display:block !important}#PTTChat .d-md-table{display:table !important}#PTTChat .d-md-table-row{display:table-row !important}#PTTChat .d-md-table-cell{display:table-cell !important}#PTTChat .d-md-flex{display:flex !important}#PTTChat .d-md-inline-flex{display:inline-flex !important}}@media (min-width: 992px){#PTTChat .d-lg-none{display:none !important}#PTTChat .d-lg-inline{display:inline !important}#PTTChat .d-lg-inline-block{display:inline-block !important}#PTTChat .d-lg-block{display:block !important}#PTTChat .d-lg-table{display:table !important}#PTTChat .d-lg-table-row{display:table-row !important}#PTTChat .d-lg-table-cell{display:table-cell !important}#PTTChat .d-lg-flex{display:flex !important}#PTTChat .d-lg-inline-flex{display:inline-flex !important}}@media (min-width: 1200px){#PTTChat .d-xl-none{display:none !important}#PTTChat .d-xl-inline{display:inline !important}#PTTChat .d-xl-inline-block{display:inline-block !important}#PTTChat .d-xl-block{display:block !important}#PTTChat .d-xl-table{display:table !important}#PTTChat .d-xl-table-row{display:table-row !important}#PTTChat .d-xl-table-cell{display:table-cell !important}#PTTChat .d-xl-flex{display:flex !important}#PTTChat .d-xl-inline-flex{display:inline-flex !important}}@media print{#PTTChat .d-print-none{display:none !important}#PTTChat .d-print-inline{display:inline !important}#PTTChat .d-print-inline-block{display:inline-block !important}#PTTChat .d-print-block{display:block !important}#PTTChat .d-print-table{display:table !important}#PTTChat .d-print-table-row{display:table-row !important}#PTTChat .d-print-table-cell{display:table-cell !important}#PTTChat .d-print-flex{display:flex !important}#PTTChat .d-print-inline-flex{display:inline-flex !important}}#PTTChat .embed-responsive{position:relative;display:block;width:100%;padding:0;overflow:hidden}#PTTChat .embed-responsive::before{display:block;content:\"\"}#PTTChat .embed-responsive .embed-responsive-item,#PTTChat .embed-responsive iframe,#PTTChat .embed-responsive embed,#PTTChat .embed-responsive object,#PTTChat .embed-responsive video{position:absolute;top:0;bottom:0;left:0;width:100%;height:100%;border:0}#PTTChat .embed-responsive-21by9::before{padding-top:42.85714%}#PTTChat .embed-responsive-16by9::before{padding-top:56.25%}#PTTChat .embed-responsive-4by3::before{padding-top:75%}#PTTChat .embed-responsive-1by1::before{padding-top:100%}#PTTChat .flex-row{flex-direction:row !important}#PTTChat .flex-column{flex-direction:column !important}#PTTChat .flex-row-reverse{flex-direction:row-reverse !important}#PTTChat .flex-column-reverse{flex-direction:column-reverse !important}#PTTChat .flex-wrap{flex-wrap:wrap !important}#PTTChat .flex-nowrap{flex-wrap:nowrap !important}#PTTChat .flex-wrap-reverse{flex-wrap:wrap-reverse !important}#PTTChat .flex-fill{flex:1 1 auto !important}#PTTChat .flex-grow-0{flex-grow:0 !important}#PTTChat .flex-grow-1{flex-grow:1 !important}#PTTChat .flex-shrink-0{flex-shrink:0 !important}#PTTChat .flex-shrink-1{flex-shrink:1 !important}#PTTChat .justify-content-start{justify-content:flex-start !important}#PTTChat .justify-content-end{justify-content:flex-end !important}#PTTChat .justify-content-center{justify-content:center !important}#PTTChat .justify-content-between{justify-content:space-between !important}#PTTChat .justify-content-around{justify-content:space-around !important}#PTTChat .align-items-start{align-items:flex-start !important}#PTTChat .align-items-end{align-items:flex-end !important}#PTTChat .align-items-center{align-items:center !important}#PTTChat .align-items-baseline{align-items:baseline !important}#PTTChat .align-items-stretch{align-items:stretch !important}#PTTChat .align-content-start{align-content:flex-start !important}#PTTChat .align-content-end{align-content:flex-end !important}#PTTChat .align-content-center{align-content:center !important}#PTTChat .align-content-between{align-content:space-between !important}#PTTChat .align-content-around{align-content:space-around !important}#PTTChat .align-content-stretch{align-content:stretch !important}#PTTChat .align-self-auto{align-self:auto !important}#PTTChat .align-self-start{align-self:flex-start !important}#PTTChat .align-self-end{align-self:flex-end !important}#PTTChat .align-self-center{align-self:center !important}#PTTChat .align-self-baseline{align-self:baseline !important}#PTTChat .align-self-stretch{align-self:stretch !important}@media (min-width: 576px){#PTTChat .flex-sm-row{flex-direction:row !important}#PTTChat .flex-sm-column{flex-direction:column !important}#PTTChat .flex-sm-row-reverse{flex-direction:row-reverse !important}#PTTChat .flex-sm-column-reverse{flex-direction:column-reverse !important}#PTTChat .flex-sm-wrap{flex-wrap:wrap !important}#PTTChat .flex-sm-nowrap{flex-wrap:nowrap !important}#PTTChat .flex-sm-wrap-reverse{flex-wrap:wrap-reverse !important}#PTTChat .flex-sm-fill{flex:1 1 auto !important}#PTTChat .flex-sm-grow-0{flex-grow:0 !important}#PTTChat .flex-sm-grow-1{flex-grow:1 !important}#PTTChat .flex-sm-shrink-0{flex-shrink:0 !important}#PTTChat .flex-sm-shrink-1{flex-shrink:1 !important}#PTTChat .justify-content-sm-start{justify-content:flex-start !important}#PTTChat .justify-content-sm-end{justify-content:flex-end !important}#PTTChat .justify-content-sm-center{justify-content:center !important}#PTTChat .justify-content-sm-between{justify-content:space-between !important}#PTTChat .justify-content-sm-around{justify-content:space-around !important}#PTTChat .align-items-sm-start{align-items:flex-start !important}#PTTChat .align-items-sm-end{align-items:flex-end !important}#PTTChat .align-items-sm-center{align-items:center !important}#PTTChat .align-items-sm-baseline{align-items:baseline !important}#PTTChat .align-items-sm-stretch{align-items:stretch !important}#PTTChat .align-content-sm-start{align-content:flex-start !important}#PTTChat .align-content-sm-end{align-content:flex-end !important}#PTTChat .align-content-sm-center{align-content:center !important}#PTTChat .align-content-sm-between{align-content:space-between !important}#PTTChat .align-content-sm-around{align-content:space-around !important}#PTTChat .align-content-sm-stretch{align-content:stretch !important}#PTTChat .align-self-sm-auto{align-self:auto !important}#PTTChat .align-self-sm-start{align-self:flex-start !important}#PTTChat .align-self-sm-end{align-self:flex-end !important}#PTTChat .align-self-sm-center{align-self:center !important}#PTTChat .align-self-sm-baseline{align-self:baseline !important}#PTTChat .align-self-sm-stretch{align-self:stretch !important}}@media (min-width: 768px){#PTTChat .flex-md-row{flex-direction:row !important}#PTTChat .flex-md-column{flex-direction:column !important}#PTTChat .flex-md-row-reverse{flex-direction:row-reverse !important}#PTTChat .flex-md-column-reverse{flex-direction:column-reverse !important}#PTTChat .flex-md-wrap{flex-wrap:wrap !important}#PTTChat .flex-md-nowrap{flex-wrap:nowrap !important}#PTTChat .flex-md-wrap-reverse{flex-wrap:wrap-reverse !important}#PTTChat .flex-md-fill{flex:1 1 auto !important}#PTTChat .flex-md-grow-0{flex-grow:0 !important}#PTTChat .flex-md-grow-1{flex-grow:1 !important}#PTTChat .flex-md-shrink-0{flex-shrink:0 !important}#PTTChat .flex-md-shrink-1{flex-shrink:1 !important}#PTTChat .justify-content-md-start{justify-content:flex-start !important}#PTTChat .justify-content-md-end{justify-content:flex-end !important}#PTTChat .justify-content-md-center{justify-content:center !important}#PTTChat .justify-content-md-between{justify-content:space-between !important}#PTTChat .justify-content-md-around{justify-content:space-around !important}#PTTChat .align-items-md-start{align-items:flex-start !important}#PTTChat .align-items-md-end{align-items:flex-end !important}#PTTChat .align-items-md-center{align-items:center !important}#PTTChat .align-items-md-baseline{align-items:baseline !important}#PTTChat .align-items-md-stretch{align-items:stretch !important}#PTTChat .align-content-md-start{align-content:flex-start !important}#PTTChat .align-content-md-end{align-content:flex-end !important}#PTTChat .align-content-md-center{align-content:center !important}#PTTChat .align-content-md-between{align-content:space-between !important}#PTTChat .align-content-md-around{align-content:space-around !important}#PTTChat .align-content-md-stretch{align-content:stretch !important}#PTTChat .align-self-md-auto{align-self:auto !important}#PTTChat .align-self-md-start{align-self:flex-start !important}#PTTChat .align-self-md-end{align-self:flex-end !important}#PTTChat .align-self-md-center{align-self:center !important}#PTTChat .align-self-md-baseline{align-self:baseline !important}#PTTChat .align-self-md-stretch{align-self:stretch !important}}@media (min-width: 992px){#PTTChat .flex-lg-row{flex-direction:row !important}#PTTChat .flex-lg-column{flex-direction:column !important}#PTTChat .flex-lg-row-reverse{flex-direction:row-reverse !important}#PTTChat .flex-lg-column-reverse{flex-direction:column-reverse !important}#PTTChat .flex-lg-wrap{flex-wrap:wrap !important}#PTTChat .flex-lg-nowrap{flex-wrap:nowrap !important}#PTTChat .flex-lg-wrap-reverse{flex-wrap:wrap-reverse !important}#PTTChat .flex-lg-fill{flex:1 1 auto !important}#PTTChat .flex-lg-grow-0{flex-grow:0 !important}#PTTChat .flex-lg-grow-1{flex-grow:1 !important}#PTTChat .flex-lg-shrink-0{flex-shrink:0 !important}#PTTChat .flex-lg-shrink-1{flex-shrink:1 !important}#PTTChat .justify-content-lg-start{justify-content:flex-start !important}#PTTChat .justify-content-lg-end{justify-content:flex-end !important}#PTTChat .justify-content-lg-center{justify-content:center !important}#PTTChat .justify-content-lg-between{justify-content:space-between !important}#PTTChat .justify-content-lg-around{justify-content:space-around !important}#PTTChat .align-items-lg-start{align-items:flex-start !important}#PTTChat .align-items-lg-end{align-items:flex-end !important}#PTTChat .align-items-lg-center{align-items:center !important}#PTTChat .align-items-lg-baseline{align-items:baseline !important}#PTTChat .align-items-lg-stretch{align-items:stretch !important}#PTTChat .align-content-lg-start{align-content:flex-start !important}#PTTChat .align-content-lg-end{align-content:flex-end !important}#PTTChat .align-content-lg-center{align-content:center !important}#PTTChat .align-content-lg-between{align-content:space-between !important}#PTTChat .align-content-lg-around{align-content:space-around !important}#PTTChat .align-content-lg-stretch{align-content:stretch !important}#PTTChat .align-self-lg-auto{align-self:auto !important}#PTTChat .align-self-lg-start{align-self:flex-start !important}#PTTChat .align-self-lg-end{align-self:flex-end !important}#PTTChat .align-self-lg-center{align-self:center !important}#PTTChat .align-self-lg-baseline{align-self:baseline !important}#PTTChat .align-self-lg-stretch{align-self:stretch !important}}@media (min-width: 1200px){#PTTChat .flex-xl-row{flex-direction:row !important}#PTTChat .flex-xl-column{flex-direction:column !important}#PTTChat .flex-xl-row-reverse{flex-direction:row-reverse !important}#PTTChat .flex-xl-column-reverse{flex-direction:column-reverse !important}#PTTChat .flex-xl-wrap{flex-wrap:wrap !important}#PTTChat .flex-xl-nowrap{flex-wrap:nowrap !important}#PTTChat .flex-xl-wrap-reverse{flex-wrap:wrap-reverse !important}#PTTChat .flex-xl-fill{flex:1 1 auto !important}#PTTChat .flex-xl-grow-0{flex-grow:0 !important}#PTTChat .flex-xl-grow-1{flex-grow:1 !important}#PTTChat .flex-xl-shrink-0{flex-shrink:0 !important}#PTTChat .flex-xl-shrink-1{flex-shrink:1 !important}#PTTChat .justify-content-xl-start{justify-content:flex-start !important}#PTTChat .justify-content-xl-end{justify-content:flex-end !important}#PTTChat .justify-content-xl-center{justify-content:center !important}#PTTChat .justify-content-xl-between{justify-content:space-between !important}#PTTChat .justify-content-xl-around{justify-content:space-around !important}#PTTChat .align-items-xl-start{align-items:flex-start !important}#PTTChat .align-items-xl-end{align-items:flex-end !important}#PTTChat .align-items-xl-center{align-items:center !important}#PTTChat .align-items-xl-baseline{align-items:baseline !important}#PTTChat .align-items-xl-stretch{align-items:stretch !important}#PTTChat .align-content-xl-start{align-content:flex-start !important}#PTTChat .align-content-xl-end{align-content:flex-end !important}#PTTChat .align-content-xl-center{align-content:center !important}#PTTChat .align-content-xl-between{align-content:space-between !important}#PTTChat .align-content-xl-around{align-content:space-around !important}#PTTChat .align-content-xl-stretch{align-content:stretch !important}#PTTChat .align-self-xl-auto{align-self:auto !important}#PTTChat .align-self-xl-start{align-self:flex-start !important}#PTTChat .align-self-xl-end{align-self:flex-end !important}#PTTChat .align-self-xl-center{align-self:center !important}#PTTChat .align-self-xl-baseline{align-self:baseline !important}#PTTChat .align-self-xl-stretch{align-self:stretch !important}}#PTTChat .float-left{float:left !important}#PTTChat .float-right{float:right !important}#PTTChat .float-none{float:none !important}@media (min-width: 576px){#PTTChat .float-sm-left{float:left !important}#PTTChat .float-sm-right{float:right !important}#PTTChat .float-sm-none{float:none !important}}@media (min-width: 768px){#PTTChat .float-md-left{float:left !important}#PTTChat .float-md-right{float:right !important}#PTTChat .float-md-none{float:none !important}}@media (min-width: 992px){#PTTChat .float-lg-left{float:left !important}#PTTChat .float-lg-right{float:right !important}#PTTChat .float-lg-none{float:none !important}}@media (min-width: 1200px){#PTTChat .float-xl-left{float:left !important}#PTTChat .float-xl-right{float:right !important}#PTTChat .float-xl-none{float:none !important}}#PTTChat .user-select-all{user-select:all !important}#PTTChat .user-select-auto{user-select:auto !important}#PTTChat .user-select-none{user-select:none !important}#PTTChat .overflow-auto{overflow:auto !important}#PTTChat .overflow-hidden{overflow:hidden !important}#PTTChat .position-static{position:static !important}#PTTChat .position-relative{position:relative !important}#PTTChat .position-absolute{position:absolute !important}#PTTChat .position-fixed{position:fixed !important}#PTTChat .position-sticky{position:sticky !important}#PTTChat .fixed-top{position:fixed;top:0;right:0;left:0;z-index:1030}#PTTChat .fixed-bottom{position:fixed;right:0;bottom:0;left:0;z-index:1030}@supports (position: sticky){#PTTChat .sticky-top{position:sticky;top:0;z-index:1020}}#PTTChat .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0, 0, 0, 0);white-space:nowrap;border:0}#PTTChat .sr-only-focusable:active,#PTTChat .sr-only-focusable:focus{position:static;width:auto;height:auto;overflow:visible;clip:auto;white-space:normal}#PTTChat .shadow-sm{box-shadow:0 0.125rem 0.25rem rgba(0,0,0,0.075) !important}#PTTChat .shadow{box-shadow:0 0.5rem 1rem rgba(0,0,0,0.15) !important}#PTTChat .shadow-lg{box-shadow:0 1rem 3rem rgba(0,0,0,0.175) !important}#PTTChat .shadow-none{box-shadow:none !important}#PTTChat .w-25{width:25% !important}#PTTChat .w-50{width:50% !important}#PTTChat .w-75{width:75% !important}#PTTChat .w-100{width:100% !important}#PTTChat .w-auto{width:auto !important}#PTTChat .h-25{height:25% !important}#PTTChat .h-50{height:50% !important}#PTTChat .h-75{height:75% !important}#PTTChat .h-100{height:100% !important}#PTTChat .h-auto{height:auto !important}#PTTChat .mw-100{max-width:100% !important}#PTTChat .mh-100{max-height:100% !important}#PTTChat .min-vw-100{min-width:100vw !important}#PTTChat .min-vh-100{min-height:100vh !important}#PTTChat .vw-100{width:100vw !important}#PTTChat .vh-100{height:100vh !important}#PTTChat .m-0{margin:0 !important}#PTTChat .mt-0,#PTTChat .my-0{margin-top:0 !important}#PTTChat .mr-0,#PTTChat .mx-0{margin-right:0 !important}#PTTChat .mb-0,#PTTChat .my-0{margin-bottom:0 !important}#PTTChat .ml-0,#PTTChat .mx-0{margin-left:0 !important}#PTTChat .m-1{margin:2.5px !important}#PTTChat .mt-1,#PTTChat .my-1{margin-top:2.5px !important}#PTTChat .mr-1,#PTTChat .mx-1{margin-right:2.5px !important}#PTTChat .mb-1,#PTTChat .my-1{margin-bottom:2.5px !important}#PTTChat .ml-1,#PTTChat .mx-1{margin-left:2.5px !important}#PTTChat .m-2{margin:5px !important}#PTTChat .mt-2,#PTTChat .my-2{margin-top:5px !important}#PTTChat .mr-2,#PTTChat .mx-2{margin-right:5px !important}#PTTChat .mb-2,#PTTChat .my-2{margin-bottom:5px !important}#PTTChat .ml-2,#PTTChat .mx-2{margin-left:5px !important}#PTTChat .m-3{margin:10px !important}#PTTChat .mt-3,#PTTChat .my-3{margin-top:10px !important}#PTTChat .mr-3,#PTTChat .mx-3{margin-right:10px !important}#PTTChat .mb-3,#PTTChat .my-3{margin-bottom:10px !important}#PTTChat .ml-3,#PTTChat .mx-3{margin-left:10px !important}#PTTChat .m-4{margin:15px !important}#PTTChat .mt-4,#PTTChat .my-4{margin-top:15px !important}#PTTChat .mr-4,#PTTChat .mx-4{margin-right:15px !important}#PTTChat .mb-4,#PTTChat .my-4{margin-bottom:15px !important}#PTTChat .ml-4,#PTTChat .mx-4{margin-left:15px !important}#PTTChat .m-5{margin:30px !important}#PTTChat .mt-5,#PTTChat .my-5{margin-top:30px !important}#PTTChat .mr-5,#PTTChat .mx-5{margin-right:30px !important}#PTTChat .mb-5,#PTTChat .my-5{margin-bottom:30px !important}#PTTChat .ml-5,#PTTChat .mx-5{margin-left:30px !important}#PTTChat .p-0{padding:0 !important}#PTTChat .pt-0,#PTTChat .py-0{padding-top:0 !important}#PTTChat .pr-0,#PTTChat .px-0{padding-right:0 !important}#PTTChat .pb-0,#PTTChat .py-0{padding-bottom:0 !important}#PTTChat .pl-0,#PTTChat .px-0{padding-left:0 !important}#PTTChat .p-1{padding:2.5px !important}#PTTChat .pt-1,#PTTChat .py-1{padding-top:2.5px !important}#PTTChat .pr-1,#PTTChat .px-1{padding-right:2.5px !important}#PTTChat .pb-1,#PTTChat .py-1{padding-bottom:2.5px !important}#PTTChat .pl-1,#PTTChat .px-1{padding-left:2.5px !important}#PTTChat .p-2{padding:5px !important}#PTTChat .pt-2,#PTTChat .py-2{padding-top:5px !important}#PTTChat .pr-2,#PTTChat .px-2{padding-right:5px !important}#PTTChat .pb-2,#PTTChat .py-2{padding-bottom:5px !important}#PTTChat .pl-2,#PTTChat .px-2{padding-left:5px !important}#PTTChat .p-3{padding:10px !important}#PTTChat .pt-3,#PTTChat .py-3{padding-top:10px !important}#PTTChat .pr-3,#PTTChat .px-3{padding-right:10px !important}#PTTChat .pb-3,#PTTChat .py-3{padding-bottom:10px !important}#PTTChat .pl-3,#PTTChat .px-3{padding-left:10px !important}#PTTChat .p-4{padding:15px !important}#PTTChat .pt-4,#PTTChat .py-4{padding-top:15px !important}#PTTChat .pr-4,#PTTChat .px-4{padding-right:15px !important}#PTTChat .pb-4,#PTTChat .py-4{padding-bottom:15px !important}#PTTChat .pl-4,#PTTChat .px-4{padding-left:15px !important}#PTTChat .p-5{padding:30px !important}#PTTChat .pt-5,#PTTChat .py-5{padding-top:30px !important}#PTTChat .pr-5,#PTTChat .px-5{padding-right:30px !important}#PTTChat .pb-5,#PTTChat .py-5{padding-bottom:30px !important}#PTTChat .pl-5,#PTTChat .px-5{padding-left:30px !important}#PTTChat .m-n1{margin:-2.5px !important}#PTTChat .mt-n1,#PTTChat .my-n1{margin-top:-2.5px !important}#PTTChat .mr-n1,#PTTChat .mx-n1{margin-right:-2.5px !important}#PTTChat .mb-n1,#PTTChat .my-n1{margin-bottom:-2.5px !important}#PTTChat .ml-n1,#PTTChat .mx-n1{margin-left:-2.5px !important}#PTTChat .m-n2{margin:-5px !important}#PTTChat .mt-n2,#PTTChat .my-n2{margin-top:-5px !important}#PTTChat .mr-n2,#PTTChat .mx-n2{margin-right:-5px !important}#PTTChat .mb-n2,#PTTChat .my-n2{margin-bottom:-5px !important}#PTTChat .ml-n2,#PTTChat .mx-n2{margin-left:-5px !important}#PTTChat .m-n3{margin:-10px !important}#PTTChat .mt-n3,#PTTChat .my-n3{margin-top:-10px !important}#PTTChat .mr-n3,#PTTChat .mx-n3{margin-right:-10px !important}#PTTChat .mb-n3,#PTTChat .my-n3{margin-bottom:-10px !important}#PTTChat .ml-n3,#PTTChat .mx-n3{margin-left:-10px !important}#PTTChat .m-n4{margin:-15px !important}#PTTChat .mt-n4,#PTTChat .my-n4{margin-top:-15px !important}#PTTChat .mr-n4,#PTTChat .mx-n4{margin-right:-15px !important}#PTTChat .mb-n4,#PTTChat .my-n4{margin-bottom:-15px !important}#PTTChat .ml-n4,#PTTChat .mx-n4{margin-left:-15px !important}#PTTChat .m-n5{margin:-30px !important}#PTTChat .mt-n5,#PTTChat .my-n5{margin-top:-30px !important}#PTTChat .mr-n5,#PTTChat .mx-n5{margin-right:-30px !important}#PTTChat .mb-n5,#PTTChat .my-n5{margin-bottom:-30px !important}#PTTChat .ml-n5,#PTTChat .mx-n5{margin-left:-30px !important}#PTTChat .m-auto{margin:auto !important}#PTTChat .mt-auto,#PTTChat .my-auto{margin-top:auto !important}#PTTChat .mr-auto,#PTTChat .mx-auto{margin-right:auto !important}#PTTChat .mb-auto,#PTTChat .my-auto{margin-bottom:auto !important}#PTTChat .ml-auto,#PTTChat .mx-auto{margin-left:auto !important}@media (min-width: 576px){#PTTChat .m-sm-0{margin:0 !important}#PTTChat .mt-sm-0,#PTTChat .my-sm-0{margin-top:0 !important}#PTTChat .mr-sm-0,#PTTChat .mx-sm-0{margin-right:0 !important}#PTTChat .mb-sm-0,#PTTChat .my-sm-0{margin-bottom:0 !important}#PTTChat .ml-sm-0,#PTTChat .mx-sm-0{margin-left:0 !important}#PTTChat .m-sm-1{margin:2.5px !important}#PTTChat .mt-sm-1,#PTTChat .my-sm-1{margin-top:2.5px !important}#PTTChat .mr-sm-1,#PTTChat .mx-sm-1{margin-right:2.5px !important}#PTTChat .mb-sm-1,#PTTChat .my-sm-1{margin-bottom:2.5px !important}#PTTChat .ml-sm-1,#PTTChat .mx-sm-1{margin-left:2.5px !important}#PTTChat .m-sm-2{margin:5px !important}#PTTChat .mt-sm-2,#PTTChat .my-sm-2{margin-top:5px !important}#PTTChat .mr-sm-2,#PTTChat .mx-sm-2{margin-right:5px !important}#PTTChat .mb-sm-2,#PTTChat .my-sm-2{margin-bottom:5px !important}#PTTChat .ml-sm-2,#PTTChat .mx-sm-2{margin-left:5px !important}#PTTChat .m-sm-3{margin:10px !important}#PTTChat .mt-sm-3,#PTTChat .my-sm-3{margin-top:10px !important}#PTTChat .mr-sm-3,#PTTChat .mx-sm-3{margin-right:10px !important}#PTTChat .mb-sm-3,#PTTChat .my-sm-3{margin-bottom:10px !important}#PTTChat .ml-sm-3,#PTTChat .mx-sm-3{margin-left:10px !important}#PTTChat .m-sm-4{margin:15px !important}#PTTChat .mt-sm-4,#PTTChat .my-sm-4{margin-top:15px !important}#PTTChat .mr-sm-4,#PTTChat .mx-sm-4{margin-right:15px !important}#PTTChat .mb-sm-4,#PTTChat .my-sm-4{margin-bottom:15px !important}#PTTChat .ml-sm-4,#PTTChat .mx-sm-4{margin-left:15px !important}#PTTChat .m-sm-5{margin:30px !important}#PTTChat .mt-sm-5,#PTTChat .my-sm-5{margin-top:30px !important}#PTTChat .mr-sm-5,#PTTChat .mx-sm-5{margin-right:30px !important}#PTTChat .mb-sm-5,#PTTChat .my-sm-5{margin-bottom:30px !important}#PTTChat .ml-sm-5,#PTTChat .mx-sm-5{margin-left:30px !important}#PTTChat .p-sm-0{padding:0 !important}#PTTChat .pt-sm-0,#PTTChat .py-sm-0{padding-top:0 !important}#PTTChat .pr-sm-0,#PTTChat .px-sm-0{padding-right:0 !important}#PTTChat .pb-sm-0,#PTTChat .py-sm-0{padding-bottom:0 !important}#PTTChat .pl-sm-0,#PTTChat .px-sm-0{padding-left:0 !important}#PTTChat .p-sm-1{padding:2.5px !important}#PTTChat .pt-sm-1,#PTTChat .py-sm-1{padding-top:2.5px !important}#PTTChat .pr-sm-1,#PTTChat .px-sm-1{padding-right:2.5px !important}#PTTChat .pb-sm-1,#PTTChat .py-sm-1{padding-bottom:2.5px !important}#PTTChat .pl-sm-1,#PTTChat .px-sm-1{padding-left:2.5px !important}#PTTChat .p-sm-2{padding:5px !important}#PTTChat .pt-sm-2,#PTTChat .py-sm-2{padding-top:5px !important}#PTTChat .pr-sm-2,#PTTChat .px-sm-2{padding-right:5px !important}#PTTChat .pb-sm-2,#PTTChat .py-sm-2{padding-bottom:5px !important}#PTTChat .pl-sm-2,#PTTChat .px-sm-2{padding-left:5px !important}#PTTChat .p-sm-3{padding:10px !important}#PTTChat .pt-sm-3,#PTTChat .py-sm-3{padding-top:10px !important}#PTTChat .pr-sm-3,#PTTChat .px-sm-3{padding-right:10px !important}#PTTChat .pb-sm-3,#PTTChat .py-sm-3{padding-bottom:10px !important}#PTTChat .pl-sm-3,#PTTChat .px-sm-3{padding-left:10px !important}#PTTChat .p-sm-4{padding:15px !important}#PTTChat .pt-sm-4,#PTTChat .py-sm-4{padding-top:15px !important}#PTTChat .pr-sm-4,#PTTChat .px-sm-4{padding-right:15px !important}#PTTChat .pb-sm-4,#PTTChat .py-sm-4{padding-bottom:15px !important}#PTTChat .pl-sm-4,#PTTChat .px-sm-4{padding-left:15px !important}#PTTChat .p-sm-5{padding:30px !important}#PTTChat .pt-sm-5,#PTTChat .py-sm-5{padding-top:30px !important}#PTTChat .pr-sm-5,#PTTChat .px-sm-5{padding-right:30px !important}#PTTChat .pb-sm-5,#PTTChat .py-sm-5{padding-bottom:30px !important}#PTTChat .pl-sm-5,#PTTChat .px-sm-5{padding-left:30px !important}#PTTChat .m-sm-n1{margin:-2.5px !important}#PTTChat .mt-sm-n1,#PTTChat .my-sm-n1{margin-top:-2.5px !important}#PTTChat .mr-sm-n1,#PTTChat .mx-sm-n1{margin-right:-2.5px !important}#PTTChat .mb-sm-n1,#PTTChat .my-sm-n1{margin-bottom:-2.5px !important}#PTTChat .ml-sm-n1,#PTTChat .mx-sm-n1{margin-left:-2.5px !important}#PTTChat .m-sm-n2{margin:-5px !important}#PTTChat .mt-sm-n2,#PTTChat .my-sm-n2{margin-top:-5px !important}#PTTChat .mr-sm-n2,#PTTChat .mx-sm-n2{margin-right:-5px !important}#PTTChat .mb-sm-n2,#PTTChat .my-sm-n2{margin-bottom:-5px !important}#PTTChat .ml-sm-n2,#PTTChat .mx-sm-n2{margin-left:-5px !important}#PTTChat .m-sm-n3{margin:-10px !important}#PTTChat .mt-sm-n3,#PTTChat .my-sm-n3{margin-top:-10px !important}#PTTChat .mr-sm-n3,#PTTChat .mx-sm-n3{margin-right:-10px !important}#PTTChat .mb-sm-n3,#PTTChat .my-sm-n3{margin-bottom:-10px !important}#PTTChat .ml-sm-n3,#PTTChat .mx-sm-n3{margin-left:-10px !important}#PTTChat .m-sm-n4{margin:-15px !important}#PTTChat .mt-sm-n4,#PTTChat .my-sm-n4{margin-top:-15px !important}#PTTChat .mr-sm-n4,#PTTChat .mx-sm-n4{margin-right:-15px !important}#PTTChat .mb-sm-n4,#PTTChat .my-sm-n4{margin-bottom:-15px !important}#PTTChat .ml-sm-n4,#PTTChat .mx-sm-n4{margin-left:-15px !important}#PTTChat .m-sm-n5{margin:-30px !important}#PTTChat .mt-sm-n5,#PTTChat .my-sm-n5{margin-top:-30px !important}#PTTChat .mr-sm-n5,#PTTChat .mx-sm-n5{margin-right:-30px !important}#PTTChat .mb-sm-n5,#PTTChat .my-sm-n5{margin-bottom:-30px !important}#PTTChat .ml-sm-n5,#PTTChat .mx-sm-n5{margin-left:-30px !important}#PTTChat .m-sm-auto{margin:auto !important}#PTTChat .mt-sm-auto,#PTTChat .my-sm-auto{margin-top:auto !important}#PTTChat .mr-sm-auto,#PTTChat .mx-sm-auto{margin-right:auto !important}#PTTChat .mb-sm-auto,#PTTChat .my-sm-auto{margin-bottom:auto !important}#PTTChat .ml-sm-auto,#PTTChat .mx-sm-auto{margin-left:auto !important}}@media (min-width: 768px){#PTTChat .m-md-0{margin:0 !important}#PTTChat .mt-md-0,#PTTChat .my-md-0{margin-top:0 !important}#PTTChat .mr-md-0,#PTTChat .mx-md-0{margin-right:0 !important}#PTTChat .mb-md-0,#PTTChat .my-md-0{margin-bottom:0 !important}#PTTChat .ml-md-0,#PTTChat .mx-md-0{margin-left:0 !important}#PTTChat .m-md-1{margin:2.5px !important}#PTTChat .mt-md-1,#PTTChat .my-md-1{margin-top:2.5px !important}#PTTChat .mr-md-1,#PTTChat .mx-md-1{margin-right:2.5px !important}#PTTChat .mb-md-1,#PTTChat .my-md-1{margin-bottom:2.5px !important}#PTTChat .ml-md-1,#PTTChat .mx-md-1{margin-left:2.5px !important}#PTTChat .m-md-2{margin:5px !important}#PTTChat .mt-md-2,#PTTChat .my-md-2{margin-top:5px !important}#PTTChat .mr-md-2,#PTTChat .mx-md-2{margin-right:5px !important}#PTTChat .mb-md-2,#PTTChat .my-md-2{margin-bottom:5px !important}#PTTChat .ml-md-2,#PTTChat .mx-md-2{margin-left:5px !important}#PTTChat .m-md-3{margin:10px !important}#PTTChat .mt-md-3,#PTTChat .my-md-3{margin-top:10px !important}#PTTChat .mr-md-3,#PTTChat .mx-md-3{margin-right:10px !important}#PTTChat .mb-md-3,#PTTChat .my-md-3{margin-bottom:10px !important}#PTTChat .ml-md-3,#PTTChat .mx-md-3{margin-left:10px !important}#PTTChat .m-md-4{margin:15px !important}#PTTChat .mt-md-4,#PTTChat .my-md-4{margin-top:15px !important}#PTTChat .mr-md-4,#PTTChat .mx-md-4{margin-right:15px !important}#PTTChat .mb-md-4,#PTTChat .my-md-4{margin-bottom:15px !important}#PTTChat .ml-md-4,#PTTChat .mx-md-4{margin-left:15px !important}#PTTChat .m-md-5{margin:30px !important}#PTTChat .mt-md-5,#PTTChat .my-md-5{margin-top:30px !important}#PTTChat .mr-md-5,#PTTChat .mx-md-5{margin-right:30px !important}#PTTChat .mb-md-5,#PTTChat .my-md-5{margin-bottom:30px !important}#PTTChat .ml-md-5,#PTTChat .mx-md-5{margin-left:30px !important}#PTTChat .p-md-0{padding:0 !important}#PTTChat .pt-md-0,#PTTChat .py-md-0{padding-top:0 !important}#PTTChat .pr-md-0,#PTTChat .px-md-0{padding-right:0 !important}#PTTChat .pb-md-0,#PTTChat .py-md-0{padding-bottom:0 !important}#PTTChat .pl-md-0,#PTTChat .px-md-0{padding-left:0 !important}#PTTChat .p-md-1{padding:2.5px !important}#PTTChat .pt-md-1,#PTTChat .py-md-1{padding-top:2.5px !important}#PTTChat .pr-md-1,#PTTChat .px-md-1{padding-right:2.5px !important}#PTTChat .pb-md-1,#PTTChat .py-md-1{padding-bottom:2.5px !important}#PTTChat .pl-md-1,#PTTChat .px-md-1{padding-left:2.5px !important}#PTTChat .p-md-2{padding:5px !important}#PTTChat .pt-md-2,#PTTChat .py-md-2{padding-top:5px !important}#PTTChat .pr-md-2,#PTTChat .px-md-2{padding-right:5px !important}#PTTChat .pb-md-2,#PTTChat .py-md-2{padding-bottom:5px !important}#PTTChat .pl-md-2,#PTTChat .px-md-2{padding-left:5px !important}#PTTChat .p-md-3{padding:10px !important}#PTTChat .pt-md-3,#PTTChat .py-md-3{padding-top:10px !important}#PTTChat .pr-md-3,#PTTChat .px-md-3{padding-right:10px !important}#PTTChat .pb-md-3,#PTTChat .py-md-3{padding-bottom:10px !important}#PTTChat .pl-md-3,#PTTChat .px-md-3{padding-left:10px !important}#PTTChat .p-md-4{padding:15px !important}#PTTChat .pt-md-4,#PTTChat .py-md-4{padding-top:15px !important}#PTTChat .pr-md-4,#PTTChat .px-md-4{padding-right:15px !important}#PTTChat .pb-md-4,#PTTChat .py-md-4{padding-bottom:15px !important}#PTTChat .pl-md-4,#PTTChat .px-md-4{padding-left:15px !important}#PTTChat .p-md-5{padding:30px !important}#PTTChat .pt-md-5,#PTTChat .py-md-5{padding-top:30px !important}#PTTChat .pr-md-5,#PTTChat .px-md-5{padding-right:30px !important}#PTTChat .pb-md-5,#PTTChat .py-md-5{padding-bottom:30px !important}#PTTChat .pl-md-5,#PTTChat .px-md-5{padding-left:30px !important}#PTTChat .m-md-n1{margin:-2.5px !important}#PTTChat .mt-md-n1,#PTTChat .my-md-n1{margin-top:-2.5px !important}#PTTChat .mr-md-n1,#PTTChat .mx-md-n1{margin-right:-2.5px !important}#PTTChat .mb-md-n1,#PTTChat .my-md-n1{margin-bottom:-2.5px !important}#PTTChat .ml-md-n1,#PTTChat .mx-md-n1{margin-left:-2.5px !important}#PTTChat .m-md-n2{margin:-5px !important}#PTTChat .mt-md-n2,#PTTChat .my-md-n2{margin-top:-5px !important}#PTTChat .mr-md-n2,#PTTChat .mx-md-n2{margin-right:-5px !important}#PTTChat .mb-md-n2,#PTTChat .my-md-n2{margin-bottom:-5px !important}#PTTChat .ml-md-n2,#PTTChat .mx-md-n2{margin-left:-5px !important}#PTTChat .m-md-n3{margin:-10px !important}#PTTChat .mt-md-n3,#PTTChat .my-md-n3{margin-top:-10px !important}#PTTChat .mr-md-n3,#PTTChat .mx-md-n3{margin-right:-10px !important}#PTTChat .mb-md-n3,#PTTChat .my-md-n3{margin-bottom:-10px !important}#PTTChat .ml-md-n3,#PTTChat .mx-md-n3{margin-left:-10px !important}#PTTChat .m-md-n4{margin:-15px !important}#PTTChat .mt-md-n4,#PTTChat .my-md-n4{margin-top:-15px !important}#PTTChat .mr-md-n4,#PTTChat .mx-md-n4{margin-right:-15px !important}#PTTChat .mb-md-n4,#PTTChat .my-md-n4{margin-bottom:-15px !important}#PTTChat .ml-md-n4,#PTTChat .mx-md-n4{margin-left:-15px !important}#PTTChat .m-md-n5{margin:-30px !important}#PTTChat .mt-md-n5,#PTTChat .my-md-n5{margin-top:-30px !important}#PTTChat .mr-md-n5,#PTTChat .mx-md-n5{margin-right:-30px !important}#PTTChat .mb-md-n5,#PTTChat .my-md-n5{margin-bottom:-30px !important}#PTTChat .ml-md-n5,#PTTChat .mx-md-n5{margin-left:-30px !important}#PTTChat .m-md-auto{margin:auto !important}#PTTChat .mt-md-auto,#PTTChat .my-md-auto{margin-top:auto !important}#PTTChat .mr-md-auto,#PTTChat .mx-md-auto{margin-right:auto !important}#PTTChat .mb-md-auto,#PTTChat .my-md-auto{margin-bottom:auto !important}#PTTChat .ml-md-auto,#PTTChat .mx-md-auto{margin-left:auto !important}}@media (min-width: 992px){#PTTChat .m-lg-0{margin:0 !important}#PTTChat .mt-lg-0,#PTTChat .my-lg-0{margin-top:0 !important}#PTTChat .mr-lg-0,#PTTChat .mx-lg-0{margin-right:0 !important}#PTTChat .mb-lg-0,#PTTChat .my-lg-0{margin-bottom:0 !important}#PTTChat .ml-lg-0,#PTTChat .mx-lg-0{margin-left:0 !important}#PTTChat .m-lg-1{margin:2.5px !important}#PTTChat .mt-lg-1,#PTTChat .my-lg-1{margin-top:2.5px !important}#PTTChat .mr-lg-1,#PTTChat .mx-lg-1{margin-right:2.5px !important}#PTTChat .mb-lg-1,#PTTChat .my-lg-1{margin-bottom:2.5px !important}#PTTChat .ml-lg-1,#PTTChat .mx-lg-1{margin-left:2.5px !important}#PTTChat .m-lg-2{margin:5px !important}#PTTChat .mt-lg-2,#PTTChat .my-lg-2{margin-top:5px !important}#PTTChat .mr-lg-2,#PTTChat .mx-lg-2{margin-right:5px !important}#PTTChat .mb-lg-2,#PTTChat .my-lg-2{margin-bottom:5px !important}#PTTChat .ml-lg-2,#PTTChat .mx-lg-2{margin-left:5px !important}#PTTChat .m-lg-3{margin:10px !important}#PTTChat .mt-lg-3,#PTTChat .my-lg-3{margin-top:10px !important}#PTTChat .mr-lg-3,#PTTChat .mx-lg-3{margin-right:10px !important}#PTTChat .mb-lg-3,#PTTChat .my-lg-3{margin-bottom:10px !important}#PTTChat .ml-lg-3,#PTTChat .mx-lg-3{margin-left:10px !important}#PTTChat .m-lg-4{margin:15px !important}#PTTChat .mt-lg-4,#PTTChat .my-lg-4{margin-top:15px !important}#PTTChat .mr-lg-4,#PTTChat .mx-lg-4{margin-right:15px !important}#PTTChat .mb-lg-4,#PTTChat .my-lg-4{margin-bottom:15px !important}#PTTChat .ml-lg-4,#PTTChat .mx-lg-4{margin-left:15px !important}#PTTChat .m-lg-5{margin:30px !important}#PTTChat .mt-lg-5,#PTTChat .my-lg-5{margin-top:30px !important}#PTTChat .mr-lg-5,#PTTChat .mx-lg-5{margin-right:30px !important}#PTTChat .mb-lg-5,#PTTChat .my-lg-5{margin-bottom:30px !important}#PTTChat .ml-lg-5,#PTTChat .mx-lg-5{margin-left:30px !important}#PTTChat .p-lg-0{padding:0 !important}#PTTChat .pt-lg-0,#PTTChat .py-lg-0{padding-top:0 !important}#PTTChat .pr-lg-0,#PTTChat .px-lg-0{padding-right:0 !important}#PTTChat .pb-lg-0,#PTTChat .py-lg-0{padding-bottom:0 !important}#PTTChat .pl-lg-0,#PTTChat .px-lg-0{padding-left:0 !important}#PTTChat .p-lg-1{padding:2.5px !important}#PTTChat .pt-lg-1,#PTTChat .py-lg-1{padding-top:2.5px !important}#PTTChat .pr-lg-1,#PTTChat .px-lg-1{padding-right:2.5px !important}#PTTChat .pb-lg-1,#PTTChat .py-lg-1{padding-bottom:2.5px !important}#PTTChat .pl-lg-1,#PTTChat .px-lg-1{padding-left:2.5px !important}#PTTChat .p-lg-2{padding:5px !important}#PTTChat .pt-lg-2,#PTTChat .py-lg-2{padding-top:5px !important}#PTTChat .pr-lg-2,#PTTChat .px-lg-2{padding-right:5px !important}#PTTChat .pb-lg-2,#PTTChat .py-lg-2{padding-bottom:5px !important}#PTTChat .pl-lg-2,#PTTChat .px-lg-2{padding-left:5px !important}#PTTChat .p-lg-3{padding:10px !important}#PTTChat .pt-lg-3,#PTTChat .py-lg-3{padding-top:10px !important}#PTTChat .pr-lg-3,#PTTChat .px-lg-3{padding-right:10px !important}#PTTChat .pb-lg-3,#PTTChat .py-lg-3{padding-bottom:10px !important}#PTTChat .pl-lg-3,#PTTChat .px-lg-3{padding-left:10px !important}#PTTChat .p-lg-4{padding:15px !important}#PTTChat .pt-lg-4,#PTTChat .py-lg-4{padding-top:15px !important}#PTTChat .pr-lg-4,#PTTChat .px-lg-4{padding-right:15px !important}#PTTChat .pb-lg-4,#PTTChat .py-lg-4{padding-bottom:15px !important}#PTTChat .pl-lg-4,#PTTChat .px-lg-4{padding-left:15px !important}#PTTChat .p-lg-5{padding:30px !important}#PTTChat .pt-lg-5,#PTTChat .py-lg-5{padding-top:30px !important}#PTTChat .pr-lg-5,#PTTChat .px-lg-5{padding-right:30px !important}#PTTChat .pb-lg-5,#PTTChat .py-lg-5{padding-bottom:30px !important}#PTTChat .pl-lg-5,#PTTChat .px-lg-5{padding-left:30px !important}#PTTChat .m-lg-n1{margin:-2.5px !important}#PTTChat .mt-lg-n1,#PTTChat .my-lg-n1{margin-top:-2.5px !important}#PTTChat .mr-lg-n1,#PTTChat .mx-lg-n1{margin-right:-2.5px !important}#PTTChat .mb-lg-n1,#PTTChat .my-lg-n1{margin-bottom:-2.5px !important}#PTTChat .ml-lg-n1,#PTTChat .mx-lg-n1{margin-left:-2.5px !important}#PTTChat .m-lg-n2{margin:-5px !important}#PTTChat .mt-lg-n2,#PTTChat .my-lg-n2{margin-top:-5px !important}#PTTChat .mr-lg-n2,#PTTChat .mx-lg-n2{margin-right:-5px !important}#PTTChat .mb-lg-n2,#PTTChat .my-lg-n2{margin-bottom:-5px !important}#PTTChat .ml-lg-n2,#PTTChat .mx-lg-n2{margin-left:-5px !important}#PTTChat .m-lg-n3{margin:-10px !important}#PTTChat .mt-lg-n3,#PTTChat .my-lg-n3{margin-top:-10px !important}#PTTChat .mr-lg-n3,#PTTChat .mx-lg-n3{margin-right:-10px !important}#PTTChat .mb-lg-n3,#PTTChat .my-lg-n3{margin-bottom:-10px !important}#PTTChat .ml-lg-n3,#PTTChat .mx-lg-n3{margin-left:-10px !important}#PTTChat .m-lg-n4{margin:-15px !important}#PTTChat .mt-lg-n4,#PTTChat .my-lg-n4{margin-top:-15px !important}#PTTChat .mr-lg-n4,#PTTChat .mx-lg-n4{margin-right:-15px !important}#PTTChat .mb-lg-n4,#PTTChat .my-lg-n4{margin-bottom:-15px !important}#PTTChat .ml-lg-n4,#PTTChat .mx-lg-n4{margin-left:-15px !important}#PTTChat .m-lg-n5{margin:-30px !important}#PTTChat .mt-lg-n5,#PTTChat .my-lg-n5{margin-top:-30px !important}#PTTChat .mr-lg-n5,#PTTChat .mx-lg-n5{margin-right:-30px !important}#PTTChat .mb-lg-n5,#PTTChat .my-lg-n5{margin-bottom:-30px !important}#PTTChat .ml-lg-n5,#PTTChat .mx-lg-n5{margin-left:-30px !important}#PTTChat .m-lg-auto{margin:auto !important}#PTTChat .mt-lg-auto,#PTTChat .my-lg-auto{margin-top:auto !important}#PTTChat .mr-lg-auto,#PTTChat .mx-lg-auto{margin-right:auto !important}#PTTChat .mb-lg-auto,#PTTChat .my-lg-auto{margin-bottom:auto !important}#PTTChat .ml-lg-auto,#PTTChat .mx-lg-auto{margin-left:auto !important}}@media (min-width: 1200px){#PTTChat .m-xl-0{margin:0 !important}#PTTChat .mt-xl-0,#PTTChat .my-xl-0{margin-top:0 !important}#PTTChat .mr-xl-0,#PTTChat .mx-xl-0{margin-right:0 !important}#PTTChat .mb-xl-0,#PTTChat .my-xl-0{margin-bottom:0 !important}#PTTChat .ml-xl-0,#PTTChat .mx-xl-0{margin-left:0 !important}#PTTChat .m-xl-1{margin:2.5px !important}#PTTChat .mt-xl-1,#PTTChat .my-xl-1{margin-top:2.5px !important}#PTTChat .mr-xl-1,#PTTChat .mx-xl-1{margin-right:2.5px !important}#PTTChat .mb-xl-1,#PTTChat .my-xl-1{margin-bottom:2.5px !important}#PTTChat .ml-xl-1,#PTTChat .mx-xl-1{margin-left:2.5px !important}#PTTChat .m-xl-2{margin:5px !important}#PTTChat .mt-xl-2,#PTTChat .my-xl-2{margin-top:5px !important}#PTTChat .mr-xl-2,#PTTChat .mx-xl-2{margin-right:5px !important}#PTTChat .mb-xl-2,#PTTChat .my-xl-2{margin-bottom:5px !important}#PTTChat .ml-xl-2,#PTTChat .mx-xl-2{margin-left:5px !important}#PTTChat .m-xl-3{margin:10px !important}#PTTChat .mt-xl-3,#PTTChat .my-xl-3{margin-top:10px !important}#PTTChat .mr-xl-3,#PTTChat .mx-xl-3{margin-right:10px !important}#PTTChat .mb-xl-3,#PTTChat .my-xl-3{margin-bottom:10px !important}#PTTChat .ml-xl-3,#PTTChat .mx-xl-3{margin-left:10px !important}#PTTChat .m-xl-4{margin:15px !important}#PTTChat .mt-xl-4,#PTTChat .my-xl-4{margin-top:15px !important}#PTTChat .mr-xl-4,#PTTChat .mx-xl-4{margin-right:15px !important}#PTTChat .mb-xl-4,#PTTChat .my-xl-4{margin-bottom:15px !important}#PTTChat .ml-xl-4,#PTTChat .mx-xl-4{margin-left:15px !important}#PTTChat .m-xl-5{margin:30px !important}#PTTChat .mt-xl-5,#PTTChat .my-xl-5{margin-top:30px !important}#PTTChat .mr-xl-5,#PTTChat .mx-xl-5{margin-right:30px !important}#PTTChat .mb-xl-5,#PTTChat .my-xl-5{margin-bottom:30px !important}#PTTChat .ml-xl-5,#PTTChat .mx-xl-5{margin-left:30px !important}#PTTChat .p-xl-0{padding:0 !important}#PTTChat .pt-xl-0,#PTTChat .py-xl-0{padding-top:0 !important}#PTTChat .pr-xl-0,#PTTChat .px-xl-0{padding-right:0 !important}#PTTChat .pb-xl-0,#PTTChat .py-xl-0{padding-bottom:0 !important}#PTTChat .pl-xl-0,#PTTChat .px-xl-0{padding-left:0 !important}#PTTChat .p-xl-1{padding:2.5px !important}#PTTChat .pt-xl-1,#PTTChat .py-xl-1{padding-top:2.5px !important}#PTTChat .pr-xl-1,#PTTChat .px-xl-1{padding-right:2.5px !important}#PTTChat .pb-xl-1,#PTTChat .py-xl-1{padding-bottom:2.5px !important}#PTTChat .pl-xl-1,#PTTChat .px-xl-1{padding-left:2.5px !important}#PTTChat .p-xl-2{padding:5px !important}#PTTChat .pt-xl-2,#PTTChat .py-xl-2{padding-top:5px !important}#PTTChat .pr-xl-2,#PTTChat .px-xl-2{padding-right:5px !important}#PTTChat .pb-xl-2,#PTTChat .py-xl-2{padding-bottom:5px !important}#PTTChat .pl-xl-2,#PTTChat .px-xl-2{padding-left:5px !important}#PTTChat .p-xl-3{padding:10px !important}#PTTChat .pt-xl-3,#PTTChat .py-xl-3{padding-top:10px !important}#PTTChat .pr-xl-3,#PTTChat .px-xl-3{padding-right:10px !important}#PTTChat .pb-xl-3,#PTTChat .py-xl-3{padding-bottom:10px !important}#PTTChat .pl-xl-3,#PTTChat .px-xl-3{padding-left:10px !important}#PTTChat .p-xl-4{padding:15px !important}#PTTChat .pt-xl-4,#PTTChat .py-xl-4{padding-top:15px !important}#PTTChat .pr-xl-4,#PTTChat .px-xl-4{padding-right:15px !important}#PTTChat .pb-xl-4,#PTTChat .py-xl-4{padding-bottom:15px !important}#PTTChat .pl-xl-4,#PTTChat .px-xl-4{padding-left:15px !important}#PTTChat .p-xl-5{padding:30px !important}#PTTChat .pt-xl-5,#PTTChat .py-xl-5{padding-top:30px !important}#PTTChat .pr-xl-5,#PTTChat .px-xl-5{padding-right:30px !important}#PTTChat .pb-xl-5,#PTTChat .py-xl-5{padding-bottom:30px !important}#PTTChat .pl-xl-5,#PTTChat .px-xl-5{padding-left:30px !important}#PTTChat .m-xl-n1{margin:-2.5px !important}#PTTChat .mt-xl-n1,#PTTChat .my-xl-n1{margin-top:-2.5px !important}#PTTChat .mr-xl-n1,#PTTChat .mx-xl-n1{margin-right:-2.5px !important}#PTTChat .mb-xl-n1,#PTTChat .my-xl-n1{margin-bottom:-2.5px !important}#PTTChat .ml-xl-n1,#PTTChat .mx-xl-n1{margin-left:-2.5px !important}#PTTChat .m-xl-n2{margin:-5px !important}#PTTChat .mt-xl-n2,#PTTChat .my-xl-n2{margin-top:-5px !important}#PTTChat .mr-xl-n2,#PTTChat .mx-xl-n2{margin-right:-5px !important}#PTTChat .mb-xl-n2,#PTTChat .my-xl-n2{margin-bottom:-5px !important}#PTTChat .ml-xl-n2,#PTTChat .mx-xl-n2{margin-left:-5px !important}#PTTChat .m-xl-n3{margin:-10px !important}#PTTChat .mt-xl-n3,#PTTChat .my-xl-n3{margin-top:-10px !important}#PTTChat .mr-xl-n3,#PTTChat .mx-xl-n3{margin-right:-10px !important}#PTTChat .mb-xl-n3,#PTTChat .my-xl-n3{margin-bottom:-10px !important}#PTTChat .ml-xl-n3,#PTTChat .mx-xl-n3{margin-left:-10px !important}#PTTChat .m-xl-n4{margin:-15px !important}#PTTChat .mt-xl-n4,#PTTChat .my-xl-n4{margin-top:-15px !important}#PTTChat .mr-xl-n4,#PTTChat .mx-xl-n4{margin-right:-15px !important}#PTTChat .mb-xl-n4,#PTTChat .my-xl-n4{margin-bottom:-15px !important}#PTTChat .ml-xl-n4,#PTTChat .mx-xl-n4{margin-left:-15px !important}#PTTChat .m-xl-n5{margin:-30px !important}#PTTChat .mt-xl-n5,#PTTChat .my-xl-n5{margin-top:-30px !important}#PTTChat .mr-xl-n5,#PTTChat .mx-xl-n5{margin-right:-30px !important}#PTTChat .mb-xl-n5,#PTTChat .my-xl-n5{margin-bottom:-30px !important}#PTTChat .ml-xl-n5,#PTTChat .mx-xl-n5{margin-left:-30px !important}#PTTChat .m-xl-auto{margin:auto !important}#PTTChat .mt-xl-auto,#PTTChat .my-xl-auto{margin-top:auto !important}#PTTChat .mr-xl-auto,#PTTChat .mx-xl-auto{margin-right:auto !important}#PTTChat .mb-xl-auto,#PTTChat .my-xl-auto{margin-bottom:auto !important}#PTTChat .ml-xl-auto,#PTTChat .mx-xl-auto{margin-left:auto !important}}#PTTChat .stretched-link::after{position:absolute;top:0;right:0;bottom:0;left:0;z-index:1;pointer-events:auto;content:\"\";background-color:rgba(0,0,0,0)}#PTTChat .text-monospace{font-family:SFMono-Regular,Menlo,Monaco,Consolas,\"Liberation Mono\",\"Courier New\",monospace !important}#PTTChat .text-justify{text-align:justify !important}#PTTChat .text-wrap{white-space:normal !important}#PTTChat .text-nowrap{white-space:nowrap !important}#PTTChat .text-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}#PTTChat .text-left{text-align:left !important}#PTTChat .text-right{text-align:right !important}#PTTChat .text-center{text-align:center !important}@media (min-width: 576px){#PTTChat .text-sm-left{text-align:left !important}#PTTChat .text-sm-right{text-align:right !important}#PTTChat .text-sm-center{text-align:center !important}}@media (min-width: 768px){#PTTChat .text-md-left{text-align:left !important}#PTTChat .text-md-right{text-align:right !important}#PTTChat .text-md-center{text-align:center !important}}@media (min-width: 992px){#PTTChat .text-lg-left{text-align:left !important}#PTTChat .text-lg-right{text-align:right !important}#PTTChat .text-lg-center{text-align:center !important}}@media (min-width: 1200px){#PTTChat .text-xl-left{text-align:left !important}#PTTChat .text-xl-right{text-align:right !important}#PTTChat .text-xl-center{text-align:center !important}}#PTTChat .text-lowercase{text-transform:lowercase !important}#PTTChat .text-uppercase{text-transform:uppercase !important}#PTTChat .text-capitalize{text-transform:capitalize !important}#PTTChat .font-weight-light{font-weight:300 !important}#PTTChat .font-weight-lighter{font-weight:lighter !important}#PTTChat .font-weight-normal{font-weight:400 !important}#PTTChat .font-weight-bold{font-weight:700 !important}#PTTChat .font-weight-bolder{font-weight:bolder !important}#PTTChat .font-italic{font-style:italic !important}#PTTChat .text-white{color:#fff !important}#PTTChat .text-primary{color:#007bff !important}#PTTChat a.text-primary:hover,#PTTChat a.text-primary:focus{color:#0056b3 !important}#PTTChat .text-secondary{color:#6c757d !important}#PTTChat a.text-secondary:hover,#PTTChat a.text-secondary:focus{color:#494f54 !important}#PTTChat .text-success{color:#28a745 !important}#PTTChat a.text-success:hover,#PTTChat a.text-success:focus{color:#19692c !important}#PTTChat .text-info{color:#17a2b8 !important}#PTTChat a.text-info:hover,#PTTChat a.text-info:focus{color:#0f6674 !important}#PTTChat .text-warning{color:#ffc107 !important}#PTTChat a.text-warning:hover,#PTTChat a.text-warning:focus{color:#ba8b00 !important}#PTTChat .text-danger{color:#dc3545 !important}#PTTChat a.text-danger:hover,#PTTChat a.text-danger:focus{color:#a71d2a !important}#PTTChat .text-light{color:#f8f9fa !important}#PTTChat a.text-light:hover,#PTTChat a.text-light:focus{color:#cbd3da !important}#PTTChat .text-dark{color:#343a40 !important}#PTTChat a.text-dark:hover,#PTTChat a.text-dark:focus{color:#121416 !important}#PTTChat .text-body{color:#212529 !important}#PTTChat .text-muted{color:#6c757d !important}#PTTChat .text-black-50{color:rgba(0,0,0,0.5) !important}#PTTChat .text-white-50{color:rgba(255,255,255,0.5) !important}#PTTChat .text-hide{font:0/0 a;color:transparent;text-shadow:none;background-color:transparent;border:0}#PTTChat .text-decoration-none{text-decoration:none !important}#PTTChat .text-break{word-break:break-word !important;word-wrap:break-word !important}#PTTChat .text-reset{color:inherit !important}#PTTChat .visible{visibility:visible !important}#PTTChat .invisible{visibility:hidden !important}@media print{#PTTChat *,#PTTChat *::before,#PTTChat *::after{text-shadow:none !important;box-shadow:none !important}#PTTChat a:not(.btn){text-decoration:underline}#PTTChat abbr[title]::after{content:\" (\" attr(title) \")\"}#PTTChat pre{white-space:pre-wrap !important}#PTTChat pre,#PTTChat blockquote{border:1px solid #adb5bd;page-break-inside:avoid}#PTTChat tr,#PTTChat img{page-break-inside:avoid}#PTTChat p,#PTTChat h2,#PTTChat h3{orphans:3;widows:3}#PTTChat h2,#PTTChat h3{page-break-after:avoid}@page{#PTTChat{size:a3}}#PTTChat body{min-width:992px !important}#PTTChat .container{min-width:992px !important}#PTTChat .navbar{display:none}#PTTChat .badge{border:1px solid #000}#PTTChat .table{border-collapse:collapse !important}#PTTChat .table td,#PTTChat .table th{background-color:#fff !important}#PTTChat .table-bordered th,#PTTChat .table-bordered td{border:1px solid #dee2e6 !important}#PTTChat .table-dark{color:inherit}#PTTChat .table-dark th,#PTTChat .table-dark td,#PTTChat .table-dark thead th,#PTTChat .table-dark tbody+tbody{border-color:#dee2e6}#PTTChat .table .thead-dark th{color:inherit;border-color:#dee2e6}}#PTTChat .list-alert-enter,#PTTChat .list-alert-leave-to{opacity:0;transform:translateX(300px)}#PTTChat .list-alert-leave-active{position:absolute}#PTTChat .alert{transition:all 1s}#PTTChat table{margin:0;font-family:-apple-system,BlinkMacSystemFont,\"Segoe UI\",Roboto,\"Helvetica Neue\",Arial,\"Noto Sans\",\"Liberation Sans\",sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\",\"Segoe UI Symbol\",\"Noto Color Emoji\";font-size:12px;font-weight:400;line-height:1.5;color:#212529;text-align:left;background-color:#fff}#PTTChat.pttbgc-0 .ptt-bg{background-color:#000}#PTTChat.pttbgc-0 .ptt-chat-id{color:#ff6}#PTTChat.pttbgc-0 .ptt-chat-time{color:#bbb}#PTTChat.pttbgc-0 .ptt-chat-msg{color:#990 !important}#PTTChat.pttbgc-0 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-0 .ptt-chat-type-n{color:red}#PTTChat.pttbgc-1 .ptt-bg{background-color:#0d0d0d}#PTTChat.pttbgc-1 .ptt-chat-id{color:#ffff6b}#PTTChat.pttbgc-1 .ptt-chat-time{color:#bebebe}#PTTChat.pttbgc-1 .ptt-chat-msg{color:#9b9b00 !important}#PTTChat.pttbgc-1 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-1 .ptt-chat-type-n{color:#ff0404}#PTTChat.pttbgc-2 .ptt-bg{background-color:#1a1a1a}#PTTChat.pttbgc-2 .ptt-chat-id{color:#ffff71}#PTTChat.pttbgc-2 .ptt-chat-time{color:#c1c1c1}#PTTChat.pttbgc-2 .ptt-chat-msg{color:#9e9e00 !important}#PTTChat.pttbgc-2 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-2 .ptt-chat-type-n{color:#ff0808}#PTTChat.pttbgc-3 .ptt-bg{background-color:#262626}#PTTChat.pttbgc-3 .ptt-chat-id{color:#ffff76}#PTTChat.pttbgc-3 .ptt-chat-time{color:#c3c3c3}#PTTChat.pttbgc-3 .ptt-chat-msg{color:#a0a000 !important}#PTTChat.pttbgc-3 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-3 .ptt-chat-type-n{color:#ff0b0b}#PTTChat.pttbgc-4 .ptt-bg{background-color:#333}#PTTChat.pttbgc-4 .ptt-chat-id{color:#ffff7b}#PTTChat.pttbgc-4 .ptt-chat-time{color:#c6c6c6}#PTTChat.pttbgc-4 .ptt-chat-msg{color:#a2a200 !important}#PTTChat.pttbgc-4 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-4 .ptt-chat-type-n{color:#ff0f0f}#PTTChat.pttbgc-5 .ptt-bg{background-color:#404040}#PTTChat.pttbgc-5 .ptt-chat-id{color:#ffff81}#PTTChat.pttbgc-5 .ptt-chat-time{color:#c9c9c9}#PTTChat.pttbgc-5 .ptt-chat-msg{color:#a4a400 !important}#PTTChat.pttbgc-5 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-5 .ptt-chat-type-n{color:#ff1313}#PTTChat.pttbgc-6 .ptt-bg{background-color:#4d4d4d}#PTTChat.pttbgc-6 .ptt-chat-id{color:#ffff86}#PTTChat.pttbgc-6 .ptt-chat-time{color:#ccc}#PTTChat.pttbgc-6 .ptt-chat-msg{color:#a7a700 !important}#PTTChat.pttbgc-6 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-6 .ptt-chat-type-n{color:#ff1717}#PTTChat.pttbgc-7 .ptt-bg{background-color:#595959}#PTTChat.pttbgc-7 .ptt-chat-id{color:#ffff8b}#PTTChat.pttbgc-7 .ptt-chat-time{color:#cfcfcf}#PTTChat.pttbgc-7 .ptt-chat-msg{color:#a9a900 !important}#PTTChat.pttbgc-7 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-7 .ptt-chat-type-n{color:#ff1b1b}#PTTChat.pttbgc-8 .ptt-bg{background-color:#666}#PTTChat.pttbgc-8 .ptt-chat-id{color:#ffff91}#PTTChat.pttbgc-8 .ptt-chat-time{color:#d1d1d1}#PTTChat.pttbgc-8 .ptt-chat-msg{color:#abab00 !important}#PTTChat.pttbgc-8 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-8 .ptt-chat-type-n{color:#ff1f1f}#PTTChat.pttbgc-9 .ptt-bg{background-color:#737373}#PTTChat.pttbgc-9 .ptt-chat-id{color:#ffff96}#PTTChat.pttbgc-9 .ptt-chat-time{color:#d4d4d4}#PTTChat.pttbgc-9 .ptt-chat-msg{color:#aeae00 !important}#PTTChat.pttbgc-9 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-9 .ptt-chat-type-n{color:#f22}#PTTChat.pttbgc-10 .ptt-bg{background-color:gray}#PTTChat.pttbgc-10 .ptt-chat-id{color:#ffff9c}#PTTChat.pttbgc-10 .ptt-chat-time{color:#d7d7d7}#PTTChat.pttbgc-10 .ptt-chat-msg{color:#b0b000 !important}#PTTChat.pttbgc-10 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-10 .ptt-chat-type-n{color:#ff2626}#PTTChat.pttbgc-11 .ptt-bg{background-color:#8c8c8c}#PTTChat.pttbgc-11 .ptt-chat-id{color:#ffffa1}#PTTChat.pttbgc-11 .ptt-chat-time{color:#dadada}#PTTChat.pttbgc-11 .ptt-chat-msg{color:#b2b200 !important}#PTTChat.pttbgc-11 .ptt-chat-type{color:#fff}#PTTChat.pttbgc-11 .ptt-chat-type-n{color:#ff2a2a}#PTTChat.pttbgc-12 .ptt-bg{background-color:#999}#PTTChat.pttbgc-12 .ptt-chat-id{color:#880}#PTTChat.pttbgc-12 .ptt-chat-time{color:#474747}#PTTChat.pttbgc-12 .ptt-chat-msg{color:#3a3a00 !important}#PTTChat.pttbgc-12 .ptt-chat-type{color:#616161}#PTTChat.pttbgc-12 .ptt-chat-type-n{color:#610000}#PTTChat.pttbgc-13 .ptt-bg{background-color:#a6a6a6}#PTTChat.pttbgc-13 .ptt-chat-id{color:#8d8d00}#PTTChat.pttbgc-13 .ptt-chat-time{color:#4a4a4a}#PTTChat.pttbgc-13 .ptt-chat-msg{color:#3c3c00 !important}#PTTChat.pttbgc-13 .ptt-chat-type{color:#656565}#PTTChat.pttbgc-13 .ptt-chat-type-n{color:#650000}#PTTChat.pttbgc-14 .ptt-bg{background-color:#b3b3b3}#PTTChat.pttbgc-14 .ptt-chat-id{color:#929200}#PTTChat.pttbgc-14 .ptt-chat-time{color:#4d4d4d}#PTTChat.pttbgc-14 .ptt-chat-msg{color:#3f3f00 !important}#PTTChat.pttbgc-14 .ptt-chat-type{color:dimgray}#PTTChat.pttbgc-14 .ptt-chat-type-n{color:#690000}#PTTChat.pttbgc-15 .ptt-bg{background-color:#bfbfbf}#PTTChat.pttbgc-15 .ptt-chat-id{color:#989800}#PTTChat.pttbgc-15 .ptt-chat-time{color:#4f4f4f}#PTTChat.pttbgc-15 .ptt-chat-msg{color:#414100 !important}#PTTChat.pttbgc-15 .ptt-chat-type{color:#6c6c6c}#PTTChat.pttbgc-15 .ptt-chat-type-n{color:#6c0000}#PTTChat.pttbgc-16 .ptt-bg{background-color:#ccc}#PTTChat.pttbgc-16 .ptt-chat-id{color:#9d9d00}#PTTChat.pttbgc-16 .ptt-chat-time{color:#525252}#PTTChat.pttbgc-16 .ptt-chat-msg{color:#434300 !important}#PTTChat.pttbgc-16 .ptt-chat-type{color:#707070}#PTTChat.pttbgc-16 .ptt-chat-type-n{color:#700000}#PTTChat.pttbgc-17 .ptt-bg{background-color:#d9d9d9}#PTTChat.pttbgc-17 .ptt-chat-id{color:#a2a200}#PTTChat.pttbgc-17 .ptt-chat-time{color:#555}#PTTChat.pttbgc-17 .ptt-chat-msg{color:#464600 !important}#PTTChat.pttbgc-17 .ptt-chat-type{color:#747474}#PTTChat.pttbgc-17 .ptt-chat-type-n{color:#740000}#PTTChat.pttbgc-18 .ptt-bg{background-color:#e6e6e6}#PTTChat.pttbgc-18 .ptt-chat-id{color:#a8a800}#PTTChat.pttbgc-18 .ptt-chat-time{color:#585858}#PTTChat.pttbgc-18 .ptt-chat-msg{color:#484800 !important}#PTTChat.pttbgc-18 .ptt-chat-type{color:#787878}#PTTChat.pttbgc-18 .ptt-chat-type-n{color:#780000}#PTTChat.pttbgc-19 .ptt-bg{background-color:#f2f2f2}#PTTChat.pttbgc-19 .ptt-chat-id{color:#adad00}#PTTChat.pttbgc-19 .ptt-chat-time{color:#5b5b5b}#PTTChat.pttbgc-19 .ptt-chat-msg{color:#4a4a00 !important}#PTTChat.pttbgc-19 .ptt-chat-type{color:#7c7c7c}#PTTChat.pttbgc-19 .ptt-chat-type-n{color:#7c0000}#PTTChat.pttbgc-20 .ptt-bg{background-color:#fff}#PTTChat.pttbgc-20 .ptt-chat-id{color:#b3b300}#PTTChat.pttbgc-20 .ptt-chat-time{color:#5e5e5e}#PTTChat.pttbgc-20 .ptt-chat-msg{color:#4d4d00 !important}#PTTChat.pttbgc-20 .ptt-chat-type{color:gray}#PTTChat.pttbgc-20 .ptt-chat-type-n{color:maroon}#PTTChat.pttc-10 .ptt-border{border:1px solid #000 !important}#PTTChat.pttc-10 .ptt-text{color:#000 !important}#PTTChat.pttc-10 .ptt-btnoutline{color:#000;color:#000;border-color:#000}#PTTChat.pttc-10 .ptt-btnoutline:hover{color:#fff;background-color:#000;border-color:#000}#PTTChat.pttc-10 .ptt-btnoutline:focus,#PTTChat.pttc-10 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(0,0,0,0.5)}#PTTChat.pttc-10 .ptt-btnoutline.disabled,#PTTChat.pttc-10 .ptt-btnoutline:disabled{color:#000;background-color:transparent}#PTTChat.pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-10 .ptt-btnoutline.dropdown-toggle{color:#fff;background-color:#000;border-color:#000}#PTTChat.pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-10 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-10 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(0,0,0,0.5)}#PTTChat.pttc-10 .nav-link.active,#PTTChat.pttc-10 .nav-item.show .nav-link{color:#000;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-9 .ptt-border{border:1px solid #1a1a1a !important}#PTTChat.pttc-9 .ptt-text{color:#1a1a1a !important}#PTTChat.pttc-9 .ptt-btnoutline{color:#1a1a1a;color:#1a1a1a;border-color:#1a1a1a}#PTTChat.pttc-9 .ptt-btnoutline:hover{color:#fff;background-color:#1a1a1a;border-color:#1a1a1a}#PTTChat.pttc-9 .ptt-btnoutline:focus,#PTTChat.pttc-9 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(26,26,26,0.5)}#PTTChat.pttc-9 .ptt-btnoutline.disabled,#PTTChat.pttc-9 .ptt-btnoutline:disabled{color:#1a1a1a;background-color:transparent}#PTTChat.pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-9 .ptt-btnoutline.dropdown-toggle{color:#fff;background-color:#1a1a1a;border-color:#1a1a1a}#PTTChat.pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-9 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-9 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(26,26,26,0.5)}#PTTChat.pttc-9 .nav-link.active,#PTTChat.pttc-9 .nav-item.show .nav-link{color:#1a1a1a;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-8 .ptt-border{border:1px solid #333 !important}#PTTChat.pttc-8 .ptt-text{color:#333 !important}#PTTChat.pttc-8 .ptt-btnoutline{color:#333;color:#333;border-color:#333}#PTTChat.pttc-8 .ptt-btnoutline:hover{color:#fff;background-color:#333;border-color:#333}#PTTChat.pttc-8 .ptt-btnoutline:focus,#PTTChat.pttc-8 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(51,51,51,0.5)}#PTTChat.pttc-8 .ptt-btnoutline.disabled,#PTTChat.pttc-8 .ptt-btnoutline:disabled{color:#333;background-color:transparent}#PTTChat.pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-8 .ptt-btnoutline.dropdown-toggle{color:#fff;background-color:#333;border-color:#333}#PTTChat.pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-8 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-8 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(51,51,51,0.5)}#PTTChat.pttc-8 .nav-link.active,#PTTChat.pttc-8 .nav-item.show .nav-link{color:#333;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-7 .ptt-border{border:1px solid #4d4d4d !important}#PTTChat.pttc-7 .ptt-text{color:#4d4d4d !important}#PTTChat.pttc-7 .ptt-btnoutline{color:#4d4d4d;color:#4d4d4d;border-color:#4d4d4d}#PTTChat.pttc-7 .ptt-btnoutline:hover{color:#fff;background-color:#4d4d4d;border-color:#4d4d4d}#PTTChat.pttc-7 .ptt-btnoutline:focus,#PTTChat.pttc-7 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(77,77,77,0.5)}#PTTChat.pttc-7 .ptt-btnoutline.disabled,#PTTChat.pttc-7 .ptt-btnoutline:disabled{color:#4d4d4d;background-color:transparent}#PTTChat.pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-7 .ptt-btnoutline.dropdown-toggle{color:#fff;background-color:#4d4d4d;border-color:#4d4d4d}#PTTChat.pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-7 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-7 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(77,77,77,0.5)}#PTTChat.pttc-7 .nav-link.active,#PTTChat.pttc-7 .nav-item.show .nav-link{color:#4d4d4d;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-6 .ptt-border{border:1px solid #666 !important}#PTTChat.pttc-6 .ptt-text{color:#666 !important}#PTTChat.pttc-6 .ptt-btnoutline{color:#666;color:#666;border-color:#666}#PTTChat.pttc-6 .ptt-btnoutline:hover{color:#fff;background-color:#666;border-color:#666}#PTTChat.pttc-6 .ptt-btnoutline:focus,#PTTChat.pttc-6 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(102,102,102,0.5)}#PTTChat.pttc-6 .ptt-btnoutline.disabled,#PTTChat.pttc-6 .ptt-btnoutline:disabled{color:#666;background-color:transparent}#PTTChat.pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-6 .ptt-btnoutline.dropdown-toggle{color:#fff;background-color:#666;border-color:#666}#PTTChat.pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-6 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-6 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(102,102,102,0.5)}#PTTChat.pttc-6 .nav-link.active,#PTTChat.pttc-6 .nav-item.show .nav-link{color:#666;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-5 .ptt-border{border:1px solid gray !important}#PTTChat.pttc-5 .ptt-text{color:gray !important}#PTTChat.pttc-5 .ptt-btnoutline{color:gray;color:gray;border-color:gray}#PTTChat.pttc-5 .ptt-btnoutline:hover{color:#fff;background-color:gray;border-color:gray}#PTTChat.pttc-5 .ptt-btnoutline:focus,#PTTChat.pttc-5 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(128,128,128,0.5)}#PTTChat.pttc-5 .ptt-btnoutline.disabled,#PTTChat.pttc-5 .ptt-btnoutline:disabled{color:gray;background-color:transparent}#PTTChat.pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-5 .ptt-btnoutline.dropdown-toggle{color:#fff;background-color:gray;border-color:gray}#PTTChat.pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-5 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-5 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(128,128,128,0.5)}#PTTChat.pttc-5 .nav-link.active,#PTTChat.pttc-5 .nav-item.show .nav-link{color:gray;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-4 .ptt-border{border:1px solid #999 !important}#PTTChat.pttc-4 .ptt-text{color:#999 !important}#PTTChat.pttc-4 .ptt-btnoutline{color:#999;color:#999;border-color:#999}#PTTChat.pttc-4 .ptt-btnoutline:hover{color:#212529;background-color:#999;border-color:#999}#PTTChat.pttc-4 .ptt-btnoutline:focus,#PTTChat.pttc-4 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(153,153,153,0.5)}#PTTChat.pttc-4 .ptt-btnoutline.disabled,#PTTChat.pttc-4 .ptt-btnoutline:disabled{color:#999;background-color:transparent}#PTTChat.pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-4 .ptt-btnoutline.dropdown-toggle{color:#212529;background-color:#999;border-color:#999}#PTTChat.pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-4 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-4 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(153,153,153,0.5)}#PTTChat.pttc-4 .nav-link.active,#PTTChat.pttc-4 .nav-item.show .nav-link{color:#999;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-3 .ptt-border{border:1px solid #b3b3b3 !important}#PTTChat.pttc-3 .ptt-text{color:#b3b3b3 !important}#PTTChat.pttc-3 .ptt-btnoutline{color:#b3b3b3;color:#b3b3b3;border-color:#b3b3b3}#PTTChat.pttc-3 .ptt-btnoutline:hover{color:#212529;background-color:#b3b3b3;border-color:#b3b3b3}#PTTChat.pttc-3 .ptt-btnoutline:focus,#PTTChat.pttc-3 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(179,179,179,0.5)}#PTTChat.pttc-3 .ptt-btnoutline.disabled,#PTTChat.pttc-3 .ptt-btnoutline:disabled{color:#b3b3b3;background-color:transparent}#PTTChat.pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-3 .ptt-btnoutline.dropdown-toggle{color:#212529;background-color:#b3b3b3;border-color:#b3b3b3}#PTTChat.pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-3 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-3 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(179,179,179,0.5)}#PTTChat.pttc-3 .nav-link.active,#PTTChat.pttc-3 .nav-item.show .nav-link{color:#b3b3b3;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-2 .ptt-border{border:1px solid #ccc !important}#PTTChat.pttc-2 .ptt-text{color:#ccc !important}#PTTChat.pttc-2 .ptt-btnoutline{color:#ccc;color:#ccc;border-color:#ccc}#PTTChat.pttc-2 .ptt-btnoutline:hover{color:#212529;background-color:#ccc;border-color:#ccc}#PTTChat.pttc-2 .ptt-btnoutline:focus,#PTTChat.pttc-2 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(204,204,204,0.5)}#PTTChat.pttc-2 .ptt-btnoutline.disabled,#PTTChat.pttc-2 .ptt-btnoutline:disabled{color:#ccc;background-color:transparent}#PTTChat.pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-2 .ptt-btnoutline.dropdown-toggle{color:#212529;background-color:#ccc;border-color:#ccc}#PTTChat.pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-2 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-2 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(204,204,204,0.5)}#PTTChat.pttc-2 .nav-link.active,#PTTChat.pttc-2 .nav-item.show .nav-link{color:#ccc;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-1 .ptt-border{border:1px solid #e6e6e6 !important}#PTTChat.pttc-1 .ptt-text{color:#e6e6e6 !important}#PTTChat.pttc-1 .ptt-btnoutline{color:#e6e6e6;color:#e6e6e6;border-color:#e6e6e6}#PTTChat.pttc-1 .ptt-btnoutline:hover{color:#212529;background-color:#e6e6e6;border-color:#e6e6e6}#PTTChat.pttc-1 .ptt-btnoutline:focus,#PTTChat.pttc-1 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(230,230,230,0.5)}#PTTChat.pttc-1 .ptt-btnoutline.disabled,#PTTChat.pttc-1 .ptt-btnoutline:disabled{color:#e6e6e6;background-color:transparent}#PTTChat.pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-1 .ptt-btnoutline.dropdown-toggle{color:#212529;background-color:#e6e6e6;border-color:#e6e6e6}#PTTChat.pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-1 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-1 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(230,230,230,0.5)}#PTTChat.pttc-1 .nav-link.active,#PTTChat.pttc-1 .nav-item.show .nav-link{color:#e6e6e6;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.pttc-0 .ptt-border{border:1px solid #fff !important}#PTTChat.pttc-0 .ptt-text{color:#fff !important}#PTTChat.pttc-0 .ptt-btnoutline{color:#fff;color:#fff;border-color:#fff}#PTTChat.pttc-0 .ptt-btnoutline:hover{color:#212529;background-color:#fff;border-color:#fff}#PTTChat.pttc-0 .ptt-btnoutline:focus,#PTTChat.pttc-0 .ptt-btnoutline.focus{box-shadow:0 0 0 2px rgba(255,255,255,0.5)}#PTTChat.pttc-0 .ptt-btnoutline.disabled,#PTTChat.pttc-0 .ptt-btnoutline:disabled{color:#fff;background-color:transparent}#PTTChat.pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled):active,#PTTChat.pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled).active,.show>#PTTChat.pttc-0 .ptt-btnoutline.dropdown-toggle{color:#212529;background-color:#fff;border-color:#fff}#PTTChat.pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled):active:focus,#PTTChat.pttc-0 .ptt-btnoutline:not(:disabled):not(.disabled).active:focus,.show>#PTTChat.pttc-0 .ptt-btnoutline.dropdown-toggle:focus{box-shadow:0 0 0 2px rgba(255,255,255,0.5)}#PTTChat.pttc-0 .nav-link.active,#PTTChat.pttc-0 .nav-item.show .nav-link{color:#fff;background-color:#fff;border-color:#dee2e6 #dee2e6 #fff}#PTTChat.position-absolute{position:absolute !important}#PTTChat .position-absolute{position:absolute !important}#PTTChat .position-relative{position:relative !important}#PTTChat.w-100{width:100% !important}#PTTChat .ptt-chat{font-weight:500}#PTTChat .ptt-chat-msg{word-break:break-word}#PTTChat hr{border-top:1px solid rgba(128,128,128,0.5) !important}#PTTChat .ptt-chat-msg a{text-decoration:underline !important}#PTTChat .dropdown-submenu{position:relative}#PTTChat .dropdown-submenu>.dropdown-menu{top:0;left:50%;margin-top:-6px}#PTTChat .dropdown-submenu:hover>.dropdown-menu{display:block}#PTTChat .dropdown-submenu>a:after{display:block;content:\" \";float:right;border-color:transparent;border-style:solid;border-width:5px 0 5px 5px;border-left-color:#ccc;margin-top:5px;margin-right:-10px}#PTTChat .transition-smooth{height:0;overflow:hidden;transition:1s}#PTTChat .col-form-label{padding-top:4.75px;padding-bottom:4.75px;margin-bottom:0;font-size:inherit;line-height:1.5}#container.position-relative{position:relative !important}#pttchatparent.d-flex,#fakeparent.d-flex{display:flex !important}#fakeparent.flex-row{flex-direction:row !important}#fakeparent.flex-column{flex-direction:column !important}#PTTChat.h-100{height:100% !important}\n", ""]);
// Exports
/* harmony default export */ __webpack_exports__["default"] = (___CSS_LOADER_EXPORT___);


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./src/MessagePoster.js
function MessagePoster() {
  this.targetorigin = '';
  this.ownerorigin = '';
  this.targetWindow = null;

  this.PostMessage = function (msg, data) {
    if (this.targetWindow === null) return;
    const d = {
      m: msg,
      d: data
    };
    this.targetWindow.postMessage(d, this.targetorigin);

    if (false) {}
  };

  this.onMessage = function (event) {
    // Check sender origin to be trusted
    if (event.origin !== this.targetorigin) return;
    const data = event.data;

    if (typeof this[data.m] === 'function') {
      this[data.m].call(null, data.d);
    }

    if (false) {}
  };

  if (window.addEventListener) {
    if (false) {}
    /* eslint-disable no-useless-call */

    window.addEventListener('message', event => {
      this.onMessage.call(this, event);
    }, false);
  } else if (window.attachEvent) {
    if (false) {}
    window.attachEvent('onmessage', event => {
      this.onMessage.call(this, event);
    }, false);
    /* eslint-enable no-useless-call */
  }
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttState.js
/**
 * @enum {number}
 * @readonly
 */
const FrameState = Object.freeze({
  login: 0,
  main: 1,
  board: 2,
  firstPageofPost: 3,
  otherPageofPost: 4,
  boardInfo: 6
});
/**
 * @typedef {Object} PttState
 * @property {boolean} connection
 * @property {boolean} login
 * @property {boolean} lock
 * @property {boolean} screenUpdated
 * @property {number} lastUpdateTime
 * @property {FrameState} frame
 * @property {string[]} screen
 * @property {boolean} serverfull
 * @property {number} reconnectTime
 * @property {boolean} deleteOtherConnection
 */

/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @return {PttState}
 */

function PttState() {
  return {
    connection: true,
    // 自動 連線狀態
    login: false,
    // 自動 登入狀態
    lock: false,
    // 手動 任務是否執行中
    screenUpdated: false,
    // 自動
    lastUpdateTime: 0,
    // 自動 最後更新時間
    frame: 0,
    // 自動 PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
    screen: [],
    // 自動 畫面資料
    serverfull: false,
    reconnectTime: 10,
    deleteOtherConnection: false,
    isInsertedText: ''
  };
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttMatch.js
/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @param {string | RegExp} pattern regular expression pattern
 * @param {string} flags regular expression flags
 * @returns {RegExpExecArray|undefined} return result
 */
function PttMatch(pattern, flags = undefined) {
  let result;
  const reg = GetReg(pattern, flags);

  if (!this.state.screenUpdated) {
    const sElement = $("[data-type='bbsline']", this.window.document);

    for (let i = 0; i < sElement.length; i++) {
      const txt = sElement[i].textContent;
      this.state.screen.push(txt);
      if (!result) result = reg.exec(txt);
    }

    this.state.screenUpdated = true;
    if (false) {}
    return result;
  } else {
    for (let i = 0; i < this.state.screen.length; i++) {
      const txt = this.state.screen[i];
      result = reg.exec(txt);
      if (result) return result;
    }
  }
}
/**
 * @param {object|string} pattern regular expression pattern
 * @param {string} flags regular expression flasgs
 * @returns {RegExpObject} regular expression
 */

function GetReg(pattern, flags) {
  if (flags) return new RegExp(pattern, flags);
  if (typeof pattern.exec === 'function') return pattern;
  return new RegExp(pattern);
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttTaskManager.js
/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @typedef {{nowTask, taskList, add,  next, reset}} PttTaskManager
 */
function PttTaskManager() {
  return {
    nowTask: null,
    taskList: [],
    add: (newTask, ...args) => {
      // console.trace('addtask', newTask, args)
      this.taskManager.taskList.push({
        fn: newTask,
        args
      });
    },
    next: () => {
      this.taskManager.nowTask = this.taskManager.taskList.shift();
    },
    reset: () => {
      this.taskManager.taskList = [];
      this.taskManager.nowTask = null;
    }
  };
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttAutoCommand.js
/**
 * @enum {number}
 * @readonly
 */
const ThisFrame = Object.freeze({
  skip: true,
  notSkip: false
});
/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @typedef {{list, runAutoCommand}} PttAutoCommand
 */

function PttAutoCommand() {
  return {
    list: [{
      reg: /您想刪除其他重複登入的連線嗎/,
      input: '',
      callback: () => {
        const inserttxt = this.state.deleteOtherConnection ? 'y\n' : 'n\n';
        this.insertText(inserttxt);
        return ThisFrame.skip;
      }
    }, {
      reg: /您要刪除以上錯誤嘗試的記錄嗎/,
      input: 'n\n'
    }, {
      reg: /按任意鍵繼續/,
      input: '',
      callback: () => {
        const reg = /(◆ 此文章無內容|找不到這個文章代碼\(AID\)，可能是文章已消失，或是你找錯看板了|這一篇文章值|◆ 本文已過長, 禁止快速連續推文|◆ 對不起，您的文章或推文間隔太近囉！|《.+》看板設定|◆ 抱歉, 禁止推薦)/;
        const result = this.match(reg);

        if (result) {
          return ThisFrame.notSkip;
        } else {
          this.insertText('\n');
          return ThisFrame.skip;
        }
      }
    }, {
      reg: /動畫播放中\.\.\./,
      input: 'q'
    }, {
      reg: /系統過載, 請稍後再來\.\.\./,
      input: '',
      callback: () => {
        this.state.serverfull = true;

        if (this.state.lock) {
          this.taskManager.reset();
          this.msg.PostMessage('alert', {
            type: 0,
            msg: '系統過載, 請稍後再來...'
          });
          return ThisFrame.skip;
        }
      }
    }, {
      reg: /大富翁 排行榜|發表次數排行榜/,
      input: 'q'
    }, {
      reg: /本日十大熱門話題/,
      input: 'q'
    }, {
      reg: /本週五十大熱門話題/,
      input: 'q'
    }, {
      reg: /每小時上站人次統計/,
      input: 'q'
    }, {
      reg: /本站歷史 \.\.\.\.\.\.\./,
      input: 'q'
    }, {
      reg: /看 板 {2}目錄數 {3}檔案數 {5}byte數 {3}總 分 {5}板 {3}主/,
      input: 'q'
    }, {
      reg: /名次──────範本───────────次數/,
      input: 'q'
    }, {
      reg: /鴻雁往返 {2}\(R\/y\)回信 \(x\)站內轉寄 \(d\/D\)刪信 \(\^P\)寄發新信/,
      input: 'q'
    }, {
      reg: /您確定要離開【 批踢踢實業坊 】嗎\(Y\/N\)？/,
      input: 'n\n'
    }, {
      reg: /【精華文章】/,
      input: 'q'
    }, {
      reg: /【看板列表】/,
      input: 'q'
    }, {
      reg: /【分類看板】/,
      input: 'q'
    }, {
      reg: /【電子郵件】/,
      input: 'e'
    }, {
      reg: /【聊天說話】/,
      input: 'e'
    }, {
      reg: /【個人設定】/,
      input: 'e'
    }, {
      reg: /【工具程式】/,
      input: 'e'
    }, {
      reg: /【網路遊樂場】/,
      input: 'e'
    }],
    runAutoCommand: () => {
      const commands = this.autoCommand.list;

      for (let i = 0; i < commands.length; i++) {
        const cmd = commands[i];
        const result = this.match(cmd.reg);

        if (result) {
          if (false) {}
          this.insertText(cmd.input);

          if (typeof cmd.callback !== 'undefined') {
            const args = cmd.args ? cmd.args : [];
            return cmd.callback(...args);
          } else {
            return true;
          }
        }
      }

      return false;
    }
  };
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttFrame.js

/**
 * @typedef Filter
 * @property {Object} reg
 * @property {FrameState} state
 * @typedef PttFrame
 * @property {Filter[]} filters
 * @property {Function} update
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 * @return {PttFrame}
 */

function PttFrame() {
  return {
    filters: [{
      reg: /請輸入代號，或以 guest 參觀，或以 new 註冊/,
      state: FrameState.login
    }, {
      reg: /上方為使用者心情點播留言區|【 精華公佈欄 】/,
      state: FrameState.main
    }, {
      reg: /《.+》看板設定/,
      state: FrameState.boardInfo
    }, {
      reg: /^\[←\]離開 \[→\]閱讀/,
      state: FrameState.board
    }, {
      reg: /目前顯示: 第 01/,
      state: FrameState.firstPageofPost
    }, {
      reg: /目前顯示: 第/,
      state: FrameState.otherPageofPost
    }],
    update: () => {
      for (let i = 0; i < this.frame.filters.length; i++) {
        const filter = this.frame.filters[i];
        const result = this.match(filter.reg); // console.log('this.match(', filter.reg, ')', result)

        if (result) {
          if (false) {}
          this.state.frame = filter.state;
          if (this.state.frame > 1) this.state.reconnectTime = 10;
          this.msg.PostMessage('pttState', this.state.frame);
          return;
        }
      }
    }
  };
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttCheckState.js

/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function Reconnect() {
  const disbtn = $('.btn.btn-danger[type=button]');

  if (disbtn && disbtn.length > 0) {
    disbtn[0].click();
    this.state.login = false;
    this.state.serverfull = false;
    this.state.screenUpdated = false;
    this.state.frame = FrameState.login;
    this.state.reconnectTime--;
  }
}
/**
 * @this {Ptt}
 */


function checkPttAlive() {
  const now = Date.now();

  if (now > this.state.lastUpdateTime + 10000) {
    this.msg.PostMessage('alert', {
      type: 0,
      msg: 'Ptt無回應，請稍後再試，或重新啟動PTT。'
    });
    this.removeAllTasks();
    this.command.remove();
  } else {
    this.msg.PostMessage('alert', {
      type: 1,
      msg: '指令執行中......'
    });
  }
}
/**
 * @this {Ptt}
 */

function checkServerFull() {
  if (this.state.serverfull) {
    this.msg.PostMessage('alert', {
      type: 0,
      msg: '系統過載, 請稍後再來...'
    });
  }

  return this.state.serverfull;
}
/**
 * @this {Ptt}
 */


function PttCheckState(fn, ...args) {
  Reconnect.apply(this);

  if (!checkServerFull.apply(this)) {
    return true;
  }

  return false;
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttCommand.js
/**
 * @typedef PttCommand
 * @property {Object} cmd
 * @property {Function} set
 * @property {Function} replace
 * @property {Function} remove
 * @property {Function} execute
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 */
function PttCommand() {
  return {
    cmd: null,
    set: (fn, ...args) => {
      if (!this.command.cmd) {
        this.command.cmd = {
          fn,
          args
        };
        if (false) {}
      } else if (false) {}
    },
    replace: (fn, ...args) => {
      if (!this.state.lock) return;
      const lastCommand = this.command.cmd;
      this.command.cmd = {
        fn,
        args
      };

      if (false) {}
    },
    remove: () => {
      if (false) {}
      this.command.cmd = null;
    },
    execute: () => {
      if (!this.command.cmd) {
        this.endTask();
        return;
      }

      const cmd = this.command.cmd;
      this.command.cmd = null;

      if (cmd) {
        if (false) {}
        cmd.fn.apply(this, cmd.args);
      }
    }
  };
}
// CONCATENATED MODULE: ./src/ptt/PttController/PttRandomInsert.js

const insertEvent = [{
  frame: FrameState.otherPageofPost,
  fn: function () {
    this.insertText('qq');
  }
}, {
  frame: FrameState.firstPageofPost,
  fn: function () {
    this.insertText('qq');
  }
}, {
  frame: FrameState.main,

  /** @this {Ptt} */
  fn: function () {
    let text = 'f';
    if (this.match(/(●|> )(F)avorite/)) text = 'p';
    if (false) {}
    this.insertText(text);
  }
}, {
  frame: FrameState.boardInfo,
  fn: function () {
    this.insertText('q');
  }
}, {
  frame: FrameState.board,
  fn: function () {
    this.insertText('p');
  }
}];
/**
 * @typedef {import("./Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function PttRandomInsert() {
  if (false) {}
  if (this.state.isInsertedText.length > 0 || !this.state.lock) return;

  for (let i = 0; i < insertEvent.length; i++) {
    const event = insertEvent[i];

    if (this.state.frame === event.frame) {
      event.fn.apply(this);
      return;
    }
  }
}
// CONCATENATED MODULE: ./src/ptt/MessagePosterData/PostData.js
const PostData = {
  /** @type {string} */
  board: '',

  /** @type {Boolean} */
  isCurrectboard: false,

  /** @type {string} */
  key: '',

  /** @type {string} */
  outsideTitle: '',

  /** @type {string} */
  insideTitle: '',

  /** @type {Date} */
  postTime: new Date(),

  /** @type {Number} */
  startLine: 0,

  /** @type {Number} */
  endLine: 0,

  /** @type {Boolean} */
  haveNormalInsideTitle: false,
  // 普通標題會有第四行消失的問題

  /** @type {Boolean} */
  isSamePost: false,

  /** @type {Number} */
  TrySetNewComment: 0,

  /** @type {string} */
  commentText: '',
  samePost: function () {
    this.isSamePost = true;
    this.TrySetNewComment = 0;
    this.commentText = '';
  },
  reset: function () {
    this.board = '';
    this.isCurrectboard = false;
    this.key = '';
    this.outsideTitle = '';
    this.insideTitle = '';
    this.postTime = new Date();
    this.startLine = 0;
    this.endLine = 0;
    this.haveNormalInsideTitle = false; // 普通標題會有第四行消失的問題

    this.isSamePost = false;
    this.TrySetNewComment = 0;
    this.commentText = '';
  }
};
/* harmony default export */ var MessagePosterData_PostData = (PostData);
// CONCATENATED MODULE: ./src/ptt/MessagePosterData/RecieveData.js
function RecieveData() {
  /** @type {string} */
  this.key = '';
  /** @type {string} */

  this.board = '';
  /** @type {string} */

  this.title = '';
  /** @type {string} */

  this.date = new Date(Date.now());
  /** @type {string} */

  this.endLine = 0;
  /** @type {Object[]} */

  this.comments = [];
  /** @type {string} */

  this.commentedText = '';
}
// CONCATENATED MODULE: ./src/ptt/PttController/Ptt.js










/**
 * @typedef {import("../../MessagePoster").MessagePoster} MessagePoster
 * @param {MessagePoster} msg message poster
 * @returns {object} Ptt
 */

function Ptt(msg) {
  if (typeof Ptt.cache === 'object') {
    if (false) {}
    return Ptt.cache;
  }

  if (false) {}
  this.msg = msg;
  this.window = window; // 自動

  /** @type {PttState} */

  this.state = PttState();
  this.match = PttMatch;
  /** @type {PttTaskManager} */

  this.taskManager = PttTaskManager.apply(this);
  /** @type {PttAutoCommand} */

  this.autoCommand = PttAutoCommand.apply(this);
  /** @type {PttFrame} */

  this.frame = PttFrame.apply(this);
  /** @type {PttCommand} */

  this.command = PttCommand.apply(this);
  /** @type {PttRandomInsert} */

  this.randomInsert = PttRandomInsert;
  /** @type {PostData} */

  this.postData = MessagePosterData_PostData;
  this.recieveData = new RecieveData();
  /** @type {PttAddTask} */

  this.addTask = function (newTask, ...args) {
    if (false) {}
    this.taskManager.add(newTask, ...args);

    if (!this.taskManager.nowTask) {
      this.runTask();
    }
  };

  this.runTask = function () {
    this.taskManager.next();
    const task = this.taskManager.nowTask;

    if (!task) {
      this.unlock();
      return;
    }

    this.state.isInsertedText = '';
    if (!this.state.lock) this.lock();
    if (false) {}
    const NormalState = PttCheckState.apply(this);

    if (NormalState) {
      this.state.lastUpdateTime = Date.now();
      if (false) {}
      task.fn.apply(this, task.args);
      this.randomInsert();
      if (false) {}

      if (!this.PttAliveInterval) {
        this.PttAliveInterval = setInterval(checkPttAlive.bind(this), 3500);
      }
    }
  };

  this.endTask = function () {
    const lasttask = this.taskManager.nowTask;
    if (false) {}
    this.runTask();
  };

  this.removeAllTasks = () => {
    this.taskManager.reset();
    this.unlock();
  };

  this.lock = () => {
    if (false) {}
    this.state.lock = true;
  };

  this.unlock = () => {
    if (false) {}
    this.state.lock = false;
    this.command.cmd = null;
    clearInterval(this.PttAliveInterval);
    this.PttAliveInterval = undefined;
  };

  this.clearScreen = () => {
    this.state.screenUpdated = false;
    this.state.screen = [];
  };

  this.insertText = str => {
    const t = this.window.document.querySelector('#t');
    const e = new CustomEvent('paste');
    if (false) {}
    e.clipboardData = {
      getData: () => str
    };
    t.dispatchEvent(e);
    this.state.isInsertedText = str;
  };

  Ptt.cache = this;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Login.js

const cryptkey = GM_getValue('cryptkey', Math.random());
let TryLogin;
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function Login(data) {
  const decryptedId = CryptoJS.AES.decrypt(data.id, cryptkey).toString(CryptoJS.enc.Utf8);
  const decryptedPassword = CryptoJS.AES.decrypt(data.pw, cryptkey).toString(CryptoJS.enc.Utf8);
  TryLogin = 2;

  if (decryptedId !== '' && decryptedPassword !== '') {
    this.addTask(login, decryptedId, decryptedPassword, data.DeleteOtherConnect);
  } else {
    this.msg.PostMessage('alert', {
      type: 0,
      msg: '加密錯誤'
    });
  }

  this.endTask();
}
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function login(id, pw, DeleteOtherConnect) {
  if (false) {}

  if (!this.state.login) {
    this.state.deleteOtherConnection = DeleteOtherConnect;
    this.msg.PostMessage('alert', {
      type: 1,
      msg: '登入中'
    });
    const result = this.match(/請輸入代號，或以 guest 參觀，或以 new 註冊/);

    if (result) {
      if (TryLogin <= 0) {
        // 防止過度嘗試
        this.msg.PostMessage('alert', {
          type: 0,
          msg: '未知原因登入失敗。'
        });
        this.endTask();
        return;
      } else {
        TryLogin--;
      }

      this.insertText(id + '\n' + pw + '\n');
      this.command.set(checkLogin);
    } else {
      this.command.set(login, id, pw);
    }
  } else {
    this.msg.PostMessage('alert', {
      type: 0,
      msg: '已經登入，請勿重複登入。'
    });
    this.endTask();
  }
}

function checkLogin() {
  if (this.match(/密碼不對或無此帳號。請檢查大小寫及有無輸入錯誤。|請重新輸入/)) {
    this.msg.PostMessage('alert', {
      type: 0,
      msg: '登入失敗，帳號或密碼有誤。'
    });
    this.endTask();
  } else if (this.match(/上方為使用者心情點播留言區|【 精華公佈欄 】/)) {
    this.msg.PostMessage('alert', {
      type: 2,
      msg: '登入成功。'
    });
    this.state.login = true;
    this.endTask();
  } else if (this.match(/登入中，請稍候\.\.\.|正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久|密碼正確！ 開始登入系統/)) {
    this.msg.PostMessage('alert', {
      type: 1,
      msg: '登入執行中，請稍候...'
    });
    this.command.set(checkLogin);
  } else {
    this.msg.PostMessage('alert', {
      type: 0,
      msg: '發生了未知錯誤，可能是因為保留連線導致被踢掉。'
    });
    console.log(this.state.screen);
    this.endTask();
  }
}
// CONCATENATED MODULE: ./src/ptt/Tasks/HandlerRunner.js
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @param {Function[]} HandlerList array of handlers
 * @param {Function} OnTaskFinishedCallBack call when task finish
 */
function RunHandler(HandlerList, OnTaskFinishedCallBack) {
  if (false) {}

  for (let i = 0; i < HandlerList.length; i++) {
    const result = HandlerList[i].apply(this);

    if (result.pass === true) {
      if (false) {}
    }

    if (result.pass === false) {
      if (false) {}
      result.callback.apply(this);
      this.command.set(RunHandler, HandlerList, OnTaskFinishedCallBack);
      return;
    }
  }

  if (OnTaskFinishedCallBack) OnTaskFinishedCallBack.apply(this);
  this.endTask();
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsInMain.js

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function gotoMain() {
  this.insertText('q');
}
/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsInMain() {
  const result = {
    pass: false,
    callback: gotoMain
  };

  if (this.state.frame === FrameState.main) {
    result.pass = true;
  }

  return result;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/GotoMain.js


const GotoMainTaskList = [() => {
  if (false) {}
  return {
    pass: true
  };
}, CheckIsInMain];
/**
 * @this {Ptt}
 */

/* harmony default export */ var GotoMain = (function () {
  this.addTask(RunHandler, GotoMainTaskList);
});
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsInBoard.js

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function gotoBoard() {
  this.postData.isCurrectboard = false;
  this.insertText('s' + this.postData.board + '\n');
}

function chechBoardInfo() {
  this.insertText('i');
}
/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsInBoard() {
  const result = {
    pass: true,
    callback: gotoBoard
  };

  if (this.state.frame === FrameState.main) {
    result.pass = false;
  } else if (this.state.frame === FrameState.boardInfo) {
    const reg = '《' + this.postData.board + '》看板設定';
    const isCurrectBoard = this.match(reg);

    if (isCurrectBoard) {
      this.postData.isCurrectboard = true;
    }

    result.pass = false;
    result.callback = chechBoardInfo;
  } else if (this.state.frame === FrameState.board) {
    if (this.postData.isCurrectboard) return result;
    const isBoardkeyExist = this.match(/【(?:板主:.+|徵求中)】.+(?:看板|系列)《.+》/);

    if (isBoardkeyExist) {
      if (false) {}
      const reg = '【(?:板主:.+|徵求中)】.+(?:看板|系列)《' + this.postData.board + '》';
      const isCurrectBoard = this.match(reg, 'i');
      if (isCurrectBoard) this.postData.isCurrectboard = true;else result.pass = false;
    } else {
      if (false) {}
      result.pass = false;
      result.callback = chechBoardInfo;
    }
  }

  return result;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsInPost.js

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function gotoPost() {
  this.insertText('NPP#' + this.postData.key + '\nr');
}
/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsInPost() {
  const res = {
    pass: false,
    callback: gotoPost
  };

  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    res.pass = true;
  } else if (this.state.frame === FrameState.main) {
    if (false) {}
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsInsideTitleInPost.js


function backToBoard() {
  this.insertText('qq');
}

function getTitleWithoutSpace(result) {
  return result[1].replace(/\s+$/g, '');
}

function getTheFirstThreeLine() {
  let s = '';

  for (let i = 0; i < 5 && i < this.state.screen.length; i++) s += this.state.screen[i];

  return s;
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsInsideTitleInPost() {
  const res = {
    pass: true,
    callback: backToBoard
  };

  if (this.state.frame === FrameState.firstPageofPost) {
    const isPostHaveNormalInsideTitle = this.match(/ 標題 +(.+)/);
    let insideTitle = '';

    if (isPostHaveNormalInsideTitle) {
      insideTitle = getTitleWithoutSpace(isPostHaveNormalInsideTitle);
    } else {
      insideTitle = getTheFirstThreeLine.apply(this);
    }

    if (this.postData.isSamePost) {
      if (!insideTitle === this.postData.insideTitle) {
        res.pass = false;
      }
    } else {
      this.postData.insideTitle = insideTitle;
      this.postData.haveNormalInsideTitle = isPostHaveNormalInsideTitle !== null;
      const result = this.match(/時間 {2}(\S{3} \S{3} ...\d{2}:\d{2}:\d{2} \d{4})/);
      if (false) {}
      this.postData.postTime = result ? new Date(result[1]) : new Date(Date.now());
    }

    this.recieveData.title = this.postData.insideTitle;
    this.recieveData.date = this.postData.postTime;
  } else if (this.state.frame === FrameState.otherPageofPost && this.postData.insideTitle !== '') {
    res.pass = true;
  } else {
    if (false) {}

    res.pass = false;
  }

  if (false) {}
  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/GetComment.js
function getComment(content, commentResult) {
  const commentData = {};
  commentData.type = commentResult[1];
  commentData.id = commentResult[2];
  commentData.content = content;
  commentData.date = new Date(this.postData.postTime.getFullYear(), commentResult[4] - 1, commentResult[5], commentResult[6], commentResult[7]);
  if (commentData.date.getTime() - this.postData.postTime.getTime() < -1000 * 60 * 60 * 24 * 360) commentData.date.setFullYear(commentData.date.getFullYear() + 1);
  return commentData;
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function GetComment() {
  const lineResult = this.match(/目前顯示: 第 (\d+)~(\d+) 行/);
  const startLine = +lineResult[1];
  const endLine = +lineResult[2];
  let targetLine = this.postData.endLine - startLine + 1;
  if (startLine < 5 && this.postData.haveNormalInsideTitle) targetLine += 1;
  if (false) {}
  const checkedLine = [];

  for (let i = targetLine; i < this.state.screen.length; i++) {
    const line = this.state.screen[i];
    const commentResult = /^(→ |推 |噓 )(.+?): (.*)(\d\d)\/(\d\d) (\d\d):(\d\d)/.exec(line);

    if (commentResult != null) {
      let content = commentResult[3];
      const reg = /\s+$/g;
      content = content.replace(reg, ''); // console.log('GetComment', this)

      const comment = getComment.apply(this, [content, commentResult]);
      this.recieveData.comments.push(comment);
      if (false) {} // if (reportMode) console.log('GetComment at line', i, content, line)
    }
    /* else if (reportMode) console.log('GetComment at line fail', i, line) */

  }

  if (false) {} // const percentresult = Ptt.match(/瀏覽 第 .+ 頁 \( *(\d+)%\)/)


  this.postData.startLine = startLine;
  this.postData.endLine = endLine;
  this.recieveData.endLine = endLine;
  return {
    pass: true,
    callback: () => {}
  };
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsEndInPost.js


function gotonextpage() {
  this.insertText(' ');
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsEndInPost() {
  const res = {
    pass: false,
    callback: gotonextpage
  };

  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    if (false) {}

    if (this.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~\d+ 行/)) {
      res.pass = true;
    }
  } else {
    console.log('==PostPercentCheck error, PTT.pagestate == ', this.state.frame);
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsCurrectLineInPost.js

/**
 * @typedef {object} HandlerResult
 * @property {boolean} pass is passed
 * @property {Function} callback call when false
 */

function gotoline() {
  if (false) {}
  this.insertText(this.postData.endLine + '.\n');
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {HandlerResult} result
 */


function CheckIsCurrectLineInPost() {
  const res = {
    pass: true,
    callback: gotoline
  };

  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    const lineResult = this.match(/目前顯示: 第 (\d+)~(\d+) 行/);
    const startLine = lineResult[1];
    let targetLine = this.postData.endLine - startLine + 1;

    if (startLine < 5 && this.postData.haveNormalInsideTitle) {
      targetLine += 1;
    }

    if (false) {}

    if (targetLine < 1 || targetLine > 23) {
      res.pass = false;
    }
  } else {
    if (false) {}
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/GetRecentLine.js


function gotoEndOfPost() {
  this.insertText('G');
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function GetRecentLine() {
  const res = {
    pass: false,
    callback: gotoEndOfPost
  };

  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    const lineResult = this.match(/瀏覽 第 \d+\/\d+ 頁 \(100%\) +目前顯示: 第 \d+~(\d+) 行/);

    if (lineResult) {
      let targetline = +lineResult[1] - 100 - 1;
      if (targetline < 3) targetline = 3;
      this.postData.endLine = targetline;
      res.pass = true;
    }
  } else {
    console.log('==GetPushTask error, Ptt.pagestate ==', this.state.frame);
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/GetCommentByAID.js











const GetCommentByLineTaskList = [() => {
  console.log('run GetCommentByLineTaskList');
  return {
    pass: true
  };
}, CheckIsInBoard, CheckIsInPost, CheckIsInsideTitleInPost, CheckIsCurrectLineInPost, GetComment, CheckIsEndInPost];
const GetRecentLineTaskList = [() => {
  console.log('run GetRecentLineTaskList');
  return {
    pass: true
  };
}, CheckIsInBoard, CheckIsInPost, CheckIsInsideTitleInPost, GetRecentLine];
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function recieveComments() {
  this.endTask();
  this.msg.PostMessage('alert', {
    type: 2,
    msg: '文章讀取完成。'
  });
  this.msg.PostMessage('newComment', this.recieveData);
  if (false) {}
}
/**
 * @this {Ptt}
 */


function GetCommentByLine() {
  if (false) {}

  if (this.state.frame === FrameState.firstPageofPost || this.state.frame === FrameState.otherPageofPost) {
    this.insertText('q');
  }

  this.insertText('P');
  this.addTask(RunHandler, GetCommentByLineTaskList, recieveComments);
}
/**
 * @typedef {import("../MessagePosterData/PostData").PostData} PostData
 * @this {Ptt}
 * @param {PostData} data PostData
 */


/* harmony default export */ var GetCommentByAID = (function (data) {
  console.log('GetCommentByAID', data);

  if (this.postData.board === data.board && this.postData.key === data.key) {
    this.postData.samePost();
  } else {
    this.postData.reset();
    this.postData.board = data.board;
    this.postData.key = data.key;
    if (data.startLine) this.postData.endLine = data.startLine;
  }

  this.recieveData = new RecieveData();
  this.recieveData.board = data.board;
  this.recieveData.key = data.key;
  if (!this.postData.samePost) GotoMain.apply(this);

  if (data.recent) {
    this.addTask(RunHandler, GetRecentLineTaskList);
  }

  this.addTask(GetCommentByLine);
  this.endTask();
});
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsLogined.js

/**
 * @this {Ptt}
 */

function NotLogin() {
  this.msg.PostMessage('alert', {
    type: 0,
    msg: 'PTT尚未登入，請先登入。'
  });
  this.endTask();
}
/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsLogined() {
  const res = {
    pass: true,
    callback: NotLogin
  };

  if (this.state.frame === FrameState.login) {
    res.pass = false;
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/CheckIsCurrectPost.js

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function CheckIsCurrectPost_gotoPost() {
  this.insertText('NPP' + this.postData.key + '\nr');
}
/**
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */


function CheckIsCurrectPost() {
  const res = {
    pass: true,
    callback: CheckIsCurrectPost_gotoPost
  };

  if (this.state.frame === FrameState.board) {
    res.pass = false;
  } else if (this.state.frame === FrameState.main) {
    if (false) {}
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/GetCommentByAnySearch.js












const GetCommentByAnySearch_GetCommentByLineTaskList = [() => {
  if (false) {}
  return {
    pass: true
  };
}, CheckIsLogined, CheckIsInBoard, CheckIsCurrectPost, CheckIsInsideTitleInPost, CheckIsCurrectLineInPost, GetComment, CheckIsEndInPost];
const GetCommentByAnySearch_GetRecentLineTaskList = [() => {
  if (false) {}
  return {
    pass: true
  };
}, CheckIsLogined, CheckIsInBoard, CheckIsCurrectPost, CheckIsInsideTitleInPost, GetRecentLine];
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function GetCommentByAnySearch_recieveComments() {
  this.endTask();
  this.msg.PostMessage('alert', {
    type: 2,
    msg: '文章讀取完成。'
  });
  this.msg.PostMessage('newComment', this.recieveData);
  if (false) {}
}
/**
 * @this {Ptt}
 */


function GetCommentByAnySearch_GetCommentByLine() {
  if (false) {}

  if (this.state.frame === FrameState.otherPageofPost) {
    this.insertText('qr');
  }

  this.addTask(RunHandler, GetCommentByAnySearch_GetCommentByLineTaskList, GetCommentByAnySearch_recieveComments);
  this.endTask();
}
/**
 * @this {Ptt}
 */


/* harmony default export */ var GetCommentByAnySearch = (function (data) {
  if (false) {}
  const result = /^ *([#/?aZGA][^,]+?) *(?:, *([#/?aZGA!].+))? *$/.exec(data.key);
  if (!result) return;
  let key = result[1];
  if (result.length > 2 && result[2]) key += '\n' + result[2];

  if (this.postData.board === data.board && this.postData.key === key) {
    this.postData.samePost();
  } else {
    this.postData.reset();
    this.postData.board = data.board;
    this.postData.key = key;
    if (data.startLine) this.postData.endLine = data.startLine;
    GotoMain.apply(this);
  }

  this.recieveData = new RecieveData();
  this.recieveData.board = data.board;
  this.recieveData.key = data.key;

  if (data.recent) {
    this.addTask(RunHandler, GetCommentByAnySearch_GetRecentLineTaskList);
  }

  this.addTask(GetCommentByAnySearch_GetCommentByLine);
  this.msg.PostMessage('alert', {
    type: 1,
    msg: '文章讀取中。'
  });
  const res = CheckIsEndInPost.apply(this);
  if (res.pass && !(this.state.frame === FrameState.firstPageofPost)) this.insertText('qr');
  this.command.set(() => {
    this.endTask();
  });
});
// CONCATENATED MODULE: ./src/ptt/Tasks/Handlers/SetNewComment.js

/**
 * @typedef {import("../../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 * @returns {import('./CheckIsCurrectLineInPost.js').HandlerResult} result
 */

function SetNewComment() {
  const res = {
    pass: false,
    callback: () => {}
  };
  this.postData.TrySetNewComment++;

  if (this.postData.TrySetNewComment > 6) {
    res.pass = true;
    return res;
  }

  if (this.state.frame === FrameState.otherPageofPost || this.state.frame === FrameState.firstPageofPost) {
    const result = this.match(/◆ 本文已過長, 禁止快速連續推文|◆ 對不起，您的文章或推文間隔太近囉！/);

    if (result) {
      if (false) {}
      this.msg.PostMessage('alert', {
        type: 0,
        msg: '推文遭暫時禁止。'
      });
      this.insertText('\nrG');
      this.postData.TrySetNewComment = 100;
      return res;
    }

    const commentText = this.postData.commentText + '\n';
    if (false) {}
    const commentCheck = this.match(/(.+?): (.+?) +確定\[y\/N]:/);

    if (commentCheck) {
      if (false) {}
      this.postData.commentText = '';
      this.recieveData.commentedText = commentCheck[2];
      this.msg.PostMessage('alert', {
        type: 2,
        msg: '推文成功。'
      });
      this.insertText('y\nr');
      this.postData.TrySetNewComment = 100;
      return res;
    }

    const commentType = this.match(/您覺得這篇文章/);

    if (commentType) {
      if (false) {}
      this.insertText('\n' + commentText);
      return res;
    }

    const commentDirect = this.match(/時間太近, 使用|作者本人, 使用/);

    if (commentDirect) {
      if (false) {}
      this.insertText(commentText);
      return res;
    }

    const uncomment = this.match(/瀏覽 第 .+ 頁 \( *(\d+)%\)/);

    if (uncomment) {
      if (false) {}
      this.insertText('%');
      return res;
    }
  }

  return res;
}
// CONCATENATED MODULE: ./src/ptt/Tasks/SetComment.js








const setCommentTaskList = [() => {
  if (false) {}
  return {
    pass: true
  };
}, CheckIsLogined, CheckIsInBoard, CheckIsCurrectPost, CheckIsInsideTitleInPost, SetNewComment];
/**
 * @this {Ptt}
 */

function recieveNewComment() {
  if (false) {}
  this.msg.PostMessage('commentedText', this.recieveData);
  this.addTask(GetCommentByAnySearch, {
    board: this.postData.board,
    key: this.postData.key
  });
}
/**
 * @typedef {import("../PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */


function SetComment(pushtext) {
  let allowedchar = 24;
  let addedtext = '';
  let trytime = 7;

  while (trytime >= 0 && allowedchar > 0 && pushtext.length > 0) {
    const addtextreg = '(.{0,' + allowedchar + '})(.*)'; // (.{0,24})(.*)

    const result = new RegExp(addtextreg).exec(pushtext);
    addedtext += result[1];
    const halfchar = addedtext.match(/[A-Za-z0-9_ :/\\.?=%]/g);
    const halfcount = halfchar ? halfchar.length : 0;
    allowedchar = parseInt((48 - addedtext.length * 2 + halfcount) / 2);
    pushtext = result[2];

    if (false) {}

    trytime--;
  }

  this.postData.commentText = addedtext;
  this.recieveData = new RecieveData();
  this.addTask(RunHandler, setCommentTaskList, recieveNewComment);
  this.endTask();
}
// CONCATENATED MODULE: ./src/ptt/eventBind.js




/**
 * @typedef {import("./PttController/Ptt").Ptt} Ptt
 * @this {Ptt}
 */

function eventBind() {
  this.msg.login = data => bindEvent.apply(this, [Login, data]);

  this.msg.getCommentByAID = data => bindEvent.apply(this, [GetCommentByAID, data]);

  this.msg.getCommentByAnySearch = data => bindEvent.apply(this, [GetCommentByAnySearch, data]);

  this.msg.setNewcomment = data => bindEvent.apply(this, [SetComment, data]);
}
/**
 * @this {Ptt}
 */

function bindEvent(event, data) {
  if (this.state.lock) return;
  this.lock();
  this.addTask(event, data);
}
// CONCATENATED MODULE: ./src/ptt/pttindex.js


/**
 * @param {import('../MessagePoster').MessagePoster} messagePoster
 */

function InitPTT(messagePoster) {
  const ptt = new Ptt(messagePoster);

  function OnUpdate() {
    if (false) {}
    if (false) {}
    ptt.clearScreen();
    if (false) {}
    ptt.frame.update();
    if (false) {}
    const skipThisFrame = ptt.autoCommand.runAutoCommand();

    if (!skipThisFrame) {
      if (false) {}
      ptt.command.execute();
    }

    if (false) {}
  }
  /**
   * @param obj
   * @param key
   * @param cb
   */


  function hook(obj, key, cb) {
    const fn = obj[key].bind(obj);

    obj[key] = function (...args) {
      fn.apply(this, args);
      cb.apply(this, args);
    };
  }

  hook(unsafeWindow.console, 'log', t => {
    if (t === 'view update') {
      ptt.state.lastUpdateTime = Date.now();
      ptt.state.serverfull = false;
      OnUpdate();
    }
  });
  eventBind.apply(ptt);
}
// CONCATENATED MODULE: ./src/menuCommand/instanceMenuCommand.js
/**
 * @typedef Command
 * @property {Function} getCaption
 * @property {Function[]} callback
 *
 * @param {Function} getCaption
 * @param {Function[]} callback
 * @returns Command
 */
function instanceMenuCommand(getCaption, callback) {
  let cb = callback;
  if (!Array.isArray(callback)) cb = [callback];
  return {
    getCaption: getCaption,
    callback: cb
  };
}
// CONCATENATED MODULE: ./src/menuCommand/createCheckbox.js

/**
 * @param {Boolean} value
 * @returns String
 */

function getCheckboxEmoji(value) {
  return value ? '☑ ' : '☐ ';
}
/**
 * @typedef {import("./instanceMenuCommand").Command} Command
 * @param {String} settingName
 * @param {String} caption
 * @param {Function} callback
 * @param {Boolean} defaultvalue
 * @returns Command
 */


function checkboxElement(settingName, caption, callback, defaultvalue = false) {
  const pre = 'menuCommand-';
  let value = GM_getValue(pre + settingName, defaultvalue);

  function getCaption() {
    return getCheckboxEmoji(value) + caption;
  }

  function onClick() {
    value = !value;
    GM_setValue(pre + settingName, value);
    callback(value);
    return value;
  }

  return instanceMenuCommand(getCaption, onClick);
}
// CONCATENATED MODULE: ./src/menuCommand/menuCommand.js

/**
 * @type {Command[]}
 * @typedef {import("./instanceMenuCommand").Command} Command
 */

const commandList = [];

function unregisterAllCommand() {
  for (let i = 0; i < commandList.length; i++) {
    const command = commandList[i];
    GM_unregisterMenuCommand(+i + 1 + '）' + command.getCaption());
  }
}

function registerAllCommand() {
  for (let i = 0; i < commandList.length; i++) {
    const command = commandList[i];
    GM_registerMenuCommand(+i + 1 + '）' + command.getCaption(), () => menuCommand_onClick(command.callback));
  }
}

function menuCommand_onClick(callback) {
  unregisterAllCommand();
  const value = callback[0]();

  for (let i = 1; i < callback.length; i++) callback[i](value);

  registerAllCommand();
}

function menuCommand(siteName) {
  commandList.push(checkboxElement('enableExtention-' + siteName, `是否在${siteName}啟用(需重新整理)`, () => {}, true));
  commandList.push(checkboxElement('customPluginSetting-' + siteName, `在${siteName}獨立使用套件設定`, () => {}));
  registerAllCommand();
}
function AddCommancCallback(index, callback) {
  commandList[index].callback.push(callback);
}
// CONCATENATED MODULE: ./src/ga/setvalue.js
/* harmony default export */ var setvalue = (function (data) {
  unsafeWindow.pttDataLayer.push(data);
});
// CONCATENATED MODULE: ./src/ga/activatingExtensionEvent.js

/* harmony default export */ var activatingExtensionEvent = (function () {
  const GaInstalledEventTime = 'GaInstalledEventTime';
  const lastEventTime = +GM_getValue(GaInstalledEventTime, 0);
  const now = Date.now();

  if (now - lastEventTime >= 1000 * 60 * 60 * 24) {
    GM_setValue(GaInstalledEventTime, now);
    setvalue({
      event: 'activatingExtension'
    });
  }
});
// CONCATENATED MODULE: ./src/ga/index.js

function ga() {
  const gtmhead = document.createElement('script');
  gtmhead.innerText = '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src= \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f); })(window,document,\'script\',\'pttDataLayer\',\'GTM-MFFJTMF\');';
  const head = document.getElementsByTagName('head')[0];

  if (head) {
    head.appendChild(gtmhead);
  }

  const noscript = document.createElement('noscript');
  noscript.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MFFJTMF"  height="0" width="0" style="display:none;visibility:hidden"></iframe>';
  const body = document.getElementsByTagName('body')[0];

  if (body) {
    body.appendChild(noscript);
  }

  setTimeout(() => {
    activatingExtensionEvent();
  }, 500);
}
// CONCATENATED MODULE: ./src/filter/HerfFilter.js



/**
 * @param {MessagePoster} msg
 * @param {Filter} filter
 */

function InitializeScript(msg, filter) {
  filter.callback(msg, filter.siteName);
  console.log('PTTChatOnYT initialize finished at', filter.siteName);
}

function throwstring(site) {
  return 'PTTonYT Script Stopped: ' + site + ' should run in top frame';
}
/**
 * @param {MessagePoster} msg
 */


function InitializePtt(msg) {
  // init msg
  msg.ownerorigin = 'https://term.ptt.cc';
  msg.targetorigin = /\?url=(.+?)\/?$/.exec(window.location.href)[1]; // \?url=(https\:\/\/|http\:\/\/)(.+)

  msg.targetWindow = top; // -----

  console.log('PTTChatOnYT PTT part started at ' + window.location.href);
  InitPTT(msg);
  console.log('PTTChatOnYT PTT part initialize finish.'); // -----
}
/**
 * @param {MessagePoster} msg
 * @param {Filter} filter
 */


function InitializeWebsite(msg, filter) {
  // init postmessage
  msg.targetorigin = 'https://term.ptt.cc';
  msg.ownerorigin = filter.ownerOrigin; // init menu command

  menuCommand(filter.siteName);
  ga();
  const isEnable = GM_getValue('menuCommand-enableExtention-' + filter.siteName, true);

  if (!isEnable) {
    console.log('PTTChatOnYT Script disabled by user at ' + filter.siteName + ', href:', window.location.href);
    return;
  } // -----


  console.log('PTTChatOnYT Script started at ' + filter.siteName + ', href:', window.location.href);
  console.log('ownerorigin ' + filter.ownerOrigin);

  switch (document.readyState) {
    case 'complete':
      InitializeScript(msg, filter);
      break;

    default:
      document.addEventListener('readystatechange', function () {
        if (document.readyState === 'complete') {
          InitializeScript(msg, filter);
        }
      });
      break;
  }
}
/**
 * @typedef {import("../MessagePoster").MessagePoster} MessagePoster
 * @typedef {import("./InsFilter").Filter} Filter
 * @param {MessagePoster} msg
 * @param {Filter[]} filters
 */


function HerfFilter(msg, filters) {
  const isTopframe = window.top === window.self;

  if (/term\.ptt\.cc/.exec(window.location.href) !== null) {
    if (isTopframe) throw throwstring('PTT'); // check script work in right frame

    InitializePtt(msg);
  } else {
    for (let i = 0; i < filters.length; i++) {
      const filter = filters[i];
      if (filter.siteRegExp.exec(window.location.href) === null) continue;
      if (!isTopframe) throw throwstring(filter.siteName); // check script work in right frame

      InitializeWebsite(msg, filter);
      break;
    }
  }
}
// CONCATENATED MODULE: ./src/filter/InsFilter.js
/**
 * @typedef Filter
 * @property {String} siteName
 * @property {RegExp} siteRegExp
 * @property {String} ownerOrigin
 * @property {Function} callback
 * @param {String} siteName
 * @param {RegExp} siteRegExp
 * @param {String} ownerOrigin
 * @param {Function} initCallback
 * @returns Filter
 */
function InsFilter(siteName, siteRegExp, ownerOrigin, initCallback) {
  return {
    siteName: siteName,
    siteRegExp: siteRegExp,
    ownerOrigin: ownerOrigin,
    callback: initCallback
  };
}
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttApp.vue?vue&type=template&id=3692ac10&scoped=true&
var render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass:
        "pttchat rounded-right position-absolute rounded-bottom w-100 collapse",
      attrs: { id: "PTTMain" },
    },
    [_c("PTTAppMain")],
    1
  )
}
var staticRenderFns = []
render._withStripped = true


// CONCATENATED MODULE: ./src/app/PttApp.vue?vue&type=template&id=3692ac10&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppMain.vue?vue&type=template&id=1e5ddf51&
var PttAppMainvue_type_template_id_1e5ddf51_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "ptt-bg ptt-border rounded w-100 d-flex flex-column",
      attrs: { id: "PTTChat-app" },
    },
    [_c("PTTAppNav"), _vm._v(" "), _c("PTTAppContent")],
    1
  )
}
var PttAppMainvue_type_template_id_1e5ddf51_staticRenderFns = []
PttAppMainvue_type_template_id_1e5ddf51_render._withStripped = true


// CONCATENATED MODULE: ./src/app/PttAppMain.vue?vue&type=template&id=1e5ddf51&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppNav.vue?vue&type=template&id=1db5f6bb&
var PttAppNavvue_type_template_id_1db5f6bb_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "ul",
    {
      staticClass: "nav nav-tabs justify-content-center",
      attrs: { id: "PTTChat-navbar", role: "tablist" },
    },
    [
      _c("li", { staticClass: "nav-item", attrs: { go: _vm.isGotoChat } }, [
        _c(
          "a",
          {
            ref: "chatbtn",
            staticClass: "nav-link ptt-text bg-transparent",
            attrs: {
              id: "nav-item-Chat",
              "data-toggle": "tab",
              href: "#PTTChat-contents-Chat",
              role: "tab",
              "aria-controls": "PTTChat-contents-Chat",
              "aria-selected": "false",
            },
          },
          [_vm._v("聊天室")]
        ),
      ]),
      _vm._v(" "),
      _vm._m(0),
      _vm._v(" "),
      _vm._m(1),
      _vm._v(" "),
      _vm._m(2),
      _vm._v(" "),
      _vm._m(3),
      _vm._v(" "),
      _vm._m(4),
    ]
  )
}
var PttAppNavvue_type_template_id_1db5f6bb_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "nav-item" }, [
      _c(
        "a",
        {
          staticClass: "nav-link ptt-text bg-transparent active",
          attrs: {
            id: "nav-item-Connect",
            "data-toggle": "tab",
            href: "#PTTChat-contents-Connect",
            role: "tab",
            "aria-controls": "PTTChat-contents-Connect",
            "aria-selected": "true",
          },
        },
        [_vm._v("連線設定")]
      ),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "nav-item" }, [
      _c(
        "a",
        {
          staticClass: "nav-link ptt-text bg-transparent",
          attrs: {
            id: "nav-item-other",
            "data-toggle": "tab",
            href: "#PTTChat-contents-other",
            role: "tab",
            "aria-controls": "PTTChat-contents-other",
            "aria-selected": "false",
          },
        },
        [_vm._v("說明")]
      ),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "nav-item" }, [
      _c(
        "a",
        {
          staticClass: "nav-link ptt-text bg-transparent",
          attrs: {
            id: "nav-item-PTT",
            "data-toggle": "tab",
            href: "#PTTChat-contents-PTT",
            role: "tab",
            "aria-controls": "PTTChat-contents-PTT",
            "aria-selected": "false",
          },
        },
        [_vm._v("PTT畫面")]
      ),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "nav-item" }, [
      _c(
        "a",
        {
          staticClass: "nav-link ptt-text bg-transparent",
          attrs: {
            id: "nav-item-log",
            "data-toggle": "tab",
            href: "#PTTChat-contents-log",
            role: "tab",
            "aria-controls": "PTTChat-contents-log",
            "aria-selected": "false",
          },
        },
        [_vm._v("log")]
      ),
    ])
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("li", { staticClass: "nav-item" }, [
      _c(
        "button",
        {
          staticClass: "nav-link ptt-text bg-transparent d-none",
          attrs: {
            id: "nav-item-TimeSet",
            type: "button",
            "data-toggle": "collapse",
            "data-target": "#PTTChat-Time",
            "aria-controls": "PTTChat-Time",
            "aria-expanded": "false",
          },
        },
        [_vm._v("\n      時間\n    ")]
      ),
    ])
  },
]
PttAppNavvue_type_template_id_1db5f6bb_render._withStripped = true


// CONCATENATED MODULE: ./src/app/PttAppNav.vue?vue&type=template&id=1db5f6bb&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppNav.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var PttAppNavvue_type_script_lang_js_ = ({
  computed: {
    isGotoChat: function () {
      const go = this.gotoChat;
      if (false) {}

      if (go) {
        this.$store.dispatch('gotoChat', false);
        this.$refs.chatbtn.click();
        if (false) {}
      }

      return go;
    },
    ...Vuex.mapGetters(['gotoChat'])
  }
});
// CONCATENATED MODULE: ./src/app/PttAppNav.vue?vue&type=script&lang=js&
 /* harmony default export */ var app_PttAppNavvue_type_script_lang_js_ = (PttAppNavvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
var componentNormalizer = __webpack_require__(0);

// CONCATENATED MODULE: ./src/app/PttAppNav.vue





/* normalize component */

var component = Object(componentNormalizer["a" /* default */])(
  app_PttAppNavvue_type_script_lang_js_,
  PttAppNavvue_type_template_id_1db5f6bb_render,
  PttAppNavvue_type_template_id_1db5f6bb_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "src/app/PttAppNav.vue"
/* harmony default export */ var PttAppNav = (component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppContent.vue?vue&type=template&id=0538b1de&
var PttAppContentvue_type_template_id_0538b1de_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "tab-content ptt-text",
      style: _vm.updateheight,
      attrs: { id: "PTTChat-contents" },
    },
    [
      _c(
        "div",
        {
          staticClass: "tab-pane h-100 w-100 mx-0 position-relative fade",
          attrs: {
            id: "PTTChat-contents-Chat",
            role: "tabpanel",
            "aria-labelledby": "nav-item-Chat",
          },
        },
        [_c("PTTApp-Chat")],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "tab-pane h-100 w-100 mx-0 row fade show active",
          attrs: {
            id: "PTTChat-contents-Connect",
            role: "tabpanel",
            "aria-labelledby": "nav-item-Connect",
          },
        },
        [_c("PTTApp-Connect"), _vm._v(" "), _c("PTTApp-Alert")],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass:
            "tab-pane h-100 w-100 mx-0 bg-transparent overflow-auto row fade",
          attrs: {
            id: "PTTChat-contents-other",
            role: "tabpanel",
            "aria-labelledby": "nav-item-other",
          },
        },
        [_c("PTTApp-Other")],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "tab-pane h-100 row fade",
          attrs: {
            id: "PTTChat-contents-PTT",
            role: "tabpanel",
            "aria-labelledby": "nav-item-PTT",
          },
        },
        [_c("PTTApp-PTT")],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        {
          staticClass: "tab-pane h-100 w-100 mx-0 fade",
          staticStyle: { "overscroll-behavior": "contain" },
          attrs: {
            id: "PTTChat-contents-log",
            role: "tabpanel",
            "aria-labelledby": "nav-item-log",
          },
        },
        [_c("PTTApp-Log")],
        1
      ),
    ]
  )
}
var PttAppContentvue_type_template_id_0538b1de_staticRenderFns = []
PttAppContentvue_type_template_id_0538b1de_render._withStripped = true


// CONCATENATED MODULE: ./src/app/PttAppContent.vue?vue&type=template&id=0538b1de&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatPreviewImage.vue?vue&type=template&id=0f3cc22a&
var ChatPreviewImagevue_type_template_id_0f3cc22a_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticStyle: { "z-index": "460" } }, [
    _c("img", {
      ref: "imgel",
      class: _vm.className,
      style: _vm.style,
      attrs: { src: _vm.previewImageURL },
    }),
  ])
}
var ChatPreviewImagevue_type_template_id_0f3cc22a_staticRenderFns = []
ChatPreviewImagevue_type_template_id_0f3cc22a_render._withStripped = true


// CONCATENATED MODULE: ./src/app/chat/ChatPreviewImage.vue?vue&type=template&id=0f3cc22a&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatPreviewImage.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChatPreviewImagevue_type_script_lang_js_ = ({
  data() {
    return {
      mousex: 0,
      mousey: 0,
      w: 0,
      h: 0
    };
  },

  computed: {
    preview: function () {
      return this.previewImageURL.match(/\.(jpeg|jpg|gif|png)$/) !== null;
    },
    className: function () {
      const classes = ['position-fixed', 'my-2'];
      if (this.preview) classes.push('d-block');else classes.push('d-none');
      return classes.join(' ');
    },
    style: function () {
      const l = this.mousex - this.getWidth() - 10;
      const t = this.mousey - this.getHeight() - 10;
      let styles = {
        left: l + 'px',
        top: t + 'px'
      };

      if (this.preview) {
        if (false) {}
        styles = {
          maxHeight: '400px',
          maxWidth: '400px',
          left: l + 'px',
          top: t + 'px'
        }; // console.log("previewimage style", this.mousex, this.mousey, l, t, styles);
      }

      return styles;
    },
    previewImageURL: function () {
      const url = this.previewImage;
      return this.getNormalImage(url) || this.getImgurImage(url) || this.getYoutubeImage(url) || '';
    },
    ...Vuex.mapGetters(['previewImage'])
  },

  mounted() {
    const self = this;
    $('body').mousemove(function (e) {
      self.mousex = e.pageX;
      self.mousey = e.pageY;
    });
  },

  beforeDestroy() {
    $('body').off('mousemove');
  },

  methods: {
    getWidth: function () {
      if (this.preview) this.w = this.$refs.imgel.width;else this.w = -10000;
      if (this.w === 0) this.w = 400;
      return this.w;
    },
    getHeight: function () {
      if (this.preview) this.h = this.$refs.imgel.height;else this.h = -10000;
      if (this.h === 0) this.h = 400;
      return this.h;
    },

    getNormalImage(text) {
      if (text.match(/\.(jpeg|jpg|gif|png)$/)) {
        return text;
      } else {
        return null;
      }
    },

    getImgurImage(text) {
      const isImageURL = text.match(/\b(https?|ftp|file):\/\/imgur\.com\/(\w+)/);

      if (isImageURL && isImageURL.length > 2) {
        return 'https://i.imgur.com/' + isImageURL[2] + '.png';
      } else {
        return null;
      }
    },

    getYoutubeImage(text) {
      const videoURL = this.isYoutubeVideo(text);

      if (videoURL !== null) {
        return 'https://i.ytimg.com/vi/' + videoURL + '/maxresdefault.jpg';
      } else {
        return null;
      }
    },

    isYoutubeVideo(text) {
      try {
        const youtubeURL = new URL(text);

        switch (youtubeURL.host) {
          case 'www.youtube.com':
          case 'm.youtube.com':
            return this.parseYoutubePreviewImage(youtubeURL);

          case 'youtu.be':
            return this.parseYoutubePreviewImageWithShortUrl(youtubeURL);

          default:
            return null;
        }
      } catch (e) {
        return null;
      }
    },

    parseYoutubePreviewImage(youtubeURL) {
      const youtubeURLArgs = youtubeURL.search.split('&');

      for (let i = 0; i < youtubeURLArgs.length; i++) {
        const isargvideo = this.parseYoutubeArgument(youtubeURLArgs[i]);
        if (isargvideo !== null) return isargvideo;
      }

      return null;
    },

    parseYoutubeArgument(youtubeURLArg) {
      const isYoutubeURLArgVideo = youtubeURLArg.match('v=(.+)');
      if (isYoutubeURLArgVideo !== null) return isYoutubeURLArgVideo[1];else return null;
    },

    parseYoutubePreviewImageWithShortUrl(url) {
      return url.pathname.split('/')[1];
    }

  },
  template: ''
});
// CONCATENATED MODULE: ./src/app/chat/ChatPreviewImage.vue?vue&type=script&lang=js&
 /* harmony default export */ var chat_ChatPreviewImagevue_type_script_lang_js_ = (ChatPreviewImagevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/chat/ChatPreviewImage.vue





/* normalize component */

var ChatPreviewImage_component = Object(componentNormalizer["a" /* default */])(
  chat_ChatPreviewImagevue_type_script_lang_js_,
  ChatPreviewImagevue_type_template_id_0f3cc22a_render,
  ChatPreviewImagevue_type_template_id_0f3cc22a_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ChatPreviewImage_api; }
ChatPreviewImage_component.options.__file = "src/app/chat/ChatPreviewImage.vue"
/* harmony default export */ var ChatPreviewImage = (ChatPreviewImage_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatScrollButton.vue?vue&type=template&id=3032c2d7&
var ChatScrollButtonvue_type_template_id_3032c2d7_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      class: _vm.className,
      staticStyle: {
        "z-index": "400",
        bottom: "5%",
        left: "50%",
        "-ms-transform": "translateX(-50%)",
        transform: "translateX(-50%)",
      },
      attrs: { id: "PTTChat-contents-Chat-btn" },
    },
    [
      _c(
        "button",
        {
          staticClass: "btn btn-primary",
          attrs: { id: "AutoScroll", type: "button" },
          on: { click: _vm.click },
        },
        [_vm._v("\n    自動滾動\n  ")]
      ),
    ]
  )
}
var ChatScrollButtonvue_type_template_id_3032c2d7_staticRenderFns = []
ChatScrollButtonvue_type_template_id_3032c2d7_render._withStripped = true


// CONCATENATED MODULE: ./src/app/chat/ChatScrollButton.vue?vue&type=template&id=3032c2d7&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatScrollButton.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ChatScrollButtonvue_type_script_lang_js_ = ({
  props: {
    isAutoScroll: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    className: function () {
      const classes = ['position-absolute'];

      if (this.isAutoScroll) {
        classes.push('d-none');
      }

      return classes.join(' ');
      /*
      const disable = this.isAutoScroll ? "d-none" : "";
      return "position-absolute " + disable; */
    }
  },
  methods: {
    click: function () {
      this.$emit('autoscrollclick');
    }
  }
});
// CONCATENATED MODULE: ./src/app/chat/ChatScrollButton.vue?vue&type=script&lang=js&
 /* harmony default export */ var chat_ChatScrollButtonvue_type_script_lang_js_ = (ChatScrollButtonvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/chat/ChatScrollButton.vue





/* normalize component */

var ChatScrollButton_component = Object(componentNormalizer["a" /* default */])(
  chat_ChatScrollButtonvue_type_script_lang_js_,
  ChatScrollButtonvue_type_template_id_3032c2d7_render,
  ChatScrollButtonvue_type_template_id_3032c2d7_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ChatScrollButton_api; }
ChatScrollButton_component.options.__file = "src/app/chat/ChatScrollButton.vue"
/* harmony default export */ var ChatScrollButton = (ChatScrollButton_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatElement.vue?vue&type=template&id=ef6a2798&
var ChatElementvue_type_template_id_ef6a2798_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "ptt-chat media px-3", style: _vm.bgc }, [
    _c("div", { staticClass: "media-body mw-100" }, [
      _c(
        "div",
        { staticClass: "ptt-chat-info d-flex flex-row", style: _vm.infoStyle },
        [
          _c("p", { class: _vm.typeclass }, [
            _vm._v("\n        " + _vm._s(_vm.item.type) + "\n      "),
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "ptt-chat-id mr-2 mb-0 flex-grow-1" }, [
            _vm._v("\n        " + _vm._s(_vm.item.pttid) + "\n      "),
          ]),
          _vm._v(" "),
          _c("p", { staticClass: "ptt-chat-time mb-0" }, [
            _vm._v(
              "\n        " +
                _vm._s(_vm.timeH) +
                ":" +
                _vm._s(_vm.timem) +
                "\n      "
            ),
          ]),
        ]
      ),
      _vm._v(" "),
      _c("div", [
        _c("p", {
          ref: "p",
          staticClass: "ptt-chat-msg mb-0 mx-2",
          style: _vm.msgStyle,
          domProps: { innerHTML: _vm._s(_vm.item.msg) },
        }),
      ]),
      _vm._v(" "),
      _c("div", { style: _vm.spaceStyle }),
    ]),
  ])
}
var ChatElementvue_type_template_id_ef6a2798_staticRenderFns = []
ChatElementvue_type_template_id_ef6a2798_render._withStripped = true


// CONCATENATED MODULE: ./src/app/chat/ChatElement.vue?vue&type=template&id=ef6a2798&

// EXTERNAL MODULE: ./src/app/chat/ChatElementMessage.js
var ChatElementMessage = __webpack_require__(12);

// CONCATENATED MODULE: ./src/library.js
// cryptkey
function GenerateCryptKey() {
  const c = makeid(20 + Math.random() * 10);
  GM_setValue('cryptkey', c);
  return c;

  function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }
} // 左邊補0 右邊補0

function paddingLeft(str, lenght) {
  str = str + '';

  if (str.length >= lenght) {
    return str;
  } else {
    return paddingLeft('0' + str, lenght);
  }
}
function paddingRight(str, lenght) {
  str = str + '';

  if (str.length >= lenght) {
    return str;
  } else {
    return paddingRight(str + '0', lenght);
  }
} // JSON轉換用

function dateReviver(key, value) {
  if (typeof value === 'string') {
    const a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);

    if (a) {
      return new Date(+a[1], +a[2] - 1, +a[3], +a[4] + 8, +a[5], +a[6]);
    }
  }

  return value;
} // 对象深复制，不考虑循环引用的情况

function cloneObj(from) {
  /* eslint-disable no-sequences */
  // eslint-disable-next-line no-return-assign
  return Object.keys(from).reduce((obj, key) => (obj[key] = clone(from[key]), obj), {});
  /* eslint-enable no-sequences */
} // 数组深复制，不考虑循环引用的情况


function cloneArr(from) {
  return from.map(n => clone(n));
} // 复制输入值


function clone(from) {
  if (from instanceof Array) {
    return cloneArr(from);
  } else if (from instanceof Object) {
    return cloneObj(from);
  } else {
    return from;
  }
}
function ThemeCheck(CSSSelector, WhiteThemeColor) {
  const element = document.querySelector(CSSSelector); // console.log("ThemeCheck element", element);

  const bgcolor = getComputedStyle(element).backgroundColor; // console.log("ThemeCheck bgcolor", bgcolor);

  console.log("Theme color check: website bgcolor is '" + bgcolor + "', WhiteThemeColor is '" + WhiteThemeColor + "', whitetheme =", bgcolor.indexOf(WhiteThemeColor) >= 0);
  return bgcolor.indexOf(WhiteThemeColor) >= 0;
}
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* eslint-disable-next-line no-unused-vars */


/* harmony default export */ var ChatElementvue_type_script_lang_js_ = ({
  props: {
    item: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    },
    msgStyle: {
      type: Object,
      required: true
    },
    infoStyle: {
      type: Object,
      required: true
    },
    spaceStyle: {
      type: Object,
      required: true
    },
    activeChat: {
      type: Number,
      required: true
    }
  },
  computed: {
    timeH: function () {
      return paddingLeft(this.item.time.getHours(), +2);
    },
    timem: function () {
      return paddingLeft(this.item.time.getMinutes(), +2);
    },
    typeclass: function () {
      const typecolor = this.item.type === '推 ' ? 'ptt-chat-type' : 'ptt-chat-type-n';
      return typecolor + ' mr-2 mb-0';
    },
    bgc: function () {
      if (this.getDisableCommentGray) return '';
      const isUnchat = this.item.gray ? '0.25' : '0';
      const color = 'rgba(128, 128, 128, ' + isUnchat + ')';
      return {
        backgroundColor: color,
        transition: '2s'
      };
    },
    ...Vuex.mapGetters(['getDisableCommentGray'])
  },
  watch: {
    activeChat: function () {
      this.$_ChatElementMessage_GrayCheck();
    }
  },

  mounted() {
    if (!this.getDisableCommentGray) this.$_ChatElementMessage_GrayCheck();
    this.$nextTick(function () {
      this.$refs.p.mouseEnter = this.$_ChatElementMessage_MoueseEnter;
      this.$refs.p.mouseLeave = this.$_ChatElementMessage_MoueseLeave;
      this.$refs.p.AddAnySrarch = this.$_ChatElementMessage_AddAnySrarch;
    });
  },

  updated() {
    if (false) {}
  },

  methods: {
    $_ChatElementMessage_GrayCheck() {
      if (false) {}
      if (this.index > this.activeChat && !this.item.gray) this.$emit('updategray', this.index, true);else if (this.index <= this.activeChat && this.item.gray) this.$emit('updategray', this.index, false);
    },

    $_ChatElementMessage_MoueseEnter(url) {
      this.$store.dispatch('previewImage', url);
    },

    $_ChatElementMessage_MoueseLeave(url) {
      this.$store.dispatch('previewImage', '');
    },

    $_ChatElementMessage_AddAnySrarch(search) {
      if (false) {}
      this.$store.dispatch('addAnySearch', search);
    }

  }
});
// CONCATENATED MODULE: ./src/app/chat/ChatElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var chat_ChatElementvue_type_script_lang_js_ = (ChatElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/chat/ChatElement.vue





/* normalize component */

var ChatElement_component = Object(componentNormalizer["a" /* default */])(
  chat_ChatElementvue_type_script_lang_js_,
  ChatElementvue_type_template_id_ef6a2798_render,
  ChatElementvue_type_template_id_ef6a2798_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ChatElement_api; }
ChatElement_component.options.__file = "src/app/chat/ChatElement.vue"
/* harmony default export */ var ChatElement = (ChatElement_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatSetNewComment.vue?vue&type=template&id=31536d4e&
var ChatSetNewCommentvue_type_template_id_31536d4e_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "container" }, [
    _c("div", { class: _vm.className }, [
      _c("div", { staticClass: "col" }, [
        _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model.lazy",
              value: _vm.commenttext,
              expression: "commenttext",
              modifiers: { lazy: true },
            },
          ],
          staticClass: "form-control",
          staticStyle: { "font-size": "14px" },
          attrs: {
            id: "setnewcomment",
            type: "text",
            placeholder: _vm.placeholder,
            autocomplete: "off",
            disabled: !_vm.getEnableSetNewComment,
          },
          domProps: { value: _vm.commenttext },
          on: {
            keyup: function ($event) {
              if (!$event.type.indexOf("key") && $event.keyCode !== 13) {
                return null
              }
              return _vm.$_ChatSetNewComment_setComment.apply(null, arguments)
            },
            change: function ($event) {
              _vm.commenttext = $event.target.value
            },
          },
        }),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-2 px-0" }, [
        _c(
          "button",
          {
            staticClass: "btn ptt-btnoutline w-100 px-2",
            attrs: { id: "setnewcommentbtn", type: "button" },
            on: {
              click: function ($event) {
                if ($event.target !== $event.currentTarget) {
                  return null
                }
                return _vm.$_ChatSetNewComment_setComment()
              },
            },
          },
          [_vm._v("\n        推文\n      ")]
        ),
      ]),
    ]),
  ])
}
var ChatSetNewCommentvue_type_template_id_31536d4e_staticRenderFns = []
ChatSetNewCommentvue_type_template_id_31536d4e_render._withStripped = true


// CONCATENATED MODULE: ./src/app/chat/ChatSetNewComment.vue?vue&type=template&id=31536d4e&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/chat/ChatSetNewComment.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ChatSetNewCommentvue_type_script_lang_js_ = ({
  inject: ['msg', 'isStream'],

  data() {
    return {
      commenttext: ''
    };
  },

  computed: {
    placeholder: function () {
      if (this.getEnableSetNewComment) return '輸入文字以推文...';else return '請到連線設定開啟測試版推文功能';
    },
    className: function () {
      const classes = ['form-row', 'my-2'];

      if (!this.isStream) {
        classes.push('d-none');
      }

      return classes.join(' ');
    },
    ...Vuex.mapGetters(['post', 'pttState', 'getEnableSetNewComment'])
  },

  mounted() {
    this.msg.commentedText = data => this.$_ChatSetNewComment_removeCommentedText(data.commentedText);
  },

  methods: {
    $_ChatSetNewComment_setComment: function () {
      const result = /.+/.exec(this.commenttext);
      if (!result) this.$store.dispatch('Alert', {
        type: 0,
        msg: '請輸入文字。'
      });else if (this.pttState < 1) this.$store.dispatch('Alert', {
        type: 0,
        msg: 'PTT尚未登入，請先登入。'
      });else if (!this.post.gettedpost) this.$store.dispatch('Alert', {
        type: 0,
        msg: '尚未獲取文章，請先獲取文章。'
      });else {
        setvalue({
          event: 'setComment'
        });
        this.msg.PostMessage('setNewcomment', this.commenttext);
      }
    },

    $_ChatSetNewComment_removeCommentedText(text) {
      if (this.commenttext.indexOf(text) === 0) this.commenttext = this.commenttext.substring(text.length, this.commenttext.length);
    }

  }
});
// CONCATENATED MODULE: ./src/app/chat/ChatSetNewComment.vue?vue&type=script&lang=js&
 /* harmony default export */ var chat_ChatSetNewCommentvue_type_script_lang_js_ = (ChatSetNewCommentvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/chat/ChatSetNewComment.vue





/* normalize component */

var ChatSetNewComment_component = Object(componentNormalizer["a" /* default */])(
  chat_ChatSetNewCommentvue_type_script_lang_js_,
  ChatSetNewCommentvue_type_template_id_31536d4e_render,
  ChatSetNewCommentvue_type_template_id_31536d4e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ChatSetNewComment_api; }
ChatSetNewComment_component.options.__file = "src/app/chat/ChatSetNewComment.vue"
/* harmony default export */ var ChatSetNewComment = (ChatSetNewComment_component.exports);
// CONCATENATED MODULE: ./src/app/chat/Chat.js




Vue.component('DynamicScroller', VueVirtualScroller.DynamicScroller);
Vue.component('DynamicScrollerItem', VueVirtualScroller.DynamicScrollerItem);
/* harmony default export */ var Chat = ({
  inject: ['msg', 'isStream'],

  data() {
    return {
      _allchats: [],
      lastChat: [],
      acChat: 0,
      postKey: '',
      lastactiveChat: -1,
      intervalChat: null,
      intervalScroll: null,
      nextUpdateTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
      isAutoScroll: true,
      lastautoscrolltime: Date.now(),
      ChatElement: ChatElement,
      scrolloffset: 0
    };
  },

  methods: {
    updateComment: function () {
      if (this.postKey !== this.post.key) {
        if (false) {}
        this.postKey = this.post.key;
        this._allchats = [];
      }

      if (!this._allchats) this._allchats = [];
      this._allchats = this._allchats.concat(this.newChatList);
      if (false) {}
      this.$store.dispatch('clearChat');
      return this._allchats;
    },
    updateGray: function (index, isgray) {
      if (!this.allchats[index]) return;

      if (false) {}

      if (this.allchats[index].gray !== isgray) this.allchats[index].gray = isgray;else console.log('update gray error', index, this.allchats[index].gray, '->', isgray, this.allchats[index].msg);
    },
    updateChat: function () {
      this.getCurrentChat();
      setTimeout(() => this.autoScrollCheck(), 10);
    },
    autoScrollCheck: function () {
      if (false) {}

      if (this.lastactiveChat !== this.activeChat) {
        this.lastactiveChat = this.activeChat;
      }

      if (this.isAutoScroll && this.lastautoscrolltime + 50 < Date.now()) {
        this.scrollToChat();
      }
    },
    scrollToChat: function () {
      const list = this.$refs.chatmain;
      const scroller = list.$refs.scroller;
      const accumulator = this.activeChat > 0 ? scroller.sizes[this.activeChat - 1].accumulator : 0;
      const clientHeight = list.$el.clientHeight;
      let scroll = accumulator - clientHeight / 2;
      if (scroll < 0) scroll = 0;
      scroller.$el.scrollTo({
        top: scroll,
        behavior: Math.abs(scroller.$el.scrollTop - scroll) > clientHeight * 2 ? 'auto' : 'smooth'
      });
      this.$store.dispatch('updateLog', {
        type: 'targetScrollHeight',
        data: scroll
      }); // scroller.scrollToPosition(scroll);
    },
    getCurrentChat: function () {
      const chats = this.allchats;

      if (this.isStream) {
        this.activeChat = chats.length - 1;
      } else {
        // console.log("this.activeChat && chats && reportMode", this.activeChat, chats, reportMode);
        if (this.activeChat > -1 && chats && false) {
          console.log('current time: ' + this.videoCurrentTime.toString(), ', activeChat', this.activeChat);

          if (chats[this.activeChat - 1]) {
            console.log(chats[this.activeChat - 1].time.toLocaleTimeString(), ', activeChat-1 < CurrentTime', chats[this.activeChat - 1].time.valueOf() < this.videoCurrentTime.valueOf());
          }

          if (chats[this.activeChat + 0]) {
            console.log(chats[this.activeChat + 0].time.toLocaleTimeString(), ', activeChat   > CurrentTime', chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf());
          }

          if (chats[this.activeChat + 1]) {
            console.log(chats[this.activeChat + 1].time.toLocaleTimeString(), ', activeChat+1 < CurrentTime', chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf());
          }
        }

        let move = 128;

        while (true) {
          while (this.activeChat > 0 && chats[this.activeChat] && chats[this.activeChat].time.valueOf() > this.videoCurrentTime.valueOf()) {
            this.activeChat -= move;
          }

          while (chats[this.activeChat + 1] && chats[this.activeChat + 1].time.valueOf() < this.videoCurrentTime.valueOf()) {
            this.activeChat += move;
          }

          if (move <= 1) break;
          move = move / 2;
        }
      }

      this.$store.dispatch('updateLog', {
        type: 'commentIndex',
        data: this.activeChat
      });
      if (false) {}
    },
    MouseWheelHandler: function (e) {
      this.isAutoScroll = false;
    },
    EnableAutoScroll: function () {
      this.isAutoScroll = true;
      this.scrollToChat();
    },
    AddEventHandler: function () {
      const list = this.$refs.chatmain.$el; // 使用者滾輪事件

      if (list.addEventListener) {
        list.addEventListener('mousewheel', this.MouseWheelHandler, false); // IE9, Chrome, Safari, Opera

        list.addEventListener('DOMMouseScroll', this.MouseWheelHandler, false); // Firefox
      } else {
        // IE 6/7/8
        list.attachEvent('onmousewheel', this.MouseWheelHandler);
      }

      list.addEventListener('scroll', e => {
        if (this.isAutoScroll) this.lastautoscrolltime = Date.now();
      });
    }
  },
  computed: {
    allchats: function () {
      return this.newChatList.length > 0 ? this.updateComment() : this._allchats;
    },
    activeChat: {
      get() {
        return this.acChat;
      },

      set(value) {
        if (value > this.allchats.length - 1) this.acChat = this.allchats.length - 1;else if (value < 0) this.acChat = 0;else this.acChat = value;
      }

    },
    // chatelement computed
    elMsgLineHeight: function () {
      return this.getFontsize * 1.2;
    },
    elMsgStyle: function () {
      return {
        'font-size': this.getFontsize + 'px',
        'line-height': this.elMsgLineHeight + 'px'
      };
    },
    elInfoStyle: function () {
      return {
        'font-size': this.getFontsize / 1.2 + 'px',
        'line-height': this.getFontsize + 'px'
      };
    },
    elSpace: function () {
      return this.getChatSpace * this.getFontsize;
    },
    elSpaceStyle: function () {
      return {
        'margin-bottom': this.elSpace + 'px'
      };
    },
    defaultElClientHeight: function () {
      return +this.elMsgLineHeight + +this.getFontsize + +this.elSpace;
    },
    ...Vuex.mapGetters(['newChatList', 'post', 'videoCurrentTime', 'pttState', 'getDisableCommentGray', 'getCommentInterval', 'getFontsize', 'getChatSpace'])
  },

  created() {
    if (false) {} // test
    else this._allchats = [];
    this.lastChat = [];
    this.postKey = this.post.key;
    this.activeChat = 0;
    this.nextUpdateTime = Date.now() + 5 * 365 * 24 * 60 * 60 * 1000;
  },

  mounted() {
    if (false) {} // 註冊文章事件

    this.msg.newComment = data => {
      this.$store.dispatch('updatePost', data);
      this.nextUpdateTime = Date.now() + Math.max(this.getCommentInterval, 2.5) * 1000;
    }; // 定時抓新聊天


    this.intervalChat = window.setInterval(() => {
      if (this.isStream && this.pttState > 0 && Date.now() > this.nextUpdateTime) {
        this.nextUpdateTime = Date.now() + 60 * 1000;
        if (false) {}
        this.msg.PostMessage('getCommentByAnySearch', {
          key: this.post.key,
          board: this.post.board,
          startLine: this.post.lastEndLine
        });
      }
    }, 340); // 定時滾動

    this.intervalScroll = window.setInterval(() => {
      this.updateChat();
    }, 500);
  },

  beforeDestroy() {
    clearInterval(this.intervalChat);
    clearInterval(this.intervalScroll);
  },

  components: {
    'chat-preview-image': ChatPreviewImage,
    'chat-scroll-btn': ChatScrollButton,
    'chat-set-new-comment': ChatSetNewComment,
    'chat-element': ChatElement // 'dynamic-scroller': DynamicScroller,
    // 'dynamic-scroller-item': DynamicScrollerItem

  },
  template: `<div id="PTTChat-contents-Chat-main" class="h-100 d-flex flex-column">
  <dynamic-scroller ref="chatmain"
    style="overscroll-behavior: none;overflow-y: scroll;overflow-x:hidden;height: 100%;"
    @hook:mounted="AddEventHandler" :items="allchats" :min-item-size="defaultElClientHeight" class="scroller"
    key-field="uid">
    <template v-slot="{ item, index, active }">
      <dynamic-scroller-item :item="item" :active="active" :index="item.id"
        :size-dependencies="[item.msg,defaultElClientHeight]">
        <chat-element :item="item" :index="index" :key="index" :msg-style="elMsgStyle" :info-style="elInfoStyle"
          :space-style="elSpaceStyle" :active-chat="activeChat" @updategray="updateGray"></chat-element>
      </dynamic-scroller-item>
    </template>
  </dynamic-scroller>
  <chat-set-new-comment />
  <chat-preview-image></chat-preview-image>
  <chat-scroll-btn :is-auto-scroll="isAutoScroll" @autoscrollclick="EnableAutoScroll()"></chat-scroll-btn>
</div>`
});
const testchat = {
  l: [],

  get list() {
    console.log('instance fake chat');

    for (let i = this.l.length; i < 12000; i++) {
      const el = {
        type: '推 ',
        pttid: 'ID_NO.' + i,
        time: new Date()
      };
      let msg = '';
      let m = i + '';

      switch (i % 4) {
        case 0:
          m += filterXSS('太神啦 https://youtu.be/23y5h8kQsv8?t=4510 太神啦 https://www.youtube.com/watch?t=1237&v=Suab3SD1rbI&feature=youtu.be');
          break;

        case 1:
          m += filterXSS('太神啦 https://pbs.twimg.com/media/ErtC6XwVoAM_ktN.jpg 太神啦 https://imgur.com/kFOAhnc');
          break;

        case 2:
          m += filterXSS('太神啦 https://i.imgur.com/m8VTnyA.png 太神啦 https://m.youtube.com/watch?v=8p-JW2RtLoY&feature=youtu.be');
          break;

        case 3:
          m += filterXSS('太神啦 https://hololive.jetri.co/#/watch #1WHqSb2l (C_Chat)');
          break;

        default:
          break;
      }

      const AidResult = /(.*)(#[a-zA-Z0-9-_^'"`]{8} \([^'"`)]+\))(.*)/.exec(m);

      if (AidResult && AidResult.length > 3) {
        const precontent = AidResult[1];
        const aid = AidResult[2];
        const postcontent = AidResult[3];
        const aidResult = /(#[a-zA-Z0-9_-]+) \(([a-zA-Z0-9_-]+)\)/.exec(aid);
        const search = aidResult[2] + ',' + aidResult[1];
        m = precontent + '<u onclick="this.parentNode.AddAnySrarch(`' + search + '`)" style="cursor: pointer;">' + aid + '</u>' + postcontent;
        if (false) {}
      }

      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m);
      let ParseTimeLimit = 5;

      while (result && m !== '' && ParseTimeLimit > 0) {
        const prestring = result[1];
        const linkstring = result[2];
        if (prestring !== '') msg = msg + prestring;
        msg = msg + '<a href="' + linkstring + '" target="_blank" rel="noopener noreferrer" class="ptt-chat-msg" ref="link' + (5 - ParseTimeLimit) + '" onmouseover="this.parentNode.mouseEnter(this.href)" onmouseleave="this.parentNode.mouseLeave(this.href)">' + linkstring + '</a>';
        m = result[3];
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m);
        ParseTimeLimit--;
      }

      if (m !== '') msg = msg + m;
      el.msg = msg;
      el.time.setHours(18);
      el.time.setMinutes(0);
      el.time.setSeconds(i * 3);
      el.id = i;
      el.uid = '#test_' + i;
      el.gray = true;
      this.l.push(el);
    }

    return this.l;
  }

};
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/Connect.vue?vue&type=template&id=77cac6ee&
var Connectvue_type_template_id_77cac6ee_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "col overflow-auto h-100 mb-0 p-4",
      attrs: {
        id: "PTTChat-contents-Connect-main",
        "data-spy": "scroll",
        "data-offset": "0",
      },
    },
    [
      _c("connect-connect-setting"),
      _vm._v(" "),
      _c("hr", { staticClass: "my-1" }),
      _vm._v(" "),
      _c("connect-plugin-setting"),
      _vm._v(" "),
      _c("hr", { staticClass: "my-1" }),
    ],
    1
  )
}
var Connectvue_type_template_id_77cac6ee_staticRenderFns = []
Connectvue_type_template_id_77cac6ee_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/Connect.vue?vue&type=template&id=77cac6ee&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting.vue?vue&type=template&id=673bf394&
var ConnectConnectSettingvue_type_template_id_673bf394_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "mt-4 mb-1" },
    [
      _c("connect-login"),
      _vm._v(" "),
      _c("connect-login-delete-other-connect"),
      _vm._v(" "),
      _c("connect-anysearch"),
      _vm._v(" "),
      _c("connect-reinstance-ptt-btn"),
    ],
    1
  )
}
var ConnectConnectSettingvue_type_template_id_673bf394_staticRenderFns = []
ConnectConnectSettingvue_type_template_id_673bf394_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting.vue?vue&type=template&id=673bf394&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectLogin.vue?vue&type=template&id=c4f7daec&
var ConnectLoginvue_type_template_id_c4f7daec_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-row mt-3" }, [
    _c("div", { staticClass: "col-5" }, [
      _c("label", { attrs: { for: "PTTid" } }, [_vm._v("PTT IDD")]),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.lazy",
            value: _vm.id,
            expression: "id",
            modifiers: { lazy: true },
          },
        ],
        staticClass: "form-control",
        attrs: {
          id: "PTTid",
          type: "text",
          placeholder: "PTT ID",
          autocomplete: "off",
        },
        domProps: { value: _vm.id },
        on: {
          keyup: function ($event) {
            if (!$event.type.indexOf("key") && $event.keyCode !== 13) {
              return null
            }
            return _vm.login.apply(null, arguments)
          },
          change: function ($event) {
            _vm.id = $event.target.value
          },
        },
      }),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "col-5" }, [
      _c("label", { attrs: { for: "PTTpw" } }, [_vm._v("PTT密碼")]),
      _vm._v(" "),
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.lazy",
            value: _vm.pw,
            expression: "pw",
            modifiers: { lazy: true },
          },
        ],
        staticClass: "form-control",
        attrs: {
          id: "PTTpw",
          type: "password",
          placeholder: "PTT密碼",
          autocomplete: "off",
        },
        domProps: { value: _vm.pw },
        on: {
          keyup: function ($event) {
            if (!$event.type.indexOf("key") && $event.keyCode !== 13) {
              return null
            }
            return _vm.login.apply(null, arguments)
          },
          change: function ($event) {
            _vm.pw = $event.target.value
          },
        },
      }),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "col-2 px-0" }, [
      _c("label", { staticClass: "col-2", attrs: { for: "PTTlogin" } }, [
        _vm._v(" "),
      ]),
      _vm._v(" "),
      _c(
        "button",
        {
          staticClass: "btn ptt-btnoutline w-100",
          attrs: { id: "PTTlogin", type: "button" },
          on: {
            click: function ($event) {
              if ($event.target !== $event.currentTarget) {
                return null
              }
              return _vm.login()
            },
          },
        },
        [_vm._v("\n      登入\n    ")]
      ),
    ]),
  ])
}
var ConnectLoginvue_type_template_id_c4f7daec_staticRenderFns = []
ConnectLoginvue_type_template_id_c4f7daec_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectLogin.vue?vue&type=template&id=c4f7daec&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectLogin.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectLoginvue_type_script_lang_js_ = ({
  inject: ['msg'],

  data() {
    return {
      id: GM_getValue('PTTID', ''),
      pw: '',
      cryptkey: GenerateCryptKey()
    };
  },

  computed: { ...Vuex.mapGetters(['getDeleteOtherConnect'])
  },
  methods: {
    login: function () {
      if (this.id === '' || this.pw === '') {
        this.$store.dispatch('Alert', {
          type: 0,
          msg: '帳號或密碼不得為空。'
        });
        return;
      } else if (this.pttState > 0) {
        this.$store.dispatch('Alert', {
          type: 0,
          msg: '已經登入，請勿重複登入。'
        });
        return;
      }

      GM_setValue('PTTID', this.id);
      const i = CryptoJS.AES.encrypt(this.id, this.cryptkey).toString();
      const p = CryptoJS.AES.encrypt(this.pw, this.cryptkey).toString();
      if (false) {}
      this.msg.PostMessage('login', {
        id: i,
        pw: p,
        DeleteOtherConnect: this.getDeleteOtherConnect
      });
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectLogin.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectLoginvue_type_script_lang_js_ = (ConnectLoginvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectLogin.vue





/* normalize component */

var ConnectLogin_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectLoginvue_type_script_lang_js_,
  ConnectLoginvue_type_template_id_c4f7daec_render,
  ConnectLoginvue_type_template_id_c4f7daec_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectLogin_api; }
ConnectLogin_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectLogin.vue"
/* harmony default export */ var ConnectLogin = (ConnectLogin_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue?vue&type=template&id=7d718caf&
var ConnectLoginDeleteOtherConnectvue_type_template_id_7d718caf_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-row mb-3" }, [
    _c(
      "div",
      { staticClass: "col" },
      [
        _c("connect-plugin-setting-checkbox-element", {
          attrs: {
            "setting-name": "DeleteOtherConnect",
            description: "刪除其他重複連線(無法登入時請開啟)",
            "default-value": false,
          },
        }),
      ],
      1
    ),
  ])
}
var ConnectLoginDeleteOtherConnectvue_type_template_id_7d718caf_staticRenderFns = []
ConnectLoginDeleteOtherConnectvue_type_template_id_7d718caf_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue?vue&type=template&id=7d718caf&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingCheckboxElement.vue?vue&type=template&id=75dea959&
var ConnectPluginSettingCheckboxElementvue_type_template_id_75dea959_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-check" }, [
    _c("input", {
      directives: [
        {
          name: "model",
          rawName: "v-model",
          value: _vm.SettingValue,
          expression: "SettingValue",
        },
      ],
      staticClass: "form-check-input",
      attrs: { id: _vm.settingName, type: "checkbox" },
      domProps: {
        checked: Array.isArray(_vm.SettingValue)
          ? _vm._i(_vm.SettingValue, null) > -1
          : _vm.SettingValue,
      },
      on: {
        change: [
          function ($event) {
            var $$a = _vm.SettingValue,
              $$el = $event.target,
              $$c = $$el.checked ? true : false
            if (Array.isArray($$a)) {
              var $$v = null,
                $$i = _vm._i($$a, $$v)
              if ($$el.checked) {
                $$i < 0 && (_vm.SettingValue = $$a.concat([$$v]))
              } else {
                $$i > -1 &&
                  (_vm.SettingValue = $$a
                    .slice(0, $$i)
                    .concat($$a.slice($$i + 1)))
              }
            } else {
              _vm.SettingValue = $$c
            }
          },
          function ($event) {
            return _vm.$_PluginSetting_valueChange()
          },
        ],
      },
    }),
    _vm._v(" "),
    _c(
      "label",
      { staticClass: "form-check-label ml-2", attrs: { for: _vm.settingName } },
      [_vm._v(_vm._s(_vm.description))]
    ),
  ])
}
var ConnectPluginSettingCheckboxElementvue_type_template_id_75dea959_staticRenderFns = []
ConnectPluginSettingCheckboxElementvue_type_template_id_75dea959_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingCheckboxElement.vue?vue&type=template&id=75dea959&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingCheckboxElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectPluginSettingCheckboxElementvue_type_script_lang_js_ = ({
  props: {
    settingName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    defaultValue: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      SettingValue: this.$store.getters['get' + this.settingName]
    };
  },

  methods: {
    $_PluginSetting_valueChange: function () {
      this.$store.dispatch('set' + this.settingName, this.SettingValue);
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingCheckboxElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var PluginSettings_ConnectPluginSettingCheckboxElementvue_type_script_lang_js_ = (ConnectPluginSettingCheckboxElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingCheckboxElement.vue





/* normalize component */

var ConnectPluginSettingCheckboxElement_component = Object(componentNormalizer["a" /* default */])(
  PluginSettings_ConnectPluginSettingCheckboxElementvue_type_script_lang_js_,
  ConnectPluginSettingCheckboxElementvue_type_template_id_75dea959_render,
  ConnectPluginSettingCheckboxElementvue_type_template_id_75dea959_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectPluginSettingCheckboxElement_api; }
ConnectPluginSettingCheckboxElement_component.options.__file = "src/app/connect/PluginSettings/ConnectPluginSettingCheckboxElement.vue"
/* harmony default export */ var ConnectPluginSettingCheckboxElement = (ConnectPluginSettingCheckboxElement_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectLoginDeleteOtherConnectvue_type_script_lang_js_ = ({
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectLoginDeleteOtherConnectvue_type_script_lang_js_ = (ConnectLoginDeleteOtherConnectvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue





/* normalize component */

var ConnectLoginDeleteOtherConnect_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectLoginDeleteOtherConnectvue_type_script_lang_js_,
  ConnectLoginDeleteOtherConnectvue_type_template_id_7d718caf_render,
  ConnectLoginDeleteOtherConnectvue_type_template_id_7d718caf_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectLoginDeleteOtherConnect_api; }
ConnectLoginDeleteOtherConnect_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectLoginDeleteOtherConnect.vue"
/* harmony default export */ var ConnectLoginDeleteOtherConnect = (ConnectLoginDeleteOtherConnect_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectReinstancePttButton.vue?vue&type=template&id=0cd6323b&
var ConnectReinstancePttButtonvue_type_template_id_0cd6323b_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-row my-3" }, [
    _c("label", { staticClass: "col-3 col-form-label" }, [_vm._v("重啟PTT")]),
    _vm._v(" "),
    _c("div", { staticClass: "col-2 px-0 ml-2" }, [
      _c(
        "button",
        {
          staticClass: "btn ptt-btnoutline w-100 px-2",
          attrs: { id: "reinstance-ptt-btn", type: "button" },
          on: {
            click: function ($event) {
              if ($event.target !== $event.currentTarget) {
                return null
              }
              return _vm.reLaunchPtt.apply(null, arguments)
            },
          },
        },
        [_vm._v("\n      點我\n    ")]
      ),
    ]),
    _vm._v(" "),
    _c("label", { staticClass: "col col-form-label ml-2" }, [
      _vm._v("PTT跑到奇怪的畫面壞掉時使用"),
    ]),
  ])
}
var ConnectReinstancePttButtonvue_type_template_id_0cd6323b_staticRenderFns = []
ConnectReinstancePttButtonvue_type_template_id_0cd6323b_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectReinstancePttButton.vue?vue&type=template&id=0cd6323b&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectReinstancePttButton.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectReinstancePttButtonvue_type_script_lang_js_ = ({
  inject: ['msg'],
  methods: {
    reLaunchPtt: function () {
      if (this.msg.ownerorigin === 'https://holodex.net') {
        const p = $('#PTTframe').clone();
        $('#PTTframe').remove();
        p.appendTo($('#ptt-frame-parent'));
        this.msg.targetWindow = document.getElementById('PTTframe').contentWindow;
      } else {
        this.reInstancePTT();
      }
    },
    ...Vuex.mapActions(['reInstancePTT' // 将 `this.reInstancePTT()` 映射为 `this.$store.dispatch('reInstancePTT')`
    ])
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectReinstancePttButton.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectReinstancePttButtonvue_type_script_lang_js_ = (ConnectReinstancePttButtonvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectReinstancePttButton.vue





/* normalize component */

var ConnectReinstancePttButton_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectReinstancePttButtonvue_type_script_lang_js_,
  ConnectReinstancePttButtonvue_type_template_id_0cd6323b_render,
  ConnectReinstancePttButtonvue_type_template_id_0cd6323b_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectReinstancePttButton_api; }
ConnectReinstancePttButton_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectReinstancePttButton.vue"
/* harmony default export */ var ConnectReinstancePttButton = (ConnectReinstancePttButton_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearch.vue?vue&type=template&id=06caf856&
var ConnectAnySearchvue_type_template_id_06caf856_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c(
      "div",
      { staticClass: "my-3" },
      [
        _c("connect-anysearch-addnew"),
        _vm._v(" "),
        _c("connect-anysearch-dropdown"),
        _vm._v(" "),
        _c("connect-anysearch-hint"),
      ],
      1
    ),
  ])
}
var ConnectAnySearchvue_type_template_id_06caf856_staticRenderFns = []
ConnectAnySearchvue_type_template_id_06caf856_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearch.vue?vue&type=template&id=06caf856&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearchAddNew.vue?vue&type=template&id=35f8eff4&
var ConnectAnySearchAddNewvue_type_template_id_35f8eff4_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "form-row mt-3" }, [
      _c(
        "label",
        { staticClass: "col-3 col-form-label", attrs: { for: "anySearch" } },
        [_vm._v("搜尋")]
      ),
      _vm._v(" "),
      _c("div", { staticClass: "col" }, [
        _c("input", {
          directives: [
            {
              name: "model",
              rawName: "v-model.lazy",
              value: _vm.search,
              expression: "search",
              modifiers: { lazy: true },
            },
          ],
          staticClass: "form-control",
          attrs: {
            id: "anySearch",
            type: "text",
            placeholder: "C_Chat,/直播單或#1VobIvqC (C_Chat)",
            autocomplete: "off",
          },
          domProps: { value: _vm.search },
          on: {
            keyup: function ($event) {
              if (!$event.type.indexOf("key") && $event.keyCode !== 13) {
                return null
              }
              return _vm.$_ConnectAnySearchAddNew_Add.apply(null, arguments)
            },
            change: function ($event) {
              _vm.search = $event.target.value
            },
          },
        }),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col-2 px-0" }, [
        _c(
          "button",
          {
            staticClass: "btn ptt-btnoutline w-100 px-2",
            attrs: { id: "anySearchbtn", type: "button" },
            on: {
              click: function ($event) {
                if ($event.target !== $event.currentTarget) {
                  return null
                }
                return _vm.$_ConnectAnySearchAddNew_Add()
              },
            },
          },
          [_vm._v("\n        搜尋\n      ")]
        ),
      ]),
    ]),
  ])
}
var ConnectAnySearchAddNewvue_type_template_id_35f8eff4_staticRenderFns = []
ConnectAnySearchAddNewvue_type_template_id_35f8eff4_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchAddNew.vue?vue&type=template&id=35f8eff4&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearchAddNew.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectAnySearchAddNewvue_type_script_lang_js_ = ({
  inject: ['msg', 'isStream'],

  data() {
    return {
      search: ''
    };
  },

  methods: {
    $_ConnectAnySearchAddNew_Add: function () {
      const searchResultBoard = /^ *([a-zA-Z0-9_-]+) *, *(.+) *$/.exec(this.search);

      if (searchResultBoard) {
        const board = searchResultBoard[1];
        const searches = searchResultBoard[2];
        const searchResultSearch = /^ *([#/?aZGA][^,]+?) *(?:, *([#/?aZGA!].+))? *$/.exec(searches);

        if (searchResultSearch) {
          let search = board + ',' + searchResultSearch[1];
          search += searchResultSearch.length > 2 && searchResultSearch[2] ? ',' + searchResultSearch[2] : '';
          this.$store.dispatch('addAnySearch', search);
          return;
        }
      }

      const AidResult = / *(#[a-zA-Z0-9_-]+) \(([a-zA-Z0-9_-]+)\) */.exec(this.search);

      if (AidResult) {
        const search = AidResult[2] + ',' + AidResult[1];
        this.$store.dispatch('addAnySearch', search);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchAddNew.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectAnySearchAddNewvue_type_script_lang_js_ = (ConnectAnySearchAddNewvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchAddNew.vue





/* normalize component */

var ConnectAnySearchAddNew_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectAnySearchAddNewvue_type_script_lang_js_,
  ConnectAnySearchAddNewvue_type_template_id_35f8eff4_render,
  ConnectAnySearchAddNewvue_type_template_id_35f8eff4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectAnySearchAddNew_api; }
ConnectAnySearchAddNew_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectAnySearchAddNew.vue"
/* harmony default export */ var ConnectAnySearchAddNew = (ConnectAnySearchAddNew_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearchDropdown.vue?vue&type=template&id=74401e86&
var ConnectAnySearchDropdownvue_type_template_id_74401e86_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "form-group my-3" }, [
    _c("div", { staticClass: "form-row mt-3 mb-2" }, [
      _c("label", { staticClass: "col-3 col-form-label" }, [
        _vm._v(_vm._s(_vm.description)),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col" }, [
        _c("div", { staticClass: "dropdown" }, [
          _c(
            "button",
            {
              staticClass: "btn ptt-btnoutline dropdown-toggle",
              attrs: { type: "button", "data-toggle": "dropdown" },
            },
            [
              _vm._v(
                "\n          " +
                  _vm._s(
                    _vm.dropdownPreview ? _vm.dropdownPreview : "最近搜尋"
                  ) +
                  "\n        "
              ),
            ]
          ),
          _vm._v(" "),
          _c(
            "ul",
            { staticClass: "dropdown-menu", attrs: { role: "menu" } },
            [
              _vm._l(_vm.optionGroup, function (item, index) {
                return _c(
                  "a",
                  {
                    key: "o-" + index,
                    staticClass: "dropdown-item",
                    attrs: { href: "#" },
                    on: {
                      click: function ($event) {
                        $event.preventDefault()
                        return _vm.$_connectAnySearchDropdown_onClickDropdownItem(
                          item,
                          index
                        )
                      },
                    },
                  },
                  [
                    _vm._v("\n            " + _vm._s(item) + "\n            "),
                    _c(
                      "button",
                      {
                        staticClass: "close ml-2",
                        attrs: { type: "button" },
                        on: {
                          click: function ($event) {
                            $event.stopPropagation()
                            $event.preventDefault()
                            return _vm.$_connectAnySearchDropdown_onClickRemoveOption(
                              index
                            )
                          },
                        },
                      },
                      [
                        _c("i", {
                          staticClass: "bi bi-x",
                          staticStyle: { "font-size": "1rem" },
                        }),
                      ]
                    ),
                    _vm._v(" "),
                    _vm._m(0, true),
                  ]
                )
              }),
              _vm._v(" "),
              _vm._l(_vm.recentGroup, function (item, index) {
                return _c(
                  "a",
                  {
                    key: "r-" + index,
                    staticClass: "dropdown-item",
                    attrs: { href: "#" },
                    on: {
                      click: function ($event) {
                        $event.preventDefault()
                        return _vm.$_connectAnySearchDropdown_onClickDropdownItem(
                          item,
                          index
                        )
                      },
                    },
                  },
                  [
                    _vm._v("\n            " + _vm._s(item) + "\n            "),
                    _c(
                      "button",
                      {
                        staticClass: "close ml-2",
                        attrs: { type: "button" },
                        on: {
                          click: function ($event) {
                            $event.stopPropagation()
                            $event.preventDefault()
                            return _vm.$_connectAnySearchDropdown_onClickRemoveRecent(
                              index
                            )
                          },
                        },
                      },
                      [
                        _c("i", {
                          staticClass: "bi bi-x",
                          staticStyle: { "font-size": "1rem" },
                        }),
                      ]
                    ),
                    _vm._v(" "),
                    _c(
                      "button",
                      {
                        staticClass: "close ml-2",
                        attrs: { type: "button" },
                        on: {
                          click: function ($event) {
                            $event.stopPropagation()
                            $event.preventDefault()
                            return _vm.$_connectAnySearchDropdown_onClickLock(
                              index
                            )
                          },
                        },
                      },
                      [
                        _c("i", {
                          staticClass: "bi bi-unlock-fill",
                          staticStyle: { "font-size": ".7rem" },
                        }),
                      ]
                    ),
                  ]
                )
              }),
            ],
            2
          ),
        ]),
      ]),
    ]),
    _vm._v(" "),
    _c("div", { ref: "previewArea", staticClass: "my-3 collapse" }, [
      _c("div", { staticClass: "form-row" }, [
        _vm._m(1),
        _vm._v(" "),
        _c(
          "div",
          { staticClass: "col ml-2", staticStyle: { border: "1px solid" } },
          [
            _c("div", { staticClass: "my-2" }, [
              _vm._v("\n          " + _vm._s(_vm.previewTitle) + "\n        "),
            ]),
          ]
        ),
      ]),
    ]),
  ])
}
var ConnectAnySearchDropdownvue_type_template_id_74401e86_staticRenderFns = [
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c(
      "button",
      { staticClass: "close ml-2", attrs: { type: "button", disabled: "" } },
      [
        _c("i", {
          staticClass: "bi bi-lock-fill",
          staticStyle: { "font-size": ".7rem" },
        }),
      ]
    )
  },
  function () {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "col-3" }, [
      _c("label", { staticClass: "col-form-label" }, [_vm._v("標題預覽")]),
    ])
  },
]
ConnectAnySearchDropdownvue_type_template_id_74401e86_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchDropdown.vue?vue&type=template&id=74401e86&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearchDropdown.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectAnySearchDropdownvue_type_script_lang_js_ = ({
  inject: ['msg', 'isStream'],

  data() {
    return {
      description: '',
      optionGroup: GM_getValue('AnySearchOption', ['C_Chat,/間直播單,Z20', 'vtuber,/彩虹直播']),
      recentGroup: GM_getValue('AnySearchRecent', []),
      dropdownPreview: undefined,
      previewTitle: null,
      lastAnySearch: ''
    };
  },

  computed: { ...Vuex.mapGetters(['pttState', 'anySearch', 'post'])
  },
  watch: {
    previewTitle() {
      $(this.$refs.manualInputArea).collapse('hide');
      $(this.$refs.previewArea).collapse('show');
      this.$store.dispatch('gotoChat', true);
    },

    anySearch(e) {
      if (e !== '') {
        this.$_connectAnySearchDropdown_AddNew(e);
        this.$store.dispatch('addAnySearch', '');
      }
    }

  },

  mounted() {
    this.msg.setPreviewPostTitle = data => {
      this.previewTitle = data; // if (reportMode) console.log("gettitle" + this.title)
    };
  },

  methods: {
    $_connectAnySearchDropdown_AddNew(item) {
      if (false) {}
      const executeItem = this.$_connectAnySearchDropdown_onClickDropdownItem(item);
      if (!executeItem) return;
      let index = this.optionGroup.indexOf(item);
      if (index > -1) return;
      index = this.recentGroup.indexOf(item);

      if (index > -1) {
        this.recentGroup.splice(index, 1);
      }

      this.recentGroup.splice(0, 0, item);
      GM_setValue('AnySearchRecent', this.recentGroup);
    },

    $_connectAnySearchDropdown_onClickDropdownItemRecent(item, index) {
      const executeItem = this.$_connectAnySearchDropdown_onClickDropdownItem(item);

      if (executeItem) {
        this.recentGroup.splice(0, 0, this.recentGroup.splice(index, 1)[0]);
        GM_setValue('AnySearchRecent', this.recentGroup);
      }
    },

    $_connectAnySearchDropdown_onClickDropdownItem(item) {
      let board = '';
      let key = '';

      if (this.pttState < 1) {
        this.$store.dispatch('Alert', {
          type: 0,
          msg: 'PTT尚未登入，請先登入。'
        });
        return false;
      }

      const RuleResult = / *([a-zA-Z0-9_-]+) *, *(.+) */.exec(item);

      if (RuleResult) {
        board = RuleResult[1];
        key = RuleResult[2];
        this.$_connectAnySearchDropdown_PostMessage(board, key);
        return true;
      }

      this.$store.dispatch('Alert', {
        type: 0,
        msg: '格式錯誤'
      });
      return false;
    },

    $_connectAnySearchDropdown_PostMessage(board, key) {
      const data = {
        key: key,
        board: board
      };
      if (false) {}

      if (this.post.key === key && this.post.board === board) {
        // 相同文章取最新推文
        data.startLine = this.post.lastEndLine;
        if (false) {}
      } else if (this.isStream) {
        // 實況取得最近的推文
        data.recent = 200;
        if (false) {}
      } else {
        // 實況紀錄取得所有推文
        data.startLine = 0;
        if (false) {}
      }

      setvalue({
        event: 'search',
        search: board + ',' + key
      });
      this.msg.PostMessage('getCommentByAnySearch', data);
      this.$store.dispatch('pageChange', true);
    },

    $_connectAnySearchDropdown_onClickRemoveOption(index) {
      this.optionGroup.splice(index, 1);
      GM_setValue('AnySearchOption', this.optionGroup);
    },

    $_connectAnySearchDropdown_onClickRemoveRecent(index) {
      this.recentGroup.splice(index, 1);
      GM_setValue('AnySearchRecent', this.recentGroup);
    },

    $_connectAnySearchDropdown_onClickLock(index) {
      const item = this.recentGroup[index];
      this.optionGroup.push(item);
      this.recentGroup.splice(index, 1);
      GM_setValue('AnySearchOption', this.optionGroup);
      GM_setValue('AnySearchRecent', this.recentGroup);
    }

  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchDropdown.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectAnySearchDropdownvue_type_script_lang_js_ = (ConnectAnySearchDropdownvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchDropdown.vue





/* normalize component */

var ConnectAnySearchDropdown_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectAnySearchDropdownvue_type_script_lang_js_,
  ConnectAnySearchDropdownvue_type_template_id_74401e86_render,
  ConnectAnySearchDropdownvue_type_template_id_74401e86_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectAnySearchDropdown_api; }
ConnectAnySearchDropdown_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectAnySearchDropdown.vue"
/* harmony default export */ var ConnectAnySearchDropdown = (ConnectAnySearchDropdown_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearchHint.vue?vue&type=template&id=3380447c&
var ConnectAnySearchHintvue_type_template_id_3380447c_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("div", { staticClass: "form-row mb-3" }, [
      _c(
        "div",
        { staticClass: "col" },
        [
          _c("connect-plugin-setting-checkbox-element", {
            attrs: {
              "setting-name": "AnySearchHint",
              description: "顯示詳細說明",
              "default-value": false,
            },
          }),
        ],
        1
      ),
    ]),
    _vm._v(" "),
    _c("div", { ref: "AnySearchHint", staticClass: "text-break collapse" }, [
      _c("pre", [
        _vm._v(
          '    搜尋規則為[看板名稱,搜尋指令+關鍵字,搜尋指令+關鍵字]\n    最多可以搜尋兩次, 可以搜尋的種類有:\n    # AID搜尋        /或? 標題搜尋\n    a 作者搜尋        Z 推文數搜尋\n    G 標記搜尋        A 稿酬搜尋\n    ! 排除關鍵字(僅限第二次搜尋時使用)\n    範例:C_Chat,/間直播,Z5\n    在C_Chat板搜尋標題含有"間直播"且推文數5以上最新的一篇文章\n    PTT本身的AID格式(#1VobIvqC (C_Chat))也可以使用\n    '
        ),
      ]),
      _vm._v(" "),
      _c("div"),
    ]),
  ])
}
var ConnectAnySearchHintvue_type_template_id_3380447c_staticRenderFns = []
ConnectAnySearchHintvue_type_template_id_3380447c_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchHint.vue?vue&type=template&id=3380447c&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearchHint.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectAnySearchHintvue_type_script_lang_js_ = ({
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement
  },

  data() {
    return {
      showHint: false,
      hint: ''
    };
  },

  computed: { ...Vuex.mapGetters(['getAnySearchHint'])
  },
  watch: {
    getAnySearchHint(e) {
      $(this.$refs.AnySearchHint).collapse(e ? 'show' : 'hide');
    }

  },

  mounted() {
    if (this.getAnySearchHint) $(this.$refs.AnySearchHint).collapse('show');
  }

});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchHint.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectAnySearchHintvue_type_script_lang_js_ = (ConnectAnySearchHintvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearchHint.vue





/* normalize component */

var ConnectAnySearchHint_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectAnySearchHintvue_type_script_lang_js_,
  ConnectAnySearchHintvue_type_template_id_3380447c_render,
  ConnectAnySearchHintvue_type_template_id_3380447c_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectAnySearchHint_api; }
ConnectAnySearchHint_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectAnySearchHint.vue"
/* harmony default export */ var ConnectAnySearchHint = (ConnectAnySearchHint_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting/ConnectAnySearch.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var ConnectAnySearchvue_type_script_lang_js_ = ({
  components: {
    'connect-anysearch-addnew': ConnectAnySearchAddNew,
    'connect-anysearch-dropdown': ConnectAnySearchDropdown,
    'connect-anysearch-hint': ConnectAnySearchHint
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearch.vue?vue&type=script&lang=js&
 /* harmony default export */ var ConnectConnectSetting_ConnectAnySearchvue_type_script_lang_js_ = (ConnectAnySearchvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting/ConnectAnySearch.vue





/* normalize component */

var ConnectAnySearch_component = Object(componentNormalizer["a" /* default */])(
  ConnectConnectSetting_ConnectAnySearchvue_type_script_lang_js_,
  ConnectAnySearchvue_type_template_id_06caf856_render,
  ConnectAnySearchvue_type_template_id_06caf856_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectAnySearch_api; }
ConnectAnySearch_component.options.__file = "src/app/connect/ConnectConnectSetting/ConnectAnySearch.vue"
/* harmony default export */ var ConnectAnySearch = (ConnectAnySearch_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectConnectSetting.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//




/* harmony default export */ var ConnectConnectSettingvue_type_script_lang_js_ = ({
  components: {
    'connect-login': ConnectLogin,
    'connect-login-delete-other-connect': ConnectLoginDeleteOtherConnect,
    'connect-anysearch': ConnectAnySearch,
    'connect-reinstance-ptt-btn': ConnectReinstancePttButton
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var connect_ConnectConnectSettingvue_type_script_lang_js_ = (ConnectConnectSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectConnectSetting.vue





/* normalize component */

var ConnectConnectSetting_component = Object(componentNormalizer["a" /* default */])(
  connect_ConnectConnectSettingvue_type_script_lang_js_,
  ConnectConnectSettingvue_type_template_id_673bf394_render,
  ConnectConnectSettingvue_type_template_id_673bf394_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectConnectSetting_api; }
ConnectConnectSetting_component.options.__file = "src/app/connect/ConnectConnectSetting.vue"
/* harmony default export */ var ConnectConnectSetting = (ConnectConnectSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectPluginSetting.vue?vue&type=template&id=a1596a02&
var ConnectPluginSettingvue_type_template_id_a1596a02_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "mt-4 mb-1" },
    [
      _c("connect-component-title", {
        attrs: { title: "套件設定", description: "輸入數值之後按Enter確認" },
      }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-row px-2" },
        [
          _c("connect-plugin-setting-input-element", {
            attrs: {
              "setting-name": "PluginHeight",
              description: "套件長度(px)",
              "default-value": 850,
              max: 850,
              min: 180,
              column: 6,
            },
          }),
          _vm._v(" "),
          _c("connect-plugin-setting-input-element", {
            attrs: {
              "setting-name": "PushInterval",
              description: "推文更新(s)",
              "default-value": 2.5,
              max: 360,
              min: 2.5,
              column: 6,
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-row px-2" },
        [
          _c("connect-plugin-setting-input-element", {
            attrs: {
              "setting-name": "Fontsize",
              description: "字體尺寸(px)",
              "default-value": 16,
              max: 30,
              min: 9,
              column: 6,
            },
          }),
          _vm._v(" "),
          _c("connect-plugin-setting-input-element", {
            attrs: {
              "setting-name": "ChatSpace",
              description: "推文間隔(行)",
              "default-value": 0.5,
              max: 5,
              min: 0,
              column: 6,
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _vm.siteName === "Holotools" || _vm.siteName === "niji-mado"
        ? _c(
            "div",
            { staticClass: "form-row px-2" },
            [
              _c("connect-plugin-setting-input-element", {
                attrs: {
                  "setting-name": "PluginWidth",
                  description: "套件寬度",
                  "default-value": 400,
                  max: 800,
                  min: 290,
                  column: 12,
                },
              }),
              _vm._v(" "),
              _c("p", { staticClass: "my-0 px-2" }, [
                _vm._v("\n      僅Holotools、niji-mado可用，需重新整理\n    "),
              ]),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _vm.siteName === "Holotools"
        ? _c(
            "div",
            { staticClass: "form-row px-2" },
            [
              _c("connect-plugin-setting-input-element", {
                attrs: {
                  "setting-name": "PluginPortraitHeight",
                  description: "直立顯示時的套件高度",
                  "default-value": 400,
                  max: 800,
                  min: 290,
                  column: 12,
                },
              }),
              _vm._v(" "),
              _c("p", { staticClass: "my-0 px-2" }, [
                _vm._v("\n      僅舊版Holotools可用，需重新整理\n    "),
              ]),
            ],
            1
          )
        : _vm._e(),
      _vm._v(" "),
      _c("connect-plugin-setting-theme"),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-row px-2" },
        [_c("connect-other-setting")],
        1
      ),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "form-row px-2" },
        [_c("connect-new-version")],
        1
      ),
    ],
    1
  )
}
var ConnectPluginSettingvue_type_template_id_a1596a02_staticRenderFns = []
ConnectPluginSettingvue_type_template_id_a1596a02_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectPluginSetting.vue?vue&type=template&id=a1596a02&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/Components/ConnectComponentTitle.vue?vue&type=template&id=7e548e38&
var ConnectComponentTitlevue_type_template_id_7e548e38_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "text-center mb-2" }, [
    _c("h4", { staticClass: "mb-1 mt-0" }, [
      _vm._v("\n    " + _vm._s(_vm.title) + "\n  "),
    ]),
    _vm._v(" "),
    _c("p", { staticClass: "mt-1 mb-0" }, [
      _vm._v("\n    " + _vm._s(_vm.description) + "\n  "),
    ]),
  ])
}
var ConnectComponentTitlevue_type_template_id_7e548e38_staticRenderFns = []
ConnectComponentTitlevue_type_template_id_7e548e38_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/Components/ConnectComponentTitle.vue?vue&type=template&id=7e548e38&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/Components/ConnectComponentTitle.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectComponentTitlevue_type_script_lang_js_ = ({
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false,
      default: ''
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/Components/ConnectComponentTitle.vue?vue&type=script&lang=js&
 /* harmony default export */ var Components_ConnectComponentTitlevue_type_script_lang_js_ = (ConnectComponentTitlevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/Components/ConnectComponentTitle.vue





/* normalize component */

var ConnectComponentTitle_component = Object(componentNormalizer["a" /* default */])(
  Components_ConnectComponentTitlevue_type_script_lang_js_,
  ConnectComponentTitlevue_type_template_id_7e548e38_render,
  ConnectComponentTitlevue_type_template_id_7e548e38_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectComponentTitle_api; }
ConnectComponentTitle_component.options.__file = "src/app/connect/Components/ConnectComponentTitle.vue"
/* harmony default export */ var ConnectComponentTitle = (ConnectComponentTitle_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingInputElement.vue?vue&type=template&id=0fa0fce2&
var ConnectPluginSettingInputElementvue_type_template_id_0fa0fce2_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { class: _vm.Classes }, [
    _c("label", { class: _vm.LabelClasses, attrs: { for: _vm.settingName } }, [
      _vm._v(_vm._s(_vm.description)),
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "col px-0" }, [
      _c("input", {
        directives: [
          {
            name: "model",
            rawName: "v-model.lazy",
            value: _vm.SettingValue,
            expression: "SettingValue",
            modifiers: { lazy: true },
          },
        ],
        staticClass: "form-control",
        attrs: {
          id: _vm.settingName,
          type: "text",
          placeholder: _vm.defaultValue,
          autocomplete: "off",
        },
        domProps: { value: _vm.SettingValue },
        on: {
          keyup: function ($event) {
            if (!$event.type.indexOf("key") && $event.keyCode !== 13) {
              return null
            }
            return _vm.$_PluginSetting_update.apply(null, arguments)
          },
          change: function ($event) {
            _vm.SettingValue = $event.target.value
          },
        },
      }),
    ]),
    _vm._v(" "),
    _vm.confirmBtn
      ? _c("div", { staticClass: "col-2 pr-0" }, [
          _c(
            "button",
            {
              staticClass: "btn ptt-btnoutline w-100",
              attrs: { id: _vm.BtnId, type: "button" },
              on: {
                click: function ($event) {
                  if ($event.target !== $event.currentTarget) {
                    return null
                  }
                  return _vm.$_PluginSetting_update()
                },
              },
            },
            [_vm._v("\n      確認\n    ")]
          ),
        ])
      : _vm._e(),
  ])
}
var ConnectPluginSettingInputElementvue_type_template_id_0fa0fce2_staticRenderFns = []
ConnectPluginSettingInputElementvue_type_template_id_0fa0fce2_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingInputElement.vue?vue&type=template&id=0fa0fce2&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingInputElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectPluginSettingInputElementvue_type_script_lang_js_ = ({
  inject: ['nowPluginWidth'],
  props: {
    settingName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    defaultValue: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    confirmBtn: {
      type: Boolean,
      required: false,
      default: false
    },
    column: {
      type: Number,
      required: false,
      default: 12
    },
    perwebsite: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data() {
    return {
      SettingValue: +GM_getValue(this.settingName, -1),
      ValueMax: +GM_getValue('A-custom-' + this.settingName + 'Max', -1),
      ValueMin: +GM_getValue('A-custom-' + this.settingName + 'Min', -1),
      BtnId: this.settingName + '-btn',
      Col: this.column
    };
  },

  computed: {
    Classes: function () {
      const classes = ['form-row', 'px-0', 'mx-0', 'my-2'];

      if (this.nowPluginWidth < 399) {
        classes.push('col-' + Math.min(this.Col * 2, 12));
      } else classes.push('col-' + Math.min(this.Col, 12));

      return classes.join(' ');
    },
    LabelClasses: function () {
      const col = parseInt(12 / this.Col) * 3;
      const classes = ['col-form-label'];
      if (this.nowPluginWidth < 399) classes.push('col-12');else classes.push('col-' + col);
      return classes.join(' ');
    },
    ...Vuex.mapGetters(['customPluginSetting', 'siteName'])
  },
  watch: {
    customPluginSetting() {
      this.SettingValue = +GM_getValue(this.settingName + (this.customPluginSetting ? '-' + this.siteName : ''), -1);
      this.$_PluginSetting_GetValue();
      this.$_PluginSetting_MaxCheck();
      this.$_PluginSetting_MinCheck();
      this.$_PluginSetting_ValueCheck();
    }

  },

  mounted() {
    this.$_PluginSetting_MaxCheck();
    this.$_PluginSetting_MinCheck();
    this.$_PluginSetting_ValueCheck();
  },

  methods: {
    $_PluginSetting_update: function () {
      if (false) {}

      if (+this.SettingValue > this.ValueMax) {
        this.SettingValue = this.ValueMax;
      } else if (+this.SettingValue < this.ValueMin) {
        this.SettingValue = this.ValueMin;
      }

      this.$store.dispatch('set' + this.settingName, this.SettingValue);
    },
    $_PluginSetting_GetValue: function () {
      this.ValueMax = +GM_getValue('A-custom-' + this.settingName + 'Max' + (this.customPluginSetting ? '-' + this.siteName : ''), -1);
      this.ValueMin = +GM_getValue('A-custom-' + this.settingName + 'Min' + (this.customPluginSetting ? '-' + this.siteName : ''), -1);
    },
    $_PluginSetting_MaxCheck: function () {
      if (this.ValueMax < 0) {
        this.ValueMax = this.max;
        GM_setValue('A-custom-' + this.settingName + 'Max' + (this.customPluginSetting ? '-' + this.siteName : ''), this.max);
      }
    },
    $_PluginSetting_MinCheck: function () {
      if (this.ValueMin < 0) {
        this.ValueMin = this.min;
        GM_setValue('A-custom-' + this.settingName + 'Min' + (this.customPluginSetting ? '-' + this.siteName : ''), this.min);
      }
    },
    $_PluginSetting_ValueCheck: function () {
      if (false) {}
      if (this.SettingValue < 0) this.SettingValue = this.defaultValue;
      this.$_PluginSetting_update();
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingInputElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var PluginSettings_ConnectPluginSettingInputElementvue_type_script_lang_js_ = (ConnectPluginSettingInputElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingInputElement.vue





/* normalize component */

var ConnectPluginSettingInputElement_component = Object(componentNormalizer["a" /* default */])(
  PluginSettings_ConnectPluginSettingInputElementvue_type_script_lang_js_,
  ConnectPluginSettingInputElementvue_type_template_id_0fa0fce2_render,
  ConnectPluginSettingInputElementvue_type_template_id_0fa0fce2_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectPluginSettingInputElement_api; }
ConnectPluginSettingInputElement_component.options.__file = "src/app/connect/PluginSettings/ConnectPluginSettingInputElement.vue"
/* harmony default export */ var ConnectPluginSettingInputElement = (ConnectPluginSettingInputElement_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingTheme.vue?vue&type=template&id=49ba112e&
var ConnectPluginSettingThemevue_type_template_id_49ba112e_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "form-row px-2" },
    [
      _c("connect-dropdown", {
        attrs: {
          "setting-name": "Theme",
          description: "主題顏色",
          "option-group": _vm.ThemeOptions,
          "default-value": 0,
        },
      }),
      _vm._v(" "),
      _c(
        "div",
        { ref: "themeColorOption", staticClass: "collapse w-100" },
        [
          _c("connect-dropdown", {
            attrs: {
              "setting-name": "ThemeColorBG",
              description: "背景亮度",
              "option-group": _vm.ThemeColorBGOptions,
              "default-value": 2,
            },
          }),
          _vm._v(" "),
          _c("connect-dropdown", {
            attrs: {
              "setting-name": "ThemeColorBorder",
              description: "字體亮度",
              "option-group": _vm.ThemeColorBorderOptions,
              "default-value": 2,
            },
          }),
        ],
        1
      ),
    ],
    1
  )
}
var ConnectPluginSettingThemevue_type_template_id_49ba112e_staticRenderFns = []
ConnectPluginSettingThemevue_type_template_id_49ba112e_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingTheme.vue?vue&type=template&id=49ba112e&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectDropdownElement.vue?vue&type=template&id=90c6cb84&
var ConnectDropdownElementvue_type_template_id_90c6cb84_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "form-row px-0 mx-0 col-12 my-2", attrs: { id: _vm.id } },
    [
      _c("legend", { staticClass: "col-form-label col-3 pt-0" }, [
        _vm._v("\n    " + _vm._s(_vm.description) + "\n  "),
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "col px-0" }, [
        _c("div", { staticClass: "dropdown" }, [
          _c(
            "button",
            {
              staticClass: "btn ptt-btnoutline btn-sm dropdown-toggle",
              attrs: {
                id: _vm.btnid,
                type: "button",
                "data-toggle": "dropdown",
                "aria-haspopup": "true",
                "aria-expanded": "false",
              },
            },
            [_vm._v("\n        " + _vm._s(_vm.DisplayOption) + "\n      ")]
          ),
          _vm._v(" "),
          _c(
            "div",
            {
              staticClass: "dropdown-menu",
              attrs: { "aria-labelledby": _vm.btnid },
            },
            _vm._l(_vm.optionGroup, function (option, index) {
              return _c(
                "a",
                {
                  key: index,
                  staticClass: "dropdown-item",
                  attrs: { href: "#" },
                  on: {
                    click: function ($event) {
                      $event.preventDefault()
                      return _vm.$_ConnectDropdownElement_Select(index)
                    },
                  },
                },
                [_vm._v(_vm._s(option))]
              )
            }),
            0
          ),
        ]),
      ]),
    ]
  )
}
var ConnectDropdownElementvue_type_template_id_90c6cb84_staticRenderFns = []
ConnectDropdownElementvue_type_template_id_90c6cb84_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectDropdownElement.vue?vue&type=template&id=90c6cb84&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectDropdownElement.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectDropdownElementvue_type_script_lang_js_ = ({
  props: {
    settingName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    optionGroup: {
      type: Array,
      required: true
    },
    defaultValue: {
      type: Number,
      required: false,
      default: 0
    }
  },

  data() {
    return {
      SettingValue: this.$store.getters['get' + this.settingName],
      btnid: this.settingName + 'btn',
      id: 'PTTConnect-' + this.settingName
    };
  },

  computed: {
    DisplayOption() {
      return this.optionGroup[this.SettingValue];
    }

  },

  mounted() {
    // console.log(this.description + " mounted", this.settingName, this.SettingValue, this.defaultValue);
    this.$_ConnectDropdownElement_Select(this.SettingValue);
  },

  methods: {
    $_ConnectDropdownElement_Select(newOption) {
      if (newOption > this.optionGroup.length - 1) {
        // console.log(this.description + " set to length - 1", this.optionGroup.length - 1);
        this.SettingValue = this.optionGroup.length - 1;
      } else if (newOption < 0) {
        // console.log(this.description + " set to defaultValue", this.defaultValue);
        this.SettingValue = this.defaultValue;
      } else {
        // console.log(this.description + " set to newOption", newOption);
        this.SettingValue = newOption;
      }

      this.$store.dispatch('set' + this.settingName, this.SettingValue);
    }

  }
});
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectDropdownElement.vue?vue&type=script&lang=js&
 /* harmony default export */ var PluginSettings_ConnectDropdownElementvue_type_script_lang_js_ = (ConnectDropdownElementvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectDropdownElement.vue





/* normalize component */

var ConnectDropdownElement_component = Object(componentNormalizer["a" /* default */])(
  PluginSettings_ConnectDropdownElementvue_type_script_lang_js_,
  ConnectDropdownElementvue_type_template_id_90c6cb84_render,
  ConnectDropdownElementvue_type_template_id_90c6cb84_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectDropdownElement_api; }
ConnectDropdownElement_component.options.__file = "src/app/connect/PluginSettings/ConnectDropdownElement.vue"
/* harmony default export */ var ConnectDropdownElement = (ConnectDropdownElement_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingTheme.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectPluginSettingThemevue_type_script_lang_js_ = ({
  components: {
    'connect-dropdown': ConnectDropdownElement
  },

  data() {
    return {
      ThemeOptions: ['與網站相同', '淺色主題', '深色主題', '使用者自訂']
    };
  },

  computed: {
    ThemeColorBGOptions: function () {
      const array = ['黑色'];

      for (let i = 1; i < 20; i++) array.push(i * 5 + '%');

      array.push('白色');
      return array;
    },
    ThemeColorBorderOptions: function () {
      const array = ['黑色'];

      for (let i = 1; i < 10; i++) array.push(i * 10 + '%');

      array.push('白色');
      return array;
    },
    showThemeColorOption: function () {
      // console.log("showThemeColorOption", (+this.getTheme == 3));
      return +this.getTheme === 3;
    },
    ...Vuex.mapGetters(['getTheme'])
  },
  watch: {
    getTheme(e) {
      if (+e === 3) $(this.$refs.themeColorOption).collapse('show');else $(this.$refs.themeColorOption).collapse('hide');
    }

  },

  mounted() {
    if (+this.getTheme === 3) $(this.$refs.themeColorOption).collapse('show');
  }

});
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingTheme.vue?vue&type=script&lang=js&
 /* harmony default export */ var PluginSettings_ConnectPluginSettingThemevue_type_script_lang_js_ = (ConnectPluginSettingThemevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingTheme.vue





/* normalize component */

var ConnectPluginSettingTheme_component = Object(componentNormalizer["a" /* default */])(
  PluginSettings_ConnectPluginSettingThemevue_type_script_lang_js_,
  ConnectPluginSettingThemevue_type_template_id_49ba112e_render,
  ConnectPluginSettingThemevue_type_template_id_49ba112e_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectPluginSettingTheme_api; }
ConnectPluginSettingTheme_component.options.__file = "src/app/connect/PluginSettings/ConnectPluginSettingTheme.vue"
/* harmony default export */ var ConnectPluginSettingTheme = (ConnectPluginSettingTheme_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectOtherSetting.vue?vue&type=template&id=36a3cbc6&
var ConnectOtherSettingvue_type_template_id_36a3cbc6_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "form-row px-0 mx-0 col-12 my-2",
      attrs: { id: "PTTConnect-OtherSetting" },
    },
    [
      _c("legend", { staticClass: "col-form-label col-3 pt-0" }, [
        _vm._v("\n    其他設定\n  "),
      ]),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "col px-0" },
        [
          _c("connect-plugin-setting-checkbox-element", {
            attrs: {
              "setting-name": "EnableSetNewComment",
              description: "推文功能(使用此功能後果請自負)",
              "default-value": false,
            },
          }),
          _vm._v(" "),
          _c("connect-plugin-setting-checkbox-element", {
            attrs: {
              "setting-name": "DisablePushGray",
              description: "關閉灰色漸變以提升效能",
              "default-value": false,
            },
          }),
          _vm._v(" "),
          _c("plugin-setting-blacklist", {
            attrs: {
              "setting-name": "Blacklist",
              description: "ID黑名單",
              text: "",
            },
          }),
          _vm._v(" "),
          _c("plugin-setting-blacklist", {
            attrs: {
              "setting-name": "CommentBlacklist",
              description: "推文關鍵字黑名單",
              text: "",
            },
          }),
        ],
        1
      ),
    ]
  )
}
var ConnectOtherSettingvue_type_template_id_36a3cbc6_staticRenderFns = []
ConnectOtherSettingvue_type_template_id_36a3cbc6_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectOtherSetting.vue?vue&type=template&id=36a3cbc6&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingBlacklist.vue?vue&type=template&id=f8ae4686&
var ConnectPluginSettingBlacklistvue_type_template_id_f8ae4686_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("connect-plugin-setting-checkbox-element", {
        attrs: {
          "setting-name": "Enable" + _vm.settingName,
          description: "啟用" + _vm.description,
          "default-value": false,
        },
      }),
      _vm._v(" "),
      _c("div", { ref: "isEnable", staticClass: "col collapse" }, [
        _c("textarea", {
          directives: [
            {
              name: "model",
              rawName: "v-model",
              value: _vm.SettingValue,
              expression: "SettingValue",
            },
          ],
          staticClass: "form-control",
          attrs: {
            id: _vm.settingName,
            rows: "5",
            placeholder: "一行一個關鍵字\n想要隱藏舊推文需重新整理",
          },
          domProps: { value: _vm.SettingValue },
          on: {
            change: function ($event) {
              return _vm.$_PluginSetting_valueChange($event)
            },
            input: function ($event) {
              if ($event.target.composing) {
                return
              }
              _vm.SettingValue = $event.target.value
            },
          },
        }),
      ]),
    ],
    1
  )
}
var ConnectPluginSettingBlacklistvue_type_template_id_f8ae4686_staticRenderFns = []
ConnectPluginSettingBlacklistvue_type_template_id_f8ae4686_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingBlacklist.vue?vue&type=template&id=f8ae4686&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectPluginSettingBlacklist.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectPluginSettingBlacklistvue_type_script_lang_js_ = ({
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement
  },
  props: {
    settingName: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: false,
      default: ''
    }
  },

  data() {
    return {
      SettingValue: this.$store.getters['get' + this.settingName]
    };
  },

  computed: {
    isEnable: function () {
      return this.$store.getters['getEnable' + this.settingName];
    }
  },
  watch: {
    isEnable: function (e) {
      $(this.$refs.isEnable).collapse(e ? 'show' : 'hide');
    }
  },

  mounted() {
    if (this.isEnable) $(this.$refs.isEnable).collapse('show');
  },

  methods: {
    $_PluginSetting_valueChange: function () {
      this.$store.dispatch('set' + this.settingName, this.SettingValue);
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingBlacklist.vue?vue&type=script&lang=js&
 /* harmony default export */ var PluginSettings_ConnectPluginSettingBlacklistvue_type_script_lang_js_ = (ConnectPluginSettingBlacklistvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectPluginSettingBlacklist.vue





/* normalize component */

var ConnectPluginSettingBlacklist_component = Object(componentNormalizer["a" /* default */])(
  PluginSettings_ConnectPluginSettingBlacklistvue_type_script_lang_js_,
  ConnectPluginSettingBlacklistvue_type_template_id_f8ae4686_render,
  ConnectPluginSettingBlacklistvue_type_template_id_f8ae4686_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectPluginSettingBlacklist_api; }
ConnectPluginSettingBlacklist_component.options.__file = "src/app/connect/PluginSettings/ConnectPluginSettingBlacklist.vue"
/* harmony default export */ var ConnectPluginSettingBlacklist = (ConnectPluginSettingBlacklist_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/PluginSettings/ConnectOtherSetting.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var ConnectOtherSettingvue_type_script_lang_js_ = ({
  components: {
    'connect-plugin-setting-checkbox-element': ConnectPluginSettingCheckboxElement,
    'plugin-setting-blacklist': ConnectPluginSettingBlacklist
  }
});
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectOtherSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var PluginSettings_ConnectOtherSettingvue_type_script_lang_js_ = (ConnectOtherSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/PluginSettings/ConnectOtherSetting.vue





/* normalize component */

var ConnectOtherSetting_component = Object(componentNormalizer["a" /* default */])(
  PluginSettings_ConnectOtherSettingvue_type_script_lang_js_,
  ConnectOtherSettingvue_type_template_id_36a3cbc6_render,
  ConnectOtherSettingvue_type_template_id_36a3cbc6_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectOtherSetting_api; }
ConnectOtherSetting_component.options.__file = "src/app/connect/PluginSettings/ConnectOtherSetting.vue"
/* harmony default export */ var ConnectOtherSetting = (ConnectOtherSetting_component.exports);
// EXTERNAL MODULE: ./src/app/connect/PluginSettings/ConnectNewVersion.vue
var ConnectNewVersion = __webpack_require__(11);

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectPluginSetting.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//





/* harmony default export */ var ConnectPluginSettingvue_type_script_lang_js_ = ({
  components: {
    'connect-component-title': ConnectComponentTitle,
    'connect-plugin-setting-input-element': ConnectPluginSettingInputElement,
    'connect-plugin-setting-theme': ConnectPluginSettingTheme,
    'connect-other-setting': ConnectOtherSetting,
    'connect-new-version': ConnectNewVersion["default"]
  },
  computed: { ...Vuex.mapGetters(['siteName'])
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectPluginSetting.vue?vue&type=script&lang=js&
 /* harmony default export */ var connect_ConnectPluginSettingvue_type_script_lang_js_ = (ConnectPluginSettingvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/ConnectPluginSetting.vue





/* normalize component */

var ConnectPluginSetting_component = Object(componentNormalizer["a" /* default */])(
  connect_ConnectPluginSettingvue_type_script_lang_js_,
  ConnectPluginSettingvue_type_template_id_a1596a02_render,
  ConnectPluginSettingvue_type_template_id_a1596a02_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var ConnectPluginSetting_api; }
ConnectPluginSetting_component.options.__file = "src/app/connect/ConnectPluginSetting.vue"
/* harmony default export */ var ConnectPluginSetting = (ConnectPluginSetting_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/Connect.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var Connectvue_type_script_lang_js_ = ({
  components: {
    'connect-connect-setting': ConnectConnectSetting,
    'connect-plugin-setting': ConnectPluginSetting
  }
});
// CONCATENATED MODULE: ./src/app/connect/Connect.vue?vue&type=script&lang=js&
 /* harmony default export */ var connect_Connectvue_type_script_lang_js_ = (Connectvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/connect/Connect.vue





/* normalize component */

var Connect_component = Object(componentNormalizer["a" /* default */])(
  connect_Connectvue_type_script_lang_js_,
  Connectvue_type_template_id_77cac6ee_render,
  Connectvue_type_template_id_77cac6ee_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var Connect_api; }
Connect_component.options.__file = "src/app/connect/Connect.vue"
/* harmony default export */ var Connect = (Connect_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectAlert.vue?vue&type=template&id=0caf7f3e&scoped=true&
var ConnectAlertvue_type_template_id_0caf7f3e_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "position-relative container",
      attrs: { id: "PTTChat-contents-Connect-alert" },
    },
    [
      _c(
        "transition-group",
        { attrs: { name: "list-alert", tag: "div" } },
        _vm._l(_vm.alertlist, function (item) {
          return _c("connect-alert-item", {
            key: item.no,
            attrs: { alert: item },
            on: {
              destroyalert: function ($event) {
                return _vm.removeAlert(item)
              },
            },
          })
        }),
        1
      ),
    ],
    1
  )
}
var ConnectAlertvue_type_template_id_0caf7f3e_scoped_true_staticRenderFns = []
ConnectAlertvue_type_template_id_0caf7f3e_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectAlert.vue?vue&type=template&id=0caf7f3e&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectAlertItem.vue?vue&type=template&id=e3224c1e&scoped=true&
var ConnectAlertItemvue_type_template_id_e3224c1e_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: _vm.className, attrs: { role: "alert", count: _vm.dismissCount } },
    [_vm._v("\n  " + _vm._s(_vm.alert.msg) + "\n")]
  )
}
var ConnectAlertItemvue_type_template_id_e3224c1e_scoped_true_staticRenderFns = []
ConnectAlertItemvue_type_template_id_e3224c1e_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/connect/ConnectAlertItem.vue?vue&type=template&id=e3224c1e&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectAlertItem.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var ConnectAlertItemvue_type_script_lang_js_ = ({
  props: {
    alert: {
      type: Object,
      required: true
    }
  },

  data() {
    return {
      dismissCount: 2,
      timerInterval: null
    };
  },

  computed: {
    className: function () {
      const classes = ['alert', 'mt-3', 'fade', 'show'];

      if (this.alert.type === 0) {
        classes.push('alert-danger');
      } else if (this.alert.type === 1) {
        classes.push('alert-warning');
      } else if (this.alert.type === 2) {
        classes.push('alert-success');
      }

      return classes.join(' ');
    }
  },

  mounted() {
    this.timerInterval = setTimeout(this.destroy, this.dismissCount * 1000);
  },

  methods: {
    CountDown: function () {
      this.dismissCount--;

      if (this.dismissCount <= 0) {
        this.destroy();
      }
    },
    destroy: function () {
      this.$emit('destroyalert');
    }
  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectAlertItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var connect_ConnectAlertItemvue_type_script_lang_js_ = (ConnectAlertItemvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/app/connect/ConnectAlertItem.vue?vue&type=style&index=0&id=e3224c1e&lang=scss&scoped=true&
var ConnectAlertItemvue_type_style_index_0_id_e3224c1e_lang_scss_scoped_true_ = __webpack_require__(13);

// CONCATENATED MODULE: ./src/app/connect/ConnectAlertItem.vue






/* normalize component */

var ConnectAlertItem_component = Object(componentNormalizer["a" /* default */])(
  connect_ConnectAlertItemvue_type_script_lang_js_,
  ConnectAlertItemvue_type_template_id_e3224c1e_scoped_true_render,
  ConnectAlertItemvue_type_template_id_e3224c1e_scoped_true_staticRenderFns,
  false,
  null,
  "e3224c1e",
  null
  
)

/* hot reload */
if (false) { var ConnectAlertItem_api; }
ConnectAlertItem_component.options.__file = "src/app/connect/ConnectAlertItem.vue"
/* harmony default export */ var ConnectAlertItem = (ConnectAlertItem_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/connect/ConnectAlert.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var ConnectAlertvue_type_script_lang_js_ = ({
  components: {
    'connect-alert-item': ConnectAlertItem
  },
  inject: ['msg'],

  data() {
    return {
      serialNumber: 0,
      alert: []
    };
  },

  computed: {
    alertlist: function () {
      return this.Alert.length > 0 ? this.addAlert(this.Alert) : this.alert;
    },
    ...Vuex.mapGetters(['Alert'])
  },

  mounted() {
    this.msg.alert = data => {
      this.$store.dispatch('Alert', {
        type: data.type,
        msg: data.msg
      });

      if (false) {}
    };

    this.alert = [];
  },

  methods: {
    removeAlert(item) {
      const index = this.alert.indexOf(item);
      this.alert.splice(index, 1);
    },

    addAlert(items) {
      for (let i = 0; i < items.length; i++) {
        items[i].no = this.serialNumber;
        this.serialNumber++;
      }

      this.alert = this.alert.concat(items);
      this.$store.dispatch('ClearAlert');
      return this.alert;
    }

  }
});
// CONCATENATED MODULE: ./src/app/connect/ConnectAlert.vue?vue&type=script&lang=js&
 /* harmony default export */ var connect_ConnectAlertvue_type_script_lang_js_ = (ConnectAlertvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/app/connect/ConnectAlert.vue?vue&type=style&index=0&id=0caf7f3e&lang=scss&scoped=true&
var ConnectAlertvue_type_style_index_0_id_0caf7f3e_lang_scss_scoped_true_ = __webpack_require__(15);

// CONCATENATED MODULE: ./src/app/connect/ConnectAlert.vue






/* normalize component */

var ConnectAlert_component = Object(componentNormalizer["a" /* default */])(
  connect_ConnectAlertvue_type_script_lang_js_,
  ConnectAlertvue_type_template_id_0caf7f3e_scoped_true_render,
  ConnectAlertvue_type_template_id_0caf7f3e_scoped_true_staticRenderFns,
  false,
  null,
  "0caf7f3e",
  null
  
)

/* hot reload */
if (false) { var ConnectAlert_api; }
ConnectAlert_component.options.__file = "src/app/connect/ConnectAlert.vue"
/* harmony default export */ var ConnectAlert = (ConnectAlert_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/other/Other.vue?vue&type=template&id=36856bfa&scoped=true&
var Othervue_type_template_id_36856bfa_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { class: _vm.Classes, attrs: { id: "PTTChat-contents-other-main" } },
    [
      _c("other-title", { attrs: { title: "使用教學" } }),
      _vm._v(" "),
      _c("pre", { staticClass: "mt-1 mb-0 ml-5" }, [
        _vm._v(
          "1.輸入帳號與密碼登入PTT\n2.輸入包含看板名稱的AID或是搜尋功能找到想要的文章\n3.最近的搜尋紀錄都會記錄在下拉式選單\n  點選鎖頭可以將蒐尋紀錄永久保存\n    "
        ),
      ]),
      _vm._v(" "),
      _c("other-title", { attrs: { title: "文章搜尋功能" } }),
      _vm._v(" "),
      _c("pre", { staticClass: "mt-1 mb-0 ml-5" }, [
        _vm._v(
          '搜尋規則為[看板名稱,搜尋指令+關鍵字,搜尋指令+關鍵字]\n範例:C_Chat,/間直播,Z5\n在C_Chat板搜尋標題含有"間直播"\n且推文數5以上最新的一篇文章\n\n最多可以搜尋兩次, 可以搜尋的種類有:\n#:AID搜尋    /或?:標題搜尋 a:作者搜尋\nZ:推文數搜尋  G:標記搜尋   A:稿酬搜尋\n!:排除關鍵字(僅限第二次搜尋時使用)\n    '
        ),
      ]),
      _vm._v(" "),
      _c("other-title", { attrs: { title: "相關連結" } }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "text-center" },
        [
          _c("other-button", {
            attrs: {
              id: "home",
              href: "https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage",
              title: "腳本介紹",
            },
          }),
          _vm._v(" "),
          _c("other-button", {
            attrs: {
              id: "github",
              href: "https://github.com/zoosewu/PTTChatOnYoutube/tree/master",
              title: "Github",
            },
          }),
          _vm._v(" "),
          _c("other-button", {
            attrs: {
              id: "greasyfork",
              href: "https://greasyfork.org/zh-TW/scripts/418469-youtubechatonptt",
              title: "GreasyFork",
            },
          }),
          _vm._v(" "),
          _c("other-button", {
            attrs: {
              id: "donate",
              href: "https://qr.opay.tw/eZHf2",
              title: "贊助",
            },
          }),
        ],
        1
      ),
      _vm._v(" "),
      _c("other-title", { attrs: { title: "聲明" } }),
      _vm._v(" "),
      _c("pre", { staticClass: "text-center mt-1 mb-0" }, [
        _vm._v(
          "本套件僅做PTT與Google的連線\n除此之外並不會連到任何伺服器\n\n所有程式碼都沒有做任何的壓縮或混淆\n在greasyfork、github以及你的瀏覽器\n都有完整的程式碼以供任何人檢視\n請確保瀏覽實況或紀錄檔時\n沒有任何其他PTT的腳本同時啟用\n如果有的話請參閱完整網站說明並跟著操作\n\n本套件盡可能保證套件在操作PTT時的安全性\n並盡可能避免帳號資訊在傳輸過程中被第三方所竊取\n\n任何使用套件的人士 須自行承擔一切風險\n本人不會負責任何因使用此套件所造成的任何形式的損失\n\n使用本套件所造成任何形式的帳號損害\n包含但不限於帳號遭到竊取、推文而招致水桶或帳號註銷\n本人一概不負責\nZoosewu\n    "
        ),
      ]),
    ],
    1
  )
}
var Othervue_type_template_id_36856bfa_scoped_true_staticRenderFns = []
Othervue_type_template_id_36856bfa_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/other/Other.vue?vue&type=template&id=36856bfa&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/other/OtherTitle.vue?vue&type=template&id=23a846a4&
var OtherTitlevue_type_template_id_23a846a4_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [
    _c("h4", { staticClass: "text-center mt-3 mb-1" }, [
      _vm._v("\n    " + _vm._s(_vm.title) + "\n  "),
    ]),
    _vm._v(" "),
    _c("hr", { staticClass: "mt-1 mb-2" }),
  ])
}
var OtherTitlevue_type_template_id_23a846a4_staticRenderFns = []
OtherTitlevue_type_template_id_23a846a4_render._withStripped = true


// CONCATENATED MODULE: ./src/app/other/OtherTitle.vue?vue&type=template&id=23a846a4&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/other/OtherTitle.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
/* harmony default export */ var OtherTitlevue_type_script_lang_js_ = ({
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/app/other/OtherTitle.vue?vue&type=script&lang=js&
 /* harmony default export */ var other_OtherTitlevue_type_script_lang_js_ = (OtherTitlevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/other/OtherTitle.vue





/* normalize component */

var OtherTitle_component = Object(componentNormalizer["a" /* default */])(
  other_OtherTitlevue_type_script_lang_js_,
  OtherTitlevue_type_template_id_23a846a4_render,
  OtherTitlevue_type_template_id_23a846a4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var OtherTitle_api; }
OtherTitle_component.options.__file = "src/app/other/OtherTitle.vue"
/* harmony default export */ var OtherTitle = (OtherTitle_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/other/OtherButton.vue?vue&type=template&id=590274cc&
var OtherButtonvue_type_template_id_590274cc_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "a",
    {
      staticClass: "btn ptt-btnoutline m-2",
      attrs: {
        id: "other-button-" + _vm.id,
        href: _vm.href,
        target: "_blank",
        rel: "noopener noreferrer",
        role: "button",
      },
    },
    [_vm._v(_vm._s(_vm.title))]
  )
}
var OtherButtonvue_type_template_id_590274cc_staticRenderFns = []
OtherButtonvue_type_template_id_590274cc_render._withStripped = true


// CONCATENATED MODULE: ./src/app/other/OtherButton.vue?vue&type=template&id=590274cc&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/other/OtherButton.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var OtherButtonvue_type_script_lang_js_ = ({
  props: {
    id: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/app/other/OtherButton.vue?vue&type=script&lang=js&
 /* harmony default export */ var other_OtherButtonvue_type_script_lang_js_ = (OtherButtonvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/other/OtherButton.vue





/* normalize component */

var OtherButton_component = Object(componentNormalizer["a" /* default */])(
  other_OtherButtonvue_type_script_lang_js_,
  OtherButtonvue_type_template_id_590274cc_render,
  OtherButtonvue_type_template_id_590274cc_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var OtherButton_api; }
OtherButton_component.options.__file = "src/app/other/OtherButton.vue"
/* harmony default export */ var OtherButton = (OtherButton_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/other/Other.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var Othervue_type_script_lang_js_ = ({
  components: {
    'other-title': OtherTitle,
    'other-button': OtherButton
  },
  inject: ['nowPluginWidth'],
  computed: {
    Classes: function () {
      const classes = ['container'];

      if (this.nowPluginWidth < 399) {
        classes.push('px-0');
      } else {
        classes.push('px-5');
      }

      return classes.join(' ');
    }
  }
});
// CONCATENATED MODULE: ./src/app/other/Other.vue?vue&type=script&lang=js&
 /* harmony default export */ var other_Othervue_type_script_lang_js_ = (Othervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/other/Other.vue





/* normalize component */

var Other_component = Object(componentNormalizer["a" /* default */])(
  other_Othervue_type_script_lang_js_,
  Othervue_type_template_id_36856bfa_scoped_true_render,
  Othervue_type_template_id_36856bfa_scoped_true_staticRenderFns,
  false,
  null,
  "36856bfa",
  null
  
)

/* hot reload */
if (false) { var Other_api; }
Other_component.options.__file = "src/app/other/Other.vue"
/* harmony default export */ var Other = (Other_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/ptt/PttScreen.vue?vue&type=template&id=08c78d86&
var PttScreenvue_type_template_id_08c78d86_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "h-100 d-flex justify-content-center px-0",
      attrs: { id: "PTTChat-contents-PTT-main" },
    },
    [_c("ptt-screen-iframe", { key: _vm.getInstancePTTID, ref: "ifm" })],
    1
  )
}
var PttScreenvue_type_template_id_08c78d86_staticRenderFns = []
PttScreenvue_type_template_id_08c78d86_render._withStripped = true


// CONCATENATED MODULE: ./src/app/ptt/PttScreen.vue?vue&type=template&id=08c78d86&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/ptt/PttScreenIframe.vue?vue&type=template&id=6ae2e06c&scoped=true&
var PttScreenIframevue_type_template_id_6ae2e06c_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return !_vm.removePttFrame
    ? _c(
        "iframe",
        {
          staticClass: "h-100 flex-grow-1",
          attrs: { id: "PTTframe", src: _vm.src },
        },
        [_vm._v("你的瀏覽器不支援 iframe")]
      )
    : _vm._e()
}
var PttScreenIframevue_type_template_id_6ae2e06c_scoped_true_staticRenderFns = []
PttScreenIframevue_type_template_id_6ae2e06c_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/ptt/PttScreenIframe.vue?vue&type=template&id=6ae2e06c&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/ptt/PttScreenIframe.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
/* harmony default export */ var PttScreenIframevue_type_script_lang_js_ = ({
  inject: ['msg'],

  data() {
    return {
      src: '//term.ptt.cc/?url=' + this.msg.ownerorigin,
      removePttFrame: false
    };
  },

  mounted() {
    if (this.msg.ownerorigin === 'https://holodex.net') {
      this.removePttFrame = true;
      this.$nextTick(function () {
        const t = setInterval(() => {
          if (document.getElementById('PTTframe') !== null) {
            this.msg.targetWindow = document.getElementById('PTTframe').contentWindow;
            clearInterval(t);
          }
        }, 200);
      });
    } else {
      this.msg.targetWindow = this.$el.contentWindow;
    }

    window.addEventListener('beforeunload', this.removeiframe);
  },

  beforeDestroy() {
    window.removeEventListener('beforeunload', this.removeiframe);
  },

  methods: {
    removeiframe: function (event) {
      if (this.msg.ownerorigin === 'https://holodex.net') {
        document.getElementById('PTTframe').parentElement.remove();
      } else {
        this.$el.parentNode.removeChild(this.$el);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/app/ptt/PttScreenIframe.vue?vue&type=script&lang=js&
 /* harmony default export */ var ptt_PttScreenIframevue_type_script_lang_js_ = (PttScreenIframevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/app/ptt/PttScreenIframe.vue?vue&type=style&index=0&id=6ae2e06c&lang=scss&scoped=true&
var PttScreenIframevue_type_style_index_0_id_6ae2e06c_lang_scss_scoped_true_ = __webpack_require__(17);

// CONCATENATED MODULE: ./src/app/ptt/PttScreenIframe.vue






/* normalize component */

var PttScreenIframe_component = Object(componentNormalizer["a" /* default */])(
  ptt_PttScreenIframevue_type_script_lang_js_,
  PttScreenIframevue_type_template_id_6ae2e06c_scoped_true_render,
  PttScreenIframevue_type_template_id_6ae2e06c_scoped_true_staticRenderFns,
  false,
  null,
  "6ae2e06c",
  null
  
)

/* hot reload */
if (false) { var PttScreenIframe_api; }
PttScreenIframe_component.options.__file = "src/app/ptt/PttScreenIframe.vue"
/* harmony default export */ var PttScreenIframe = (PttScreenIframe_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/ptt/PttScreen.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var PttScreenvue_type_script_lang_js_ = ({
  components: {
    'ptt-screen-iframe': PttScreenIframe
  },
  computed: { ...Vuex.mapGetters(['getInstancePTTID'])
  }
});
// CONCATENATED MODULE: ./src/app/ptt/PttScreen.vue?vue&type=script&lang=js&
 /* harmony default export */ var ptt_PttScreenvue_type_script_lang_js_ = (PttScreenvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/ptt/PttScreen.vue





/* normalize component */

var PttScreen_component = Object(componentNormalizer["a" /* default */])(
  ptt_PttScreenvue_type_script_lang_js_,
  PttScreenvue_type_template_id_08c78d86_render,
  PttScreenvue_type_template_id_08c78d86_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PttScreen_api; }
PttScreen_component.options.__file = "src/app/ptt/PttScreen.vue"
/* harmony default export */ var PttScreen = (PttScreen_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/Log.vue?vue&type=template&id=1d5d09bc&scoped=true&
var Logvue_type_template_id_1d5d09bc_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    {
      staticClass: "flex-grow-1 overflow-auto h-100 w-100 mx-0 row",
      staticStyle: { "overscroll-behavior": "contain" },
      attrs: { id: "PTTChat-contents-log-main" },
    },
    [
      _c(
        "table",
        { staticClass: "table ptt-bg" },
        [
          _c(
            "tbody",
            { staticClass: "ptt-text" },
            [
              _c("log-item", {
                attrs: { "item-title": "PTT狀態", "item-type": "pttState" },
              }),
              _vm._v(" "),
              _c("log-title", { attrs: { title: "文章資訊" } }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "文章標題",
                  "item-type": "postTitle",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "搜尋代碼",
                  "item-type": "postKey",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "已獲取推文數",
                  "item-type": "postCommentCount",
                  "second-item-title": "結尾行數",
                  "second-item-type": "postEndLine",
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "發文時間",
                  "item-type": "postDate",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "最後推文時間",
                  "item-type": "postLastCommentTime",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-title", { attrs: { title: "影片資訊" } }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "影片類型",
                  "item-type": "videoType",
                  "second-item-title": "",
                  "second-item-type": "",
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "開台時間",
                  "item-type": "videoStartTime",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "關台時間",
                  "item-type": "videoEndTime",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "影片播放時間",
                  "item-type": "videoPlayedTime",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "影片當下時間",
                  "item-type": "videoCurrentTime",
                  "item-col-span": 3,
                },
              }),
              _vm._v(" "),
              _c("log-title", { attrs: { title: "套件狀態" } }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "主題顏色",
                  "item-type": "themeColor",
                  "second-item-title": " ",
                  "second-item-type": " ",
                },
              }),
              _vm._v(" "),
              _c("log-item", {
                attrs: {
                  "item-title": "目標推文樓數",
                  "item-type": "commentIndex",
                  "second-item-title": "目標捲動高度",
                  "second-item-type": "targetScrollHeight",
                },
              }),
            ],
            1
          ),
          _vm._v(" "),
          _c("log-recent-alert"),
        ],
        1
      ),
    ]
  )
}
var Logvue_type_template_id_1d5d09bc_scoped_true_staticRenderFns = []
Logvue_type_template_id_1d5d09bc_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/log/Log.vue?vue&type=template&id=1d5d09bc&scoped=true&

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/LogItem.vue?vue&type=template&id=182843d5&scoped=true&
var LogItemvue_type_template_id_182843d5_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("tr", [
    _c("th", { attrs: { colspan: "1", scope: "row" } }, [
      _vm._v("\n    " + _vm._s(_vm.item1Title) + "\n  "),
    ]),
    _vm._v(" "),
    _c("td", { attrs: { colspan: _vm.item1ColSpan } }, [
      _vm._v("\n    " + _vm._s(_vm.item1Data) + "\n  "),
    ]),
    _vm._v(" "),
    _vm.secondItemTitle
      ? _c("th", { attrs: { scope: "row" } }, [
          _vm._v("\n    " + _vm._s(_vm.item2Title) + "\n  "),
        ])
      : _vm._e(),
    _vm._v(" "),
    _vm.secondItemTitle
      ? _c("td", [_vm._v("\n    " + _vm._s(_vm.item2Data) + "\n  ")])
      : _vm._e(),
  ])
}
var LogItemvue_type_template_id_182843d5_scoped_true_staticRenderFns = []
LogItemvue_type_template_id_182843d5_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/log/LogItem.vue?vue&type=template&id=182843d5&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/LogItem.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var LogItemvue_type_script_lang_js_ = ({
  props: {
    itemTitle: {
      type: String,
      required: true
    },
    itemType: {
      type: String,
      required: true
    },
    itemColSpan: {
      type: Number,
      required: false,
      default: 3
    },
    secondItemTitle: {
      type: String,
      required: false,
      default: ''
    },
    secondItemType: {
      type: String,
      required: false,
      default: ''
    }
  },

  data() {
    return {
      item1Title: this.itemTitle,
      i1Data: '--',
      i2Data: ''
    };
  },

  computed: {
    item1ColSpan: function () {
      if (this.secondItemTitle) return 1;else return this.itemColSpan ? Math.min(this.itemColSpan, 3) : 1;
    },
    item2Title: function () {
      return this.secondItemTitle ? this.secondItemTitle : '';
    },
    item1Data: function () {
      let i = 0;

      for (; i < this.newLog.length; i++) {
        if (this.newLog[i].type === this.itemType) break;
      } // console.log('computed', this.itemType, this.newLog[i], i)


      return i < this.newLog.length ? this.$_LogItem_updateLog1(this.newLog[i].data) : this.i1Data;
    },
    item2Data: function () {
      let i = 0;

      for (; i < this.newLog.length; i++) {
        if (this.newLog[i].type === this.secondItemType) break;
      } // console.log('computed', this.secondItemType, this.newLog[i], i)


      return i < this.newLog.length ? this.$_LogItem_updateLog2(this.newLog[i].data) : this.i2Data;
    },
    ...Vuex.mapGetters(['newLog'])
  },

  mounted() {// if (showAllLog) console.log('LogItem', this.itemTitle, this.itemType, this.itemColSpan, this.secondItemTitle, this.secondItemType)
  },

  methods: {
    $_LogItem_updateLog1: function (data) {
      this.i1Data = data;
      this.$store.dispatch('removeLog', this.itemType);
      return this.i1Data;
    },
    $_LogItem_updateLog2: function (data) {
      this.i2Data = data;
      this.$store.dispatch('removeLog', this.secondItemType);
      return this.i2Data;
    }
  }
});
// CONCATENATED MODULE: ./src/app/log/LogItem.vue?vue&type=script&lang=js&
 /* harmony default export */ var log_LogItemvue_type_script_lang_js_ = (LogItemvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/log/LogItem.vue





/* normalize component */

var LogItem_component = Object(componentNormalizer["a" /* default */])(
  log_LogItemvue_type_script_lang_js_,
  LogItemvue_type_template_id_182843d5_scoped_true_render,
  LogItemvue_type_template_id_182843d5_scoped_true_staticRenderFns,
  false,
  null,
  "182843d5",
  null
  
)

/* hot reload */
if (false) { var LogItem_api; }
LogItem_component.options.__file = "src/app/log/LogItem.vue"
/* harmony default export */ var LogItem = (LogItem_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/LogTitle.vue?vue&type=template&id=2059f2f4&
var LogTitlevue_type_template_id_2059f2f4_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "th",
    {
      staticClass: "text-center bg-secondary text-white",
      attrs: { colspan: "4" },
    },
    [_vm._v("\n  " + _vm._s(_vm.title) + "\n")]
  )
}
var LogTitlevue_type_template_id_2059f2f4_staticRenderFns = []
LogTitlevue_type_template_id_2059f2f4_render._withStripped = true


// CONCATENATED MODULE: ./src/app/log/LogTitle.vue?vue&type=template&id=2059f2f4&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/LogTitle.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var LogTitlevue_type_script_lang_js_ = ({
  props: {
    title: {
      type: String,
      required: true
    }
  }
});
// CONCATENATED MODULE: ./src/app/log/LogTitle.vue?vue&type=script&lang=js&
 /* harmony default export */ var log_LogTitlevue_type_script_lang_js_ = (LogTitlevue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/log/LogTitle.vue





/* normalize component */

var LogTitle_component = Object(componentNormalizer["a" /* default */])(
  log_LogTitlevue_type_script_lang_js_,
  LogTitlevue_type_template_id_2059f2f4_render,
  LogTitlevue_type_template_id_2059f2f4_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var LogTitle_api; }
LogTitle_component.options.__file = "src/app/log/LogTitle.vue"
/* harmony default export */ var LogTitle = (LogTitle_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/LogRecentAlert.vue?vue&type=template&id=686fda22&scoped=true&
var LogRecentAlertvue_type_template_id_686fda22_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "tbody",
    { staticClass: "ptt-text", attrs: { alertcount: _vm.alertcount } },
    [
      _c("log-title", { attrs: { title: "近期訊息" } }),
      _vm._v(" "),
      _vm._l(_vm.alertlist, function (item) {
        return _c("tr", { key: item.no }, [
          _c("th", { attrs: { colspan: "4", scope: "row" } }, [
            _vm._v("\n      " + _vm._s(item.type + ":" + item.msg) + "\n    "),
          ]),
        ])
      }),
    ],
    2
  )
}
var LogRecentAlertvue_type_template_id_686fda22_scoped_true_staticRenderFns = []
LogRecentAlertvue_type_template_id_686fda22_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/log/LogRecentAlert.vue?vue&type=template&id=686fda22&scoped=true&

// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/LogRecentAlert.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var LogRecentAlertvue_type_script_lang_js_ = ({
  components: {
    'log-title': LogTitle
  },

  data() {
    return {
      alertlist: []
    };
  },

  computed: {
    alertcount: function () {
      let i = 0;

      for (; i < this.newLog.length; i++) {
        if (this.newLog[i].type === 'Alert') break;
      }

      return i < this.newLog.length ? this.$_LogItem_updateLog1(this.newLog[i].data).length : this.alertlist.length;
    },
    ...Vuex.mapGetters(['newLog'])
  },
  methods: {
    $_LogItem_updateLog1: function (data) {
      const alertObject = {
        msg: data.msg
      };

      switch (data.type) {
        case 0:
          alertObject.type = '錯誤';
          break;

        case 1:
          alertObject.type = '警告';
          break;

        case 2:
          alertObject.type = '訊息';
          break;

        default:
          break;
      }

      this.alertlist.unshift(alertObject);
      if (this.alertlist.length > 10) this.alertlist.pop();
      this.$store.dispatch('removeLog', 'Alert');
      return this.alertlist;
    }
  }
});
// CONCATENATED MODULE: ./src/app/log/LogRecentAlert.vue?vue&type=script&lang=js&
 /* harmony default export */ var log_LogRecentAlertvue_type_script_lang_js_ = (LogRecentAlertvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/log/LogRecentAlert.vue





/* normalize component */

var LogRecentAlert_component = Object(componentNormalizer["a" /* default */])(
  log_LogRecentAlertvue_type_script_lang_js_,
  LogRecentAlertvue_type_template_id_686fda22_scoped_true_render,
  LogRecentAlertvue_type_template_id_686fda22_scoped_true_staticRenderFns,
  false,
  null,
  "686fda22",
  null
  
)

/* hot reload */
if (false) { var LogRecentAlert_api; }
LogRecentAlert_component.options.__file = "src/app/log/LogRecentAlert.vue"
/* harmony default export */ var LogRecentAlert = (LogRecentAlert_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/log/Log.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var Logvue_type_script_lang_js_ = ({
  components: {
    'log-item': LogItem,
    'log-title': LogTitle,
    'log-recent-alert': LogRecentAlert
  },
  inject: ['msg'],

  mounted() {
    this.msg.updateLog = data => {
      if (false) {}

      this.$store.dispatch('updateLog', data);
    };
  }

});
// CONCATENATED MODULE: ./src/app/log/Log.vue?vue&type=script&lang=js&
 /* harmony default export */ var log_Logvue_type_script_lang_js_ = (Logvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/log/Log.vue





/* normalize component */

var Log_component = Object(componentNormalizer["a" /* default */])(
  log_Logvue_type_script_lang_js_,
  Logvue_type_template_id_1d5d09bc_scoped_true_render,
  Logvue_type_template_id_1d5d09bc_scoped_true_staticRenderFns,
  false,
  null,
  "1d5d09bc",
  null
  
)

/* hot reload */
if (false) { var Log_api; }
Log_component.options.__file = "src/app/log/Log.vue"
/* harmony default export */ var Log = (Log_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppContent.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//






/* harmony default export */ var PttAppContentvue_type_script_lang_js_ = ({
  components: {
    'PTTApp-Chat': Chat,
    'PTTApp-Alert': ConnectAlert,
    'PTTApp-Connect': Connect,
    'PTTApp-Other': Other,
    'PTTApp-PTT': PttScreen,
    'PTTApp-Log': Log
  },
  computed: {
    updateheight() {
      return {
        height: this.$store.getters.getPluginHeight + 'px',
        overflow: 'hidden overlay'
      };
    }

  }
});
// CONCATENATED MODULE: ./src/app/PttAppContent.vue?vue&type=script&lang=js&
 /* harmony default export */ var app_PttAppContentvue_type_script_lang_js_ = (PttAppContentvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/PttAppContent.vue





/* normalize component */

var PttAppContent_component = Object(componentNormalizer["a" /* default */])(
  app_PttAppContentvue_type_script_lang_js_,
  PttAppContentvue_type_template_id_0538b1de_render,
  PttAppContentvue_type_template_id_0538b1de_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PttAppContent_api; }
PttAppContent_component.options.__file = "src/app/PttAppContent.vue"
/* harmony default export */ var PttAppContent = (PttAppContent_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppMain.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ var PttAppMainvue_type_script_lang_js_ = ({
  components: {
    PTTAppNav: PttAppNav,
    PTTAppContent: PttAppContent
  }
});
// CONCATENATED MODULE: ./src/app/PttAppMain.vue?vue&type=script&lang=js&
 /* harmony default export */ var app_PttAppMainvue_type_script_lang_js_ = (PttAppMainvue_type_script_lang_js_); 
// CONCATENATED MODULE: ./src/app/PttAppMain.vue





/* normalize component */

var PttAppMain_component = Object(componentNormalizer["a" /* default */])(
  app_PttAppMainvue_type_script_lang_js_,
  PttAppMainvue_type_template_id_1e5ddf51_render,
  PttAppMainvue_type_template_id_1e5ddf51_staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var PttAppMain_api; }
PttAppMain_component.options.__file = "src/app/PttAppMain.vue"
/* harmony default export */ var PttAppMain = (PttAppMain_component.exports);
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttApp.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//

/* harmony default export */ var PttAppvue_type_script_lang_js_ = ({
  components: {
    PTTAppMain: PttAppMain
  },

  mouted() {
    GM_deleteValue('PostAID');
  }

});
// CONCATENATED MODULE: ./src/app/PttApp.vue?vue&type=script&lang=js&
 /* harmony default export */ var app_PttAppvue_type_script_lang_js_ = (PttAppvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/app/PttApp.vue?vue&type=style&index=0&id=3692ac10&lang=scss&scoped=true&
var PttAppvue_type_style_index_0_id_3692ac10_lang_scss_scoped_true_ = __webpack_require__(19);

// CONCATENATED MODULE: ./src/app/PttApp.vue






/* normalize component */

var PttApp_component = Object(componentNormalizer["a" /* default */])(
  app_PttAppvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "3692ac10",
  null
  
)

/* hot reload */
if (false) { var PttApp_api; }
PttApp_component.options.__file = "src/app/PttApp.vue"
/* harmony default export */ var PttApp = (PttApp_component.exports);
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppButton.vue?vue&type=template&id=3700bc4a&scoped=true&
var PttAppButtonvue_type_template_id_3700bc4a_scoped_true_render = function () {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "a",
    {
      staticClass: "btn btn-lg ptt-btnoutline position-absolute openpttchat",
      attrs: {
        id: "PTTMainBtn",
        type: "button",
        "data-toggle": "collapse",
        "data-target": "#PTTMain",
        "aria-expanded": "false",
        "aria-controls": "PTTMain",
      },
      on: {
        click: function ($event) {
          if ($event.target !== $event.currentTarget) {
            return null
          }
          return _vm.$_PttAppButton_Openpttchat()
        },
      },
    },
    [_vm._v("P")]
  )
}
var PttAppButtonvue_type_template_id_3700bc4a_scoped_true_staticRenderFns = []
PttAppButtonvue_type_template_id_3700bc4a_scoped_true_render._withStripped = true


// CONCATENATED MODULE: ./src/app/PttAppButton.vue?vue&type=template&id=3700bc4a&scoped=true&

// CONCATENATED MODULE: ./src/ga/useExtensionEvent.js

/* harmony default export */ var useExtensionEvent = (function () {
  const useExtensionEventTime = 'useExtensionEventTime';
  const lastEventTime = +GM_getValue(useExtensionEventTime, 0);
  const now = Date.now();

  if (now - lastEventTime >= 1000 * 60 * 60 * 24) {
    GM_setValue(useExtensionEventTime, now);
    setvalue({
      event: 'useExtension'
    });
  }
});
// CONCATENATED MODULE: ./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/app/PttAppButton.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ var PttAppButtonvue_type_script_lang_js_ = ({
  methods: {
    $_PttAppButton_Openpttchat: function () {
      useExtensionEvent();
    }
  }
});
// CONCATENATED MODULE: ./src/app/PttAppButton.vue?vue&type=script&lang=js&
 /* harmony default export */ var app_PttAppButtonvue_type_script_lang_js_ = (PttAppButtonvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/app/PttAppButton.vue?vue&type=style&index=0&id=3700bc4a&lang=scss&scoped=true&
var PttAppButtonvue_type_style_index_0_id_3700bc4a_lang_scss_scoped_true_ = __webpack_require__(21);

// CONCATENATED MODULE: ./src/app/PttAppButton.vue






/* normalize component */

var PttAppButton_component = Object(componentNormalizer["a" /* default */])(
  app_PttAppButtonvue_type_script_lang_js_,
  PttAppButtonvue_type_template_id_3700bc4a_scoped_true_render,
  PttAppButtonvue_type_template_id_3700bc4a_scoped_true_staticRenderFns,
  false,
  null,
  "3700bc4a",
  null
  
)

/* hot reload */
if (false) { var PttAppButton_api; }
PttAppButton_component.options.__file = "src/app/PttAppButton.vue"
/* harmony default export */ var PttAppButton = (PttAppButton_component.exports);
// CONCATENATED MODULE: ./src/app/store/mutations_type.js
const types = {
  INCREASE: 'INCREASE',
  DECREASE: 'DECREASE',
  PTTID: 'PTTID',
  ALERT: 'Alert',
  CLEARALERT: 'CLEARALERT',
  ADDANYSEARCH: 'ADDANYSEARCH',
  GOTOPOST: 'GOTOPOST',
  COMMENTDATA: 'CommentData',
  UPDATEBOARD: 'updateBoard',
  UPDATEPOST: 'UpdatePost',
  UPDATECHAT: 'Updatechatlist',
  CLEARCHAT: 'CLEARCHAT',
  SETPOSTLASTENDLINE: 'SETPOSTLASTENDLINE',
  SETPOSTCOMMENTCOUNT: 'SETPOSTCOMMENTCOUNT',
  UPDATELOG: 'UpdateLog',
  REMOVELOG: 'RemoveLog',
  VIDEOSTARTDATE: 'VIDEOSTARTDATE',
  VIDEOPLAYEDTIME: 'VIDEOPLAYEDTIME',
  VIDEOCURRENTRIME: 'VIDEOCURRENTRIME',
  PAGECHANGE: 'PAGECHANGE',
  GOTOCHAT: 'GOTOCHAT',
  PTTSTATE: 'PTTSTATE',
  ISSTREAM: 'ISSTREAM',
  PREVIEWIMG: 'PREVIEWIMG',
  REINSTANCEPTT: 'REINSTANCEPTT',
  CUSTOMPLUGINSETTING: 'menuCommand-customPluginSetting-',
  SITENAME: 'siteName',
  // checkbox
  ENABLESETNEWCOMMENT: 'EnableSetNewComment',
  DISABLECOMMENTGRAY: 'DisableCommentGray',
  DELETEOTHERCONNECT: 'DeleteOtherConnect',
  ANYSEARCHHINT: 'ANYSEARCHHINT',
  // input value
  PLUGINHEIGHT: 'PluginHeight',
  CHATFONTSIZE: 'Fontsize',
  CHATSPACE: 'ChatSpace',
  COMMENTINTERVAL: 'CommentInterval',
  PLUGINWIDTH: 'PluginWidth',
  PLUGINPORTRAITHEIGHT: 'PluginPortraitHeight',
  // inputfield value
  ENABLEBLACKLIST: 'EnableBlacklist',
  BLACKLIST: 'Blacklist',
  ENABLECOMMENTBLACKLIST: 'EnableCommentBlacklist',
  COMMENTBLACKLIST: 'CommentBlacklist',
  // dropdown
  THEME: 'Theme',
  THEMECOLORBG: 'ThemeColorBG',
  THEMECOLORBORDER: 'ThemeColorBorder',
  TITLELIST: 'TitleList'
};
// CONCATENATED MODULE: ./src/app/store/mutations.js

const mutations_state = {
  count: 0,
  alert: [],
  anySearch: '',
  post: {
    key: '',
    board: '',
    title: '',
    date: (() => {
      const t = new Date();
      t.setHours(0);
      t.setMinutes(0);
      t.setSeconds(0);
      return t;
    })(),
    lastEndLine: 0,
    lastcommenttime: new Date(),
    commentcount: 0,
    nowcomment: 0,
    gettedpost: false
  },
  chatlist: [],
  log: [],
  firstChatTime: {},
  lastChatTime: {},
  VStartDate: (() => {
    const t = new Date();
    t.setHours(0);
    t.setMinutes(0);
    t.setSeconds(0);
    return t;
  })(),
  VPlayedTime: 0,
  VCurrentTime: new Date(),
  pageChange: false,
  gotoChat: false,
  pttState: 0,
  isStream: true,
  previewImg: '',
  InstancePTTID: 1,
  customPluginSetting: false,
  siteName: '',
  // checkbox
  enablesetnewcomment: GM_getValue(types.ENABLESETNEWCOMMENT, false),
  disablecommentgray: GM_getValue(types.DISABLECOMMENTGRAY, false),
  deleteotherconnect: GM_getValue(types.DELETEOTHERCONNECT, false),
  anySearchHint: GM_getValue(types.ANYSEARCHHINT, false),
  // input value
  pluginHeight: GM_getValue(types.PLUGINHEIGHT, -1),
  commentInterval: GM_getValue(types.COMMENTINTERVAL, -1),
  chatFontsize: GM_getValue(types.CHATFONTSIZE, -1),
  chatSpace: GM_getValue(types.CHATSPACE, -1),
  pluginWidth: GM_getValue(types.PLUGINWIDTH, -1),
  pluginPortraitHeight: GM_getValue(types.PLUGINPORTRAITHEIGHT, -1),
  // inputfield value
  enableBlacklist: GM_getValue(types.ENABLEBLACKLIST, false),
  blacklist: GM_getValue(types.BLACKLIST, null),
  enableCommentBlacklist: GM_getValue(types.ENABLECOMMENTBLACKLIST, false),
  commentBlacklist: GM_getValue(types.COMMENTBLACKLIST, null),
  // dropdown
  theme: GM_getValue(types.THEME, -1),
  themeColorBG: GM_getValue(types.THEMECOLORBG, -1),
  themeColorBorder: GM_getValue(types.THEMECOLORBORDER, -1),
  titleList: GM_getValue(types.TITLELIST, ['直播單 (C_Chat)', '彩虹直播 (Vtuber)'])
}; // mutations

const mutations = {
  // action 發出 commit 會對應到 mutation 使用的是 Object key 方式
  [types.INCREASE](state) {
    // 在 mutation 改變 state（只有 mutation 可以改變！）
    state.count += 1;
  },

  [types.DECREASE](state) {
    state.count -= 1;
  },

  [types.ALERT](state, alert) {
    state.alert.push(alert);
  },

  [types.CLEARALERT](state) {
    state.alert = [];
  },

  [types.ADDANYSEARCH](state, search) {
    state.anySearch = search;
  },

  [types.UPDATEBOARD](state, board) {
    state.post.board = board;
  },

  [types.UPDATEPOST](state, post) {
    if (false) {}
    state.post = post;
  },

  [types.UPDATECHAT](state, chatlist) {
    if (false) {}
    state.chatlist = chatlist;
  },

  [types.CLEARCHAT](state) {
    state.chatlist = [];
  },

  [types.SETPOSTLASTENDLINE](state, lastEndLine) {
    state.post.lastEndLine = lastEndLine;
  },

  [types.SETPOSTCOMMENTCOUNT](state, commentCount) {
    state.post.commentCount = commentCount;
  },

  [types.UPDATELOG](state, log) {
    if (false) {}
    if (!Array.isArray(log)) state.log.push(log);else state.log = state.log.concat(log);
  },

  [types.REMOVELOG](state, type) {
    for (let i = 0; i < state.log.length; i++) {
      if (state.log[i].type === type) {
        state.log.splice(i, 1);
        return;
      }
    }
  },

  [types.VIDEOSTARTDATE](state, videostartdate) {
    state.VStartDate = videostartdate;
  },

  [types.VIDEOPLAYEDTIME](state, videoplayedtime) {
    state.VPlayedTime = videoplayedtime;
  },

  [types.VIDEOCURRENTRIME](state, vcurrentime) {
    state.VCurrentTime = vcurrentime;
  },

  [types.PAGECHANGE](state, pageChange) {
    state.pageChange = pageChange;
  },

  [types.GOTOCHAT](state, gotoChat) {
    state.gotoChat = gotoChat;
  },

  [types.PTTSTATE](state, pttstate) {
    state.pttState = pttstate;
  },

  [types.ISSTREAM](state, isStream) {
    state.isStream = isStream;
  },

  [types.PREVIEWIMG](state, src) {
    state.previewImg = src;
  },

  [types.REINSTANCEPTT](state) {
    state.InstancePTTID++;
  },

  [types.CUSTOMPLUGINSETTING](state, value) {
    state.customPluginSetting = value;
  },

  [types.SITENAME](state, value) {
    state.siteName = value;
  },

  // checkbox
  [types.DELETEOTHERCONNECT](state, deleteotherconnect) {
    GM_setValue(types.DELETEOTHERCONNECT, deleteotherconnect);
    state.deleteotherconnect = deleteotherconnect;
  },

  [types.ENABLESETNEWCOMMENT](state, value) {
    GM_setValue(types.ENABLESETNEWCOMMENT, value);
    state.enablesetnewcomment = value;
  },

  [types.DISABLECOMMENTGRAY](state, disable) {
    GM_setValue(types.DISABLECOMMENTGRAY, disable);
    state.disablecommentgray = disable;
  },

  [types.ANYSEARCHHINT](state, search) {
    GM_setValue(types.ANYSEARCHHINT, search);
    state.anySearchHint = search;
  },

  // input value
  [types.PLUGINHEIGHT](state, height) {
    const ValueName = types.PLUGINHEIGHT + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, height);
    if (false) {}
    state.pluginHeight = height;
  },

  [types.COMMENTINTERVAL](state, interval) {
    const ValueName = types.COMMENTINTERVAL + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, interval);
    state.commentInterval = interval;
  },

  [types.CHATFONTSIZE](state, size) {
    const ValueName = types.CHATFONTSIZE + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, size);
    state.chatFontsize = size;
  },

  [types.CHATSPACE](state, space) {
    const ValueName = types.CHATSPACE + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, space);
    state.chatSpace = space;
  },

  [types.PLUGINWIDTH](state, width) {
    const ValueName = types.PLUGINWIDTH + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, width);
    state.pluginWidth = width;
  },

  [types.PLUGINPORTRAITHEIGHT](state, portraitHeight) {
    const ValueName = types.PLUGINPORTRAITHEIGHT + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, portraitHeight);
    state.pluginPortraitHeight = portraitHeight;
  },

  // inputfield value
  [types.ENABLEBLACKLIST](state, isEnable) {
    GM_setValue(types.ENABLEBLACKLIST, isEnable);
    state.enableBlacklist = isEnable;
  },

  [types.BLACKLIST](state, list) {
    const l = list.toLowerCase();
    GM_setValue(types.BLACKLIST, l);
    state.blacklist = l;
  },

  [types.ENABLECOMMENTBLACKLIST](state, isEnable) {
    GM_setValue(types.ENABLECOMMENTBLACKLIST, isEnable);
    state.enableCommentBlacklist = isEnable;
  },

  [types.COMMENTBLACKLIST](state, list) {
    const l = list.toLowerCase();
    GM_setValue(types.COMMENTBLACKLIST, l);
    state.commentBlacklist = l;
  },

  // dropdown
  [types.THEME](state, theme) {
    const ValueName = types.PLUGINPORTRAITHEIGHT + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, theme);
    state.theme = theme;
  },

  [types.THEMECOLORBG](state, themecolorbg) {
    const ValueName = types.THEMECOLORBG + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, themecolorbg);
    state.themeColorBG = themecolorbg;
  },

  [types.THEMECOLORBORDER](state, themecolorborder) {
    const ValueName = types.THEMECOLORBORDER + (state.customPluginSetting ? '-' + state.siteName : '');
    GM_setValue(ValueName, themecolorborder);
    state.themeColorBorder = themecolorborder;
  },

  [types.TITLELIST](state, list) {
    GM_setValue(types.TITLELIST, list);
    state.titleList = list;
  }

};
// CONCATENATED MODULE: ./src/app/store/getters.js
const getters = {
  getCount: state => state.count,
  Alert: state => state.alert,
  anySearch: state => state.anySearch,
  newLog: state => state.log,
  post: state => state.post,
  newChatList: state => state.chatlist,
  videoCurrentTime: state => state.VCurrentTime,
  gotoChat: state => state.gotoChat,
  pttState: state => state.pttState,
  // PTT頁面狀態 0未登入畫面 1主畫面 2看板畫面 3文章畫面第一頁 4文章畫面其他頁
  previewImage: state => state.previewImg,
  getInstancePTTID: state => state.InstancePTTID,
  customPluginSetting: state => state.customPluginSetting,
  siteName: state => state.siteName,
  // checkbox
  getEnableSetNewComment: state => state.enablesetnewcomment,
  getDisableCommentGray: state => state.disablepushgray,
  getDeleteOtherConnect: state => state.deleteotherconnect,
  getAnySearchHint: state => state.anySearchHint,
  // input value
  getPluginHeight: state => state.pluginHeight,
  getFontsize: state => state.chatFontsize,
  getChatSpace: state => state.chatSpace,
  getCommentInterval: state => state.commentInterval,
  getPluginWidth: state => state.pluginWidth,
  getPluginPortraitHeight: state => state.pluginPortraitHeight,
  // inputfield value
  getEnableBlacklist: state => state.enableBlacklist,
  getBlacklist: state => state.blacklist,
  getEnableCommentBlacklist: state => state.enableCommentBlacklist,
  getCommentBlacklist: state => state.commentBlacklist,
  // dropdown
  getTheme: state => state.theme,
  getThemeColorBG: state => state.themeColorBG,
  getThemeColorBorder: state => state.themeColorBorder,
  getTitleList: state => state.titleList
};
// CONCATENATED MODULE: ./src/app/store/actions.js

const actions = {
  actionIncrease: ({
    commit
  }) => {
    console.log('actionIncrease');
    commit(types.INCREASE);
  },
  actionDecrease: ({
    commit
  }) => {
    console.log('actionDecrease');
    commit(types.DECREASE);
  },
  Alert: ({
    dispatch,
    commit
  }, alertobject) => {
    commit(types.ALERT, alertobject);
    dispatch('updateLog', {
      type: 'Alert',
      data: alertobject
    });
  },
  ClearAlert: context => {
    context.commit(types.CLEARALERT);
  },
  addAnySearch: ({
    commit
  }, search) => {
    commit(types.ADDANYSEARCH, search);
  },
  updateLog: (context, log) => {
    context.commit(types.UPDATELOG, log);
  },
  removeLog: (context, log) => {
    context.commit(types.REMOVELOG, log);
  },
  updatePost: ({
    dispatch,
    commit,
    state
  }, RecievedData) => {
    let newpost;

    if (RecievedData.key === state.post.key && RecievedData.board === state.post.board) {
      newpost = state.post;
      commit(types.SETPOSTLASTENDLINE, RecievedData.endLine);
      const commentCount = state.post.commentCount + RecievedData.comments.length;
      commit(types.SETPOSTCOMMENTCOUNT, commentCount);
      dispatch('updateLog', [{
        type: 'postEndLine',
        data: RecievedData.endLine
      }, {
        type: 'postCommentCount',
        data: commentCount
      }]);
    } else {
      newpost = {
        key: RecievedData.key,
        board: RecievedData.board,
        title: RecievedData.title,
        date: RecievedData.date,
        lastEndLine: RecievedData.endLine,
        lastCommentTime: new Date(),
        commentCount: RecievedData.comments.length,
        nowComment: 0,
        gettedpost: true
      };
      const t = newpost.date;
      dispatch('updateLog', [{
        type: 'postKey',
        data: newpost.key
      }, {
        type: 'postBoard',
        data: newpost.board
      }, {
        type: 'postTitle',
        data: newpost.title
      }, {
        type: 'postDate',
        data: t.toLocaleDateString() + ' ' + t.toLocaleTimeString()
      }, {
        type: 'postEndLine',
        data: newpost.lastEndLine
      }, {
        type: 'postCommentCount',
        data: newpost.commentCount
      }]);
    }

    commit(types.UPDATEPOST, newpost);
    dispatch('updateChat', RecievedData.comments);

    if (RecievedData.comments.length > 0) {
      const lastcommentDate = RecievedData.comments[RecievedData.comments.length - 1].date;
      dispatch('updateLog', {
        type: 'postLastCommentTime',
        data: lastcommentDate.toLocaleDateString() + ' ' + lastcommentDate.toLocaleTimeString()
      });
    }

    if (state.pageChange) {
      dispatch('gotoChat', true);
      dispatch('pageChange', false);
    }
  },
  updateChat: ({
    commit,
    state
  }, comments) => {
    if (false) {}
    const existcomment = state.post.commentCount - comments.length;
    const chatlist = [];
    let sametimecount = 0;
    let sametimeIndex = 0;

    for (let index = 0; index < comments.length; index++) {
      const currcomment = comments[index];
      let isBlakcList = false;

      if (state.enableBlacklist) {
        const list = state.blacklist.split('\n');
        const id = currcomment.id.toLowerCase();

        for (let i = 0; i < list.length; i++) {
          if (id === list[i]) {
            if (false) {}
            isBlakcList = true;
            break;
          }
        }
      }

      if (state.enableCommentBlacklist && !isBlakcList) {
        const list = state.commentBlacklist.split('\n');
        const msg = currcomment.content.toLowerCase();

        for (let i = 0; i < list.length; i++) {
          if (list[i] || list[i].length === 0) continue;

          if (msg.indexOf(list[i]) > -1) {
            console.log('commentBlacklist', msg, list[i], msg.indexOf(list[i]));
            isBlakcList = true;
            break;
          }
        }
      }

      if (isBlakcList) continue;
      const chat = {};

      if (!state.isStream) {
        if (index >= sametimeIndex) {
          // 獲得同時間點的推文數量
          for (let nextpointer = index + 1; nextpointer < comments.length; nextpointer++) {
            const element = comments[nextpointer];

            if (currcomment.date.getTime() < element.date.getTime() || nextpointer >= comments.length - 1) {
              sametimeIndex = nextpointer;
              sametimecount = nextpointer - index;
              break;
            }
          }
        }
      }

      chat.time = new Date(currcomment.date.getTime()); // console.log("sametimeIndex, index, sametimecount", sametimeIndex, index, sametimecount);

      if (!state.isStream && sametimecount > 0) chat.time.setSeconds((sametimecount + index - sametimeIndex) * 60 / sametimecount);
      chat.pttid = currcomment.id;
      chat.type = currcomment.type; // chat.msg = currpush.content;

      let msg = '';
      let m = filterXSS(currcomment.content);
      const AidResult = /(.*)(#[a-zA-Z0-9-_^'"`]{8} \([^'"`)]+\))(.*)/.exec(m);

      if (AidResult && AidResult.length > 3) {
        const precontent = AidResult[1];
        const aid = AidResult[2];
        const postcontent = AidResult[3];
        const aidResult = /(#[a-zA-Z0-9_-]+) \(([a-zA-Z0-9_-]+)\)/.exec(aid);
        const search = aidResult[2] + ',' + aidResult[1];
        m = precontent + '<u onclick="this.parentNode.AddAnySrarch(`' + search + '`)" style="cursor: pointer;">' + aid + '</u>' + postcontent;
        if (false) {}
      }

      let result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m);
      let parsetime = 5;

      while (result && m !== '' && parsetime > 0) {
        const prestring = result[1];
        const linkstring = result[2];
        if (prestring !== '') msg = msg + prestring;
        msg = msg + '<a href="' + linkstring + '" target="_blank" rel="noopener noreferrer" class="ptt-chat-msg" ref="link' + (5 - parsetime) + '" onmouseover="this.parentNode.mouseEnter(this.href)" onmouseleave="this.parentNode.mouseLeave(this.href)">' + linkstring + '</a>';
        m = result[3];
        result = /(.*?)(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(.*)/ig.exec(m);
        parsetime--;
      }

      if (m !== '') msg = msg + m;
      chat.msg = msg;
      chat.id = existcomment + index;
      chat.uid = state.post.key + '_' + chat.id;
      chat.gray = !state.disablecommentgray;
      chatlist.push(chat);
      if (false) {}
    } // console.log("chatlist actions", chatlist);


    commit(types.UPDATECHAT, chatlist);
  },
  clearChat: ({
    commit
  }) => {
    commit(types.CLEARCHAT);
  },
  updateVideoStartDate: ({
    dispatch,
    commit,
    state
  }, d) => {
    dispatch('updateLog', {
      type: 'videoStartTime',
      data: d.toLocaleDateString() + ' ' + d.toLocaleTimeString()
    });
    commit(types.VIDEOSTARTDATE, d);
    dispatch('updateVideoCurrentTime');
  },
  updateVideoPlayedTime: ({
    dispatch,
    commit,
    state
  }, time) => {
    // console.log("updateVideoPlayedTime", time);
    commit(types.VIDEOPLAYEDTIME, time);
    dispatch('updateLog', {
      type: 'videoPlayedTime',
      data: time
    });
    dispatch('updateVideoCurrentTime');
  },
  updateVideoCurrentTime: ({
    dispatch,
    commit,
    state
  }) => {
    const vstart = state.VStartDate;
    const time = state.VPlayedTime; // [H,m,s,isVideoVeforePost]

    const currtime = new Date(vstart.valueOf());
    currtime.setSeconds(vstart.getSeconds() + time);
    if (false) {} // console.log("updateVideoCurrentTime vstart, time, currtime", vstart, time, currtime);

    dispatch('updateLog', {
      type: 'videoCurrentTime',
      data: currtime.toLocaleDateString() + ' ' + currtime.toLocaleTimeString()
    });
    commit(types.VIDEOCURRENTRIME, currtime);
  },
  pageChange: ({
    commit
  }, Change) => {
    commit(types.PAGECHANGE, Change);
  },
  gotoChat: ({
    commit
  }, gtChat) => {
    commit(types.GOTOCHAT, gtChat);
  },
  pttState: ({
    dispatch,
    commit
  }, pttstate) => {
    dispatch('updateLog', {
      type: 'pttState',
      data: pttstate
    });
    commit(types.PTTSTATE, pttstate);
  },
  isStream: ({
    commit
  }, isStream) => {
    commit(types.ISSTREAM, isStream);
  },
  previewImage: ({
    commit
  }, src) => {
    commit(types.PREVIEWIMG, src);
  },
  reInstancePTT: ({
    commit
  }) => commit(types.REINSTANCEPTT),
  setCustomPluginSetting: ({
    commit
  }, value) => {
    commit(types.CUSTOMPLUGINSETTING, value);
  },
  setSiteName: ({
    commit
  }, value) => {
    commit(types.SITENAME, value);
  },
  // checkbox
  setEnableSetNewComment: ({
    commit
  }, value) => {
    commit(types.ENABLESETNEWCOMMENT, value);
  },
  setDisableCommentGray: ({
    commit
  }, value) => {
    commit(types.DISABLECOMMENTGRAY, value);
  },
  setDeleteOtherConnect: ({
    commit
  }, value) => {
    commit(types.DELETEOTHERCONNECT, value);
  },
  setAnySearchHint: ({
    commit
  }, value) => {
    commit(types.ANYSEARCHHINT, value);
  },
  // input value
  setPluginHeight: (context, value) => {
    context.commit(types.PLUGINHEIGHT, value);
  },
  setFontsize: ({
    commit
  }, value) => {
    commit(types.CHATFONTSIZE, value);
  },
  setChatSpace: ({
    commit
  }, value) => {
    commit(types.CHATSPACE, value);
  },
  setCommentInterval: ({
    commit
  }, value) => {
    commit(types.COMMENTINTERVAL, value);
  },
  setPluginWidth: ({
    commit
  }, value) => {
    commit(types.PLUGINWIDTH, value);
  },
  setPluginPortraitHeight: ({
    commit
  }, value) => {
    commit(types.PLUGINPORTRAITHEIGHT, value);
  },
  // inputfield value
  setEnableBlacklist: ({
    commit
  }, value) => {
    commit(types.ENABLEBLACKLIST, value);
  },
  setBlacklist: ({
    commit
  }, value) => {
    commit(types.BLACKLIST, value);
  },
  setEnableCommentBlacklist: ({
    commit
  }, value) => {
    commit(types.ENABLECOMMENTBLACKLIST, value);
  },
  setCommentBlacklist: ({
    commit
  }, value) => {
    commit(types.COMMENTBLACKLIST, value);
  },
  // dropdown
  setTheme: ({
    dispatch,
    commit
  }, value) => {
    switch (value) {
      case 0:
        dispatch('updateLog', {
          type: 'themeColor',
          data: '自動'
        });
        break;

      case 1:
        dispatch('updateLog', {
          type: 'themeColor',
          data: '白色'
        });
        break;

      case 2:
        dispatch('updateLog', {
          type: 'themeColor',
          data: '黑色'
        });
        break;

      case 3:
        dispatch('updateLog', {
          type: 'themeColor',
          data: '自訂'
        });
        break;

      default:
        break;
    }

    commit(types.THEME, value);
  },
  setThemeColorBG: ({
    commit
  }, value) => {
    commit(types.THEMECOLORBG, value);
  },
  setThemeColorBorder: ({
    commit
  }, value) => {
    commit(types.THEMECOLORBORDER, value);
  },
  setTitleList: ({
    commit
  }, list) => {
    commit(types.TITLELIST, list);
  }
};
// CONCATENATED MODULE: ./src/app/store/store.js



Vue.use(Vuex);
const store = new Vuex.Store({
  state: mutations_state,
  mutations: mutations,
  getters: getters,
  actions: actions,
  // 嚴格模式，禁止直接修改 state
  strict: true
});
// CONCATENATED MODULE: ./src/app/appindex.js



let appinscount = 0;
/**
 *
 * @param {*} chatContainer
 * @param {*} isWhitetheme
 * @param {*} isStreaming
 * @param {*} messagePoster
 */

function InitApp(chatContainer, isWhitetheme, isStreaming, messagePoster, siteName) {
  // generate crypt key everytime;
  InitChatApp(chatContainer);

  function InitChatApp(cn) {
    /* -----------------------------------preInitApp----------------------------------- */
    // init property
    const ele = document.createElement('div');
    ele.id = 'PTTChat';
    ele.setAttribute('style', 'z-index: 301;');
    if (cn) cn[0].appendChild(ele);
    const bootsrtapicon = document.createElement('link');
    bootsrtapicon.setAttribute('rel', 'stylesheet');
    bootsrtapicon.setAttribute('href', 'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.2/font/bootstrap-icons.css');
    if (cn) cn[0].appendChild(bootsrtapicon);
    const themewhite = 'pttbgc-19 pttc-5';
    const themedark = 'pttbgc-2 pttc-2';
    if (false) {}
    const PTT = new Vue({
      el: '#PTTChat',
      store: store,
      components: {
        PTTAppBtn: PttAppButton,
        PTTApp: PttApp
      },
      provide: function () {
        return {
          msg: this.rootmsg,
          isStream: isStreaming,
          nowPluginWidth: GM_getValue('PluginWidth', 400)
        };
      },

      data() {
        return {
          index: appinscount,
          rootmsg: messagePoster,
          player: document.getElementsByTagName('video')[0],
          playertime: null,
          exist: null,
          customPluginSettingListenerId: 0
        };
      },

      computed: {
        classes: function () {
          const classes = ['position-absolute', 'w-100'];
          if (false) {}

          switch (+this.getTheme) {
            case 0:
              if (isWhitetheme) {
                classes.push(themewhite);
              } else {
                classes.push(themedark);
              }

              break;

            case 1:
              classes.push(themewhite);
              break;

            case 2:
              classes.push(themedark);
              break;

            case 3:
              classes.push('pttbgc-' + this.getThemeColorBG);
              classes.push('pttc-' + (10 - this.getThemeColorBorder));
              break;

            default:
              break;
          }

          return classes.join(' ');
        },
        ...Vuex.mapGetters(['getTheme', 'getThemeColorBG', 'getThemeColorBorder'])
      },

      mounted() {
        this.$store.dispatch('updateLog', {
          type: 'videoType',
          data: isStreaming ? '實況' : '影片'
        });
        this.customPluginSettingListenerId = GM_addValueChangeListener('menuCommand-customPluginSetting-' + siteName, (name, oldValue, newValue, remote) => this.$store.dispatch('setCustomPluginSetting', newValue));
        this.$store.dispatch('setSiteName', siteName);
        this.$store.dispatch('setCustomPluginSetting', GM_getValue('menuCommand-customPluginSetting-' + siteName, false));
        if (false) {}
        appinscount++;
        this.playertime = window.setInterval(() => {
          if (this.player) {
            this.$store.dispatch('updateVideoPlayedTime', this.player.currentTime);
          } else clearInterval(this.playertime);
        }, 1000);
        this.exist = window.setInterval(() => {
          const self = document.querySelector('#PTTChat[ins="' + this.index + '"');

          if (!self) {
            if (false) {}
            PTT.$destroy();
          } else {// console.log("Instance " + this.index + " alive.");
          }
        }, 1000);
        this.$store.dispatch('isStream', isStreaming);

        if (!isStreaming) {
          try {
            const videoinfo = JSON.parse(document.getElementById('scriptTag').innerHTML); // if (reportMode) console.log('videoinfo', videoinfo)

            const startDate = new Date(videoinfo.publication[0].startDate);
            if (false) {}
            this.$store.dispatch('updateVideoStartDate', startDate);
            const endDate = new Date(videoinfo.publication[0].endDate);
            if (false) {}
            this.$store.dispatch('updateLog', {
              type: 'videoEndTime',
              data: endDate.toLocaleDateString() + ' ' + endDate.toLocaleTimeString()
            });
          } catch (e) {
            console.log(e);
          }
        }

        this.rootmsg.pttState = data => {
          this.$store.dispatch('pttState', data);
        };
      },

      beforeDestroy() {
        GM_removeValueChangeListener(this.customPluginSettingListenerId);
        clearInterval(this.playertime);
        clearInterval(this.exist);
      },

      template: `<div id="PTTChat" :class="classes" :ins="index">
      <PTTAppBtn></PTTAppBtn>
      <PTTApp></PTTApp>
    </div>`
    });
  }
}
// CONCATENATED MODULE: ./src/ChangeLog.js
/**
 *
 */
function ChangeLog() {
  /**
   * @returns {string} newest post in ptt
   */
  function GetPTTChangeLogURL() {
    return 'https://www.ptt.cc/bbs/C_Chat/M.1630322443.A.2E2.html';
  }
  /**
   * @returns {object} object of change log
   */


  function AddChangeLogInfo() {
    const changeLogInfo = {};
    changeLogInfo.v_3_0 = new Info();
    changeLogInfo.v_3_0.版本.push('使用新的搜尋功能，可以搜尋標題、AID、作者、推文數、稿酬、標記等。\n舊版的AID(#1WHqSb2l (C_Chat))依然可以使用。');
    changeLogInfo.v_3_0.版本.push('修正版主ID+版標太常導致看板名稱消失後就會無法辨識看板的問題。');
    changeLogInfo.v_3_0.版本.push('現在可以套件關閉對特定網站的支援了。');
    changeLogInfo.v_3_0.版本.push('現在可以對每個網站做套件設定了。');
    changeLogInfo.v_3_0.版本.push('修正firefox無法使用的問題。');
    changeLogInfo.v_3_0.版本.push('現在可以針對推文的關鍵字做黑名單了，只要推文內容包含關鍵字就不會顯示。');
    changeLogInfo.v_3_0.版本.push('修正log頁籤的內容，現在可以正確的顯示套件的各項資訊了。');
    changeLogInfo.v_2_9 = new Info();
    changeLogInfo.v_2_9.HoloDex.push('修正holodex改版造成套件失效的問題。');
    changeLogInfo.v_2_8 = new Info();
    changeLogInfo.v_2_8.HoloTools.push('修復在新版HoloTools中無法使用的問題。');
    changeLogInfo.v_2_8.HoloTools.push('支援新版HoloTools聊天室開關、佈局切換。');
    changeLogInfo.v_2_8.HoloTools.push('修正開台數多時會擋住增加指定影片按鈕的問題。');
    changeLogInfo.v_2_8.HoloDex.push('支援嵌入式顯示模式，可以在分割中使用PTT聊天室並自訂大小、位置了。<br>詳細說明：<a href="https://github.com/zoosewu/PTTChatOnYoutube/tree/master/homepage#holodex" target="_blank">github</a>');
    changeLogInfo.v_2_8.HoloDex.push('在右上方控制列中新增新舊版PTT聊天室切換開關。');
    changeLogInfo.v_2_8.版本.push('修復PTT新式游標在搜尋超過五位數文章數時會發生錯誤的問題。');
    changeLogInfo.v_2_8.版本.push('修復在同看板使用同標題搜尋時不會更新標題預覽及跳轉至聊天室的問題。');
    changeLogInfo.v_2_8.版本.push('修復在PTT卡住後無法再使用標題搜尋功能的問題。');
    changeLogInfo.v_2_8.版本.push('支援回文、轉文的搜尋。');
    changeLogInfo.v_2_8.版本.push('修正若干css問題。');
    changeLogInfo.v_2_8.版本.push('修正網站原生對話框(如結帳頁面)會錯誤的問題。');
    changeLogInfo.v_2_8.版本.push('現在會完全隱藏被黑名單ID的推文了。');
    changeLogInfo.v_2_7 = new Info();
    changeLogInfo.v_2_7.HoloTools.push('(舊版)在右上方控制列中新增<strong>PTT聊天室開關</strong>與<strong>切換顯示佈局按鈕</strong>。<br>');
    changeLogInfo.v_2_7.HoloTools.push('<p><b>PTT聊天室開關</b>：<br>&emsp;&emsp;現在可以在不用時完全隱藏PTT聊天室，回復佔用的空間。</p>');
    changeLogInfo.v_2_7.HoloTools.push('<p><b>切換顯示佈局按鈕</b>：<br>&emsp;&emsp;支援直立式螢幕顯示，將聊天室移到底部。</p>');
    changeLogInfo.v_2_7.版本.push('新增更新日誌，套件更新時會顯示更新資訊，並且可以點擊閱讀更多按鈕查看更新說明文章。');
    changeLogInfo.v_2_6 = new Info();
    changeLogInfo.v_2_6.版本.push('新增黑名單功能。');
    changeLogInfo.v_2_6.版本.push('新增標題搜尋功能。');
    changeLogInfo.v_2_6.HoloDex.push('支援HoloDex。');
    return changeLogInfo;
  }

  const previousVersion = GM_getValue('previousVersion', '2.9.0').split('.');
  const nowVerion = GM_info.script.version.split('.');
  GM_setValue('previousVersion', GM_info.script.version);
  if (nowVerion[0] <= previousVersion[0] && nowVerion[1] <= previousVersion[1]) return;

  class Info {
    constructor() {
      this.版本 = [];
      this.HoloDex = [];
      this.HoloTools = [];
      this.Twitch = [];
      this.Nijimado = [];
      this.Youtube = [];
    }

  }

  const allChangeLogInfo = AddChangeLogInfo();
  const changeLogInfo = GetChangeLogInfo(new Info(), +previousVersion[0], +previousVersion[1] + 1);
  const changeLogHTML = EncodeChangeLog(changeLogInfo);
  const PTTChangeLogURL = GetPTTChangeLogURL(); // data-backdrop should be empty

  const modal = $(`
    <div id="PTTChangeLog" class="modal fade" data-backdrop="" data-keyboard="false" tabindex="-1" aria-hidden="true" style="color: #000; overflow: overlay;">
      <div class="modal-dialog modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h4 class="modal-title">PTTChatOnYoutube更新日誌</h4>
          </div>
          <div class="modal-body">
              ${changeLogHTML}
          </div>
          <div class="modal-footer">
          <a href="${PTTChangeLogURL}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" type="button">閱讀更多</a>
          <button type="button" class="btn btn-primary" data-dismiss="modal">關閉</button>
          </div>
        </div>
      </div>
    </div>`);
  $('#PTTChat').append(modal);
  $('#PTTChangeLog').modal('show');
  /**
   * @param {object} info ..
   * @param {string} major major version number
   * @param {string} minor minor version number
   * @returns {object} Logs to show
   */

  function GetChangeLogInfo(info, major, minor) {
    const newInfo = allChangeLogInfo['v_' + major + '_' + minor];
    if (+minor > nowVerion[1] && +major > nowVerion[0]) return info;

    if (newInfo !== undefined) {
      for (const key in newInfo) {
        info[key] = info[key].concat(newInfo[key]);
      }
    }

    if (+minor + 1 <= nowVerion[1]) return GetChangeLogInfo(info, +major, +minor + 1);
    if (+major + 1 <= nowVerion[0]) return GetChangeLogInfo(info, +major + 1, 0);
    return info;
  }
  /**
   * @param {object} log ..
   * @returns {string} HTML data with Logs
   */


  function EncodeChangeLog(log) {
    let logHTML = '';

    for (const key in log) {
      if (log[key].length !== 0) {
        let tmp = '';

        for (let index = 0; index < log[key].length; index++) {
          tmp = String.prototype.concat(tmp, `<li>${log[key][index]}</li>`);
        }

        logHTML = String.prototype.concat(logHTML, `<div style="margin: 5px 0px"><b>${key}：</b>`);
        if (key === '版本') logHTML = String.prototype.concat(logHTML, `${GM_info.script.version}`);
        logHTML = String.prototype.concat(logHTML, '<ul style="margin: 2px 0px;padding-left: 30px;">', tmp, '</ul></div>');
      }
    }

    return logHTML;
  }
}
// CONCATENATED MODULE: ./src/SupportWebsite/youtube/InitYT.js



function InitYT(messageposter, siteName) {
  const msg = messageposter; // Check Theme

  const WhiteTheme = ThemeCheck('html', 'rgb(249, 249, 249)');

  (function CheckChatInstanced() {
    if (/www\.youtube\.com\/watch\?v=/.exec(window.location.href) === null) {
      if (false) {}
      setTimeout(CheckChatInstanced, 2000);
      return;
    }

    const ChatContainer = $('ytd-live-chat-frame');
    const defaultChat = $('iframe', ChatContainer);
    const PTTApp = $('#PTTChat', ChatContainer);

    if (PTTApp.length > 0) {
      if (false) {}
      setTimeout(CheckChatInstanced, 5000);
    } else if (defaultChat.length > 0) {
      if (false) {}
      ChatContainer.css({
        position: 'relative'
      }); // 生出套件

      const isstream = checkvideotype();
      InitApp(ChatContainer, WhiteTheme, isstream, msg, siteName);
      ChangeLog();
      setTimeout(CheckChatInstanced, 5000);
    } else {
      if (false) {}
      setTimeout(CheckChatInstanced, 5000);
    }
  })();

  function checkvideotype() {
    const streambtncss = $('.ytp-live-badge').css('display');
    const logstr = ['$(\'.ytp-live-badge\').css("display")', streambtncss];

    if (true) {
      if (streambtncss === 'inline-block') {
        if (false) {}
        return true; // $(`#PTTConnect-Time-Setting`).addClass('d-none');
      } else if (streambtncss === 'none') {
        if (false) {}
        return false;
      }
    }
  }
}
// CONCATENATED MODULE: ./src/SupportWebsite/youtube/ytfilter.js


const ytfilter = InsFilter('Youtube', /www\.youtube\.com/, 'https://www.youtube.com', InitYT);
/* harmony default export */ var youtube_ytfilter = (ytfilter);
// CONCATENATED MODULE: ./src/SupportWebsite/holotools/InitHT.js




function InitHT(messageposter, siteName) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250'); // run app instance loop

  let waswatch;
  let iswatch;
  let tryinsholotools = 20;

  (function ChechChatInstanced() {
    setTimeout(ChechChatInstanced, 1000);
    const watchcheck = /https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(window.location.href) || /https:\/\/hololive\.jetri\.co\/#\/watch/.exec(window.location.href);
    if (watchcheck) iswatch = watchcheck[0];else iswatch = false;

    if (waswatch !== iswatch && iswatch) {
      tryinsholotools = 20;
    }

    if (tryinsholotools >= 0) {
      TryInsChat();
    }

    waswatch = iswatch;
  })();

  function TryInsChat() {
    const parent = $('.container-watch');
    const theme = $('html:eq(0)').hasClass('md-theme-hololight') ? 'hololight' : 'holodark';
    const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>');
    const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>');
    const defaultVideo = $('.player-container.hasControls');
    const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>');
    if (false) {}

    if (parent.length > 0 && iswatch) {
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const pluginheight = GM_getValue('PluginHeight', 400);
      const pluginportraitheight = GM_getValue('PluginPortraitHeight', 400);
      const pluginwidth0 = '0';
      const liveControls = $('.live-controls');
      liveControls.css('width', 'auto');
      const datahash = Object.keys(liveControls.data())[0];
      const iconParent = $(`<div data-${datahash} class="live-control live-control-double bg-300" type="button"></div>`);
      const iconFlex = $(`<div data-${datahash} class="live-control-button"><i data-${datahash} class="md-icon md-icon-font md-theme-${theme}" title="切換PTT顯示佈局">library_books</i></div>`);
      const iconPTT = $(`<div data-${datahash} class="live-control-button"><i data-${datahash} class="md-icon md-icon-font md-theme-${theme} openpttchat" title="PTT">local_parking</i></div>`);
      iconParent.append(iconFlex, iconPTT);
      liveControls.prepend(iconParent);

      if (/https:\/\/hololive\.jetri\.co\/#\/watch/.exec(iswatch)) {
        $('.md-layout.live-videos').css({
          'margin-right': '-40px',
          'padding-right': '40px'
        });
      } else if (/https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(iswatch)) {
        $('.md-layout.live-videos').css({
          'max-width': 'calc(100% - 385px)'
        });
      }

      let now = pluginwidth0;
      let collapseStart = false;
      let collapseEnd = true;
      let isChatOnen = false;
      let enablePortaitMode = false;
      const containerHeight = defaultVideo.height();
      iconPTT.on('click', function () {
        useExtensionEvent();

        if (collapseEnd || !collapseStart) {
          if (now === '0') {
            $('#PTTMainBtn').css('display', 'block');
            $('#PTTMain').collapse('show');
          } else {
            $('#PTTMainBtn').css('display', 'none');
            $('#PTTMain').collapse('hide');
          }

          now = now === pluginwidth0 ? pluginwidth : pluginwidth0;
          $('#pttchatparent').css('flex', '0 0 ' + now + 'px');
          if (enablePortaitMode && isChatOnen) defaultVideo.height(containerHeight);else if (enablePortaitMode) {
            defaultVideo.height(containerHeight - pluginportraitheight);
          }
          defaultSetting();
          isChatOnen = !isChatOnen;
        }
      });
      iconFlex.on('click', function () {
        if (isChatOnen) {
          if ($('#fakeparent').hasClass('flex-row')) {
            parent.css('overflow', 'visible');
            $('#fakeparent').removeClass('flex-row').addClass('flex-column');
            defaultVideo.height(containerHeight - pluginportraitheight);
            $('#PTTChat-contents').height(pluginportraitheight - 35);
          } else {
            parent.css('overflow', 'hidden');
            $('#fakeparent').removeClass('flex-column').addClass('flex-row');
            defaultVideo.height(containerHeight);
            $('#PTTChat-contents').height(pluginheight);
          }

          enablePortaitMode = !enablePortaitMode;
          defaultSetting();
        }
      });
      $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', function () {
        collapseStart = true;
        collapseEnd = false;
      });
      $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', function () {
        collapseStart = false;
        collapseEnd = true;
      });
      parent.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      $('.reopen-toolbar').css({
        'z-index': '302'
      });
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, siteName, true);
      ChangeLog();
      tryinsholotools = -10;
    } else {
      tryinsholotools--;
    }
  }

  function defaultSetting() {
    if (/https:\/\/hololive\.jetri\.co\/#\/watch/.exec(iswatch)) {
      const defaultHTDisplaySettingBtn = $(`.md-icon.md-icon-font:eq(${$('.md-icon.md-icon-font').length - 6})`);
      defaultHTDisplaySettingBtn.trigger('click');
    } else if (/https:\/\/hololive\.jetri\.co\/#\/ameliawatchon/.exec(iswatch)) {
      const defaultHTDisplaySettingList = $(`.md-icon.md-icon-font:eq(${$('.md-icon.md-icon-font').length - 6})`);
      defaultHTDisplaySettingList.trigger('click');
      setTimeout(() => {
        const defaultHTDisplaySettingBtn = $('.preset-preview').eq(0);
        defaultHTDisplaySettingBtn.trigger('click');
      }, 100);
    }
  }
}
// CONCATENATED MODULE: ./src/SupportWebsite/holotools/htfilter.js


const htfilter = InsFilter('Holotools', /hololive\.jetri\.co/, 'https://hololive.jetri.co', InitHT);
/* harmony default export */ var holotools_htfilter = (htfilter);
// CONCATENATED MODULE: ./src/SupportWebsite/blank/Initblank.js


function Initblank(messageposter, siteName) {
  const WhiteTheme = true; // Check Theme

  const pluginwidth = GM_getValue('PluginWidth', 400);
  const Body = document.getElementsByTagName('BODY')[0];
  const container = document.createElement('div');
  container.id = 'container';
  container.classList.add('position-relative');
  container.setAttribute('style', 'width:' + pluginwidth + 'px;height:800px;');
  Body.prepend(container); // const blankcontainer = document.getElementById(`container`);

  InitApp([container], WhiteTheme, true, messageposter, siteName, true);
  ChangeLog();
}
// CONCATENATED MODULE: ./src/SupportWebsite/blank/blankfilter.js


const blankfilter = InsFilter('Blank', /blank\.org/, 'https://blank.org/', Initblank);
/* harmony default export */ var blank_blankfilter = (blankfilter);
// CONCATENATED MODULE: ./src/SupportWebsite/twitch/InitTwitch.js



function InitTwitch(messageposter, siteName) {
  // Check Theme
  const WhiteTheme = ThemeCheck('body', 'rgb(247, 247, 248)'); // run app instance loop

  (function ChechChatInstanced() {
    setTimeout(ChechChatInstanced, 1000);
    TryInsChat();
  })();

  function TryInsChat() {
    const parent = $('section.chat-room');
    if (false) {}

    if (parent.length > 0) {
      const PTTApp = $('#PTTChat', parent);

      if (PTTApp.length < 1) {
        InitApp(parent, WhiteTheme, true, messageposter, siteName);
        ChangeLog();
      }
    }
  }
}
// CONCATENATED MODULE: ./src/SupportWebsite/twitch/twitchfilter.js


const twitchfilter = InsFilter('Twitch', /www\.twitch\.tv/, 'https://www.twitch.tv/', InitTwitch);
/* harmony default export */ var twitch_twitchfilter = (twitchfilter);
// CONCATENATED MODULE: ./src/SupportWebsite/nijimado/InitNijimado.js



function InitNijimado(messageposter, siteName) {
  // Check Theme
  const WhiteTheme = ThemeCheck('mat-drawer-container', 'rgb(250, 250, 250)');
  let tryinsholotools = 20;

  (function ChechChatInstanced() {
    if (tryinsholotools >= 0) {
      TryInsChat();
      setTimeout(ChechChatInstanced, 1000);
    }
  })();

  function TryInsChat() {
    const parent = $('app-home.ng-star-inserted');
    if (false) {}

    if (parent.length > 0) {
      const pluginwidth = GM_getValue('PluginWidth', 400);
      const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>');
      const defaultVideoHandler = $('<div id="videohandler" style="flex:1 1 auto;"></div>');
      const defaultVideo = $('[role="main"].content');
      const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 ' + pluginwidth + 'px;position:relative;"></div>');
      parent.append(fakeparent);
      fakeparent.append(defaultVideoHandler);
      defaultVideoHandler.append(defaultVideo);
      fakeparent.append(PTTChatHandler);
      $('.reopen-toolbar').css({
        'z-index': '302'
      });
      InitApp(PTTChatHandler, WhiteTheme, true, messageposter, siteName, true);
      ChangeLog();
      tryinsholotools = -10;
    } else {
      tryinsholotools--;
    }
  }
}
// CONCATENATED MODULE: ./src/SupportWebsite/nijimado/nijimadofilter.js


const nijimadofilter = InsFilter('niji-mado', /niji-mado\.web\.app/, 'https://niji-mado.web.app/', InitNijimado);
/* harmony default export */ var nijimado_nijimadofilter = (nijimadofilter);
// CONCATENATED MODULE: ./src/SupportWebsite/holodex/InitHD.js




function InitHD(messageposter, siteName) {
  // Check Theme
  const WhiteTheme = ThemeCheck('html', '250, 250, 250');
  let recentWatch = false;
  let repositionTimer;
  let observer;
  let layoutObserver;
  setInterval(() => {
    const url = /https:\/\/holodex\.net\/multiview/.exec(window.location.href);
    if (!url) recentWatch = false;else if (!recentWatch) initHolodex();
  }, 1000);

  function initHolodex() {
    const pluginWidth = parseInt(GM_getValue('PluginWidth', 350), 10);
    const liveControls = $('.justify-end.d-flex.mv-toolbar-btn.align-center.no-btn-text');
    const fakeparent = $('<div id="fakeparent" class="d-flex flex-row"></div>');
    const defaultVideoHandler = $('<div id="holotoolsvideohandler" style="flex:1 1 auto;"></div>');
    const PTTChatHandler = $('<div id="pttchatparent" class="p-0 d-flex" style="flex:0 0 0px;position:relative;"></div>');
    const defaultVideo = $('.vue-grid-layout');
    const parent = defaultVideo.parent();
    const holodexStyle = $('body').children().eq(1).hasClass('theme--light') ? '#757575' : '#F2F2F2';
    const iconSwitch = $(`<button type="button" id="ptt-switch-btn" title="切換PTT顯示模式" style="width: 36px; margin: 4px; padding-top: 6px"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="${holodexStyle}"><path d="M0 0h24v24H0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg></button>`);
    const iconPTT = $('<button type="button" id="HDClassicMode" class="openpttchat" title="展開/隱藏PTT聊天室" style="height: 36px; width: 36px; margin: 3px; font-size: 21px;">P</button>');
    liveControls.prepend(iconPTT, iconSwitch);
    parent.append(fakeparent);
    fakeparent.append(defaultVideoHandler);
    defaultVideoHandler.append(defaultVideo);
    PTTChatHandler.css('z-index', '5');
    fakeparent.append(PTTChatHandler);
    if (GM_getValue('PluginTypeHolodex', '1') === '0') iconPTT.css('display', 'none');
    let nowWidth = 0;
    let collapseStart = false;
    let collapseEnd = true;
    iconPTT.on('click', () => {
      useExtensionEvent();

      if (GM_getValue('PluginTypeHolodex', '1') === '1') {
        if (collapseEnd || !collapseStart) {
          if (nowWidth === 0) {
            $('#PTTMain').collapse('show');
            nowWidth = pluginWidth;
          } else {
            $('#PTTMain').collapse('hide');
            nowWidth = 0;
          }

          $('#pttchatparent').css('flex', `0 0 ${nowWidth}px`);
        }
      }

      if (false) {}
    });
    $(document).on('show.bs.collapse hide.bs.collapse', '#PTTMain', () => {
      collapseStart = true;
      collapseEnd = false;
    });
    $(document).on('shown.bs.collapse hidden.bs.collapse', '#PTTMain', () => {
      collapseStart = false;
      collapseEnd = true;
    });
    iconSwitch.on('click', () => {
      if (confirm(`切換為${GM_getValue('PluginTypeHolodex', '1') === '0' ? '舊' : '新'}版PTT顯示模式？`)) {
        if (GM_getValue('PluginTypeHolodex', '1') === '0') {
          clearInterval(mainTimer);
          if (observer) observer.disconnect();
          $('[name="ptt-boot-btn"]').remove();
          iconPTT.css('display', 'block');
          GM_setValue('PluginTypeHolodex', '1');
        } else {
          iconPTT.css('display', 'none');
          $('#pttchatparent').css('flex', '0 0 0px');
          GM_setValue('PluginTypeHolodex', '0');
          mainTimer = setInterval(appendPttEmbedBtn, 1000);
        }

        initPttChatStyle();
        if (false) {}
      }
    });

    function initPttChatStyle() {
      switch (GM_getValue('PluginTypeHolodex', '1')) {
        case '0':
          if ($('.vue-grid-layout #PTTChat').length === 0) $('#PTTChat').appendTo($('.vue-grid-layout')).css('display', 'none');
          break;

        case '1':
          if ($('#pttchatparent #PTTChat').length === 0) $('#PTTChat').appendTo($('#pttchatparent'));
          $('#PTTChat-contents').css('height', `${GM_getValue('PluginHeight', 400)}`);
          $('#PTTChat-app').height('');
          $('#PTTChat').addClass('w-100').attr('style', '');
          break;
      }

      $('#PTTMain').collapse('hide');
    }

    if ($('#PTTChat').length === 0) {
      InitApp($('#pttchatparent'), WhiteTheme, true, messageposter, siteName, true);
      ChangeLog();
      const pttFrame = $('<div id="ptt-frame-parent" style="position: absolute; z-index: 6;"><iframe id="PTTframe" src="//term.ptt.cc/?url=https://holodex.net" style="display:none;">你的瀏覽器不支援iframe</iframe></div>');
      $('.vue-grid-layout').append(pttFrame);
      listenPttFrameBtn();
      if (false) {}
    }

    let mainTimer = GM_getValue('PluginTypeHolodex', '1') === '0' ? setInterval(appendPttEmbedBtn, 1000) : undefined;
    recentWatch = true;
    if (false) {}
  }

  function appendPttEmbedBtn() {
    const btnParentSet = $('.centered-btn');
    btnParentSet.each(index => {
      const btnParent = btnParentSet.eq(index);
      if (btnParent.find($('[name="ptt-boot-btn"]')).length !== 0) return;
      const btn = btnParent.children().eq(0).clone();
      btn.attr({
        name: 'ptt-boot-btn',
        style: 'background-color:rgb(130, 30, 150)!important;margin-top:8px;width:190px;'
      }).appendTo(btnParent);
      btn.classList.add('openpttchat');
      btn.id = 'HDNewMode';
      btn.find($('.v-btn__content')).eq(0).text('P').css('font-size', '20px');
      btn.on('click', () => {
        useExtensionEvent();
        const gridIndex = btn.parents().eq(3).index();
        btnParent.children().eq(1).children().eq(1).trigger('click');
        appendPtt2Cell(gridIndex);
        if (false) {}
      });
    });
  }

  function appendPtt2Cell(gridIndex) {
    if ($('.vue-grid-layout #PTTChat').length === 0) $('#PTTChat').appendTo($('.vue-grid-layout')).css('display', 'none');
    const cell = $('.vue-grid-item').eq(gridIndex);
    const config = {
      attributes: true
    };
    if (observer) observer.disconnect();
    observer = new MutationObserver(() => {
      if (repositionTimer) clearTimeout(repositionTimer);
      repositionTimer = setTimeout(repositionPttChat, 10, cell);
    });
    observer.observe(cell[0], config);
    checkFilledWithVideo(cell);
  }
  /** @param {JQuery} parentCell */


  function repositionPttChat(parentCell) {
    const sheet = parentCell.find($('.mv-cell.v-sheet')).eq(0);
    const editMode = sheet.hasClass('edit-mode');
    const height = sheet.height();
    const width = sheet.width();
    let el = sheet[0];
    let x = 0;
    let y = 0;

    while (el.className !== 'vue-grid-layout') {
      x += el.offsetLeft - el.scrollLeft + el.clientLeft;
      y += el.offsetTop - el.scrollLeft + el.clientTop;
      el = el.offsetParent;
    }

    $('#PTTChat-contents').height('');

    if (editMode) {
      $('#PTTChat').attr('style', `z-index: 5; margin: ${y + 20}px 0px 0px ${x + 20}px; width: ${width}px !important;`);
      $('#PTTChat-app').height(height - 68);
    } else {
      $('#PTTChat').attr('style', `z-index: 5; margin: ${y}px 0px 0px ${x}px; width: ${width}px !important;`);
      $('#PTTChat-app').height(height - 24);
    }

    $('#PTTChat').removeClass('w-100').css('display', 'block');
    $('#PTTMain').collapse('show');
    checkCellRemoved(parentCell[0]);
  }

  function checkCellRemoved(observeredNode) {
    if ($('.vue-grid-layout').length === 0) setTimeout(checkCellRemoved, 10, observeredNode);else {
      if (layoutObserver) layoutObserver.disconnect();
      layoutObserver = new MutationObserver(mutations => {
        mutations.forEach(el => {
          el.removedNodes.forEach(e => {
            if (e === observeredNode) hidePttChatInGrid();
          });
        });
      });
      const config = {
        childList: true
      };
      layoutObserver.observe($('.vue-grid-layout')[0], config);
    }
  }

  function hidePttChatInGrid() {
    if ($('.vue-grid-layout #PTTChat').length !== 0) {
      $('#PTTChat').css('display', 'none');
      $('#PTTMain').collapse('hide');
    }

    if (observer) observer.disconnect();
    if (false) {}
  }

  function checkFilledWithVideo(cell) {
    if (cell.find($('.mv-frame.ma-auto')).length === 0) setTimeout(checkFilledWithVideo, 1000, cell);else {
      if (false) {}
      hidePttChatInGrid();
    }
  }

  function listenPttFrameBtn() {
    $('#nav-item-PTT').off('click').on('click', () => {
      setTimeout(repositionFrame, 100); // get position recursively

      function repositionFrame() {
        let el = $('#PTTMainBtn')[0];
        let x = 0;
        let y = 0;

        while (el && el.className !== 'v-main__wrap') {
          x += el.offsetLeft - el.scrollLeft + el.clientLeft;
          y += el.offsetTop - el.scrollLeft + el.clientTop; // console.log(el)

          el = el.offsetParent;
        }

        y = y + $('#PTTChat-navbar').height() - document.querySelector('.v-main__wrap .v-toolbar__content').offsetHeight;
        const height = $('#PTTChat-app').height() - $('#PTTChat-navbar').height();
        const width = $('#PTTChat').width();
        $('#ptt-frame-parent').css('margin', `${y}px 0px 0px ${x}px`);
        $('#PTTframe').css({
          height: `${height}px`,
          width: `${width}px`
        }); // 轉場動畫 50ms

        if ($('#PTTChat-contents-PTT').width() === 0) $('#PTTframe').css({
          border: 'none',
          display: 'none'
        });else $('#PTTframe').css({
          border: 'revert',
          display: 'block'
        });
        if ($('#nav-item-PTT').hasClass('active')) setTimeout(repositionFrame, 10);else $('#PTTframe').css({
          border: 'none',
          display: 'none'
        });
      }
    });
  }
}
// CONCATENATED MODULE: ./src/SupportWebsite/holodex/hdfilter.js


const hdfilter = InsFilter('Holodex', /holodex\.net/, 'https://holodex.net', InitHD);
/* harmony default export */ var holodex_hdfilter = (hdfilter);
// EXTERNAL MODULE: ./src/scss/index.scss
var scss = __webpack_require__(23);

// CONCATENATED MODULE: ./src/main.js






 // import { lineTVfilter } from './SupportWebsite/lineTV/lineTVfilter'



/* 關閉vue-devtools */

Vue.config.devtools = false;
/* 關閉錯誤警告 */

Vue.config.debug = false;

(function () {
  const msg = new MessagePoster();
  const filters = [];
  filters.push(youtube_ytfilter);
  filters.push(holotools_htfilter);
  filters.push(blank_blankfilter);
  filters.push(twitch_twitchfilter);
  filters.push(nijimado_nijimadofilter); // filters.push(lineTVfilter);

  filters.push(holodex_hdfilter);
  HerfFilter(msg, filters);
})();

/***/ })
/******/ ]);