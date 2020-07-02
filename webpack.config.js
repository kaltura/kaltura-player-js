'use strict';

const webpack = require('webpack');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const packageData = require('./package.json');
const PROD = process.env.NODE_ENV === 'production';

const baseConfig = {
  context: __dirname + '/src',
  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: 'KalturaPlayer',
    libraryTarget: 'umd',
    umdNamedDefine: true,
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
  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(packageData.version),
      __NAME__: JSON.stringify(packageData.name),
      __PACKAGE_URL__: JSON.stringify(packageData.repository.url),
      __CONFIG_DOCS_URL__: JSON.stringify(`${packageData.repository.url}/blob/master/docs/configuration.md`)
    }),
    new CopyPlugin([{
      from: '../node_modules/@playkit-js/playkit-js-ui/translations',
      ignore: ['en.i18n.json'],
      transform: function(content) {
        // minify json
        return JSON.stringify(JSON.parse(content));
      },
      to: 'translations'
    }])
  ],
  resolve: {
    alias: {
      'playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js'),
      '@playkit-js/playkit-js': path.resolve('./node_modules/@playkit-js/playkit-js')
    },
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  }
};

if (PROD) {
  baseConfig.plugins.push(new webpack.optimize.UglifyJsPlugin({sourceMap: true}));
} else {
  baseConfig.plugins.push(
    new CopyPlugin([
      {
        from: '../samples/style.css',
        to: '.'
      }
    ])
  );
}

module.exports = baseConfig;
