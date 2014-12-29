var jsx = require('jsx-transform/lib/jsx');

module.exports = function jsxLoader(content) {
    return jsx.transform(content, {
        ignoreDocblock: true,
        docblockUnknownTags: true,
        jsx: 'Backbone.h'
    });
};
