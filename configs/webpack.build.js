const mergeConfig = require('webpack-merge')
const commonConfig = require('./webpack.common')
const WebpackUserscript = require('webpack-userscript')

module.exports = mergeConfig(commonConfig, {
  mode: 'production',
  entry: './src/main.js',
  plugins: [
    new WebpackUserscript({
      metajs: false,
      headers: './configs/metadata.js'
    })
  ]
})
