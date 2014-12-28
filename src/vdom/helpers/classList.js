function classList(classList) {
	var result = [];
	for(var className in classList) {
		if(classList[className]) {
			result.push(className);
		}
	}
	return result.join(" ");
}

module.exports = classList;
