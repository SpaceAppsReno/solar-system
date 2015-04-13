var koa = require('koa');
var router = require('koa-router');
var mount = require('koa-mount');
var serve = require('koa-static');

var Scale = require('./scale');
var Mechanics = require('./mechanics');
var objects = require('./objects');

var app = module.exports = koa();

app.use(router(app));

app.get('/characteristics', function *characteristics() {
	var factor = 1 / (+this.query.factor || 1);
	
	this.body = getCharacteristics(objects, factor);
});

app.get('/characteristics/:slug', function *characteristicsSlug() {
	var factor = 1 / (+this.query.factor || 1);
	
	var object = findBySlug(this.params.slug);
	this.body = getCharacteristics([object], factor);
});

function getCharacteristics(objects, factor) {
	return objects.map(function(object) {
		var result = {
			name: object.name,
			slug: slugify(object.name),
			epoch: object.orbital.epoch.toUTCString(),
		};
		
		result.orbital = Scale(object.orbital, factor, ['semimajor','semiminor','focus1','focus2','center']);
		result.physical = Scale(object.physical, factor, ['radius']);
		delete result.orbital.epoch;
		
		if(object.moons) {
			result.moons = getCharacteristics(object.moons, factor);
		}
		
		return result;
	});
}

app.get('/realtime', function *realtime() {
	var factor = 1 / (+this.query.factor || 1);
	
	var date;
	if(!this.query.date) date = new Date();
	else date = new Date(this.query.date);
	
	this.body = getRealtime(objects, factor, date);
});

app.get('/realtime/:slug', function *realtimeSlug() {
	var factor = 1 / (+this.query.factor || 1);
	
	var date;
	if(!this.query.date) date = new Date();
	else date = new Date(this.query.date);
	
	var object = findBySlug(this.params.slug);
	this.body = getRealtime([object], factor, date);
});

function getRealtime(objects, factor, date) {
	return objects.map(function(object) {
		var result = {
			name: object.name,
			slug: slugify(object.name),
			epoch: object.orbital.epoch.toUTCString(),
			date: date.toUTCString(),
		};
		
		var mechanics = Mechanics(object.orbital, date);
		result.polar = Scale(mechanics.polar, factor, ['radius']);
		result.cartesian = Scale(mechanics.cartesian, factor, ['x','y','z']);
		
		if(object.moons) {
			result.moons = getRealtime(object.moons, factor, date);
		}
		
		return result;
	});
}

function slugify(name) {
	return name.toLowerCase()
		.replace(/\s+/g, '-')      // Replace spaces with -
		.replace(/\-\-+/g, '-')    // Replace multiple - with single -
		.replace(/[^\w\-]+/g, '')  // Remove all non-word chars
		.replace(/^-+/, '')        // Trim - from start of text
		.replace(/-+$/, '');       // Trim - from end of text
}

function findBySlug(slug) {
	var object;
	for(var i = 0; i < objects.length; i++) {
		if(slugify(objects[i].name) === slug) {
			object = objects[i];
			break;
		}
	}
	
	if(!object) {
		throw new Error('404|No records matching slug: ' + slug);
	}
	
	return object;
}
