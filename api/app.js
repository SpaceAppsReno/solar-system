var debug = require('debug')('app:main');

var koa = require('koa');
var cors = require('koa-cors');
var mount = require('koa-mount');
var serve = require('koa-static');
var bodyParser = require('koa-body-parser');

var error = require('./lib/error');
var view = require('./lib/view');


var app = koa();
app.config = require('./config.json');

app.use(cors());
app.use(error(app));
app.use(view(app, __dirname));
app.use(bodyParser());

app.use(mount('/', require('./apps/main')));

var apps = require('fs')
	.readdirSync(__dirname + '/apps')
	.filter(function(slug) {
		return (slug !== 'main');
	}, app)
	.map(function(slug) {
		var app = require('./apps/' + slug);
		app.slug = slug;
		
		this.use(mount('/' + slug, app));
		
		return app;
	}, app)
;

var server = app.listen(process.env.PORT || app.config.port, function() {
	debug('listening on port ' + this.address().port);
});
