var Backbone = require('exoskeleton');
var ViewWidget = require('./ViewWidget');
var ElementWidget = require('./ElementWidget');
var hyperScript = require('virtual-dom/h');

function h(tag, props, childs) {
	if(typeof tag === 'function') {
		return new ViewWidget(tag, props, (props && props.key));
	}
	if(tag instanceof Node) {
		return new ElementWidget(tag, props, (props && props.key));
	}

	return hyperScript(tag, props, childs);
}

module.exports = h;
Backbone.h = h;
