const webpackConfig = require('./webpack.config')( {playerType: 'ovp'},{mode: 'development'});
delete webpackConfig.entry;
delete webpackConfig.externals;
delete webpackConfig.output;
delete webpackConfig.devServer;
webpackConfig.devtool = 'inline-source-map';

module.exports = function (config) {
  config.set({
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['webpack', 'mocha'],

    // list of files / patterns to load in the browser
    // https://github.com/webpack-contrib/karma-webpack#alternative-usage
    files: [
      'node_modules/regenerator-runtime/runtime.js',
      {
        pattern: 'tests/index.js',
        watched: false
      },
      {
        pattern: 'tests/assets/mov_bbb.mp4',
        included: false
      },
      {
        pattern: 'tests/assets/audios.mp4',
        included: false
      }
    ],

    // list of files to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    // node_modules must not be webpacked or else Karma will fail to load frameworks
    preprocessors: {
      'tests/index.js': ['webpack', 'sourcemap']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],
    mochaReporter: {
      showDiff: true,
    },

    coverageIstanbulReporter: {
      reports: ['lcov', 'text-summary'],
      fixWebpackSourcePaths: true
    },

    webpack: webpackConfig,

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['ChromeHeadless'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    client: {
      mocha: {
        reporter: 'html',
        timeout: 50000
      }
    }
  });
};
