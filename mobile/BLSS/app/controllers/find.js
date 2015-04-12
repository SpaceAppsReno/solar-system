var args = arguments[0] || {};


$.on('updateStatus', function(e) {
	$.statusLabel.text = e.status;
});