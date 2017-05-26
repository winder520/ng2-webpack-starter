var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
//var sprite = require('sprite-webpack-plugin');
var helpers = require('./helpers');
var path = require('path');

module.exports = {
  entry: {
    'polyfills': './src/polyfills.ts',
    'vendor': './src/vendor.ts',
    'app': './src/main.ts'
  },

  resolve: {
    extensions: ['.ts', '.js']
  },

  module: {
    rules: [{
      test: /\.ts$/,
      loaders: [
        {
          loader: 'awesome-typescript-loader',
          options: {
            configFileName: helpers.root('tsconfig.json')
          }
        },
        'angular2-template-loader',
        //懒加载
        'angular-router-loader'
      ]
    }, {
      test: /\.html$/,
      loader: 'html-loader'
    }, {
      test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
      loader: 'file-loader?name=assets/images/r/[name].[hash].[ext]'
    },
    {
      test: /\.less$/,
      include: helpers.root('src', 'app'),
      use: ['to-string-loader', 'css-loader', 'less-loader']
    }, {
      test: /\.less$/,
      exclude: helpers.root('src', 'app'),
      loader: ExtractTextPlugin.extract(
        {
          fallbackLoader: "style-loader",
           loader: "css-loader!less-loader?sourceMap"
          //loader: "less-loader?sourceMap"
        }
      )
    }, {
      //处理全局样式
      test: /\.css$/,
      exclude: helpers.root('src', 'app'),
      loader: ExtractTextPlugin.extract({ fallbackLoader: 'style-loader', loader: 'css-loader?sourceMap' })
    }, {
      //处理组件内样式
      test: /\.css$/,
      include: helpers.root('src', 'app'),
      loader: 'raw-loader'
    }
    ]
  },

  plugins: [

    // new sprite({
    //     'source': 'src/assets/images/css-sprites/',
    //     'imgPath': 'src/assets/images/',
    //     'cssPath': 'src/app/'
    // }),

    new CopyWebpackPlugin([
      {
        context: helpers.root('src', 'assets/images'),
        from: 'css-sprites/',
        to: 'assets/images/css-sprites'
      },
      {
        context: path.join(__dirname, '../'),
        from: 'favicon.ico',
        to: 'favicon.ico'
      }
    ]),

    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery',
      jquery: 'jquery'
    }),

    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills']
    }),
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/
    ),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    })
  ]
};
