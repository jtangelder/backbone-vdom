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
	_vDom: {},

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
		if (!this._vDom.element) {
			this._vDomRender();
			this._vDom.element = createElement(this._vDom.tree);
			this.el.appendChild(this._vDom.element);
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

		if (this._vDom.tree && this._vDom.element) {
			this._vDom.patches = diff(this._vDom.tree, newTree);
			this._vDom.element = patch(this._vDom.element, this._vDom.patches);
		}

		this._vDom.tree = newTree;
	},

	/**
	 * wait for the next animation frame to update the dom
	 */
	_vDomQueueRender: function() {
		if(this._vDom.rafScheduled) {
			return;
		}

		this._vDom.rafScheduled = true;

		raf(function() {
			this._vDom.rafScheduled = false;
			this._vDomRender()
		}.bind(this));
	}
});

Backbone.VDomView = VDomView;

// expose the hyperscript function to create a virtual dom tree
Backbone.VDomView.h = function(tag, attrs, childs) {
	// known html tag, pass to hyperscript
	if(typeof tag === 'string') {
		return h(tag, attrs, childs);
	}
	// create an html element widget
	if(tag instanceof Node) {
		return new ElementWidget(tag, attrs, (attrs && attrs.key));
	}
	// create a backbone view widget
	return new ViewWidget(tag, attrs, (attrs && attrs.key));
};

module.exports = VDomView;
