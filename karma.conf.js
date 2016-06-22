var webpack = require('webpack');
var babelMoreOptions = {
  presets: ['react', 'es2015']
};
module.exports = function(config) {
  config.set({
    browsers: ['PhantomJS'],
    singleRun: false,
    frameworks: ['mocha', 'sinon', 'chai'],
    files: [
      'test/index.js'
    ],
    proxies: {
    },
    preprocessors: {
      'test/index.js': ['webpack', 'sourcemap']
    },
    reporters: ['progress', 'coverage', 'coveralls'],
    coverageReporter: {
      type: 'lcov',
      dir: 'coverage/'
    },
    webpack: {
      devtool: 'inline-source-map',
      isparta: {
        embedSource: true,
        noAutoWrap: true,
        // these babel options will be passed only to isparta and not to babel-loader
        babel: {
          presets: ['es2015', 'react']
        }
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            // loader: "isparta",
            loader: 'babel',
            exclude: /node_modules/,
            query: {
              presets: ['react', 'es2015']
            },
            include: __dirname
          },
          {
            test: /src\/.*\.js$/,
            loader: "isparta",
            // loader: 'babel',
            exclude: /node_modules/,
            query: {
              presets: ['react', 'es2015']
            },
            include: __dirname
          }
        ],
        loaders: [
          {
            test: /\.css$/,
            loader: "style-loader!css-loader"
          }, {
            test: /\.(png|jpg|svg)$/,
            loader: 'url-loader?limit=8192'
          }, {
            test: /\.json$/,
            loader: 'json-loader'
          }
        ],
        noParse: /request\/server\.js/
      },
      node: {
        fs: "empty"
      },
      watch: true
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};