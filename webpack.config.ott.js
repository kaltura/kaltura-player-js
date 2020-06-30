'use strict';

const webpack = require('webpack');
const path = require('path');
const baseConfig = require('./webpack.config');
const merge = require('webpack-merge');
const playerType = 'ott';

const plugins = [
  new webpack.DefinePlugin({
    __PLAYER_TYPE__: JSON.stringify(playerType)
  })
];

const entry = {
  'kaltura-tv-player': 'index.js'
};

const alias = {
  'playkit-js-providers': path.resolve('./node_modules/playkit-js-providers/dist/playkit-ott-provider'),
  'playkit-js-analytics': path.resolve('./src/ott/analytics'),
  'player-defaults': path.resolve('./src/ott/player-defaults'),
  poster: path.resolve('./src/ott/poster')
};

const webpackConfig = merge(baseConfig, {
  resolve: {
    alias
  },
  entry,
  plugins
});

module.exports = webpackConfig;
