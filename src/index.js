'use strict';

var _ = require('lodash');
var document = require('global/document');
var Backbone = require('exoskeleton');
require('./vdom/Backbone.VDomView');

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
				#{this.model.cid} {this.model.get('name')}
				<a onclick={this.onEdit.bind(this)}> [edit]</a>
				<a onclick={this.onRemove.bind(this)}> [remove]</a>
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
	initialize: function(){
		this.collection.on('add remove', this.render.bind(this));
	},

	template: function(){
		var listItems;
		if(this.collection.length) {
			listItems = this.collection.map(function(item) {
				return <ItemView model={item} key={item.cid} />;
			}.bind(this));
		}

		return (
			<div>
				<button onclick={this.onAddItem.bind(this)}>Add list item</button>
				<h1>{this.collection.length.toString()} Items</h1>
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
new ListView({
	el: document.querySelector('#el1'),
	collection: new List()
}).render();

new ListView({
	el: document.querySelector('#el2'),
	collection: new List()
}).render();

// overwrite this method from exoskeleton
// because we don't want to use jQuery
Backbone.View.prototype._setAttributes = function(attrs) {
	for(var name in attrs) {
		this.el.setAttribute(name, attrs[name]);
	}
};

Backbone.View.prototype._removeElement = function() {
	if (this.el.parentNode) {
		this.el.parentNode.removeChild(this.el);
	}
};
