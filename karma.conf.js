const isWindows = /^win/.test(process.platform);
const isMacOS = /^darwin/.test(process.platform);
// Create custom launcher in case running with Travis
const customLaunchers = {
  Chrome_travis_ci: {
    base: 'Chrome',
    flags: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  }
};

const launchers = {
  Chrome_browser: {
    base: 'Chrome',
    flags: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  },
  Firefox_browser: {
    base: 'Firefox',
    prefs: {
      'media.autoplay.default': 0
    }
  }
};

const timeout = 30 * 60 * 1000;

module.exports = config => {
  const karmaConf = {
    logLevel: config.LOG_INFO,
    customLaunchers: launchers,
    // browserNoActivityTimeout: timeout,
    // browserDisconnectTimeout: timeout,
    // captureTimeout: timeout,

    //plugins: ['karma-safarinative-launcher'],
    browsers: ['Chrome_browser', 'Firefox_browser'],
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
        timeout,
        reporter: 'html'
      }
    },
    browserConsoleLogOptions: {
      level: 'log',
      format: '%b %T: %m',
      terminal: true
    }
  };

  if (process.env.TRAVIS) {
    karmaConf.customLaunchers = customLaunchers;
    karmaConf.browsers = ['Chrome_travis_ci'];
  } else {
    if (isWindows) {
      karmaConf.browsers.push('IE');
    } else if (isMacOS) {
      karmaConf.browsers.push('Safari');
    }
  }

  karmaConf.browsers = ['Chrome_browser'];
  //karmaConf.browsers = ['Firefox_browser'];
  //karmaConf.browsers = ['SafariNative'];

  config.set(karmaConf);
};
