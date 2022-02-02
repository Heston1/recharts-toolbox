const path = require('path');
const { LoaderOptionsPlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  context: __dirname,
  devtool: 'inline-source-map',
  entry: [
    './index.tsx',
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  plugins: [
    new LoaderOptionsPlugin({
      debug: true
    }),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false
    })
  ],
  resolve: {
    alias: {
      "recharts-toolkit": path.join(__dirname, '..', 'src/index.ts')
    },
    extensions: ['.json', '.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [{
      test: /\.(js|ts|tsx)$/,
      use: {
        loader: 'babel-loader',
      },
      exclude: /node_modules/,
      include: [
        __dirname,
        path.join(__dirname, '..', 'src'),
      ],
    }, {
      test: /\.(ts|tsx)$/,
      exclude: /node_modules/,
      include: [
        path.resolve(__dirname, 'src'),
      ],
      use: {
        loader: 'ts-loader',
      }
    }],
  },
};
