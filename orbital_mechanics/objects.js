var objects = (function() {
	var rads = Math.PI / 180;
	
	var objects = [
		{
			name: 'Mars',
			epoch: new Date("January 1 2000 12:00:00 UTC"),
			semimajor: 1.523679, // semi-major axis (au)
			eccentricity: 0.0935, // eccentricity of orbit
			inclination: 1.850 * rads, // inclination to ecliptic
			ascending: 49.562 * rads, // longitude of ascending node
			argument: 286.562 * rads, // argument of periapsis
			anomaly: 19.3564 * rads, // mean anomaly
			period: 686.971, // orbital period (d)
		},
	];
	
	return objects;
})();
