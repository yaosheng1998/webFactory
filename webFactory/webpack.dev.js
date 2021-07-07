import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import WebpackBundleAnalyzer from 'webpack-bundle-analyzer';

import path from 'path';

import base from './webpack';
import proxy from './proxy.json';

const BundleAnalyzerPlugin = WebpackBundleAnalyzer.BundleAnalyzerPlugin;
const host = '0.0.0.0';
const port = process.env.PORT || 5007;
const publicPath = '/dist';

export default merge(base, {
    entry: {
        app: ['react-hot-loader/patch', path.join(__dirname, '/src/index.tsx')]
    },
    devtool: 'eval-source-map',
    output: {
        publicPath
    },
    plugins: [
        new HtmlWebpackPlugin({
            hash: true,
            title: 'NewsEditor',
            filename: 'dev.html',
            template: './src/index.html',
            alwaysWriteToDisk: true,
            inject: true,
            // chunks: ["theme-beop", "app"],
            chunks: ['app'],
            chunksSortMode: 'manual',
            dev: true
        })

        // new BundleAnalyzerPlugin(),
    ],
    devServer: {
        port,
        host,
        inline: true,
        proxy,
        disableHostCheck: true,
        historyApiFallback: {
            verbose: true,
            rewrites: [{ from: /^\/$/, to: '/dist/dev.html' }]
        },
        compress: true
    }
});
