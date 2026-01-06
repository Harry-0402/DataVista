/* eslint-disable no-undef */

const devCerts = require("office-addin-dev-certs");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

const urlDev = "https://localhost:3000/";
const urlProd = "https://www.contoso.com/"; // CHANGE THIS TO YOUR PRODUCTION URL

async function getHttpsOptions() {
    const hotline = await devCerts.getHttpsServerOptions();
    return hotline;
}

module.exports = async (env, options) => {
    const dev = options.mode === "development";
    const config = {
        devtool: "source-map",
        entry: {
            polyfill: ["core-js/stable", "regenerator-runtime/runtime"],
            taskpane: "./src/taskpane/taskpane.js", // We will bundle this, BUT our code relies on global scripts. 
            commands: "./src/commands/commands.js",
            // We will handle that by Copying them.
        },
        output: {
            clean: true,
            path: path.resolve(__dirname, "docs"),
        },
        resolve: {
            extensions: [".html", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: "babel-loader",
                        options: {
                            presets: ["@babel/preset-env"],
                        },
                    },
                },
                {
                    test: /\.html$/,
                    exclude: /node_modules/,
                    use: "html-loader",
                },
                {
                    test: /\.(png|jpg|jpeg|gif|ico)$/,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/[name][ext][query]",
                    },
                },
            ],
        },
        plugins: [
            new HtmlWebpackPlugin({
                filename: "taskpane.html",
                template: "./src/taskpane/taskpane.html",
                chunks: ["polyfill", "taskpane"],
            }),
            new HtmlWebpackPlugin({
                filename: "commands.html",
                template: "./src/commands/commands.html",
                chunks: ["polyfill", "commands"],
            }),
            new HtmlWebpackPlugin({
                filename: "index.html",
                template: "./src/index.html",
                chunks: [], // No JS chunks for landing page
            }),
            // Copy the generator files as-is because the HTML refers to them via <script> tags
            new CopyWebpackPlugin({
                patterns: [
                    { from: "src/taskpane/generators.js", to: "generators.js" },
                    { from: "src/taskpane/workbook_generators.js", to: "workbook_generators.js" },
                    { from: "src/taskpane/test_preview.html", to: "test_preview.html" },
                    { from: "assets", to: "assets", noErrorOnMissing: true },
                    { from: "manifest.xml", to: "manifest.xml" },
                ],
            }),
        ],
        devServer: {
            headers: {
                "Access-Control-Allow-Origin": "*",
            },
            server: {
                type: "https",
                options: await getHttpsOptions(),
            },
            port: 3000,
            static: {
                directory: path.join(__dirname, "dist"),
            },
        },
    };

    return config;
};
