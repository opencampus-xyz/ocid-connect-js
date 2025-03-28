var webpack = require('webpack');
var path = require('path');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    optimization: {
        innerGraph: false,
    },
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name]',
    },
    module: {
        rules: [
            {
                test: /\.jsx?/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                exclude: /(node_modules)/,
                sideEffects: true,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
        alias: {
            'ocid-connect-js': path.resolve(__dirname, 'src/index.js'),
        },
    },
    plugins: [new webpack.IgnorePlugin(/vertx/)],
};
