const path = require('path');
const webpack = require('webpack');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const TerserPlugin = require('terser-webpack-plugin');

const env = process.env.NODE_ENV;

const config = {
  devtool: 'source-map',

  entry: './src/index.ts',

  output: {
    filename: 'recharts-toolbox.js',
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        loader: 'babel-loader',
      },
      {
        test: /\.(ts|tsx)$/,
        exclude: /node_modules/,
        include: [
          path.resolve(__dirname, 'src'),
        ],
        loader: 'ts-loader',
      }
    ],
  },

  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
  },

  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'recharts': {
      root: 'Recharts',
      commonjs2: 'recharts',
      commonjs: 'recharts',
      amd: 'recharts',
    }
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env),
      __DEV__: false,
      __DEVTOOLS__: false,
    }),
  ],
};

// if (env === 'analyse') {
//   config.plugins.push(
//     new BundleAnalyzerPlugin()
//   );
// }

if (env === 'production') {
  config.mode = 'production';
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin(),
    ],
  };
}

module.exports = config;
