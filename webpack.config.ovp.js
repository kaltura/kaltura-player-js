'use strict';

const webpack = require("webpack");
const path = require("path");
const packageData = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const webpackConfig = require("./webpack.config");
// const PROD = (process.env.NODE_ENV === 'production');
const playerType = "ovp";


const entry = {
  "kaltura-ovp-player": "index.js"
};

const alias = {
  // 'playkit-js-providers': path.resolve('./node_modules/playkit-js-providers/dist/playkit-ovp-provider'),
  'player-defaults': path.resolve('./src/ovp/player-defaults'),
  'poster': path.resolve('./src/ovp/poster')
};

Object.assign(webpackConfig.resolve.alias, alias);

webpackConfig.entry = entry;
// webpackConfig.plugins = plugins;

module.exports = webpackConfig;
