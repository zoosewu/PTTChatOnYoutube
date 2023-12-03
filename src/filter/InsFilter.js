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
export default function InsFilter (siteName, siteRegExp, ownerOrigin, initCallback) {
  return {
    siteName: siteName,
    siteRegExp: siteRegExp,
    ownerOrigin: ownerOrigin,
    callback: initCallback
  }
}
