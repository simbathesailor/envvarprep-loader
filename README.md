# envvarprep-loader

---

### A webpack loader which prepares the builds to allow env injection later on without building everything again.

### Usage

```sh
yarn add envvarprep-loader --dev
```

```javascript
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
```

Built with [TSDX](https://github.com/jaredpalmer/tsdx)
