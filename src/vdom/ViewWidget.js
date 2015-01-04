var Backbone = require('exoskeleton');
var VDomView = require('./VDomView');

/**
 * Create a virtual-dom widget
 * @param {Backbone.View|Function} view
 * @param {object} [props]
 * @param {string|number} [key]
 * @constructor
 */
function ViewWidget(view, props, key) {
    this.view = view;
    this.props = props;

    // used by virtual-node to identify widgets
    this.name = 'View';
    this.id = key;
}

ViewWidget.prototype = {
    type: 'Widget',

    /**
     * called when the widget node is being set up
     * @returns {Node}
     */
    init: function () {
        if (typeof this.view === 'function') {
            var Constructor = this.view;
            this.view = new Constructor(this.props);
        }
        this.update(null, this.view.el);

        return this.view.render().el;
    },

    /**
     * called when the widget node already exists
     * @param {ViewWidget} prev
     * @param {Node} element
     */
    update: function (prev, element) {
        if(prev) {
            this.view = prev.view;
        }

        this.view.el = element;

        if(this.view.props instanceof Backbone.Model) {
            this.view.props.set(this.props);
        }
    },

    /**
     * called when the widget node is being removed
     * @param {Node} element
     */
    destroy: function (element) {
        this.view && this.view.remove();

        this.view = null;
        this.props = null;
    }
};

module.exports = ViewWidget;
