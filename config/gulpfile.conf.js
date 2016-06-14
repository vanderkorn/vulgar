// ```
// gulpfile.conf.js
// (c) 2016 David Newman
// david.r.niciforovic@gmail.com
// gulpfile.conf.js may be freely distributed under the MIT license
// ```

// *gulpfile.js*

//# Helpers
let helpers = require('./helpers');

// Import gulp packages
import gulp from 'gulp';
import gutil from 'gulp-util';
import rename from 'gulp-rename';
import nodemon from 'nodemon';
import docco from 'gulp-docco';
import scsslint from 'gulp-scss-lint';
import path from 'path';
import fs from 'fs';
import del from 'del';
import globby from 'globby';
import webpack from 'webpack';
import DeepMerge from 'deep-merge';

// Create a deep merging function for recursively merging objects, which
// allows us to override the default config.
let deepmerge = DeepMerge((target, source, key) => {
  if(target instanceof Array)
    return [].concat(target, source);
  return source;
});

// Webpack Plugins
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

// Define `webpack` default configuration object
let defaultConfig = {
  resolve: {

    // Remove other default values
    modulesDirectories: ['node_modules'],

    // An array of extensions that should be used to resolve modules.
    //
    // See: http://webpack.github.io/docs/configuration.html#resolve-extensions
    extensions: ['', '.ts', '.js', '.json']
  },
  module: {

    // An array of applied pre and post loaders.
    //
    // See: http://webpack.github.io/docs/configuration.html#module-preloaders-module-postloaders
    preLoaders: [

      // Tslint loader support for *.ts files
      //
      // See: https://github.com/wbuchwalter/tslint-loader
      // { test: /\.ts$/, loader: 'tslint-loader', exclude: [ helpers.root('node_modules') ] },

      // Source map loader support for *.js files
      // Extracts SourceMaps for source files that as added as sourceMappingURL comment.
      //
      // See: https://github.com/webpack/source-map-loader
      {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs')
        ]
      }

    ],
    loaders: [

      // Typescript loader support for .ts and Angular 2 async routes via .async.ts
      //
      // See: https://github.com/s-panferov/awesome-typescript-loader
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader',
        exclude: [/\.(spec|e2e)\.ts$/]
      },

      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ['babel']
      },
      // Json loader support for *.json files.
      //
      // See: https://github.com/webpack/json-loader
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  // Add additional plugins to the compiler.
  //
  // See: http://webpack.github.io/docs/configuration.html#plugins
  plugins: [

    // Plugin: ForkCheckerPlugin
    // Description: Do type checking in a separate process, so webpack don't need to wait.
    //
    // See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
    new ForkCheckerPlugin(),

    // Plugin: OccurenceOrderPlugin
    // Description: Varies the distribution of the ids to get the smallest id length
    // for often used ids.
    //
    // See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    // See: https://github.com/webpack/docs/wiki/optimization#minimize
    new webpack.optimize.OccurenceOrderPlugin(true)
  ],
};

if(process.env.NODE_ENV !== 'production') {
  // Tell `webpack` to process `sourcemaps` individually for each module,
  // this avoids a potential performance hit. It achieves this by `eval`ing
  // each module at runtime with its own `sourcemap`
  // The `#` prefix tells it you use the `//#` comment instead of the older
  // `//@` style
  defaultConfig.devtool = '#eval-source-map';
  defaultConfig.debug = true;
}

// Provide a function `config` for generating configurations
// based on the default config
function config(overrides) {
  return deepmerge(defaultConfig, overrides || {});
}

// Backend Webpack configuration
let nodeModules = {};

