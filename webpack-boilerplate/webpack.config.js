const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const CssUrlRelativePlugin = require('css-url-relative-plugin');
const glob = require('glob');
const autoprefixer = require('autoprefixer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const isAnalyze = typeof process.env.BUNDLE_ANALYZE !== 'undefined';
const IS_DEV = process.env.NODE_ENV === 'dev';

const config = {
  mode: IS_DEV ? 'development' : 'production',
  devtool: IS_DEV ? 'eval' : 'source-map',
  entry: './src/js/index.js',
  output: {
    filename: 'js/[name].[hash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'initial',
          name: 'vendor',
          priority: 10,
          enforce: true,
        },
      },
    },
    minimizer: [],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: IS_DEV,
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              autoprefixer: {
                browsers: ['last 2 versions'],
              },
              sourceMap: IS_DEV,
              plugins: () => [autoprefixer],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        use: [
          // https://github.com/webpack-contrib/url-loader
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              fallback: 'file-loader',
              outputPath: 'public/images',
              limit: 8192,
            },
          },

          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65,
              },
              pngquant: {
                quality: '65-90',
                speed: 4,
              },
              gifsicle: {
                interlaced: false,
              },
              webp: {
                quality: 75,
              },
            },
          },
        ],
      },
      {
        // test: /\.(eot|svg|ttf|woff|woff2)$/,
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[name].[ext]',
              fallback: 'file-loader',
              outputPath: 'public/fonts',
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'windows.jQuery': 'jquery',
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src', 'public', 'fonts'),
        to: path.resolve(__dirname, 'dist', 'public', 'fonts'),
        toType: 'dir',
      },
      {
        from: path.resolve(__dirname, 'src', 'public', 'images', 'design'),
        to: path.resolve(__dirname, 'dist', 'public', 'images', 'design'),
        toType: 'dir',
      },
    ]),
    new MiniCssExtractPlugin({
      filename: IS_DEV ? 'css/[name].css' : 'css/[name].[contenthash].css',
    }),
    // new webpack.HashedModuleIdsPlugin(),
    new PreloadWebpackPlugin({
      include: 'initial',
    }),
    new CssUrlRelativePlugin(),
  ],
};

if (!IS_DEV) {
  const TerserPlugin = require('terser-webpack-plugin');
  const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

  config.optimization.minimizer.push(
    new TerserPlugin(),
    new OptimizeCSSAssetsPlugin({})
  );
}
if (isAnalyze) {
  config.plugins.push(new BundleAnalyzerPlugin());
}

// incase of more than one html
const files = glob.sync('./src/*.html');

files.forEach(file => {
  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: path.basename(file),
      template: file,
      favicon: path.resolve(__dirname, 'src/public/images/favicon.ico'),
      minify: !IS_DEV,
    })
  );
});

module.exports = config;
