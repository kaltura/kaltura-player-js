'use strict';

const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: __dirname + '/src',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'KalturaPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: './kaltura-player/[resource-path]'
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader'
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.js$/,
        use: ['source-map-loader'],
        enforce: 'pre'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: __dirname + '/src'
  },
  resolve: {
    alias: {
      'playkit-js': path.resolve('./node_modules/playkit-js')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
