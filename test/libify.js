const fs = require('fs');

const webpack = require('webpack');
const tape = require('tape');
const rimraf = require('rimraf');

const libify = require.resolve('../libify');

rimraf.sync(`${__dirname}/fixtures/lib/`);

tape('webpack libify', (t) => {
  webpack({
    context: __dirname,
    entry: './fixtures/src/libify/foo.js',
    output: {
      filename: 'foo.js',
      path: `${__dirname}/fixtures/dist/libify`,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: 'babel-loader',
          query: {
            presets: ['es2015', 'react'],
          },
        },
        {
          loader: libify,
          enforce: 'post',
        },
      ],
    },
  })
  .run((err, stats) => {
    if (err) {
      t.ifError(err);
    }
    const jsonStats = stats.toJson();
    if (jsonStats.errors.length > 0) {
      t.fail(jsonStats.errors);
    }
    if (jsonStats.warnings.length > 0) {
      console.info(jsonStats.warnings);
    }
    t.ok(fs.statSync(`${__dirname}/fixtures/lib/libify/foo.js`).isFile());
    t.end();
  });
});
