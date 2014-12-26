/**
 * Create a virtual-dom widget
 * @param {HTMLElement} element
 * @param {object} attrs
 * @param {string|number} [key]
 * @constructor
 */
function ElementWidget(element, attrs, key) {
    this.element = element;
    this.attrs = attrs || {};

    // used by virtual-node to identify widgets
    this.name = 'Element';
    this.id = key;
}

ElementWidget.prototype = {
    type: 'Widget',

    /**
     * called when the widget node is being set up
     * @returns {HTMLElement}
     */
    init: function () {
        this.update(null, this.element);
        return this.element;
    },

    /**
     * called when the widget node already exists
     * @param {ViewWidget} prev instance
     * @param {HTMLElement} element
     */
    update: function (prev, element) {
        this.element = element;

        if(prev) {
            this.attrs = prev.attrs || {};
        }

        for(var attr in this.attrs) {
            this.element[attr] = this.attrs[attr];
        }
    },

    /**
     * called when the widget node is being removed
     * @param {HTMLElement} element
     */
    destroy: function (element) {
        this.element = null;
    }
};

module.exports = ElementWidget;
