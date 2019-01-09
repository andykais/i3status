const CleanTerminalPlugin = require('clean-terminal-webpack-plugin')

const devPlugins = [new CleanTerminalPlugin()]

module.exports = (env, argv) => ({
  target: 'node',
  node: {
    __dirname: false
  },
  devtool: 'inline-source-map',
  entry: './src/index.js',
  output: {
    path: `${__dirname}/dist`,
    libraryTarget: 'umd'
  },
  resolve: {
    alias: {
      handlebars: 'handlebars/dist/handlebars.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  plugins: [...(argv.mode === 'development' ? devPlugins : [])]
})
