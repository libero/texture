const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  devtool: false,
  entry: {
    texture: './webpack-entry.js',
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    library: 'texture',
    libraryExport: '',
    libraryTarget: 'global',
  },
  module: {
    rules: [
      {
        test: /\.js?$/,
        include: [path.resolve(__dirname, 'src')],
      },
      {
        test: /\.css$/,
        use: [{ loader: MiniCssExtractPlugin.loader }, 'css-loader'],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: 'texture.css',
      chunkFilename: '[id].css',
    }),
    new CopyPlugin([
      { from: './node_modules/font-awesome', to: 'lib/font-awesome' },
      { from: './node_modules/katex/dist', to: 'lib/katex' },
      { from: './node_modules/inter-ui', to: 'lib/inter-ui' },
      { from: './node_modules/substance/dist/*.css', to: 'lib/substance', flatten: true },
      { from: './node_modules/substance/dist/substance.js', to: 'lib/substance' },
      { from: './node_modules/substance/dist/substance.min.js', to: 'lib/substance' },
      { from: './node_modules/texture-plugin-jats/dist', to: 'plugins/texture-plugin-jats' },
      { from: './texture-reset.css', to: 'texture-reset.css' },
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};
