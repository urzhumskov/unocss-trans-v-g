import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import UnoCSS from '@unocss/webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'

const mode = process.env.NODE_ENV ?? 'development'
const devMode = mode === 'development'

const overlay = false

const __dirname = import.meta.dirname

export default {
	entry: [path.resolve(__dirname, 'src', 'index.tsx'), 'uno.css'],
	mode,
	devtool: devMode ? 'inline-source-map' : 'source-map',
	output: {
		path: path.resolve(__dirname, 'build'),
		clean: true,
		filename: 'bundle.[contenthash].js',
	},
	module: {
		rules: [
			{
				test: /\.m?(js|ts)x?$/,
				exclude: /node_modules/,
				use: {
					loader: 'swc-loader',
					options: {
						module: { type: 'nodenext' },
						jsc: {
							parser: { syntax: 'typescript', jsx: true, tsx: true },
							transform: { react: { development: devMode, refresh: devMode } },
						},
					},
				},
			},
			{ test: /\.css$/, use: [devMode ? 'style-loader' : MiniCssExtractPlugin.loader, 'css-loader'] },
			{ test: /\.(png|jpg|gif)$/i, type: 'asset/resource' },
		],
	},
	resolve: {
		extensions: ['.js', '.tsx', '.ts'],
		plugins: [
			new TsconfigPathsPlugin({
				baseUrl: 'src',
				configFile: 'tsconfig.json',
				extensions: ['.js', '.ts', '.tsx'],
			}),
		],
	},
	plugins: [
		UnoCSS(),
		new ReactRefreshWebpackPlugin({ overlay }),
		new HtmlWebpackPlugin({ template: path.resolve(__dirname, 'public', 'index.html') }),
		!devMode && new MiniCssExtractPlugin({ filename: 'bundle.[contenthash].css' }),
	].filter(Boolean),
	stats: 'errors-warnings',
	infrastructureLogging: { debug: [name => name.includes('webpack-dev-server')] },

	optimization: {
		realContentHash: true,
  }
}
