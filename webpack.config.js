'use strict';

const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const packageData = require('./package.json');

const playerType = process.env.PLAYER_TYPE || 'ovp';
const playerFileType = playerType === 'ovp' ? 'ovp' : 'tv';

module.exports = (env, argv) => {
  const configs = [
    createConfig(env, argv, 'var')
  ];
  if (argv.mode === 'production') {
    configs.push(createConfig(env, argv, 'commonjs2'));
  }
  return configs;
};

function createConfig(env, argv, target) {
  const isProd = argv.mode === 'production';
  const plugins = [
    new webpack.DefinePlugin({
      __PLAYER_TYPE__: JSON.stringify(playerType),
      __VERSION__: JSON.stringify(packageData.version),
      __NAME__: JSON.stringify(packageData.name),
      __PACKAGE_URL__: JSON.stringify(packageData.repository.url),
      __CONFIG_DOCS_URL__: JSON.stringify(`${packageData.repository.url}/blob/master/docs/configuration.md`)
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: '../node_modules/@playkit-js/playkit-js-ui/translations',
          to: 'translations',
          globOptions: {
            ignore: ['en.i18n.json']
          },
          transform: function (content) {
            // minify json
            return JSON.stringify(JSON.parse(content));
          }
        }
      ]
    })
  ];

  if (!isProd) {
    plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: '../samples/style.css',
            to: '.'
          }
        ]
      })
    );
  }

  return {
    context: __dirname + '/src',
    entry: {
      [`kaltura-${playerFileType}-player`]: 'index.js'
    },
    output: {
      path: __dirname + '/dist',
      filename: `[name]${target === 'commonjs2' ? '.cjs' : ''}.js`,
      library: 'KalturaPlayer',
      libraryTarget: target,
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
    plugins,
    resolve: {
      alias: {
        'playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js'),
        '@playkit-js/playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js'),
        'playkit-js-providers': path.resolve(`./node_modules/playkit-js-providers/dist/playkit-${playerType}-provider`),
        'player-defaults': path.resolve(`./src/${playerType}/player-defaults`),
        poster: path.resolve(`./src/${playerType}/poster`)
      },
      modules: [path.resolve(__dirname, 'src'), 'node_modules']
    }
  };
};
