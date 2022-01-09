const webpack = require('webpack')
const path = require('path')
const mergeConfig = require('webpack-merge')
const commonConfig = require('./webpack.common')
const WebpackUserscript = require('webpack-userscript')

module.exports = mergeConfig(commonConfig, {
  mode: 'development',
  entry: './src/main.js',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../dist'),
    https: true,
    hot: true,
    inline: true,
    allowedHosts: [
      '.blank.org' // example site
    ],
    disableHostCheck: true,
    open: true,
    openPage: 'main.user.js'
  },
  plugins: [
    new WebpackUserscript({
      metajs: false,
      headers: './configs/metadata.js'
    }),
    new webpack.DefinePlugin({
      reportMode: true,
      showAllLog: false,
      showPttScreen: false || this.reportMode || this.showAllLog,
      showCommand: false || this.reportMode || this.showAllLog,
      showMessage: true || this.reportMode || this.showAllLog,
      showAlertMsg: false || this.showAllLog,
      defaultOpen: false,
      disablePttFrame: false,
      simulateIsStreaming: false,
      showScrollLog: false
    })
  ]
})
