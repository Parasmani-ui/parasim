const TerserPlugin = require('terser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'source-map',
  output: {
    filename: 'bundle.[contenthash].js',
    path: __dirname + '/build',
    publicPath: '/',
    clean: true,
  },
  optimization: {
    minimize: false, // Disable minification in development
  },
  devServer: {
    static: './public',
    hot: true,
    port: 8080,
    historyApiFallback: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: 'body',
      minify: false, // Disable minification in development
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        'REACT_APP_API_URL': JSON.stringify(process.env.REACT_APP_API_URL),
        'REACT_APP_UPLOAD_URL': JSON.stringify(process.env.REACT_APP_UPLOAD_URL),
        'REACT_APP_SOCKET_URL': JSON.stringify(process.env.REACT_APP_SOCKET_URL),
        'REACT_APP_PUBLIC_URL': JSON.stringify(process.env.REACT_APP_PUBLIC_URL),
        'REACT_APP_USE_STUBS': JSON.stringify(process.env.REACT_APP_USE_STUBS)
      }
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader' }],
        exclude: /node_modules/
      },
      {
        test: /\.(svg|png|jpeg|jpg|gif)$/,
        use: [{ loader: "file-loader"}],
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [{ loader: "style-loader"}, { loader: "css-loader"}],
      }
    ],
  }
};
