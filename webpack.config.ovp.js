'use strict';

const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config');
const merge = require('webpack-merge');
const playerType = 'ovp';

const plugins = [
  new webpack.DefinePlugin({
    __PLAYER_TYPE__: JSON.stringify(playerType),
  })
];

const entry = {
  'kaltura-ovp-player': 'index.js'
};

const alias = {
  'playkit-js-providers': path.resolve('./node_modules/playkit-js-providers/dist/playkit-ovp-provider'),
  'player-defaults': path.resolve('./src/ovp/player-defaults'),
  poster: path.resolve('./src/ovp/poster')
};

const webpackConfig = merge(baseConfig, {
  resolve: {
    alias
  },
  entry,
  plugins
});

module.exports = webpackConfig;
