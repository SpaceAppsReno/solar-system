var
	fs = require('fs'),
	path = require('path'),
	_ = require('underscore');

var View = module.exports = function(app, path) {
	path = path || '.';
	
	app.view = {
		cache: false,
		views: {},
		get: View.getView(path),
	};
	
	return function *render(next) {
		this.globals = {};
		this.globals.view = app.view;
		this.render = View.render;
		
		yield next;
	}
}

View.util = {
	extend: function(template, data) {
		this.parent = {
			template: template,
			data: data || {},
		};
	},
	include: function(template, data) {
		return View._render.call(this, template, data);
	},
}

View._render = function(template, input, globals) {
	if(!Object.keys(this).length) {
		for(var k in View.util) this[k] = View.util[k];
		for(var k in globals) this[k] = globals[k];
	}
	
	template = this.view.get(template);
	
	var content = template.call(this, input || {});
	
	if(this.parent) {
		this.parent.data.content = content;
		
		var parent = this.parent;
		delete this.parent;
		return View._render.call(this, parent.template, parent.data);
	}
	
	return content;
}

View.render = function(status, template, input) {
	if(typeof status !== 'number') {
		input = template;
		template = status;
	}
	else {
		this.status = status;
	}
	
	var globals = this.globals;
	return new Promise(function(resolve, reject) {
		return resolve(View._render.call({}, template, input, globals));
	});
}

View.getView = function(base) {
	base = [base,'views'];
	
	return function(view) {
		var _base = base;
		if(view[0] === 'core') {
			view = view.slice();
			view.shift();
			_base = ['views','core'];
		}
		
		var file = path.join.apply(null, _base.concat(view));
		
		if(this.cache === false) delete this.views[file];
		if(!this.views[file]) {
			view = fs.readFileSync(file, 'utf-8');
			this.views[file] = _.template(view, null, { variable: 'data', evaluate : /<%([\s\S]+?)%>(?:\r\n)?/g, });
		}
		
		return this.views[file];
	}
}
