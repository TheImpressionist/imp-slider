
// const path = require('path');

module.exports = {
  mode: 'development',

  entry: '../src/index.tsx',

  output: '../.tmp/[name].[ext]',

  // entry: path.resolve(__dirname, '../', 'src/index.ts'),

  stats: {
    colors: true,
    hash: true,
    timings: true,
    assets: true,
    chunks: true,
    chunkModules: true,
    modules: true,
    children: true,
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'ts-loader',
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js'],
  },
};
