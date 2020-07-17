const path = require('path');

const reactExternal = {
    root: 'React',
    commonjs2: 'react',
    commonjs: 'react',
    amd: 'react',
};

const reactDOMExternal = {
    root: 'ReactDOM',
    commonjs2: 'react-dom',
    commonjs: 'react-dom',
    amd: 'react-dom',
};

module.exports = {
    entry: "./index.ts",
    externals: {
        react: reactExternal,
        'react-dom': reactDOMExternal,
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/react'],
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.svg$/,
                loader: '@svgr/webpack',
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader',
            },
            {
              test: /\.scss$/,
              use: [
                  require.resolve('style-loader'),
                  {
                      loader: 'css-loader',
                      options: {
                          importLoaders: 1,
                      },
                  },
                  {
                      loader: 'sass-loader',
                  },
              ],
          }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'main.js',
        globalObject: 'this',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: {
        minimize: true,
    },
    mode: 'production',
};
