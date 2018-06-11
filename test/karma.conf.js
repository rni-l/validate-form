const webpack = require('webpack')
// Karma configuration
// Generated on Wed May 23 2018 18:54:07 GMT+0800 (HKT)

module.exports = function(config) {
  config.set({
    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'chai'],


    // list of files / patterns to load in the browser
    files: [
      './index.js'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      './index.js': ['webpack', 'sourcemap']
    },

    plugins: [
      'karma-mocha',
      'karma-chai',
      // 'karma-mocha-reporter',
      'karma-chrome-launcher',
      'karma-spec-reporter',
      'karma-webpack',
      'karma-sourcemap-loader',
      'karma-coverage-istanbul-reporter',
      'karma-coverage'
    ],

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage-istanbul'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity,

    coverageIstanbulReporter: {
      reports: ['html', 'lcovonly', 'text-summary'],
      dir: './test/coverage/',
      fixWebpackSourcePaths: true,
      // Most reporters accept additional config options. You can pass these through the `report-config` option
      'report-config': {
        // all options available at: https://github.com/istanbuljs/istanbul-reports/blob/590e6b0089f67b723a1fdf57bc7ccc080ff189d7/lib/html/index.js#L135-L137
        html: {
          // outputs the report in ./coverage/html
          subdir: 'html'
        }
      }
    },

    webpack: {
      mode: 'production',

      output: {
        path: __dirname + '/lib',
        filename: '[name].js',
        libraryTarget: 'umd'
      },

      devtool: 'inline-source-map',

      module: {
        rules: [
          {
            test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/
          },
          {
            test: /\.(js)$/,
            loader: 'istanbul-instrumenter-loader',
            exclude: /node_modules/,
            include: /src|packages/,
            enforce: 'post',
            options: {
              esModules: true
            }
          }
        ]
      },

      plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        })
      ]
    }
  })
}
