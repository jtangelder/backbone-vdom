/**
 * Create a virtual-dom widget
 * @param {HTMLElement} element
 * @param {string|number} [key]
 * @constructor
 */
function ElementWidget(element, key) {
    this.element = element;

    // used by virtual-node to identify widgets
    this.name = this.id = key;
}

ElementWidget.prototype = {
    type: 'Widget',

    /**
     * called when the widget node is being set up
     * @returns {HTMLElement}
     */
    init: function () {
        return this.element;
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
        this.element = null;
    }
};

module.exports = ElementWidget;
