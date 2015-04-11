var scale = (function() {
	var sun = 1392684000;
	var dome = 9.8;
	return dome / sun;
})();

console.log('Sun Diameter:', 1392684000 * scale, 'm')
console.log('Speed of Light:', 671000000 * scale, 'mph')
console.log('Speed of Light:', 300000000 * scale, 'm/s')
console.log('')

var objects = {
	Mercury: {
		diameter: 3032,
		distance: 35983610,
	},
	Venus: {
		diameter: 7521,
		distance: 67232360,
	},
	Earth: {
		diameter: 7926,
		distance: 92957100,
	},
	Mars: {
		diameter: 4222,
		distance: 141635300,
	},
	Jupiter: {
		diameter: 88846,
		distance: 483632000,
	},
	Saturn: {
		diameter: 74898,
		distance: 888188000,
	},
	Uranus: {
		diameter: 31763,
		distance: 1783950000,
	},
	Neptune: {
		diameter: 30778,
		distance: 2798842000,
	},
}

for(var planet in objects) {
	console.log(planet)
	
	planet = objects[planet];
	
	console.log('  Diameter:', planet.diameter * scale * 1609.34, 'm')
	console.log('  Diameter:', planet.diameter * scale * 160934 / 2.54, 'in')
	console.log('  Distance:', planet.distance * scale, 'mi')
}
