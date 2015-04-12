var objects = (function() {
	var rads = Math.PI / 180;
	
	var objects = [
		{
			name: 'Mercury',
			semimajor: 57909050000,
			eccentricity: 0.20563,
			period: 87.969,
			anomaly: 174.796 * rads,
			inclination: 7.005 * rads,
			ascending: 48.331 * rads,
			argument: 29.124 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Venus',
			semimajor: 108208000000,
			eccentricity: 0.0067,
			period: 224.701,
			anomaly: 50.115 * rads,
			inclination: 3.39458 * rads,
			ascending: 76.678 * rads,
			argument: 55.186 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Earth',
			semimajor: 149598261000,
			eccentricity: 0.01671123,
			period: 365.256363,
			anomaly: 355.53 * rads,
			inclination: 7.155 * rads,
			ascending: -11.26064 * rads,
			argument: 102.94719 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Mars',
			semimajor: 227939100000,
			eccentricity: 0.0935,
			period: 686.971,
			anomaly: 19.3564 * rads,
			inclination: 1.85 * rads,
			ascending: 49.562 * rads,
			argument: 286.537 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Ceres',
			semimajor: 414010000000,
			eccentricity: 0.075823,
			period: 1681.63,
			anomaly: 95.9891 * rads,
			inclination: 10.593 * rads,
			ascending: 80.3293 * rads,
			argument: 72.522 * rads,
			epoch: 'December 19 2014 12:00:00 UTC'
		},
		{
			name: 'Jupiter',
			semimajor: 778547200000,
			eccentricity: 0.048775,
			period: 4332.59,
			anomaly: 18.818 * rads,
			inclination: 1.305 * rads,
			ascending: 100.492 * rads,
			argument: 275.066 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Saturn',
			semimajor: 1443449370000,
			eccentricity: 0.055723219,
			period: 10759.22,
			anomaly: 320.34675 * rads,
			inclination: 2.78524 * rads,
			ascending: 113.642811 * rads,
			argument: 336.013862 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Uranus',
			semimajor: 2870671400000,
			eccentricity: 0.47220087,
			period: 30687.15,
			anomaly: 142.2386 * rads,
			inclination: 0.772556 * rads,
			ascending: 73.999342 * rads,
			argument: 96.998857 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Neptune',
			semimajor: 4498542600000,
			eccentricity: 0.00867797,
			period: 60190.03,
			anomaly: 259.885588 * rads,
			inclination: 1.767975 * rads,
			ascending: 131.782974 * rads,
			argument: 273.219414 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		},
		{
			name: 'Pluto',
			semimajor: 5874000000000,
			eccentricity: 0.244671664,
			period: 90465,
			anomaly: 14.86012204 * rads,
			inclination: 17.151394 * rads,
			ascending: 110.28683 * rads,
			argument: 113.76349 * rads,
			epoch: 'January 1 2000 12:00:00 UTC'
		}
	];
	
	return objects;
})();
