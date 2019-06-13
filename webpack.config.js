'use strict';

const webpack = require("webpack");
const path = require("path");
const packageData = require("./package.json");
// const PROD = (process.env.NODE_ENV === 'production');

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name),
    __PACKAGE_URL__: JSON.stringify(packageData.repository.url)
  })
];

module.exports = {
  context: __dirname + '/src',
  entry: {
    'kaltura-player': 'index.js'
  },
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
  plugins: plugins,
  devServer: {
    contentBase: __dirname + '/src'
  },
  resolve: {
    alias: {
      'playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js'),
      '@playkit-js/playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};
