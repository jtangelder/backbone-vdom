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
	 * @param {Boolean} [force=false]
	 * @returns {VDomView}
	 */
	render: function (force) {
		// initial render
		if (!this.vDomElement) {
			this.vDomRender();
			this.vDomElement = createElement(this._tree);
			this.el.appendChild(this.vDomElement);
		}
		// immediately render the virtualDom
		else if(force === true) {
			this.vDomRender();
		}
		// queue the render to the next animation frame
		else {
			this.vDomQueueRender();
		}

		return this;
	},

	/**
	 * do a virtual dom diff and update the real DOM
	 */
	vDomRender: function() {
		var newTree = this.template(this);

		if (this._tree && this.vDomElement) {
			this._patches = diff(this._tree, newTree);
			this.vDomElement = patch(this.vDomElement, this._patches);
		}

		this._tree = newTree;
	},

	/**
	 * wait for the next animation frame to update the dom
	 */
	vDomQueueRender: function() {
		if(this._rafScheduled) {
			return;
		}

		this._rafScheduled = true;

		raf(function() {
			this._rafScheduled = false;
			this.vDomRender()
		}.bind(this));
	}
});

Backbone.VDomView = VDomView;

// expose the hyperscript function to create a virtual dom tree
Backbone.VDomView.h = function(tag, attrs, childs) {
	if(typeof tag === 'string') {
		return h(tag, attrs, childs);
	} else if(tag instanceof Node) {
		return new ElementWidget(tag, attrs, (attrs && attrs.key));
	}
	return new ViewWidget(tag, attrs, (attrs && attrs.key));
};

module.exports = VDomView;
