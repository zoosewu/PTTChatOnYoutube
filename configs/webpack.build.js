const webpack = require('webpack')
const mergeConfig = require('webpack-merge')
const commonConfig = require('./webpack.common')
const WebpackUserscript = require('webpack-userscript')

module.exports = mergeConfig(commonConfig, {
  mode: 'production',
  entry: './src/main.js',
  plugins: [
    new WebpackUserscript({
      metajs: false,
      headers: './configs/metadata.build.js'
    }),
    new webpack.DefinePlugin({
      reportMode: false,
      showAllLog: false,
      get showPttScreen () { return (false || this.reportMode || this.showAllLog) },
      get showCommand () { return (false || this.reportMode || this.showAllLog) },
      get showMessage () { return (false || this.reportMode || this.showAllLog) },
      get showAlertMsg () { return (false || this.showAllLog) },
      defaultOpen: false,
      disablePttFrame: false,
      simulateIsStreaming: false,
      showScrollLog: false
    })
  ]
})
