import * as path from 'path';
import * as webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import StatoscopePlugin from '@statoscope/webpack-plugin';
import ModuleLogger from './plugins/moduleLogger';

const config: webpack.Configuration = {
    mode: 'production',
    target: 'web',
    entry: {
        root: './src/pages/root.tsx',
        root2: './src/pages/root2.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[contenthash].js',
    },
    optimization: {
        minimize: true,
        moduleIds: 'deterministic',
        innerGraph: true,
        concatenateModules: true,
        splitChunks: { 
            chunks: "all",
            minSize: 0,
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/    
                }
            }
        }
    },
    cache: {
        type: 'filesystem',
        buildDependencies: {
            config: [__filename]
        }
    },
    plugins: [
        new HtmlWebpackPlugin({  // Also generate a test.html
            filename: 'index.html',
            template: 'src/index.html'
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
        alias: {
            '../components/Link' : path.resolve(__dirname, 'src/i.ts')
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/, 
                include: path.resolve('src'),
                use: [
                    {
                        loader: 'thread-loader', 
                        options: {
                            workers: 2,
                            workerParallelJobs: 50,
                            poolTimeout: 2000
                        }
                    },
                    {
                        loader: 'babel-loader', 
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }, 
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true,
                            happyPackMode: true
                        }
                    }
                    ], 
                exclude: /node_modules/
            }
        ]
    }
};

export default config;
