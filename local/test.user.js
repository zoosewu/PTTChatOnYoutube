// ==UserScript==
// @name        test script
// @namespace   Test Script
// @description test your script on userscript manager
// @match       https://blank.org/
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @version     1.0
// @author      -
// @run-at      document-start
// @require     https://code.jquery.com/jquery-2.2.4.min.js
// @require     https://cdn.jsdelivr.net/npm/vue@2.6.14
// ==/UserScript==

/* the '@match', '@grant', '@require' MUST be same with the headers in 'configs/webpack.build.js' EXCEPT for 'GM_xmlhttpRequest' */
/* paste these code on your userscript manager and test it */

GM_xmlhttpRequest({
  method: "GET",
  url: "https://localhost:8080/main.js",
  onload: response => {
    eval(response.responseText)
  }
})