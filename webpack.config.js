const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const buildDate = new Date().toGMTString().slice(0, 25);
const buildHash = (+new Date() / 1000).toFixed(0);

const plugins = [
    new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /fa/),
    new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: JSON.stringify(nodeEnv)
        }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
        title: 'HOP: The HbbTV Open Platform',
        description: 'HbbTV Open Platform built to run on HbbTV-ready TV sets.',
        template: '!!ejs-loader!src/index.html',
        direction: 'rtl',
        language: 'fa-IR',
        languageCode: 'fa',
        modified: buildDate,
        buildHash: buildHash,
        hash: true,
        inject: 'head',
        cache: false
    }),
    new webpack.LoaderOptionsPlugin({
        options: {
            tslint: {
                emitErrors: true,
                failOnHint: true
            }
        }
    }),
    new CopyWebpackPlugin([
        {from: './assets', to: 'assets/'},
        {from: '.htaccess'}
    ])
];

var config = {
    devtool: isProd ? '' : 'source-map',
    context: path.resolve('./src'),
    entry: {
        // vendor: Object.keys(package.dependencies),
        app: './main.ts'
    },
    node: {
        __filename: true
    },
    output: {
        path: path.resolve('./dist'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                enforce: 'pre',
                test: /\.ts?$/,
                exclude: [/\/node_modules\//],
                use: ['awesome-typescript-loader', 'source-map-loader']
            },
            !isProd
                ? {
                    test: /\.(js|ts)$/,
                    loader: 'istanbul-instrumenter-loader',
                    exclude: [/\/node_modules\//],
                    query: {
                        esModules: true
                    }
                }
                : null,
            {test: /\.html$/, loader: 'html-loader'},
            {test: /\.css$/, loaders: ['style-loader', 'css-loader']}
        ].filter(Boolean)
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            handlebars: 'handlebars/dist/handlebars.min.js',
            "handlebars/runtime": 'handlebars/dist/handlebars.runtime.min.js'
        }
    },
    plugins: plugins,
    devServer: {
        contentBase: path.join(__dirname, 'dist/'),
        compress: true,
        port: 3000,
        hot: true
    }
};

module.exports = config;
