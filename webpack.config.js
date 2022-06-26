// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  entry: "./src/index.js",
  devServer: {
    historyApiFallback: true,
  },
  plugins: [new HtmlWebpackPlugin({ base: "/", template: "src/index.html" })],
  resolve: {
    alias: {
      apis: path.resolve(__dirname, "src/apis/"),
      common: path.resolve(__dirname, "src/common/"),
      components: path.resolve(__dirname, "src/components/"),
      core: path.resolve(__dirname, "src/core/"),
      files: path.resolve(__dirname, "src/files/"),
      reducers: path.resolve(__dirname, "src/reducers/"),
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
        exclude: /public/,
      },
      {
        test: /\.s[ac]ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
      {
        resourceQuery: /raw/,
        type: "asset/source",
      },
      {
        resourceQuery: /inline/,
        type: "asset/inline",
      },
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
