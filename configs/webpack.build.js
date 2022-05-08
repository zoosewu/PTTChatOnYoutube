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
      showPttScreen: false || this.reportMode || this.showAllLog,
      showCommand: false || this.reportMode || this.showAllLog,
      showMessage: true || this.reportMode || this.showAllLog,
      showAlertMsg: false || this.showAllLog,
      defaultOpen: false,
      disablePttFrame: false,
      simulateIsStreaming: false
    })
  ]
})
