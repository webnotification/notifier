/*
 * React.js Starter Kit
 * Copyright (c) Konstantin Tarkus (@koistya), KriaSoft LLC
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import path from 'path';
import webpack, { DefinePlugin, BannerPlugin } from 'webpack';
import merge from 'lodash/object/merge';
import minimist from 'minimist';
import nib from 'nib';
import axis from 'axis';

const argv = minimist(process.argv.slice(2));
const DEBUG = !argv.release;
const STYLE_LOADER = 'style-loader/useable';
const CSS_LOADER = DEBUG ? 'css-loader' : 'css-loader?minimize';
const AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24',
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
];
const GLOBALS = {
  'process.env.NODE_ENV': DEBUG ? '"development"' : '"production"',
  '__DEV__': DEBUG
};

//
// Common configuration chunk to be used for both
// client-side (app.js) and server-side (server.js) bundles
// -----------------------------------------------------------------------------




const config = {
  output: {
    publicPath: './',
    sourcePrefix: '  '
  },

  cache: DEBUG,
  debug: DEBUG,

  stats: {
    colors: true,
    reasons: DEBUG
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin()
  ],

  resolve: {
    alias: {
      "react": __dirname + '/node_modules/react',
      "react-addons-css-transition-group": __dirname + '/node_modules/react-addons-css-transition-group'
    },
    moduleDirectories: ['node_modules'],
    extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /\.gif$/, loader: 'url-loader?limit=10000&mimetype=image/gif' },
      { test: /\.jpg$/, loader: 'url-loader?limit=10000&mimetype=image/jpg' },
      { test: /\.png$/, loader: 'url-loader?limit=10000&mimetype=image/png' },
      { test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },
      { test: /\.jsx?$/,
        include: [ path.resolve(__dirname, 'src') ],
        loader: 'babel'
      }
    ],
    query: {
        // https://github.com/babel/babel-loader#options
        cacheDirectory: true,
        plugins: ['transform-decorators-legacy' ],
        presets: ['es2015', 'react', 'stage-0']
    }
  },

  stylus: {
    use: [nib(), axis()],
    import: [
      path.resolve(__dirname, './src/common/stylus/index.styl')
    ],
    error: DEBUG ? true : false,
    compress: DEBUG ? false: true,
    'include css': DEBUG ? false : true
  }

};

//
// Configuration for the client-side bundle (app.js)
// -----------------------------------------------------------------------------

const appConfig = merge({}, config, {
  entry: [
    './src/client/website/app.js'
  ],
  output: {
    path: path.join(__dirname, './build/public/website'),
    filename: 'app.js'
  },
  target: 'web',
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new DefinePlugin(merge({}, GLOBALS, {'__SERVER__': false})),
    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}}),
      new webpack.optimize.AggressiveMergingPlugin()
    ]),
    ...(DEBUG ? [
      new webpack.NoErrorsPlugin()
    ] : [])
  ],
  module: {
    loaders: [...config.module.loaders, {
      test: /\.styl$/,
      loader: `${STYLE_LOADER}!${CSS_LOADER}!stylus-loader`
    }]
  }
});


//
// Configuration for the dashboard bundle (app.js)
// -----------------------------------------------------------------------------

const dashboardConfig = merge({}, config, {
  entry: [
    './src/client/dashboard/app.js'
  ],
  output: {
    path: path.join(__dirname, './build/public/dashboard'),
    filename: 'app.js'
  },
  target: 'web',
  devtool: DEBUG ? 'source-map' : false,
  plugins: [
    ...config.plugins,
    new webpack.ProvidePlugin({
      React: 'react'
    }),
    new DefinePlugin(merge({}, GLOBALS, {'__SERVER__': false})),
    ...(DEBUG ? [] : [
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({compress: {warnings: VERBOSE}}),
      new webpack.optimize.AggressiveMergingPlugin()
    ]),
    ...(DEBUG ? [
      new webpack.NoErrorsPlugin()
    ] : [])
  ],
  module: {
    loaders: [...config.module.loaders, {
      test: /\.styl$/,
      loader: `${STYLE_LOADER}!${CSS_LOADER}!stylus-loader`
    }]
  }
});

//
// Configuration for the server-side bundle (server.js)
// -----------------------------------------------------------------------------

const serverConfig = merge({}, config, {
  entry: ['./src/server/index.js'],
  output: {
    path: './build',
    filename: 'server.js',
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  externals: [
    /^[a-z\-0-9]+$/
  ],
  node: {
    console: false,
    global: false,
    process: false,
    Buffer: false,
    __filename: false,
    __dirname: false
  },
  devtool: DEBUG ? 'source-map' : 'cheap-module-source-map',
  plugins: [
    ...config.plugins,
    new DefinePlugin(merge({}, GLOBALS, {'__SERVER__': true})),
    new BannerPlugin('require("source-map-support").install();',{
      raw: true, entryOnly: false
    }),
    new webpack.ProvidePlugin({
      React: 'react'
    })
  ],

  module: {
    loaders: [...config.module.loaders, {
      test: /\.styl$/,
      loader: 'css-loader!stylus-loader'
    }]
  }
});

export default [dashboardConfig, appConfig, serverConfig];
