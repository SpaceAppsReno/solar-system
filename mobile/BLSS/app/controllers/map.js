$.map.addEventListener('click', function(e) {
	Ti.API.info("map.click: " + JSON.stringify(e));
});

$.on('updateLocation', function(geodata) {
	$.map.setLocation({
		latitude : geodata.latitude,
		longitude : geodata.longitude,
		animate : geodata.animate,
		latitudeDelta : geodata.latitudeDelta,
		longitudeDelta : geodata.longitudeDelta
	});
});
