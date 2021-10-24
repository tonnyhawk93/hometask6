import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';

import ModuleLogger from './plugins/moduleLogger';

const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        root: './src/pages/root.tsx',
        root2: './src/pages/root2.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'hw6',
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html'
        }),
        new ModuleLogger(),
        new StatoscopePlugin({
            saveStatsTo: 'stats.json',
            saveOnlyStats: false,
            open: false,
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            "buffer": require.resolve("buffer"),
            "stream": false,
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, 
                use: [
                    {
                        loader: 'babel-loader', 
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }, 
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true
                        }
                    }
            ], 
                exclude: /node_modules/
            }
        ]
    }
};

export default config;
