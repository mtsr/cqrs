
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var stylus = require('stylus');
var nib = require('nib');
var jade = require('jade');
var fs = require('fs');
var async = require('async');
var chokidar = require('chokidar');
var util = require('util');
var _ = require('lodash');

var routes = require('./routes');

var app = express();

// compilation function for stylus that includes nib
function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .set('compress', true)
    .use(nib())
}

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('templates', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);

  app.use(stylus.middleware({
    src: __dirname + '/public',
    compile: compile
  }));

  app.use(express.static(path.join(__dirname, 'public')));
});

// In development mode use the default express errorhandler
app.configure('development', function(){
  app.use(express.errorHandler());
});

// settings for all views in the app
app.locals({
  title: 'framework'
});

// define routes
app.get('/', routes.index);

// start server
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

// compile all .jade files from views/templates to public/js/views/templates
var templateDir = path.join('templates');
var publicDir = path.join('public');

// remove all old compiled templates
removeDirForce(path.join(publicDir, templateDir));

// watch changes to files in views/templates and recompile
var templateWatcher = chokidar.watch(templateDir);
templateWatcher
  .on('add', compileTemplate)
  .on('change', compileTemplate)
  .on('unlink', deleteTemplate);

// compile a single jade file
function compileTemplate(filePath, callback) {
  if (path.extname(filePath) !== '.jade') {
    console.log('Ignoring:', filePath);
    return;
  }

  var compiledFilePath = path.join(publicDir, path.dirname(filePath), (path.basename(filePath, '.jade') + '.js'));
  console.log('Compiling', filePath, 'to', compiledFilePath);
  fs.readFile(filePath, function(err, contents) {
    if (err) {
      console.log(err);
      return callback(err);
    }

    var js = jade.compile(contents, {
      // include line numbers for debugging
      compileDebug: true,
      // include for client use (together with runtime.js)
      client: true,
      // include whitespace or not
      pretty:true,
      // filepath so jade can find included/extended files
      filename: filePath
    });

    js = "define(['runtime'], function() {\n" +
       "return " + js.toString() + "\n" +
       "});"

    fs.writeFile(compiledFilePath, js);

    if(callback) {
      callback();
    }
  });
}

function deleteTemplate(filePath) {
  fs.unlink(path.join('public/js', filePath))
}

// Remove everything within dir including subdirs
function removeDirForce(dirPath, removeDir) {
  removeDir = removeDir || false;
  fs.readdir(dirPath, function(err, files) {
    if (err) {
      console.log(JSON.stringify(err));
    } else {
      if (removeDir && files.length === 0) {
        fs.rmdir(dirPath, function(err) {
          if (err) {
            console.log(JSON.stringify(err));
          } else {
            var parentPath = path.normalize(dirPath + '/..') + '/';
            if (parentPath != path.normalize(rootPath)) {
              removeDirForce(parentPath);
            }
          }
        });
      } else {
        _.each(files, function(file) {
          if (file.substr(0,1) === '.') {
            // ignore hidden file
            return;
          }
          var filePath = path.join(dirPath, file);
          fs.stat(filePath, function(err, stats) {
            if (err) {
              console.log(JSON.stringify(err));
            } else {
              if (stats.isFile()) {
                fs.unlink(filePath, function(err) {
                  if (err) {
                    console.log(JSON.stringify(err));
                  }
                });
              }

              if (stats.isDirectory()) {
                removeDirForce(filePath + '/', true);
              }
            }
          });
        });
      }
    }
  });
}
