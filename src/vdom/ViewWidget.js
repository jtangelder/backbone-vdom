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

        this.update(this, this.element);
        return this.view.render().el;
    },

    update: function (inst, element) {
        // what to do with this method?
    }
};
module.exports = ViewWidget;
