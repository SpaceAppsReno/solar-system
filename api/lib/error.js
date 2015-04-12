var statuses = require('koa/node_modules/statuses');

module.exports = function(app) {
	return function *error(next) {
		try {
			yield next;
			
			if(this.status !== 404) return;
			
			var err = new Error();
			err.status = 404;
			
			throw err;
		}
		catch (err) {
			this.app.emit('error', err, this);
			
			err.status = err.status || 500;
			err.title = statuses[err.status];
			
			this.status = err.status;
			this.body = yield this.render(['core','error.html'], err);
		}
	}
}
