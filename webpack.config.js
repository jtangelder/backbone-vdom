var webpack = require('webpack');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var config = {
    entry:  {
        app: path.join(__dirname, 'src', 'index.js'),
        vendor: ['dom-delegator', 'exoskeleton', 'global', 'lodash', 'raf', 'virtual-dom']
    },
    output: {
        path: path.join(__dirname, 'build', 'js'),
        filename: "app.js"
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
            { test: /\.js/, loader: 'es6!' + path.join(__dirname, 'jstransform-loader.js') }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.js"),

        // write a webpack stats file
        function() {
            this.plugin("done", function(stats) {
                fs.writeFileSync(
                    path.join(__dirname, "webpack.stats.json"),
                    JSON.stringify(stats.toJson(), null, '\t'));
            });
        }
    ]
};

module.exports = config;
