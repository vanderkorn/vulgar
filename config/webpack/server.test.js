/**
 * Server Webpack Test Configuration
 */

import fs from 'fs';
import webpack from 'webpack';

/**
 * Helpers
 */
const helpers = require('../helpers');

/**
 * Webpack Merge
 */
const webpackMerge = require('webpack-merge');

/**
 * Common webpack configuration for development and production
 */
const commonConfig = require('./server.common.js');

/**
 * Webpack Plugins
 */
const LoaderOptionsPlugin = require('webpack/lib/LoaderOptionsPlugin');

let nodeModules = {};

fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

/**
 * Webpack Constants
 */
const ENV = process.env.ENV = process.env.NODE_ENV = 'test';

module.exports = function(options) {

  return {

    /**
     * The entry point for the bundle; the location of our Angular.js app
     *
     * @see: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      /**
       * Our Node server
       */
      'server': './src/server/server.conf.ts',
    },

    /**
     * Developer tool to enhance debugging
     *
     * @see http://webpack.github.io/docs/configuration.html#devtool
     * @see https://github.com/webpack/docs/wiki/build-performance#sourcemaps\
     *
     * Do not change, leave as is or it wont work!
     * @see https://github.com/webpack/karma-webpack#source-maps
     */
    devtool: 'inline-source-map',

    /**
     * Options affecting the resolving of modules
     *
     * @see: http://webpack.github.io/docs/configuration.html#resolve
     */
    resolve: {

      /**
       * An array of extensions that should be used to resolve modules
       *
       * @see: http://webpack.github.io/docs/configuration.html#resolve-extensions
       */
      extensions: ['.js', '.json', '.ts']
    },

    target: 'node',

    /**
     * Tell `webpack` that you want to preserve the values of `__dirname` and
     * `__filename`
     */
    node: {
      __dirname: true,
      __filename: true
    },

    externals: nodeModules,



    /**
     * Options affecting the normal modules
     *
     * @see: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      rules: [

        /**
         * Source map loader support for *.js files
         *
         * @see https://github.com/webpack/source-map-loader
         */
         {
           enforce: 'pre',
           test: /\.js$/,
           loader: 'source-map-loader',
           exclude: [
             // these packages have problems with their sourcemaps
             helpers.root('node_modules/rxjs')
           ]
         },

        /**
         * TypeScript loader support for .ts
         *
         * @see https://github.com/s-panferov/awesome-typescript-loader
         * @see https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader'
          ],
          exclude: [/\.(spec|e2e)\.ts$/]
        },

        /**
         * JSON loader support for *.json files
         *
         * @see https://github.com/webpack/json-loader
         */
        {
          test: /\.json$/,
          loader: 'json-loader'
        },

        /**
         * JavaScript loader support for .js
         *
         * @see https://github.com/babel/babel-loader
         */
        {
          test: /\.js$/,
          loaders: [
            'babel'
          ],
          exclude: [
            helpers.root('node_modules')
          ]
        },

        /**
         * Instruments JS files with Istanbul for subsequent code coverage reporting.
         * Instrument only testing sources.
         *
         * @see https://github.com/deepsweet/istanbul-instrumenter-loader
         */
        {
          enforce: 'post',
          test: /\.(js|ts)$/,
          include: helpers.root('src/server'),
          loader: 'istanbul-instrumenter-loader',
          exclude: [
            /\.(e2e|spec)\.ts$/,
            /node_modules/
          ]
        }

      ]

    },

    plugins: [

      /**
       * Plugin LoaderOptionsPlugin (experimental)
       *
       * See: https://gist.github.com/sokra/27b24881210b56bbaff7
       */
      new LoaderOptionsPlugin({
        debug: true,
        options: {

          /**
           * Static analysis linter for TypeScript advanced options configuration
           * Description: An extensible linter for the TypeScript language.
           *
           * @see: https://github.com/wbuchwalter/tslint-loader
           */
          tslint: {
            emitErrors: false,
            failOnHint: false,
            resourcePath: 'src/server'
          },

          /**
           * TypeScript loaders support for .ts and Angular 2 async routes via .async.ts
           *
           * @see https://github.com/s-panferov/awesome-typescript-loader
           * @see https://github.com/TheLarkInn/angular2-template-loader
           */
          'awesome-typescript-loader': {
            // use inline sourcemaps for "karma-remap-coverage" reporter
            sourceMap: false,
            inlineSourceMap: true,
            compilerOptions: {
              // Remove TypeScript helpers to be injected
              // below by DefinePlugin
              removeComments: true
            }
          }

        }
      }),

      /**
       * Plugin: IgnorePlugin
       * Description: Don't generate modules for requests matching the provided RegExp
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#ignoreplugin
       */
      new webpack.IgnorePlugin(/\.(css|scss|less)$/),

      /**
       * Plugin: BannerPlugin
       * Description: Adds a banner to the top of each generated chunk
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#bannerplugin
       */
      new webpack.BannerPlugin({
        banner: 'require("source-map-support").install();',
        raw: true,
        entryOnly: false
      })

    ]

  }

}
