var rads = Math.PI / 180;

module.exports = [
	{
		name: 'Mercury',
		orbital: {
			semimajor: 57909050000,
			eccentricity: 0.20563,
			period: 87.969,
			anomaly: 174.796 * rads,
			inclination: 7.005 * rads,
			ascending: 48.331 * rads,
			argument: 29.124 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0,
			radius: 2439700,
		},
	},
	{
		name: 'Venus',
		orbital: {
			semimajor: 108208000000,
			eccentricity: 0.0067,
			period: 224.701,
			anomaly: 50.115 * rads,
			inclination: 3.39458 * rads,
			ascending: 76.678 * rads,
			argument: 55.186 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0,
			radius: 6051800,
		},
	},
	{
		name: 'Earth',
		orbital: {
			semimajor: 149598261000,
			eccentricity: 0.01671123,
			period: 365.256363,
			anomaly: 355.53 * rads,
			inclination: 7.155 * rads,
			ascending: -11.26064 * rads,
			argument: 102.94719 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0.0033528,
			radius: 6371000,
		},
	},
	{
		name: 'Mars',
		orbital: {
			semimajor: 227939100000,
			eccentricity: 0.0935,
			period: 686.971,
			anomaly: 19.3564 * rads,
			inclination: 1.85 * rads,
			ascending: 49.562 * rads,
			argument: 286.537 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0.00589,
			radius: 3389500,
		},
	},
	{
		name: 'Ceres',
		orbital: {
			semimajor: 414010000000,
			eccentricity: 0.075823,
			period: 1681.63,
			anomaly: 95.9891 * rads,
			inclination: 10.593 * rads,
			ascending: 80.3293 * rads,
			argument: 72.522 * rads,
			epoch: new Date('December 09 2014 12:00:00 UTC'),
		},
		physical: {
			radius: 476200,
		},
	},
	{
		name: 'Jupiter',
		orbital: {
			semimajor: 778547200000,
			eccentricity: 0.048775,
			period: 4332.59,
			anomaly: 18.818 * rads,
			inclination: 1.305 * rads,
			ascending: 100.492 * rads,
			argument: 275.066 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0.06487,
			radius: 69911000,
		},
	},
	{
		name: 'Saturn',
		orbital: {
			semimajor: 1443449370000,
			eccentricity: 0.055723219,
			period: 10759.22,
			anomaly: 320.34675 * rads,
			inclination: 2.78524 * rads,
			ascending: 113.642811 * rads,
			argument: 336.013862 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0.09796,
			radius: 58232000,
		},
	},
	{
		name: 'Uranus',
		orbital: {
			semimajor: 2870671400000,
			eccentricity: 0.47220087,
			period: 30687.15,
			anomaly: 142.2386 * rads,
			inclination: 0.772556 * rads,
			ascending: 73.999342 * rads,
			argument: 96.998857 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0.0229,
			radius: 25362000,
		},
	},
	{
		name: 'Neptune',
		orbital: {
			semimajor: 4498542600000,
			eccentricity: 0.00867797,
			period: 60190.03,
			anomaly: 259.885588 * rads,
			inclination: 1.767975 * rads,
			ascending: 131.782974 * rads,
			argument: 273.219414 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			flattening: 0.0171,
			radius: 24622000,
		},
	},
	{
		name: 'Pluto',
		orbital: {
			semimajor: 5874000000000,
			eccentricity: 0.244671664,
			period: 90465,
			anomaly: 14.86012204 * rads,
			inclination: 17.151394 * rads,
			ascending: 110.28683 * rads,
			argument: 113.76349 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			radius: 1184000,
		},
	},
	{
		name: 'Halley\'s Comet',
		orbital: {
			semimajor: 2667950010000,
			eccentricity: 0.96714291,
			period: 27510,
			anomaly: 139.4753 * rads,
			inclination: 162.26269 * rads,
			ascending: 58.42008 * rads,
			argument: 111.33249 * rads,
			epoch: new Date('January 1 2000 12:00:00 UTC'),
		},
		physical: {
			radius: 5500,
		},
	},
	{
		name: 'Makemake',
		orbital: {
			semimajor: 6838866660 * 1000,
			eccentricity: 0.15586,
			period: 112897,
			anomaly: 156.353 * rads,
			inclination: 29.00685 * rads,
			ascending: 79.3659 * rads,
			argument: 297.240 * rads,
			epoch: new Date('December 09 2014 12:00:00 UTC')
		},
		physical: {
			radius: 715000,
		},
	},
	{
		name: 'Eris',
		orbital: {
			semimajor: 1.01398933 * Math.pow(10,13),
			eccentricity: 0.44068,
			period: 203830,
			anomaly: 204.16 * rads,
			inclination: 44.0445 * rads,
			ascending: 35.9531 * rads,
			argument: 150.977 * rads,
			epoch: new Date('December 09 2014 12:00:00 UTC')
		},
		physical: {
			radius: 1163000,
		},
	},
	{
		name: 'Haumea',
		orbital: {
			semimajor: 6.46532078 * Math.pow(10,12),
			eccentricity: 0.19126,
			period: 103774,
			anomaly: 209.07 * rads,
			inclination: 28.19 * rads,
			ascending: 121.79 * rads,
			argument: 240.20 * rads,
			epoch: new Date('December 09 2014 12:00:00 UTC')
		},
		physical: {
			radius: 620000,
		},
	},
];

function slugify(name) {
	return name.toLowerCase()
		.replace(/\s+/g, '-')           // Replace spaces with -
		.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
		.replace(/\-\-+/g, '-')         // Replace multiple - with single -
		.replace(/^-+/, '')             // Trim - from start of text
		.replace(/-+$/, '');            // Trim - from end of text
}

module.exports.map(function(value) {
	value.slug = slugify(value.name);
	
	value.orbital.semiminor = value.orbital.semimajor * Math.sqrt(1 - Math.pow(value.orbital.eccentricity, 2));
	
	var distance = Math.sqrt(Math.pow(value.orbital.semimajor, 2) - Math.pow(value.orbital.semiminor, 2));
	value.orbital.focus1 = value.orbital.focus1 || [0, 0];
	value.orbital.focus2 = value.orbital.focus2 || [
		value.orbital.focus1[0] + distance * Math.sin(0),
		value.orbital.focus1[1] + distance * Math.cos(0)
	];
	
	value.orbital.center = [ (value.orbital.focus1[0] + value.orbital.focus2[0]) / 2, (value.orbital.focus1[1] + value.orbital.focus2[1]) / 2 ];
	value.orbital.rotation = Math.atan2(value.orbital.focus2[0] - value.orbital.focus1[0], value.orbital.focus2[1] - value.orbital.focus1[1]);
});
