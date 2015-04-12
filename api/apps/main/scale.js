var Scale = module.exports = function(input, factor, include) {
	if(typeof input === 'number') return input * factor;
	if(typeof input !== 'object') return input;
	if(!include || (include !== true && !include.length)) return input;
	
	var output = (input.constructor === Array) ? [] : {};
	
	for(var key in input) {
		if(include === true || include.indexOf(key) !== -1) {
			output[key] = Scale(input[key], factor, true);
		}
		else {
			output[key] = input[key];
		}
	}
	
	return output;
}
