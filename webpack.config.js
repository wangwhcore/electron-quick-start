// webpack.config.js

const path = require('path');

module.exports = {
  entry: {
    bundle:'./renderer.js',
    textEditor: './src/editor/TextEditor.js',

  },
  output: {
    filename: '[name].js', // 使用 [name] 占位符
    path: path.resolve(__dirname, 'dist'),
    
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
