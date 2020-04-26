import path from 'path';
import webpack from 'webpack';
import { createFsFromVolume, Volume } from 'memfs';

export default (fixture: string) => {
  console.log('fixture', fixture);
  const compiler = webpack({
    context: __dirname,
    entry: `./src/${fixture}`,
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: 'pre',
          include: path.join(__dirname, './'),
          use: [
            {
              // options: {
              //   cache: true,
              //   formatter: require.resolve("react-dev-utils/eslintFormatter"),
              //   eslintPath: require.resolve("eslint"),
              //   resolvePluginsRelativeTo: __dirname
              // },
              // loader: require.resolve("eslint-loader")
              options: {
                exclude: ['NODE_ENV', 'REACT_APP_APPNAME', 'PUBLIC_URL'],
                plugins: ['jsx'],
                enable: true,
              },
              loader: path.join(__dirname, './'),
            },
          ],
          exclude: /(node_modules|dist)/,
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        // {
        //   test: /\.(js|mjs|jsx|ts|tsx)$/,
        //   include: path.join(__dirname, '../'),
        //   loader: require.resolve('babel-loader'),
        //   options: {
        //     customize: require.resolve(
        //       'babel-preset-react-app/webpack-overrides'
        //     ),

        //     plugins: [],
        //     // This is a feature of `babel-loader` for webpack (not Babel itself).
        //     // It enables caching results in ./node_modules/.cache/babel-loader/
        //     // directory for faster rebuilds.
        //     cacheDirectory: true,
        //     cacheCompression: true,
        //     compact: true,
        //   },
        //   exclude: /(node_modules|dist)/,
        // },
        // {
        //   test: /\.(js|mjs|tsx)$/,
        //   include: path.join(__dirname, '../'),
        //   exclude: /@babel(?:\/|\\{1,2})runtime/,
        //   loader: require.resolve('babel-loader'),
        //   options: {
        //     babelrc: false,
        //     configFile: false,
        //     compact: false,
        //     exclude: /(node_modules|dist)/,
        //     presets: [
        //       [
        //         require.resolve('babel-preset-react-app/dependencies'),
        //         { helpers: true },
        //       ],
        //     ],
        //     cacheDirectory: true,
        //     cacheCompression: true,

        //     // If an error happens in a package, it's possible to be
        //     // because it was compiled. Thus, we don't want the browser
        //     // debugger to show the original code. Instead, the code
        //     // being evaluated would be much more helpful.
        //     sourceMaps: false,
        //   },
        // },
      ],
    },
  });

  // @ts-ignore
  compiler.outputFileSystem = createFsFromVolume(new Volume());

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      console.log('err', err);
      console.log('stats', stats);
      if (err) reject(err);

      // @ts-ignore
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

      resolve(stats);
    });
  });
};
