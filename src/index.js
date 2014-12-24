'use strict';

var _ = require('lodash');
var document = require('global/document');
var Backbone = require('exoskeleton');
require('./vdom/Backbone.VDomView');


// overwrite this method from exoskeleton
// because we don't want to use jQuery
Backbone.View.prototype._setAttributes = function(attrs) {
	for(var name in attrs) {
		this.el.setAttribute(name, attrs[name]);
	}
};

// small example backbone application to demo and test the workings

var Item = Backbone.Model.extend({
	defaults: {
		name: 'hello world'
	}
});

var List = Backbone.Collection.extend({
	model: Item
});

var ItemView = Backbone.VDomView.extend({
	tagName: 'li',

	initialize: function(){
		this.model.on('change', this.render.bind(this));
	},

	template: function(){
		return (
			<div>
				{this.model.get('name')}
				<a onclick={this.onEdit.bind(this)}>[edit]</a>
				<a onclick={this.onRemove.bind(this)}>[remove]</a>
			</div>);
	},

	onEdit: function() {
		this.model.set('name',
			window.prompt('Enter new name', this.model.get('name'))
		);
	},

	onRemove: function(){
		this.model.destroy();
	}
});

var ListView = Backbone.VDomView.extend({
	el: document.body,

	initialize: function(){
		this.collection = new List();
		this.collection.on('add remove', this.render.bind(this));

		this.render();
	},

	template: function(){
		var listItems;
		if(this.collection.length) {
			listItems = this.collection.map(function(item) {
				return this.vDomAppendView(ItemView, { model: item });
			}.bind(this));
		}

		return (
			<div>
				<button onclick={this.onAddItem.bind(this)}>Add list item</button>
				<ul>
					{listItems || <li><em>No Items</em></li>}
				</ul>
			</div>);
	},

	onAddItem: function(){
		this.collection.add(new Item());
	}
});

// go!
new ListView();
