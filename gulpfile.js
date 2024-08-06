"use strict";

var gulp = require("gulp");
var del = require("del");
var webpack = require("webpack");
var assign = require("object-assign");

var UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const DEV_PORT = process.env.DEV_PORT || 8080;

gulp.task("clean", function() {
  return del(["./build/*"]);
});

// gulp tasks for building dist files
gulp.task("dist-clean", function() {
  return del(["./dist/*"]);
});

var distConfig = require("./webpack.config.dist.js");
gulp.task("dist-unmin", function(cb) {
  var unminConfig = assign({}, distConfig);
  unminConfig.output.filename = "ocid-connect-js.js";
  unminConfig.mode = "none";
  return webpack(unminConfig, function(err, stat) {
    console.error(err);
    cb();
  });
});

gulp.task("dist-min", function(cb) {
  var minConfig = assign({}, distConfig);
  minConfig.output.filename = "ocid-connect-js.min.js";
  minConfig.plugins = minConfig.plugins.concat(
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: true,
      uglifyOptions: {
        warnings: false
      }
    })
  );
  return webpack(minConfig, function(err, stat) {
    console.error(err);
    cb();
  });
});

gulp.task(
  "dist",
  gulp.series(["dist-clean", "dist-unmin", "dist-min"], function(done) {
    done();
  })
);
