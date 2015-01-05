var transform = require('jstransform').transform;

var es6ArrowFunctions = require('jstransform/visitors/es6-arrow-function-visitors');
var es6Classes = require('jstransform/visitors/es6-class-visitors');
var es6Destructuring = require('jstransform/visitors/es6-destructuring-visitors');
var es6ObjectConciseMethod = require('jstransform/visitors/es6-object-concise-method-visitors');
var es6ObjectShortNotation = require('jstransform/visitors/es6-object-short-notation-visitors');
var es6RestParameters = require('jstransform/visitors/es6-rest-param-visitors');
var es6Templates = require('jstransform/visitors/es6-template-visitors');
var es7SpreadProperty = require('jstransform/visitors/es7-spread-property-visitors');
var jsx = require('jsx-transform/lib/visitor');

var transformVisitors = [
    es6ArrowFunctions.visitorList,
    es6Classes.visitorList,
    es6Destructuring.visitorList,
    es6ObjectConciseMethod.visitorList,
    es6ObjectShortNotation.visitorList,
    es6RestParameters.visitorList,
    es6Templates.visitorList,
    es7SpreadProperty.visitorList,
    [jsx]
];

var visitorList = transformVisitors.reduce(function(list, item) {
    return list.concat(item);
});

module.exports = function (code) {
    return transform(visitorList, code, {
        ignoreDocblock: true,
        docblockUnknownTags: true,
        jsx: 'Backbone.h'
    }).code;
};
