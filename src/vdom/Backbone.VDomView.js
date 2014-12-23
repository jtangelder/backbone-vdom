'use strict';

var _ = require('lodash');
var Backbone = require('exoskeleton');
var raf = require('raf');
var ViewWidget = require('./ViewWidget');

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');
var createElement = require('virtual-dom/create-element');

var VDomView = Backbone.View.extend({
	template: function() {
		return (<div></div>);
	},

	render: function (force) {
		// initial render
		if (!this.vDomElement) {
			this.vDomRender();
			this.vDomElement = createElement(this._tree);
			this.el.appendChild(this.vDomElement);
		} else if(force === true) {
			this.vDomRender();
		} else {
			this.vDomQueueRender();
		}
		return this;
	},

	vDomRender: function() {
		var newTree = this.template();

		if (this._tree && this.vDomElement) {
			this._patches = diff(this._tree, newTree);
			this.vDomElement = patch(this.vDomElement, this._patches);
		}

		this._tree = newTree;
	},

	vDomQueueRender: function() {
		if(this._rafScheduled) {
			return;
		}

		this._rafScheduled = true;

		raf(function() {
			this._rafScheduled = false;
			this.vDomRender()
		}.bind(this));
	},

	vDomAppendView: function(ViewClass, options) {
		var key = options.key || (options.model && (options.model.cid || options.model.id)) || _.uniqueId('vdom');
		return new ViewWidget(ViewClass, options, key);
	}
});

Backbone.VDomView = VDomView;
Backbone.VDomView.h = require('virtual-dom/h');

module.exports = VDomView;
