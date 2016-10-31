'use strict';
/* eslint-env node */

require('dotenv').config();
const Merge = require('broccoli-merge-trees');
const Sass = require('broccoli-sass-source-maps');
const LiveReload = require('broccoli-inject-livereload');
const Autoprefixer = require('broccoli-autoprefixer');
const CssOptimizer = require('broccoli-csso');
const Babel = require('broccoli-babel-transpiler');
const mv = require('broccoli-stew').mv;
const rm = require('broccoli-stew').rm;
const browserify = require('broccoli-browserify-cache');
const vueify = require('vueify');
const envify = require('envify');

let pubFiles = new LiveReload('public');

if (process.env.EMBER_ENV === 'production') {
  pubFiles = 'public';
}

const stylePaths = [
  'app/styles',
  'node_modules',
];
const appNoSass = rm('app', '**/*.scss');

const babelScript = new Babel(appNoSass);

const appScript = browserify(babelScript, {
  entries: ['./index'],
  outputFile: 'app.js',

  config(browserify) {
    browserify.transform(vueify);
    browserify.transform(envify);
  },
});

const compiledSass = new Sass(stylePaths, 'app.scss', 'app.css', {});
const optimizedCSS = new CssOptimizer(compiledSass);
const styles = new Autoprefixer(optimizedCSS);

if (process.env.EMBER_ENV === 'test') {
  const testTree = new Merge([
    mv(babelScript, 'app'),
    mv(new Babel('tests'), 'tests'),
  ]);

  const testJs = browserify(testTree, {
    entries: ['./tests/index-test'],
    outputFile: 'tests.js',
  });

  module.exports = new Merge([pubFiles, styles, appScript, testJs]);
} else {
  module.exports = new Merge([pubFiles, styles, appScript]);
}
