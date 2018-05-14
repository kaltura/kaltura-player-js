'use strict';

const webpack = require("webpack");
const path = require("path");
const packageData = require("./package.json");
const CopyPlugin = require("copy-webpack-plugin");
const webpackConfig = require("./webpack.config");
const PROD = (process.env.NODE_ENV === 'production');
const playerType = "ott";


const entry = {
  "kaltura-tv-player": "index.js"
};

const alias = {
  'playkit-js-analytics': path.resolve('./node_modules/playkit-js-ott-analytics'),
  'player-defaults': path.resolve('./src/ott/player-defaults'),
  'poster': path.resolve('./src/ott/poster')
};

// TODO: Webpack merge?
Object.assign(webpackConfig.resolve.alias, alias);

webpackConfig.entry = entry;
webpackConfig.plugins = plugins;

module.exports = webpackConfig;
