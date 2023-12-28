const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const packageData = require('./package.json');
const TerserPlugin = require('terser-webpack-plugin');
const chalk = require('chalk');

module.exports = (env, { mode }) => {
  const { playerType } = env;
  console.log(
    chalk.blue.bold('Player Type:') +
      ' ' +
      chalk.green.bold(playerType) +
      ' | ' +
      chalk.red.bold('Player Version:') +
      ' ' +
      chalk.redBright.bold(packageData.version) +
      ' | ' +
      chalk.yellow.bold('Mode:') +
      ' ' +
      chalk.yellow.bold(mode) +
      '\n'
  );
  return {
    target: 'web',
    entry: {
      [`kaltura-${playerType}-player.js`]: './src/index.ts',
      [`kaltura-${playerType}-player.mjs`]: './src/index.ts'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader']
        },
        {
          test: /\.(ts|js)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    bugfixes: true // This option will be enabled by default in Babel 8.
                    // run 'npx browserslist' to see supported browsers and version by the current target config & 'npx babel --show-config' to see the babel final target config
                  }
                ],
                '@babel/preset-typescript'
              ]
            }
          }
        },
        {
          test: /\.css$/i,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.js'],
      alias: {
        '@playkit-js/playkit-js-providers': path.resolve(
          `./node_modules/@playkit-js/playkit-js-providers/dist/playkit-${playerType}-provider`
        ),
        'player-defaults': path.resolve(`./src/${playerType}/player-defaults`),
        poster: path.resolve(`./src/${playerType}/poster`),
        'plugins-config-store': path.resolve(
          `./src/${playerType}/plugins/plugins-config-store`
        ),
        'hls.js': path.resolve(__dirname, 'node_modules/hls.js/dist/hls.min.js')
      }
    },
    output: {
      filename: '[name]',
      path: path.resolve(__dirname, 'dist'),
      library: {
        name: 'KalturaPlayer',
        type: 'var'
      },
      clean: mode === 'development'
    },
    devServer: {
      static: {
        directory: path.join(__dirname, 'demo')
      },
      client: {
        progress: true
      }
    },
    plugins: [
      new webpack.DefinePlugin({
        __PLAYER_TYPE__: JSON.stringify(playerType),
        __VERSION__: JSON.stringify(packageData.version),
        __NAME__: JSON.stringify(packageData.name),
        __PACKAGE_URL__: JSON.stringify(packageData.repository.url),
        __CONFIG_DOCS_URL__: JSON.stringify(
          `${packageData.repository.url}/blob/master/docs/configuration.md`
        )
      }),
      new CopyPlugin({
        patterns: [
          {
            from: 'node_modules/@playkit-js/playkit-js-ui/translations',
            to: 'translations',
            globOptions: {
              ignore: ['en.i18n.json']
            },
            transform: function (content) {
              return JSON.stringify(JSON.parse(content));
            }
          }
        ]
      })
    ],
    ignoreWarnings: [/Failed to parse source map/]
  };
};
