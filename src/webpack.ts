import path from "path";
import type { Config } from "payload/config";
import type { Configuration as WebpackConfig } from "webpack";

export const extendWebpackConfig =
  (config: Config): ((webpackConfig: WebpackConfig) => WebpackConfig) =>
  webpackConfig => {
    const existingWebpackConfig =
      typeof config.admin?.webpack === "function"
        ? config.admin.webpack(webpackConfig)
        : webpackConfig;

    // const mockModulePath = path.resolve(__dirname, "./mocks/mockFile.js");

    const newWebpack = {
      ...existingWebpackConfig,
      resolve: {
        ...(existingWebpackConfig.resolve || {}),
        alias: {
          ...(existingWebpackConfig.resolve?.alias ? existingWebpackConfig.resolve.alias : {}),
          // Add additional aliases here like so:
        },
      },
      module: {
        ...(existingWebpackConfig.module || {}),
        // rules: (existingWebpackConfig.module?.rules || []).concat({
        //   test: /\.css$/i,
        //   loader: "css-loader",
        //   options: {
        //     modules: true,
        //     // importLoaders: 1,
        //     // localIdentName: "[sha1:hash:hex:4]",
        //   },

        // }
        // ),
      },
    };
    return newWebpack;
  };
