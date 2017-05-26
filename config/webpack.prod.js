/**
 * Created by winder on 2017/1/3.
 */
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var commonConfig = require('./webpack.common.js');
var helpers = require('./helpers');
var path = require('path');

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

module.exports = webpackMerge(commonConfig, {
  //devtool: 'source-map',

  output: {
    path: helpers.root('dist'),
    publicPath: '/',
    filename: 'assets/js/[name].[hash].js',
    chunkFilename: 'assets/js/[id].[hash].chunk.js'
  },

  // htmlLoader: {
  //   ignoreCustomFragments: [/\{\{.*?}}/],
  //   root: path.resolve(__dirname, '../'),
  //   attrs: ['img:src', 'link:href'],
  //   minimize: false // workaround for ng2
  // },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new webpack.LoaderOptionsPlugin({
      htmlLoader: {
        ignoreCustomFragments: [/\{\{.*?}}/],
        root: path.resolve(__dirname, '../'),
        attrs: ['img:src', 'link:href'],
        minimize: false // workaround for ng2
      }
    }),
    new ExtractTextPlugin('assets/css/[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});
