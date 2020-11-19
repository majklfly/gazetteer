const HtmlWebPackPlugin = require("html-webpack-plugin");
const RemoveStrictPlugin = require("remove-strict-webpack-plugin");
const webpack = require("webpack");
const dotenv = require("dotenv");

const port = process.env.PORT;

module.exports = (env) => {
    return {
        devServer: {
            port: port,
            compress: true,
            disableHostCheck: true,
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
                "process.env": JSON.stringify(dotenv.config().parsed),
                NODE_ENV: JSON.stringify(process.env.NODE_ENV),
                WEATHER_API_KEY: JSON.stringify(process.env.WEATHER_API_KEY),
                GEO_API_KEY: JSON.stringify(process.env.GEO_API_KEY),
                UNSPLASH_ACCESS_KEY: JSON.stringify(process.env.UNSPLASH_ACCESS_KEY),
                CAPITAL_API_KEY: JSON.stringify(process.env.CAPITAL_API_KEY),
            }),
            new RemoveStrictPlugin(),
        ],
    };
};