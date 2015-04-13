var calculate = (function() {
	// ported and modified from http://www.stargazing.net/kepler/ellipse.html
	
	function getJulian(date) {
		return (date / 86400000) - (date.getTimezoneOffset() / 1440) + 2440587.5;
	}
	
	/* Make an angle between 0 and 2 pi */
	function wrap(theta) {
		while(theta < 0) theta += 2 * Math.PI;
		while(theta >= 2 * Math.PI) theta -= 2 * Math.PI;
		return theta;
	}
	
	function KeplersEquation(mean, eccentricity, epsilon) {
		mean = wrap(mean);
		var delta, e = mean;
		
		do {
			delta = e - eccentricity * Math.sin(e) - mean;
			e = e - delta / (1 - eccentricity * Math.cos(e));
		} while(Math.abs(delta) >= Math.pow(10, -epsilon));
		
		var angle = 2 * Math.atan(Math.sqrt((1 + eccentricity) / (1 - eccentricity)) * Math.tan(e / 2));
		
		return wrap(angle);
	}
	
	return function calculate(object, date) {
		var period = object.period; // orbital period (d)
		var anomaly = object.anomaly; // mean anomaly
		var eccentricity = object.eccentricity; // eccentricity of orbit
		var semimajor = object.semimajor; // semi-major axis
		var ascending = object.ascending; // longitude of ascending node
		var argument = object.argument; // argument of periapsis
		var inclination = object.inclination; // inclination to ecliptic
		
		var epoch = object.epoch;
		var delta = getJulian(date) - getJulian(epoch);
		
		var rotation = 2 * Math.PI * delta / period + anomaly;
		var azimuth = KeplersEquation(rotation, eccentricity, 12);
		var radius = semimajor * (1 - eccentricity * eccentricity) / (1 + eccentricity * Math.cos(azimuth));
		
		var x = radius * (Math.cos(ascending) * Math.cos(azimuth + argument) - Math.sin(ascending) * Math.sin(azimuth + argument) * Math.cos(inclination));
		var y = radius * (Math.sin(ascending) * Math.cos(azimuth + argument) + Math.cos(ascending) * Math.sin(azimuth + argument) * Math.cos(inclination));
		var z = radius * (                                                                           Math.sin(azimuth + argument) * Math.sin(inclination));
		
		return {
			polar: { radius: radius, azimuth: azimuth, inclination: object.inclination },
			cartesian: { x: x, y: y, z: z },
		};
	}
})();
