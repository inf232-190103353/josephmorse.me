var webpack = require('webpack')
var path = require('path')

// PostCSS
var autoprefixer = require('autoprefixer')

// Extract sass files to css files
var extractTextPlugin = require('extract-text-webpack-plugin')
var extractSass = new extractTextPlugin('css/[name].css')

var htmlWebpackPlugin = require('html-webpack-plugin')

require('dotenv').config()

module.exports = {
  entry: {
    main: [
      path.resolve(__dirname, 'src/client'),
      path.resolve(__dirname, 'src/styles')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'js/[name].js',
    publicPath: '/'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: [/node_modules/, /server/, /test/],
        loader: 'babel',
        query: {
          presets: [process.env.NODE_ENV && 'react-hmre']
        }
      },

      {
        test: /\.scss|\.sass$/,
        exclude: /node_modules/,
        loaders: extractSass.extract([
          'css',
          'postcss',
          'sass'
        ])
      },

      {
        test: /.*\.(gif|png|jpe?g|svg)$/i,
        exclude: [/node_modules/, /src\/fonts/],
        loaders: [
          'file?hash=sha512&digest=hex&name=images/[name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, '
            + 'interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      },

      {
        test: /\.((woff2?|svg)(\?v=\d+\.\d+\.\d+))?$|(woff2?|svg|jpe?g|png|gif|ico)$/,
        exclude: /src\/images/,
        loader: 'url?name=fonts/[name].[ext]&limit=10000'
      },

      {
        test: /\.((ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9]))|(ttf|eot)$/,
        loader: 'file?name=fonts/[name].[ext]'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss']
  },
  sassLoader: {
    includePaths: [path.resolve(__dirname, 'bower_components')]
  },
  postcss: function() {
    return [
      autoprefixer({ browsers: ['last 2 versions'] })
    ]
  },
  plugins: [
    extractSass,
    new htmlWebpackPlugin({
      hash: true,
      inject: true,
      title: 'React Webpack',
      template: './src/index.html'
    }),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    new webpack.optimize.UglifyJsPlugin({
      mangle: {
        except: ['exports', 'require']
      },
      compress: {
        warnings: false
      }
    })
  ]
}
