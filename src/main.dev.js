// eslint-disable-next-line no-undef
GM_xmlhttpRequest({
  method: 'GET',
  url: 'https://localhost:8080/main.js',
  onload: response => {
    // eslint-disable-next-line no-eval
    eval(response.responseText)
  }
})
