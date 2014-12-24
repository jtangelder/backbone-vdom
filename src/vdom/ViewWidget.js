/**
 * Create a virtual-dom widget
 * @param {Backbone.View} ViewClass
 * @param {object} [options]
 * @param {string|number} [key]
 * @constructor
 */
function ViewWidget(ViewClass, options, key) {
    this.ViewClass = ViewClass;
    this.options = options;

    // used by virtual-node to identify widgets
    this.name = this.id = key;
}

ViewWidget.prototype = {
    type: 'Widget',

    /**
     * called when the widget node is being set up
     * @returns {HTMLElement}
     */
    init: function () {
        var Constructor = this.ViewClass;
        this.view = new Constructor(this.options);

        var element = this.view.render().el;
        this.update(this, element);

        return element;
    },

    /**
     * called when the widget node already exists
     * @param {ViewWidget} widget instance
     * @param {HTMLElement} element
     */
    update: function (widget, element) { },

    /**
     * called when the widget node is being removed
     * @param {HTMLElement} element
     */
    destroy: function (element) {
        this.view && this.view.remove();
    }
};

module.exports = ViewWidget;
