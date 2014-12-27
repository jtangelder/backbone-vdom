var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var OUTPUT_POSTFIX = '.js'; // '.[chunkhash].js';

var config = {
    entry:  {
        app: __dirname + "/src/index.js",
        vendor: ["exoskeleton", "lodash", "virtual-dom", "dom-delegator", "raf", "global"]
    },
    output: {
        path: __dirname + "/build/js/",
        filename: "app" + OUTPUT_POSTFIX
    },
    externals: {
        jquery: 'new (function(q){return [q]; });' // fake the jQuery dependency of Backbone
    },
    resolve: {
        alias: {
            'underscore': 'lodash'
        }
    },
    module: {
        loaders: [
            { test: /\.js/, loader: __dirname + "/jsx-loader.js" }
        ]
    },
    plugins: [
        // create a cachable vendor js file
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor" + OUTPUT_POSTFIX),

        // remove unusued chunk files
        function() {
            this.plugin("done", function(stats) {
                var assets = stats.toJson().assetsByChunkName;
                var assetFiles = _.flatten(_.values(assets));
                var assetNames = Object.keys(assets);

                // remove all previous generated chunk files
                fs.readdirSync(config.output.path)
                    // only chuck files
                    .filter(function(filename) {
                        return _.find(assetNames, function(name) {
                            return filename.indexOf(name) === 0;
                        });
                    })
                    // exclude the just generated files
                    .filter(function(filename) {
                        return assetFiles.indexOf(filename) === -1;
                    })
                    // remove files
                    .forEach(function(filename) {
                        console.log(filename, assetFiles);
                        fs.unlink(path.join(config.output.path, filename));
                    });

                // write a webpack stats file
                fs.writeFileSync(
                    path.join(__dirname, "webpack.stats.json"),
                    JSON.stringify(assets));
            });
        }
    ]
};

module.exports = config;