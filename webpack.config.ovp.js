'use strict';

const webpack = require("webpack");
const path = require("path");
const packageData = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const webpackConfig = require("./webpack.config");
const PROD = (process.env.NODE_ENV === 'production');
const playerType = "ovp";

const plugins = [
  new webpack.DefinePlugin({
    __VERSION__: JSON.stringify(packageData.version),
    __NAME__: JSON.stringify(packageData.name),
    __PACKAGE_URL__: JSON.stringify(packageData.repository.url),
    __PLAYER_TYPE__: JSON.stringify(playerType)
  })
];

if (PROD) {
  plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
} else {
  plugins.push(new CopyPlugin([{
    from: '../samples/style.css',
    to: '.'
  }]));
}

const entry = {
  "kaltura-ovp-player": "index.js"
};

const alias = {
  'playkit-js-providers': path.resolve('./node_modules/playkit-js-providers/dist/playkit-ovp-provider'),
  'playkit-js-analytics': path.resolve('./src/ovp/analytics-plugins'),
  'player-defaults': path.resolve('./src/ovp/player-defaults')
};

Object.assign(webpackConfig.resolve.alias, alias);

webpackConfig.entry = entry;
webpackConfig.plugins = plugins;

module.exports = webpackConfig;
