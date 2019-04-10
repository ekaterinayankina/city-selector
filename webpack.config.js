const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
    devtool: 'source-map',
    entry: [
        './src/app.js'
    ],
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'bundle.js'
    },

    module: {
        rules: [
            {
                test: /\.css$/,
                use: ExtractTextPlugin.extract(
                    {
                        fallback: 'style-loader',
                        use: ['css-loader']
                    })
            },
            {
                test: /\.scss$/,
                use:[
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            }
        ]
    }
};
