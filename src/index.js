'use strict';

var _ = require('lodash');
var Backbone = require('exoskeleton');
require('./vdom/Backbone.VDomView');
var classList = require('./vdom/classList');


// overwrite this method from exoskeleton
// because we don't want to use jQuery
Backbone.View.prototype._setAttributes = function(attrs) {
	if(!this.el) {
		return;
	}
	for(var name in attrs) {
		this.el.setAttribute(name, attrs[name]);
	}
};

Backbone.View.prototype._removeElement = function() {
	if (this.el.parentNode) {
		this.el.parentNode.removeChild(this.el);
	}
};

//
// small example backbone application to demo and test the workings
//

var Item = Backbone.Model.extend({
	defaults: {
		name: 'hello world'
	}
});

var List = Backbone.Collection.extend({
	model: Item
});

var HeaderView = Backbone.View.extend({
	tagName: 'header',
	template: "<h1>Backbone.VDomView example</h1>",
	render: function() {
		this.el.innerHTML = this.template;
		return this;
	}
});

var ItemView = Backbone.VDomView.extend({
	tagName: 'li',

	initialize: function(){
		this.listenTo(this.model, 'change', this.render.bind(this));
		this.listenTo(this.props, 'change', this.render.bind(this));
	},

	template: function(){
		return (
			<div>
				{this.props.get('date').toString()}
				{this.model.cid} {this.model.get('name')}
				<a ev-click={this.onEdit.bind(this)}> [edit]</a>
				<a ev-click={this.onRemove.bind(this)}> [remove]</a>
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
		this.listenTo(this.collection, 'add remove', this.render.bind(this));

		// initialize a static, regular Backbone.View
		this.headerView = new HeaderView();
	},

	template: function(){
		// example of showing collections
		var listItems;
		if(this.collection.length) {
			listItems = this.collection.map(function(item) {
				return <ItemView model={item} key={item.cid} date={new Date()}/>
			}.bind(this));
		}

		// example of the classList helper function
		var listClassNames = classList({
			yes: true,
			no: false,
			odd: this.collection.length % 2
		});

		// static view
		var Header = this.headerView;

		return (
			<div>
				<Header />
				<button ev-click={this.onAddItem.bind(this)}>Add list item</button>
				<h3>{this.collection.length.toString()} Items</h3>
				<ul className={listClassNames}>
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
