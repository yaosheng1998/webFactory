import path from "path";
import merge from "webpack-merge";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";

import base from "./webpack";

const OUTPUT_PATH = path.join(__dirname, "../../webpack-gen/News/");
// const OUTPUT_PATH = path.join(__dirname, "./dist");
const PUBLIC_PATH = "/static/webpack-gen/News/";

export default merge(base, {
  mode: "production",
  output: {
    path: OUTPUT_PATH,
    publicPath: PUBLIC_PATH,
  },
  plugins: [
    new HtmlWebpackPlugin({
      hash: true,
      title: "NewsEditor",
      filename: "index.html",
      template: "./src/index.ejs",
      inject: true,
      chunks: ["theme-beop", "app"],
      chunksSortMode: "manual"
    }),
    new CleanWebpackPlugin({
      dry: false,
      cleanOnceBeforeBuildPatterns: [OUTPUT_PATH + "/*.*"],
      dangerouslyAllowCleanPatternsOutsideProject: true,
    }),
  ],
});
