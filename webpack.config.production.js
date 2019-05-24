const path = require('path')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    entry: './src/inject',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'inject.js'
    },
    resolve: {
        alias: {
            'gxclient': path.resolve(__dirname, 'node_modules/gxclient/lib')
        }
    },
    // plugins: [new BundleAnalyzerPlugin()],
    optimization: {
        minimizer: [
            // we specify a custom UglifyJsPlugin here to get source maps in production
            new TerserPlugin({
                terserOptions: {
                    output: {
                        comments: false
                    },
                    safari10: true
                }
            })
        ]
    }
}
