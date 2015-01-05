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

var transformVisitors = {
    'es6-arrow-functions': es6ArrowFunctions.visitorList,
    'es6-classes': es6Classes.visitorList,
    'es6-destructuring': es6Destructuring.visitorList,
    'es6-object-concise-method': es6ObjectConciseMethod.visitorList,
    'es6-object-short-notation': es6ObjectShortNotation.visitorList,
    'es6-rest-params': es6RestParameters.visitorList,
    'es6-templates': es6Templates.visitorList,
    'es7-spread-property': es7SpreadProperty.visitorList,
    'jsx': [jsx]
};

/**
 * Specifies the order in which each transform should run.
 */
var transformRunOrder = [
    'es6-arrow-functions',
    'es6-object-concise-method',
    'es6-object-short-notation',
    'es6-classes',
    'es6-rest-params',
    'es6-templates',
    'es6-destructuring',
    'es7-spread-property',
    'jsx'
];

var visitorList = [];
for (var i = 0, il = transformRunOrder.length; i < il; i++) {
    visitorList = visitorList.concat(transformVisitors[transformRunOrder[i]]);
}

module.exports = function (code) {
    return transform(visitorList, code, {
        ignoreDocblock: true,
        docblockUnknownTags: true,
        jsx: 'Backbone.h'
    }).code;
};
