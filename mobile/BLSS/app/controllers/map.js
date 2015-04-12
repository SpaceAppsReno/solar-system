$.map.addEventListener('click', function(e) {
	Ti.API.info("map.click: " + JSON.stringify(e));
});




exports.addAnnotation = function(geodata) {
	var annotation = Alloy.createController('annotation', {
		title : geodata.title,
		latitude : geodata.coords.latitude,
		longitude : geodata.coords.longitude
	});
	$.map.addAnnotation(annotation.getView());
	$.map.setLocation({
		latitude : geodata.coords.latitude,
		longitude : geodata.coords.longitude,
		latitudeDelta : 1,
		longitudeDelta : 1
	});
}; 