const isWindows = /^win/.test(process.platform);
const isMacOS = /^darwin/.test(process.platform);
// Create custom launcher in case running with Travis
const customLaunchers = {
  Chrome_travis_ci: {
    base: 'Chrome',
    flags: ['--no-sandbox']
  }
};

module.exports = function (config) {
  let karmaConf = {
    logLevel: config.LOG_INFO,
    browsers: [
      'Chrome',
      'Firefox'
    ],
    concurrency: 1,
    singleRun: true,
    colors: true,
    frameworks: [
      'mocha'
    ],
    files: [
      'test/setup/karma.js'
    ],
    preprocessors: {
      'src/**/*.js': [
        'webpack',
        'sourcemap'
      ],
      'test/setup/karma.js': [
        'webpack',
        'sourcemap'
      ]
    },
    reporters: [
      'progress',
      'coverage'
    ],
    webpack: {
      devtool: 'inline-source-map',
      module: {
        rules: [{
          test: /\.js$/,
          use: [{
            loader: "babel-loader"
          }],
          exclude: [
            /node_modules/
          ]
        }]
      }
    },
    webpackServer: {
      noInfo: true
    },
    client: {
      mocha: {
        reporter: 'html'
      }
    }
  };

  if (process.env.TRAVIS) {
    karmaConf.customLaunchers = customLaunchers;
    karmaConf.browsers = [
      'Chrome_travis_ci'
    ];
  } else {
    if (isWindows) {
      karmaConf.browsers.push('IE');
    } else if (isMacOS) {
      karmaConf.browsers.push('Safari');
    }
  }

  config.set(karmaConf);
};
