var jsx = require('jsx-transform');

module.exports = function jsxLoader(content) {
    return jsx.transform(content, {
        ignoreDocblock: true,
        docblockUnkownTags: true,
        jsx: 'Backbone.h'
    });
};