fs.readdirSync('node_modules')
  .filter((x) => {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach((mod) => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

let backendConfig = config({
  entry: [
    './src/server/server.conf.ts'
  ],
  target: 'node',
  output: {
    path: helpers.root('dist/server'),
    filename: 'server.bundle.js'
  },
  // Tell `webpack` that you want to preserve the values of `__dirname` and
  // `__filename`
  node: {
    __dirname: true,
    __filename: true
  },
  externals: nodeModules,
  plugins: [
    new webpack.IgnorePlugin(/\.(css|scss|less)$/),
    new webpack.BannerPlugin('require("source-map-support").install();',
                             { raw: true, entryOnly: false })
  ]
});

// Define `JavaScript` files to watch/ignore
let jsGlob = ['**/*.js', '!{node_modules,node_modules/**}', '!{docs,doc/**}',
  '!{dist,dist/**}', '!{coverage,coverage/**}', '!src/{res,res/**}',
  '!config/env.conf.js'];

// Define `TypeScript` files to watch/ignore
let tsGlob = ['**/*.ts', '!{node_modules,node_modules/**}', '!{docs,doc/**}',
  '!{dist,dist/**}', '!{coverage,coverage/**}', '!src/{res,res/**}'];

// Define `Sass` files to watch/ignore
let scssGlob = ['**/*.scss', '!{node_modules,node_modules/**}',
  '!{dist,dist/**}', '!{docs,doc/**}', '!{coverage,coverage/**}', '!src/{res,res/**}'];

// Create the default task and watch all neccessary files for automatic
// documentation generation as well as lint all `sass` styles.
gulp.task('default', ['watch:docs',
                      'watch:sass']);

// Webpack Tasks

function onBuild(done) {
  return function(error, stats) {
    if(error)
      console.log('Error: ', error);
    else {
      console.log(stats.toString());
    if(done)
      done();
    }
  }
}

gulp.task('build:server', (done) => {
  // You can pass a `config` object to `webpack` and get
  // back a compiler. From there, you can call `run` or
  // `watch` on the compiler.
  webpack(backendConfig).run(onBuild(done));
});

gulp.task('watch:server', () => {
  // The first `argument` is a `delay`
  webpack(backendConfig).watch(100, (err, stats) => {
    onBuild()(err, stats);
    nodemon.restart();
  });
})

// Configure nodemon
// This watches the files belonging to the app for changes
// When a change is detected the `watch:backend` task will be
// automatically fired, which will allow `webpack` to recompile
// the server code. After this is complete `nodemon` will restart
// the server.
gulp.task('serve', ['watch:server'], () => {
  nodemon({
    execMap: {
      js: 'node'
    },
    script: path.join(helpers.root('dist/server'), 'server.bundle'),
    // We don't actually want `nodemon`'s watcher to watch anything.
    // That is why we pass `ignore` `*` and give `watch` a non-existant
    // directory.
    ignore: ['*'],
    watch: ['foo/'],
    ext: 'noop'
  }).on('restart', () => {
    console.log('Changes detected; restarting server...')
  });
});

// Watch `Sass` files for changes and lint
gulp.task('watch:sass', () => {

  gulp.watch(scssGlob, function (event) {
    return gulp.src(event.path)
      .pipe(scsslint());
  });
});

gulp.task('build:docs', ['clean:docs'], () => {

  // Take a file `glob` pattern and a file extension matching
  // the extension of the files you are trying to generate
  // documentation for
  function generateDocs(fileSrc, ext) {

    console.log(ext);

    if(ext == '') {

      throw new Error('Extension must be passed in for documentation to be generated properly!')
    }
    return gulp.src(fileSrc)
      .pipe(docco())
      .pipe(gulp.dest(`docs/${ext}`));
  }

  generateDocs(jsGlob, '.js');

  generateDocs(tsGlob, '.ts');

  generateDocs(scssGlob, '.scss');

});

// Create documentation for Javascript, Typescript, and Sass files
// on the fly
gulp.task('watch:docs', ['clean:docs'], () => {

  // For `gulp-docco` if the need arises
  //  Default configuration options. All of these may be extended by user-specified options.
  //
  //  defaults =
  //    layout:     'parallel'
  //    output:     'docs'
  //    template:   null
  //    css:        null
  //    extension:  null
  //    languages:  {}
  //    marked:     null
  //
  //  Example:
  //
  //  let docco = require("gulp-docco");
  //
  //  gulp.src("./src/*.js")
  //    .pipe(docco(options))
  //    .pipe(gulp.dest('./documentation-output'))
  //
  // Reference: https://www.npmjs.com/package/gulp-docco
  //  Also see: https://jashkenas.github.io/docco/
  //
  let options = {
    layout:     'parallel',
    output:     'docs',
    template:    null,
    css:         null,
    extension:   null,
    languages:   {},
    marked:      null
  }

  // Alert the user whenever changes have been detected and documentation
  // generation is occurring
  function generateUserAlert(ext) {

    switch(ext) {

        case '.js':
          console.log('A JavaScript file has changed; documentation will now be generated...');

          break;

        case '.scss':
          console.log('A Sass file has changed; documentation will now be generated...');

          break;

        case '.ts':
          console.log('A TypeScript file has changed; documentation will now be generated...');

          break;

        default:
          console.log('Generating appropriate folders and styles...');

          break;
      }

      return;
  }

  // Watch files specified and generate the documentation
  // whenever changes are detected.
  function generateDocs(fileSrc) {
    gulp.watch(fileSrc, function (event, ext = path.extname(event.path)) {

      generateUserAlert(ext);

      // Ignore docs, bower_components and node_modules
      return gulp.src(fileSrc)
        .pipe(docco())
        .pipe(gulp.dest(`docs/${ext}`))
        .on('error', gutil.log);
    });
  }

  // Generate documentation for files specified in `glob` vars at top
  // of file
  generateDocs(jsGlob);

  generateDocs(tsGlob);

  generateDocs(scssGlob);
});

// Use the 'del' module to clear all traces of documentation
// Useful before regenerating documentation
gulp.task('clean:docs', (callback) => {
  del(['./docs']).then(function (paths) {
    callback(); // ok
  }, function (reason) {
    callback('Failed to delete files: ' + reason); // fail
  });
});
