'use strict';

const webpack = require("webpack");
const path = require("path");
const libraryName = "KalturaPlayer";
const PROD = (process.env.NODE_ENV === 'production');

let plugins = 1 ? [
  new webpack.optimize.UglifyJsPlugin({sourceMap: true})
] : [];
const sourceMaps = 'source-map';
module.exports = {
  context: __dirname + "/src",
  entry: {
    "Kaltura-player": "index.js"
  },
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: libraryName,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  devtool: sourceMaps,
  plugins: plugins,
  module: {
    rules: [{
      test: /\.js$/,
      use: [{
        loader: "babel-loader",
        // options: { presets: ["es2015"] }
      }],
      exclude: [/node_modules/]
    }, {
      test: /\.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  devServer: {
    contentBase: __dirname + "/src"
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  }
};
