/**
 * Create a virtual-dom widget
 * @param {Node} node
 * @param {object} props
 * @param {string|number} [key]
 * @constructor
 */
function NodeWidget(node, props, key) {
    this.node = node;
    this.props = props || {};

    // used by virtual-node to identify widgets
    this.name = 'Node';
    this.id = key;
}

NodeWidget.prototype = {
    type: 'Widget',

    /**
     * called when the widget node is being set up
     * @returns {Node}
     */
    init: function () {
        this.update(null, this.node);
        return this.node;
    },

    /**
     * called when the widget node already exists
     * @param {ViewWidget} prev
     * @param {Node} node
     */
    update: function (prev, node) {
        for(var prop in this.props) {
            this.node[prop] = this.props[prop];
        }
    },

    /**
     * called when the widget node is being removed
     * @param {Node} node
     */
    destroy: function (node) {
        this.node = null;
        this.props = null;
    }
};

module.exports = NodeWidget;
