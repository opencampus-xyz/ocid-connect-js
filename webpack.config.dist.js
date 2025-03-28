var webpack = require('webpack');
var path = require('path');

const VENDOR_LIBS = ['react'];

module.exports = {
    mode: 'production',

    entry: {
        bundle: './src/index.js',
        vendor: VENDOR_LIBS,
    },

    output: {
        library: 'Slider',
        libraryTarget: 'umd',
        path: path.join(__dirname, 'dist'),
    },

    module: {
        rules: [
            {
                test: /\.js/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                sideEffects: true,
                exclude: /(node_modules)/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },

    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },

    externals: {
        react: {
            root: 'react',
            commonjs2: 'react',
            commonjs: 'react',
            amd: 'react',
        },
        'react-dom': {
            root: 'ReactDOM',
            commonjs2: 'react-dom',
            commonjs: 'react-dom',
            amd: 'react-dom',
        },
    },

    node: {
        Buffer: false,
    },

    devtool: 'source-map',

    performance: {
        hints: 'warning',
    },
    plugins: [],
};
