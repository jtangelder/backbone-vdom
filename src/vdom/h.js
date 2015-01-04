var Backbone = require('exoskeleton');
var ViewWidget = require('./ViewWidget');
var NodeWidget = require('./NodeWidget');
var hyperScript = require('virtual-dom/h');

function h(tag, props, children) {
	// when the tag is a function, it is probably a not-instantiated Backbone.View class
	if(typeof tag === 'function' || tag instanceof Backbone.View) {
		props = props || {};
		props.children = children;
		return new ViewWidget(tag, props, props.key);
	}
	if(tag instanceof Node) {
		return new NodeWidget(tag, props, (props && props.key));
	}

	return hyperScript(tag, props, children);
}

Backbone.h = h;
module.exports = h;
