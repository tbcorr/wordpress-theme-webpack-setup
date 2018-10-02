const path = require('path');

// setup webpack copy plugin instance
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CopyWebpackPluginInstance = new CopyWebpackPlugin([{
	from: './resources/static/images', to: 'images', // copy eveything in static images directory to assets
	ignore: [ '.*' ] // ignore dot files
}]);

// setup css extaction plugin instance
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const MiniCssExtractPluginInstance = new MiniCssExtractPlugin({
	filename: "[name].bundle.css",
	chunkFilename: "[name].bundle.css"
});

module.exports = {
	mode: process.env.NODE_ENV,
	devtool: process.env.NODE_ENV === 'development' ? 'source-map' : '',
	watch: process.env.NODE_ENV === 'development',
	entry: {
		theme: './resources/javascript/theme.js'
	},
	output: {
		path: path.resolve('./assets'),
		filename: '[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env']
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader', 
						options: {
							minimize: true,
							importLoaders: 1
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							sourceMap: true,
							plugins: () => [
								require('autoprefixer')()
							]
						}
					}
				],
			},
			{
				test: /\.(sa|sc)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader', 
						options: {
							minimize: true,
							sourceMap: true,
							importLoaders: 2
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							sourceMap: true,
							plugins: () => [
								require('autoprefixer')()
							]
						}
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
							outputStyle: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded'
						}
					}
				],
			},
			{
				test: /\.less$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader', 
						options: {
							minimize: true,
							sourceMap: true,
							importLoaders: 2
						}
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							sourceMap: true,
							plugins: () => [
								require('autoprefixer')()
							]
						}
					},
					{
						loader: 'less-loader',
						options: {
							sourceMap: true,
							compress: process.env.NODE_ENV === 'production'
						}
					}
				],
			},
			{
				test: /\.(png|jpg|gif)$/,
				use: [
				{
					loader: 'url-loader',
					options: {
						name: 'images/[name].[ext]',
						limit: 50
					}
				}
				]
			},
			{
				test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
				use: [{
					loader: 'url-loader',
					options: {
						name: 'fonts/[name].[ext]',
						limit: 50
					}
				}]
			}
		]
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'all'
				}
			}
		}
	},
	externals: {
		jquery: 'jQuery'
	},
	resolve: {
		modules: [
			path.resolve('./resources'),
			path.resolve('./node_modules')
		]
	},
	plugins: [
		CopyWebpackPluginInstance,
		MiniCssExtractPluginInstance
	],
	stats: {
		colors: true,
		children: false
	}
};
