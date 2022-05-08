const md = require('./metadata.js')
const metadata = { ...md }
metadata.version = '[version]-build.[buildNo]'
metadata.require = [...md.require]
metadata.require.splice(4, 0, 'https://cdn.jsdelivr.net/npm/vue@2.6.14/dist/vue.min.js')
metadata.require.splice(5, 0, 'https://cdn.jsdelivr.net/npm/vuex@3.6.2/dist/vuex.min.js')

module.exports = metadata
