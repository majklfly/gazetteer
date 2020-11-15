const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

const port = process.env.PORT;

module.exports = {
    devServer: {
        port: port,
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                },
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: { minimize: true },
                }, ],
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ["file-loader"],
            },
            {
                test: /\.php$/,
                use: {
                    loader: "php-loader",
                },
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: "./index.html",
            filename: "./index.html",
        }),
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(dotenv.config().parsed), // it will automatically pick up key values from .env file
        }),
    ],
};