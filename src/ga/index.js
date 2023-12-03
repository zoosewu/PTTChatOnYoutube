import activatingExtensionEvent from './activatingExtensionEvent'
export default function ga () {
  const gtmhead = document.createElement('script')
  gtmhead.innerText = '(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({\'gtm.start\':  new Date().getTime(),event:\'gtm.js\'});var f=d.getElementsByTagName(s)[0],  j=d.createElement(s),dl=l!=\'dataLayer\'?\'&l=\'+l:\'\';j.async=true;j.src= \'https://www.googletagmanager.com/gtm.js?id=\'+i+dl;f.parentNode.insertBefore(j,f); })(window,document,\'script\',\'pttDataLayer\',\'GTM-MFFJTMF\');'
  const head = document.getElementsByTagName('head')[0]
  if (head) {
    head.appendChild(gtmhead)
  }
  const noscript = document.createElement('noscript')
  noscript.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-MFFJTMF"  height="0" width="0" style="display:none;visibility:hidden"></iframe>'
  const body = document.getElementsByTagName('body')[0]
  if (body) {
    body.appendChild(noscript)
  }
  setTimeout(() => { activatingExtensionEvent() }, 500)
}
