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
    })
  ]
})
