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
    contentBase: path.resolve(__dirname, '../src'),
    https: true,
    hot: true,
    inline: true,
    allowedHosts: [
      '.blank.org' // example site
    ],
    disableHostCheck: true,
    open: true,
    openPage: 'main.user.js',
    watchOptions: {
      poll: true, // or use an integer for a check every x milliseconds, e.g. poll: 1000,
      ignored: /node_modules/ // otherwise it takes a lot of time to refresh
    }
  },
  plugins: [
    new WebpackUserscript({
      metajs: false,
      headers: './configs/metadata.js'
    }),
    new webpack.DefinePlugin({
      reportMode: true,
      showAllLog: false,
      get showPttScreen () { return (false || this.reportMode || this.showAllLog) },
      get showCommand () { return (false || this.reportMode || this.showAllLog) },
      get showMessage () { return (true || this.reportMode || this.showAllLog) },
      get showAlertMsg () { return (false || this.showAllLog) },
      defaultOpen: false,
      disablePttFrame: false,
      simulateIsStreaming: false,
      showScrollLog: false
    })
  ]
})
