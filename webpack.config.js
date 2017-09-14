'use strict';

const webpack = require("webpack");
const path = require("path");
const PROD = (process.env.NODE_ENV === 'production');

module.exports = {
  context: __dirname + "/src",
  entry: PROD ? {"kaltura-player.min": "index.js"} : {"kaltura-player": "index.js"},
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: 'KalturaPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: 'source-map',
  plugins: PROD ? [new webpack.optimize.UglifyJsPlugin({sourceMap: true})] : [],
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader"
      }],
      exclude: [
        /node_modules/
      ]
    }, {
      test: /\.js$/,
      use: [
        "source-map-loader"
      ],
      enforce: "pre"
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader'
      ]
    }]
  },
  devServer: {
    contentBase: __dirname + "/src"
  },
  resolve: {
    alias: {
      'playkit-js': path.resolve('./node_modules/playkit-js')
    },
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  }
};
