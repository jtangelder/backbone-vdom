'use strict';

var Backbone = require('exoskeleton');
Backbone.h = require('./h.js');
var _ = require('lodash');
var domDelegator = require('dom-delegator');
var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');
var raf = require('raf');
var renderQueue = require('./renderQueue');

// domDelegator makes sure all events are using `ev-foo` events are delegated to the document,
// so only one event is being bound to the DOM
domDelegator();

var VDomView = Backbone.View.extend({
	/**
	 * when set to `true`, the view element that is created by Backbone will be replaced by the element of
	 * `virtualDom/createElement` function.
	 */
	replaceElement: false,

	/**
	 * extend the view with a props property,
	 * containing all the properties of the virtual dom node
	 * @returns {*}
	 */
	constructor: function() {
		this.props = new Backbone.Model();
		return Backbone.View.apply(this, arguments);
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
		if (!this._vDomElement || immediately === true) {
			this._vDomRender();

			if (!this._vDomElement) {
				this._vDomElement = createElement(this._vDomTree);

				if (this.replaceElement) {
					this.el = this._vDomElement;
				} else {
					this.el.appendChild(this._vDomElement);
				}
			}
		}
		// queue the render to the next animation frame
		else {
			renderQueue(this);
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
	 * destroy view instance
	 */
	remove: function() {
		this.props = null;
		this._vDomElement = null;
		this._vDomTree = null;

		Backbone.View.prototype.remove.apply(this, arguments);
	}
});

Backbone.VDomView = VDomView;
module.exports = VDomView;
