var jsx = require('jsx-transform');

module.exports = function jsxLoader(content) {
    return jsx.transform(content, {
        ignoreDocblock: true,
        jsx: 'Backbone.VDomView.h'
    });
};
