/**
 *  @author: @datatypevoid
 */

/**
 * Webpack Development Configuration
 */

/**
 * Webpack
 */
const webpack = require('webpack');

/**
 * Helpers
 */
const helpers = require('./helpers');

/**
 * Webpack Plugins
 */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./modules/html-elements.util.js');
const AssetsPlugin = require('assets-webpack-plugin');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');
const path = require('path');

/**
 * postcss-loader
 */
const precss       = require('precss');
const autoprefixer = require('autoprefixer');

/**
 * Webpack Constants
 */
const HMR = helpers.hasProcessFlag('hot');
const METADATA = {
  title: 'Angular 2 MEAN Webpack Starter Kit by @datatype_void',
  baseUrl: '/',
  isDevServer: helpers.isWebpackDevServer(),
};

/**
 * Webpack Configuration
 *
 * @see: http://webpack.github.io/docs/configuration.html#cli
 */
module.exports = function(options) {

  /**
   * Production option
   */
  isProd = options.env === 'production';

  return {

    /**
     * Merged metatdata from webpack.common.js for index.html
     *
     * @see: (custom attribute)
     */
    metadata: METADATA,

    /**
     * Cache generated modules and chunks to improve performance for multiple
     * incremental builds
     * This is enabled by default in watch mode
     * You can pass false to disable it
     *
     * @see: http://webpack.github.io/docs/configuration.html#cache
     */
    // cache: false,

    /**
     * The entry point for the bundle; the location of our Angular.js app
     *
     * @see: http://webpack.github.io/docs/configuration.html#entry
     */
    entry: {
      'polyfills': './src/client/polyfills.browser.ts',
      'vendor': './src/client/vendor.browser.ts',
      /**
       * Our primary Angular 2 application
       */
      'main': './src/client/main.browser.ts',
    },

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
      extensions: ['', '.ts', '.js', '.json', '.scss'],

      /**
       * Ensure that root is our client source directory
       */
      root: helpers.root('src/client'),

      /**
       * An array of directory names to be resolved to the current directory
       */
      modules: [helpers.root('src/client'), 'node_modules'],
    },

    /**
     * Options affecting the normal modules
     *
     * @see: http://webpack.github.io/docs/configuration.html#module
     */
    module: {

      /**
       * An array of applied pre loaders
       *
       * @see: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
       */
      preLoaders: [
        {
          test: /\.ts$/,
          loader: 'string-replace-loader',
          query: {
            search: '(System|SystemJS)(.*[\\n\\r]\\s*\\.|\\.)import\\((.+)\\)',
            replace: '$1.import($3).then(mod => (mod.__esModule && mod.default) ? mod.default : mod)',
            flags: 'g'
          },
          include: [helpers.root('src')]
        }
      ],

      /**
       * An array of automatically applied loaders
       *
       * IMPORTANT: The loaders have resolved relative to the resource which
       * they are applied to. This means they are not resolved relative to the
       * configuration file
       *
       * @see: http://webpack.github.io/docs/configuration.html#module-loaders
       */
      loaders: [

        /**
         * TypeScript loaders support for .ts and Angular 2 async routes via .async.ts
         *
         * @see https://github.com/s-panferov/awesome-typescript-loader
         * @see https://github.com/TheLarkInn/angular2-template-loader
         */
        {
          test: /\.ts$/,
          loaders: [
            'awesome-typescript-loader',
            'angular2-template-loader',
            '@angularclass/hmr-loader?pretty=' + !isProd + '&prod=' + isProd
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
         * to-string and css-loader support for *.css files
         * Returns file content as string
         *
         * @see https://github.com/gajus/to-string-loader
         * @see https://github.com/webpack/css-loader
         */
        {
          test: /\.css$/,
          loaders: ['to-string-loader', 'css-loader']
        },

        /**
         * Raw loader support for *.html
         * Returns file content as a string
         *
         * @see https://github.com/webpack/raw-loader
         */
        {
          test: /\.html$/,
          loader: 'raw-loader',
          exclude: [helpers.root('src/client/index.html')]
        },

        /**
         * Support for Sass imports
         *
         * @see get postcss-loader working
         */
        {
          test: /\.scss$/,
          loaders: ['raw-loader', 'sass-loader'],
          exclude: [ helpers.root('node_modules') ]
        },

        /**
         * Files loader for supporting images, for example, in CSS files
         */
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'file'
        }
      ],

      /**
       * An array of applied post loaders
       *
       * @see: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
       */
      postLoaders: [
        {
          test: /\.js$/,
          loader: 'string-replace-loader',
          query: {
            search: 'var sourceMappingUrl = extractSourceMappingUrl\\(cssText\\);',
            replace: 'var sourceMappingUrl = "";',
            flags: 'g'
          }
        }
      ]
    },

    /**
     * postcss-loader
     *
     * CSS postprocessor
     *
     * @see: https://github.com/postcss/postcss-loader
     */
    postcss: function () {
      return [precss, autoprefixer];
    },

    /**
     * Add additional plugins to the compiler
     *
     * @see: http://webpack.github.io/docs/configuration.html#plugins
     */
    plugins: [

      /**
       * Plugin: AssetsPlugin
       *
       * @todo Add documentation
       */
      new AssetsPlugin({
        path: helpers.root('dist'),
        filename: 'webpack-assets.json',
        prettyPrint: true
      }),

      /**
       * Plugin: ForkCheckerPlugin
       * Description: Perform type checking in a separate process, so webpack
       * doesn't need to wait
       *
       * @see https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
       */
      new ForkCheckerPlugin(),

      /**
       * Plugin: CommonsChunkPlugin
       * Description: Shares common code between the pages
       * Identifies common modules and put them into a commons chunk
       *
       * @see https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
       * @see https://github.com/webpack/docs/wiki/optimization#multi-page-app
       */
      new webpack.optimize.CommonsChunkPlugin({
        name: ['polyfills', 'vendor'].reverse()
      }),

      /**
       * Plugin: ContextReplacementPlugin
       * Description: Provides context to Angular's use of System.import
       *
       * See: https://webpack.github.io/docs/list-of-plugins.html#contextreplacementplugin
       * See: https://github.com/angular/angular/issues/11580
      */
      new ContextReplacementPlugin(
        // The (\\|\/) piece accounts for path separators in *nix and Windows
        /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
        helpers.root('src') // location of your src
      ),

      /**
       * Plugin: CopyWebpackPlugin
       * Description: Copy files and directories in webpack
       * Copies project static assets
       *
       * @see https://www.npmjs.com/package/copy-webpack-plugin
       */
      new CopyWebpackPlugin([{
        from: 'src/client/assets',
        to: 'assets'
      }]),

      /**
       * Plugin: HtmlHeadConfigPlugin
       * Description: Generate html tags based on javascript maps.
       *
       * If a publicPath is set in the webpack output configuration, it will be automatically added to
       * href attributes, you can disable that by adding a "=href": false property.
       * You can also enable it to other attribute by settings "=attName": true.
       *
       * The configuration supplied is map between a location (key) and an element definition object (value)
       * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
       *
       * Example:
       *  Adding this plugin configuration
       *  new HtmlElementsPlugin({
       *    headTags: { ... }
       *  })
       *
       *  Means we can use it in the template like this:
       *  <%= webpackConfig.htmlElements.headTags %>
       *
       * Dependencies: HtmlWebpackPlugin
       */
      new HtmlElementsPlugin({
        headTags: require('./head.conf')
      }),

      /**
       * Plugin: HtmlWebpackPlugin
       * Description: Simplifies creation of HTML files to serve your webpack
       * bundles. This is especially useful for webpack bundles that include a
       * hash in the filename which changes upon every compilation
       *
       * @see https://github.com/ampedandwired/html-webpack-plugin
       */
      new HtmlWebpackPlugin({
        template: 'src/client/index.html',
        chunksSortMode: 'dependency'
      })
    ],

    /**
     * Include polyfills or mocks for various node stuff
     * Description: Node configuration
     *
     * @see https://webpack.github.io/docs/configuration.html#node
     */
    node: {
      global: 'window',
      crypto: 'empty',
      process: true,
      module: false,
      clearImmediate: false,
      setImmediate: false
    }
  }
};
