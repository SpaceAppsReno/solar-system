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
	
	this.body = objects.map(function(object) {
		var result = {
			name: object.name,
			slug: object.slug,
			epoch: object.orbital.epoch.toUTCString(),
		};
		
		result.orbital = Scale(object.orbital, factor, ['semimajor','semiminor','focus1','focus2','center']);
		result.physical = Scale(object.physical, factor, ['radius']);
		delete result.orbital.epoch;
		
		return result;
	});
});

app.get('/realtime', function *realtime() {
	var factor = 1 / (+this.query.factor || 1);
	
	var date;
	if(!this.query.date) date = new Date();
	else date = new Date(this.query.date);
	
	this.body = calculate(objects, factor, date);
});

function calculate(objects, factor, date) {
	return objects.map(function(object) {
		var mechanics = Mechanics(object.orbital, date);
		
		var result = {
			name: object.name,
			slug: object.slug,
			date: date.toUTCString(),
			epoch: object.orbital.epoch.toUTCString(),
		};
		
		result.polar = Scale(mechanics.polar, factor, ['radius']);
		result.cartesian = Scale(mechanics.cartesian, factor, ['x','y','z']);
		
		if(object.moons) {
			result.moons = calculate(object.moons, factor, date);
		}
		
		return result;
	});
}
