// Create custom launcher in case running with Travis
const launchers = {
  Chrome_browser: {
    base: 'ChromeHeadless',
    flags: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  }
};

module.exports = config => {
  const karmaConf = {
    logLevel: config.LOG_INFO,
    customLaunchers: launchers,
    browsers: [],
    concurrency: 1,
    singleRun: true,
    colors: true,
    frameworks: ['mocha'],
    files: [
      'node_modules/regenerator-runtime/runtime.js',
      'test/setup/karma.js',
      {
        pattern: 'test/assets/mov_bbb.mp4',
        included: false
      },
      {
        pattern: 'test/assets/audios.mp4',
        included: false
      }
    ],
    preprocessors: {
      'src/**/*.js': ['webpack', 'sourcemap'],
      'test/setup/karma.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'coverage'],
    webpack: {
      ...require('./webpack.config.js')(process.env.NODE_ENV, {mode: config.mode || 'development'})[0],
      externals: {}, //Need to remove externals otherwise they won't be included in test
      devtool: 'inline-source-map', // Need to define inline source maps when using karma
      mode: config.mode || 'development' // run in development mode by default to avoid minifying -> faster
    },
    webpackServer: {
      noInfo: true
    },
    client: {
      mocha: {
        timeout: 10000,
        reporter: 'html'
      }
    }
  };

  karmaConf.customLaunchers = launchers;
  karmaConf.browsers = ['Chrome_browser'];
  config.set(karmaConf);
};
