/**
 * Created by winder on 2017/1/3.
 */

var helpers = require('./helpers');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [{
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader', 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'

            },{
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'null'
            }, {
                test: /\.less$/,
                include: helpers.root('src', 'app'),
                loaders: ['to-string', 'css', 'less']
            }, {
                test: /\.less$/,
                exclude: helpers.root('src', 'app'),
                loader: ExtractTextPlugin.extract(
                    "style-loader",
                    "css-loader!less-loader?sourceMap"
                )
            },
            {
                test: /\.css$/,
                exclude: helpers.root('src', 'app'),
                loader: 'null'
            },
            {
                test: /\.css$/,
                include: helpers.root('src', 'app'),
                loader: 'raw'
            }
        ]
    }
}
