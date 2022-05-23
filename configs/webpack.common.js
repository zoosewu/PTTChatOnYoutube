const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  context: path.resolve(__dirname, '../'),
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'main.js'
  },
  optimization: {
    minimize: false
  },
  // externals: {
  //   vue: 'Vue'
  // },
  resolve: {
    alias: {
      menuCommand: path.resolve(__dirname, '../src/menuCommand/'),
      src: path.resolve(__dirname, '../src/'),
      PttController: path.resolve(__dirname, '../src/ptt/PttController/')
    },
    extensions: ['.js', '.vue', '.css']
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: [
          'vue-style-loader',
          'css-loader'
          // {
          //   loader: 'css-loader',
          //   options: { importLoaders: 1 }
          // },
          // 'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
  plugins: [new VueLoaderPlugin()]
}
