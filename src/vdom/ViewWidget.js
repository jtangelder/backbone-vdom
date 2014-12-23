function ViewWidget(ViewClass, options, key) {
    this.ViewClass = ViewClass;
    this.options = options;

    this.name = this.id = key;
}

ViewWidget.prototype = {
    type: 'Widget',

    init: function () {
        var Constructor = this.ViewClass;
        this.view = new Constructor(this.options);

        var element = this.view.render().el;
        this.update(this, element);
        return element;
    },

    update: function (widget, element) {

    },

    destroy: function (element) {
        this.view.remove();
    }
};
module.exports = ViewWidget;
