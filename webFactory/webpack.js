import webpack from 'webpack';
import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
const devMode = process.env.NODE_ENV === 'development';

export default {
  entry: {
    app: path.join(__dirname, '/src/index.tsx')
    // "theme-beop": path.join(__dirname, "/src/themes/beop/index.ts"),
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].[hash].js',
    publicPath: './'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['lodash']
          }
        },
        exclude: [/node_modules/]
      },
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader'
        },
        exclude: [/node_modules/]
      },
      {
        test: /\.css$/,
        include: [path.resolve(__dirname, 'node_modules')],
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode
            }
          },
          // "style-loader",
          'css-loader'
        ]
      },
      {
        test: /\.less$/,
        exclude: [path.resolve(__dirname, 'node_modules')],
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: devMode
            }
          },
          // "style-loader",
          {
            loader: '@teamsupercell/typings-for-css-modules-loader'
          },
          {
            loader: 'css-loader',
            options: {
              localsConvention: 'camelCase',
              modules: {
                localIdentName: '[folder]__[name]__[local]__[hash:base64:5]'
              }
            }
          },
          'less-loader'
        ]
      },
      // {
      //     test: /\.(le|c)ss$/,
      //     include: path.resolve(__dirname, "src/themes"),
      //     use: [
      //         {
      //             loader: MiniCssExtractPlugin.loader,
      //             options: {
      //                 hmr: devMode,
      //             },
      //         },
      //         // "style-loader",
      //         "css-loader",
      //         "less-loader",
      //     ],
      // },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/font-woff'
          }
        }
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'application/octet-stream'
          }
        }
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            mimetype: 'image/svg+xml'
          }
        }
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
        use: {
          loader: 'url-loader',
          options: {
            esModule: false,
            limit: 1000
          }
        }
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
    alias: {
      '@': path.join(__dirname, '/src'),
      '@routes': path.join(__dirname, '/src/routes'),
      '@components': path.join(__dirname, '/src/components'),
      '@core': path.join(__dirname, '/src/core'),
      '@reducer': path.join(__dirname, '/src/reducer'),
      '@action': path.join(__dirname, '/src/action'),
      '@services': path.join(__dirname, '/src/services'),
      '@utils': path.join(__dirname, '/src/utils')
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      moment: 'moment',
      _: 'lodash',
      React: 'react',
      ReactDom: 'react-dom'
    }),
    // moment 压缩
    // new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /^\.\/(zh-cn)$/),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
    }),
    new LodashModuleReplacementPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      filename: '[name].bundle.js',
      cacheGroups: {
        common: {
          name: 'common',
          minSize: 0,
          priority: 5
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          minSize: 0,
          name: 'vendors',
          priority: 10
        }
      }
    },
    runtimeChunk: {
      name: entrypoint => `runtime~${entrypoint.name}`
    }
  }
};
