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
  }
};

module.exports = config => {
  const {mode} = config;
  const webpackConfig = require('./webpack.config.js')(process.env.NODE_ENV, {mode});
  //Need to remove externals otherwise they won't be included in test
  delete webpackConfig.externals;
  // Need to define inline source maps when using karma
  webpackConfig.devtool = 'inline-source-map';

  const karmaConf = {
    logLevel: config.LOG_INFO,
    customLaunchers: launchers,
    browsers: ['Chrome_browser', 'Firefox'],
    concurrency: 1,
    singleRun: true,
    colors: true,
    frameworks: ['mocha'],
    files: [
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
    webpack: webpackConfig,
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

  config.set(karmaConf);
};
