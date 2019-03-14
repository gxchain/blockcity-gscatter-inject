const path = require('path')

module.exports = {
    mode: 'development',
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
    resolve: {
        alias: {
            'gxclient': path.resolve(__dirname, 'node_modules/gxclient/lib')
        }
    },
    output: {
        path: path.resolve(__dirname, 'dev'),
        filename: 'inject.js'
    },
    devtool: 'source-map'
}
