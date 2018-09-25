
module.exports = {
  webpack: (config, { env }) => ({
    ...config,
    module: {
      ...config.module,
      rules: [
        ...config.module.rules,
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
      extensions: [
        ...config.resolve.extensions,
        '.ts',
        '.tsx',
      ],
    },
  }),

  // containerQuerySelector: '#root',
  // webpackConfigPath: 'config/webpack.development',
  // publicPath: './.tmp',
};
