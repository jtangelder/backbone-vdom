var raf = require('raf');
var queue = [];
var scheduled = false;

function scheduleRender() {
	if (scheduled) {
		return;
	}
	scheduled = true;
	raf(function() {
		renderQueue();
		scheduled = false;
	});
}

function renderQueue() {
	var obj;
	while(obj = queue.pop()) {
		obj._vDomRender();
	}
}

module.exports = function(obj) {
	if (queue.indexOf(obj) === -1) {
		queue.push(obj);
	}
	scheduleRender();
};