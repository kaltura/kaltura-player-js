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
  context: __dirname + "/src",
  output: {
    path: __dirname + "/dist",
    filename: '[name].js',
    library: 'KalturaPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true,
    devtoolModuleFilenameTemplate: "./kaltura-player/[resource-path]",
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
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
  plugins: plugins,
  devServer: {
    contentBase: __dirname + "/src",
    host: "0.0.0.0",
    port:8080
  },
  resolve: {
    alias: {
      'playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js'),
      '@playkit-js/playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js')
    },
    modules: [
      path.resolve(__dirname, "src"),
      "node_modules"
    ]
  },
  externals: {
    "@playkit-js/playkit-js": {
      commonjs: "@playkit-js/playkit-js",
      commonjs2: "@playkit-js/playkit-js",
      amd: "@playkit-js/playkit-js",
      root: ["playkit", "core"]
    },
    "@playkit-js/playkit-js-ui": {
      commonjs: "@playkit-js/playkit-js-ui",
      commonjs2: "@playkit-js/playkit-js-ui",
      amd: "@playkit-js/playkit-js-ui",
      root: ["playkit", "ui"]
    }
  }
};
