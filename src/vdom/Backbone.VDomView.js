'use strict';

var _ = require('lodash');
var Backbone = require('exoskeleton');
var raf = require('raf');
var ViewWidget = require('./ViewWidget');
var ElementWidget = require('./ElementWidget');

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var h = require('virtual-dom/h');

var VDomView = Backbone.View.extend({
	_vDom: {
		tree: {},
		element: null
	},

	setProps: function(props) {
		
	},

	/**
	 * create a virtual-dom structure
	 * receives the view instance as an argument
	 * @abstract
	 * @param {Backbone.VDomView} view
	 * @returns {VNode}
	 */
	template: function(view) { },

	/**
	 * trigger the rendering of the virtualDom
	 * default the raf strategy is being used
	 * @param {Boolean} [immediately=false]
	 * @returns {VDomView}
	 */
	render: function (immediately) {
		// initial render
		if (!this._vDomElement) {
			this._vDomRender();
			this._vDomElement = createElement(this._vDomTree);
			this.el.appendChild(this._vDomElement);
		}
		// immediately render the virtualDom
		else if(immediately === true) {
			this._vDomRender();
		}
		// queue the render to the next animation frame
		else {
			this._vDomQueueRender();
		}

		return this;
	},

	/**
	 * do a virtual dom diff and update the real DOM
	 */
	_vDomRender: function() {
		var newTree = this.template(this);

		if (this._vDomTree && this._vDomElement) {
			var patches = diff(this._vDomTree, newTree);
			this._vDomElement = patch(this._vDomElement, patches);
		}

		this._vDomTree = newTree;
	},

	/**
	 * wait for the next animation frame to update the dom
	 */
	_vDomQueueRender: function() {
		if(this._vDomRaf) {
			return;
		}

		this._vDomRaf = true;

		raf(function() {
			this._vDomRaf = false;
			this._vDomRender()
		}.bind(this));
	}
});

Backbone.VDomView = VDomView;

// expose the hyperscript function to create a virtual dom tree
Backbone.VDomView.h = function(tag, props, childs) {
	if(typeof tag === 'function') {
		return new ViewWidget(tag, props, (props && props.key));
	}
	if(tag instanceof Node) {
		return new ElementWidget(tag, props, (props && props.key));
	}

	return h(tag, props, childs);
};

module.exports = VDomView;
