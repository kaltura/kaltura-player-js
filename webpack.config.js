'use strict';

const webpack = require("webpack");
const path = require("path");
const PROD = (process.env.NODE_ENV === 'production');
const packageData = require("./package.json");

let plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name),
    __PACKAGE_URL__: JSON.stringify(packageData.repository.url)
  })
];

if (PROD){
  plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
}

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
  plugins: plugins,
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
