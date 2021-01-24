// node module for working wih file and dir paths
const path = require('path');
/**
 * webpack-merge is used to merge 2 webpack configurations
 * docs: https://www.npmjs.com/package/webpack-merge
 */
const { merge } = require("webpack-merge");
/** 
 * the HtmlWebpackPlugin simplifies creation 
 * of html files to serve you webpack bundles
 * docs: https://webpack.js.org/plugins/html-webpack-plugin/
 */
var HtmlWebpackPlugin = require("html-webpack-plugin");
/**
 * PostCSS Normalize lets you use the parts of normalize.css or sanitize.css that you need from your browserslist.
 * docs: https://www.npmjs.com/package/postcss-normalize
 */
const postcssNormalize = require('postcss-normalize');
/**
 * This plugin uses cssnano to optimize and minify your CSS.
 * docs: https://github.com/webpack-contrib/css-minimizer-webpack-plugin
 */
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
/**
 *  This plugin uses terser to minify your JavaScript
 *  docs: https://webpack.js.org/plugins/terser-webpack-plugin/
 */
const TerserPlugin = require("terser-webpack-plugin");
/**
 * This plugin extracts CSS into separate files. It creates a CSS file per JS file which contains CSS. It supports On-Demand-Loading of CSS and SourceMaps.
 * docs: https://webpack.js.org/plugins/mini-css-extract-plugin/
 */
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
/**
 * A webpack plugin to remove/clean your build folder(s).
 * docs: https://github.com/johnagan/clean-webpack-plugin
 */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

/*
* A Webpack plugin that allows you to copy 
* files and directories before and after builds
* docs: https://github.com/gregnb/filemanager-webpack-plugin
*/
const FileManagerPlugin = require('filemanager-webpack-plugin');

// shared configuration
const commonConfig = {
    // entry file to your project
    entry: {
        main: path.resolve(__dirname, 'src', 'index.tsx'),
        // import your vendor js libraries in vendor so you don't
        // have to recompile them every time you change your code
        vendor: path.resolve(__dirname, 'src', 'vendor.tsx'),
    },

    // describe how to resolve path for imported modules
    resolve: {
        // aliases for importing modules
        // instead of import react from '../../node_modules/react
        // use import react from 'react'
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },

        // attempt to resolve these extensions in order
        extensions: ['.tsx', '.ts', '.jsx', '.js']
    },

    // where the build folder is
    output: {
        filename: '[name].[contenthash].bundle.js',
        path: path.resolve(__dirname, 'build'),
    },

    // loaders help webpack understand other files like css
    module: {
        rules: [
            {
                test: /\.(svg|png|jpg|gif)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: "[name].[hash].[ext]",
                        outputPath: "assets/images"
                    }
                }
            },
            {
                test: /\.(js|jsx|tsx|ts)$/,
                exclude: /node_modules/,
                use: {
                    /**
                     * This package allows transpiling JavaScript files using Babel and webpack.
                     * docs: https://webpack.js.org/loaders/babel-loader/
                     */
                    loader: 'babel-loader',
                }
            },
        ]
    }
}

const postCssLoaderConfig = {
    loader: "postcss-loader",
    options: {
        postcssOptions: {
            plugins: [
                [
                    'postcss-flexbugs-fixes',
                ],
                [
                    "postcss-preset-env",
                    {
                        autoprefixer: {
                            flexbox: 'no-2009',
                        },
                        stage: 3,
                    },
                ],
                postcssNormalize(),
            ]
        }
    }
}

// development configuration
const devConfig = merge(commonConfig, {
    mode: 'development',

    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    "style-loader", //2. Inject styles into DOM
                    "css-loader", //1. Turns css into commonjs
                    postCssLoaderConfig,
                ]
            }
        ]
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, "src", "index.ejs"),
        })
    ],

    // configurations for the webpack development server
    devServer: {
        historyApiFallback: true,
        stats: {
            colors: true,
            hash: false,
            version: false,
            timings: false,
            assets: false,
            chunks: false,
            modules: false,
            reasons: false,
            children: false,
            source: false,
            errors: false,
            errorDetails: false,
            warnings: false,
            publicPath: false
        }
    }
});

// production configuration
const prodConfig = merge(commonConfig, {
    mode: "production",


    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader, //2. Extract css into files
                    "css-loader", //1. Turns css into commonjs
                    postCssLoaderConfig,
                ]
            }
        ]
    },

    optimization: {
        minimize: true,
        minimizer: [

            new CssMinimizerPlugin(),

            new TerserPlugin(),

            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, "src", "index.ejs"),

                inject: false,

                minify: {
                    removeAttributeQuotes: true,
                    collapseWhitespace: true,
                    removeComments: true
                }
            })
        ],
    },

    plugins: [

        new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),

        new CleanWebpackPlugin(),
    ],
});


// uses env variables to determine what configuration to use
// you change env variables in package.json file in scripts section
module.exports = env => {
    if (env.production)
        if (!env.DjangoProject)
            return prodConfig;
        else
            return merge(prodConfig, {
                plugins: [
                    // move files to DjangoProject location
                    // 1. move css files to DjangoProject/assets/css
                    // 2. move js files to DjangoProject/assets/js
                    // 3. move html files to DjangoProject/templates/index.html

                    new FileManagerPlugin({
                        events: {
                            onEnd: {
                                copy: [
                                    { source: './build/*.html', destination: path.resolve(env.DjangoProject, 'templates/') },
                                    { source: './build/*.js', destination: path.resolve(env.DjangoProject, 'assets/js/') },
                                    { source: './build/*.css', destination: path.resolve(env.DjangoProject, 'assets/css/') },
                                ]
                            }
                        }
                    })
                ],
            });
    else
        return devConfig;
}
