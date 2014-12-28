var Backbone = require('exoskeleton');
var ViewWidget = require('./ViewWidget');
var NodeWidget = require('./NodeWidget');
var hyperScript = require('virtual-dom/h');

function h(tag, props, childs) {
	// when the tag is a function, it is probably a not-instantiated Backbone.View class
	if(typeof tag === 'function' || tag instanceof Backbone.View) {
		return new ViewWidget(tag, props, (props && props.key));
	}
	if(tag instanceof Node) {
		return new NodeWidget(tag, props, (props && props.key));
	}

	return hyperScript(tag, props, childs);
}

Backbone.h = h;
module.exports = h;
