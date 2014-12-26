var webpack = require('webpack');


module.exports = {
    entry:  __dirname + "/src/index.js",
    output: {
        path: __dirname + "/build",
        filename: "index.js"
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
    }
};
