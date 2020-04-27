import path from 'path';
import webpack from 'webpack';
// @ts-ignore
import joinPath from 'memory-fs/lib/join';
import { fs } from 'memfs';

export default (fixture: string) => {
  console.log('fixture', fixture);
  const compiler = webpack({
    context: __dirname,
    entry: `./src/${fixture}`,
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist'),
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
    },
    stats: {
      source: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|mjs|jsx|ts|tsx)$/,
          enforce: 'pre',
          include: path.join(__dirname, './src'),
          use: [
            {
              options: {
                exclude: ['NODE_ENV', 'REACT_APP_APPNAME', 'PUBLIC_URL'],
                plugins: ['jsx'],
                enable: true,
                sourceType: 'module',
              },
              loader: path.join(__dirname, './src/index.tsx'),
            },
            {
              loader: require.resolve('ts-loader'),
            },
          ],
          exclude: /(node_modules|dist)/,
        },
      ],
    },
  });

  function ensureWebpackMemoryFs(fs: any) {
    // Return it back, when it has Webpack 'join' method
    if (fs.join) {
      return fs;
    }

    // Create FS proxy, adding `join` method to memfs, but not modifying original object
    const nextFs = Object.create(fs);
    nextFs.join = joinPath;

    return nextFs;
  }

  const webpackFs = ensureWebpackMemoryFs(fs);
  // @ts-ignore
  compiler.outputFileSystem = webpackFs;
  // compiler.resolvers.context.fileSystem = webpackFs

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      // console.log('err', err);
      // console.log('stats', stats);
      if (err) reject(err);

      // @ts-ignore
      if (stats.hasErrors()) reject(new Error(stats.toJson().errors));

      resolve(stats);
    });
  });
};
