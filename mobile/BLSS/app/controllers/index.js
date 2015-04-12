var self;

var beaconRegions,
    open = false;

var digestServices,
    digestCharacteristics,
    digestNewValue,
    digestNewRSSI,
    digestWroteValue;

var weAreTheUser = false,
    weAreTheBeacon = false,
    rangingInProgress = false;

var counter = 0;

var planets = [{
	name : 'Mercury',
	color : 'orange',
	averageOrbit : 407,
	innerOrbit : 323.6999635,
	outerOrbit : 491,
	semiMajorAxis : 407
}, {
	name : 'Venus',
	color : 'yellow',
	averageOrbit : 761.435042,
	innerOrbit : 756.2911615,
	outerOrbit : 766.5789224,
	semiMajorAxis : 761.435042
}, {
	name : 'Earth',
	color : 'blue',
	averageOrbit : 1052.688878,
	innerOrbit : 1035.074001,
	outerOrbit : 1069.096794,
	semiMajorAxis : 1052.688878
}, {
	name : 'Mars',
	color : 'red',
	averageOrbit : 1604,
	innerOrbit : 1753.563622,
	outerOrbit : 1454.500806,
	semiMajorAxis : 1604
}];

var BluetoothLE = require('com.logicallabs.bluetoothle'),
    Lib = require('lib'),
// BEACON_REGION_UUIDS holds the UUIDs of the regions this app deals with.
// The central/monitoring side monitors for all of these regions
// simultaneously. The peripheral/beacon side cycles through them one by
// one, every time it's restarted.
    BEACON_REGION_UUIDS = ['A495B155-C5B1-4B44-B512-1370F02D74DE'];

function initBeaconRegionsForCentral() {
	// The difference between this and initBeaconRegionsForBeacon is
	// that the latter initializes the beacon with a specific major/minor
	// number. This allows us to test the case where the app in the central
	// role scans for a wider range of beacons than what the app in the
	// beacon role advertises.
	var idCounter = 0;
	beaconRegions = [];
	BEACON_REGION_UUIDS.forEach(function(uuid) {
		beaconRegions.push(BluetoothLE.createBeaconRegion({
			UUID : uuid,
			identifier : '#' + idCounter
		}));
		idCounter++;
	});
}

function initBeaconRegionsForBeacon() {
	// The difference between this and initBeaconRegionsForCentral is
	// that the latter initializes the beacon without a specific major/minor
	// number. This allows us to test the case where the app in the central
	// role scans for a wider range of beacons than what the app in the
	// beacon role advertises.
	var idCounter = 0;
	beaconRegions = [];
	BEACON_REGION_UUIDS.forEach(function(uuid) {
		beaconRegions.push(BluetoothLE.createBeaconRegion({
			UUID : uuid,
			identifier : '#' + idCounter,
			major : 1
		}));
		idCounter++;
	});
}

function initCentral() {
	// Central === user (as opposed to beacon).
//	initBeaconRegionsForCentral();
	initBeaconRegionsForBeacon();
	beaconRegions.forEach(function(region) {
		BluetoothLE.startRegionMonitoring({
			beaconRegion : region
		});
		BluetoothLE.requestRegionState({
			beaconRegion : region
		});
		//
		// The recommended approach is to start ranging for beacons
		// only when you are inside a region, and stop ranging for them
		// when you exit the region. Some native apps out there ignore
		// this recommendation and range continuously. If you want to
		// match that behavior, uncomment the following function call
		// and comment out the stopRangingBeacons and startRangingBeacons
		// calls in the regionStateUpdated event handler.
		//
		// BluetoothLE.startRangingBeacons({
		// beaconRegion: region
		// });
	});
	Ti.API.info('Location manager authorization status: ' + BluetoothLE.locationManagerAuthorizationStatus);
	setStatus('Started region monitoring...');
}

function shutdown() {
	BluetoothLE.stopRangingBeacons();
	BluetoothLE.stopRegionMonitoring();
	setStatus('Stopped monitoring.');

}

BluetoothLE.addEventListener('locationManagerAuthorizationChanged', function(e) {
	if (!open) {
		return;
	}
	switch (e.status) {
	case BluetoothLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_NOT_DETERMINED:
		Ti.API.info('Location manager changed authorization status to undetermined.');
		break;
	case BluetoothLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_RESTRICTED:
		Ti.API.info('Location manager changed authorization status to restricted.');
		break;
	case BluetoothLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_DENIED:
		Ti.API.info('Location manager changed authorization status to denied.');
		break;
	case BluetoothLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED:
		Ti.API.info('Location manager changed authorization status to authorized.');
		break;
	default:
		Ti.API.info('Unknown authorization status!');
	}
});

BluetoothLE.addEventListener('peripheralManagerStateChange', function(e) {
	var advertParams;

	if (!open) {
		return;
	}
	switch (e.state) {
	case BluetoothLE.PERIPHERAL_MANAGER_STATE_UNKNOWN:
		Ti.API.info('Peripheral manager changed state to unknown.');
		break;
	case BluetoothLE.PERIPHERAL_MANAGER_STATE_RESETTING:
		Ti.API.info('Peripheral manager changed state to resetting.');
		break;
	case BluetoothLE.PERIPHERAL_MANAGER_STATE_UNSUPPORTED:
		Ti.API.info('Peripheral manager changed state to unsupported.');
		setStatus('Bluetooth LE is not supported.');
		break;
	case BluetoothLE.PERIPHERAL_MANAGER_STATE_UNAUTHORIZED:
		Ti.API.info('Peripheral manager changed state to unauthorized.');
		break;
	case BluetoothLE.PERIPHERAL_MANAGER_STATE_POWERED_OFF:
		Ti.API.info('Peripheral manager changed state to powered off.');
		break;
	case BluetoothLE.PERIPHERAL_MANAGER_STATE_POWERED_ON:
		Ti.API.info('Peripheral manager changed state to powered on.');
		setStatus('Firing up beacon #' + (counter % beaconRegions.length) + '...');
		BluetoothLE.startAdvertising({
			beaconRegion : beaconRegions[counter % beaconRegions.length]
		});
		counter++;
		break;
	}
});

BluetoothLE.addEventListener('proximityChange', function(e) {
	var i;

	if (!open) {
		return;
	}
	Ti.API.info('Number of beacons that changed proximity: ' + e.beacons.length);
	i = 0;
	e.beacons.forEach(function(beacon) {
		i++;
		Ti.API.info('Beacon #' + i);
		Lib.printBeaconInfo(beacon);
	});
});

BluetoothLE.addEventListener('rangedBeacons', function(e) {
	var i;

	if (!open) {
		return;
	}
	Ti.API.info('Beacons in range: ' + e.beacons.length);

	Ti.API.info('Region.UUID: ' + e.region.UUID);
	Ti.API.info('Region.major: ' + e.region.major);
	Ti.API.info('Region.minor: ' + e.region.minor);

	i = 0;
	e.beacons.forEach(function(beacon) {
		i++;
		Ti.API.info('Beacon #' + i);
		Lib.printBeaconInfo(beacon);
	});
});

BluetoothLE.addEventListener('regionStateUpdated', function(e) {
	var stateStr,
	    statusMsg,
	    intent;

	if (!open) {
		return;
	}

	// Ti.API.info('regionStateUpdated event received for region ' + e.region.UUID + '/' + e.region.identifier + ': ' + e.state);

	switch(e.state) {
	case BluetoothLE.REGION_STATE_UNKNOWN:
		stateStr = 'unknown';
		break;
	case BluetoothLE.REGION_STATE_INSIDE:
		BluetoothLE.startRangingBeacons({
			beaconRegion : e.region
		});
		stateStr = 'inside.';
		break;
	case BluetoothLE.REGION_STATE_OUTSIDE:
		BluetoothLE.stopRangingBeacons({
			beaconRegion : e.region
		});
		stateStr = 'outside.';
		break;
	}
	statusMsg = 'Region state for ' + e.region.UUID.slice(0, 8) + ' is now ' + stateStr;
	setStatus(statusMsg);

	if (Lib.isInForeground() || e.state === BluetoothLE.REGION_STATE_UNKNOWN) {
		// The remainder of this callback posts a local notification;
		// we don't want that if the app is in the foreground or if
		// all we've got to say is "state is unknown".
		return;
	}

	if (Lib.isIOS()) {
		Ti.App.iOS.scheduleLocalNotification({
			alertBody : statusMsg,
			date : new Date(new Date().getTime() + 100)
		});
	}
	if (Lib.isAndroid()) {
		intent = Ti.Android.createIntent({
			flags : Ti.Android.FLAG_ACTIVITY_BROUGHT_TO_FRONT,
			// Substitute the correct classname for your application
			className : 'com.logicallabs.bletest.BluetoothletestActivity'
		});

		// Note: Unlike iOS, Android will post the local notification
		// even if the app is in the foreground.
		Titanium.Android.NotificationManager.notify(androidNotificationId++, Ti.Android.createNotification({
			contentTitle : 'iBeacons Test',
			contentText : statusMsg,
			contentIntent : Ti.Android.createPendingIntent({
				intent : intent,
				flags : Ti.Android.FLAG_UPDATE_CURRENT
			})
		}));
	}
});

BluetoothLE.addEventListener('enteredRegion', function(e) {
	if (!open) {
		return;
	}
	// In theory, we could use this event instead of regionStateUpdated
	// to turn on ranging; however, our testing indicated that this event
	// is less reliable, so we recommend using regionStateUpdated instead.
	Ti.API.info('Received enteredRegion event for region ' + e.region.UUID);
});

BluetoothLE.addEventListener('exitedRegion', function(e) {
	if (!open) {
		return;
	}
	// In theory, we could use this event instead of regionStateUpdated
	// to turn off ranging; however, our testing indicated that this event
	// is less reliable, so we recommend using regionStateUpdated instead.
	Ti.API.info('Received exitedRegion event for region ' + e.region.UUID);
});

BluetoothLE.addEventListener('retrievedMonitoredRegions', function(e) {
	var areAllRegionsMonitored;

	beaconRegions = e.beaconRegions;

	areAllRegionsMonitored = true;

	BEACON_REGION_UUIDS.forEach(function(regionUUID) {
		var isRegionMonitored;

		isRegionMonitored = false;
		beaconRegions.forEach(function(region) {
			if (Lib.uuidMatch(regionUUID, region.UUID)) {
				Lib.log('Region ' + regionUUID + ' is monitored!');
				isRegionMonitored = true;
			}
		});

		areAllRegionsMonitored = areAllRegionsMonitored && isRegionMonitored;
	});

	if (areAllRegionsMonitored) {
		Lib.log('All regions restored!');
	} else {
		Lib.log('Some regions were not restored!');
		// For the sake of consistency, if we don't have all the regions
		// we'll just reset everything.
		shutdown();
		initCentral();
	}
});

function setStatus(text) {
	$.find.trigger('updateStatus', {status: text});
	Ti.API.info(text);
}

// $.addEventListener('restored', function() {
	// Ti.API.info('Restoring iBeacon example...');
	// open = true;
	// setupAsUser();
	// BluetoothLE.retrieveMonitoredRegions();
// });
// 
// $.addEventListener('pause', function() {
	// Ti.API.info('Closing iBeacon example...');
	// shutdown();
	// open = false;
// });

BluetoothLE.addEventListener('locationManagerAuthorizationChanged', function(e) {
	Ti.API.info('locationManagerAuthorizationChanged: status = ' + JSON.stringify(e));
	if (e.status == BluetoothLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED && open == false) {
		initCentral();
	} else {
		BluetoothLE.requestAlwaysAuthorization();
	}
});

function onOpen() {
	open = true;
	if (BluetoothLE.locationManagerAuthorizationStatus == BluetoothLE.LOCATION_MANAGER_AUTHORIZATION_STATUS_AUTHORIZED) {
		Ti.API.info('Initializing central');
		initCentral();
	}
}

if (Ti.Platform.name == "iPhone OS" && parseInt(Ti.Platform.version.split(".")[0]) >= 8) {
	Ti.App.iOS.registerUserNotificationSettings({
		types : [Ti.App.iOS.USER_NOTIFICATION_TYPE_ALERT, Ti.App.iOS.USER_NOTIFICATION_TYPE_SOUND, Ti.App.iOS.USER_NOTIFICATION_TYPE_BADGE]
	});
}

// Fired when the application receives an incoming local notification when it's in the foreground
Ti.App.iOS.addEventListener('notification', function(e) {

	// Process custom data
	// if (e.userInfo && "url" in e.userInfo) {
		// httpGetRequest(e.userInfo.url);
	// }

	// Reset the badge value
	if (e.badge > 0) {
		Ti.App.iOS.scheduleLocalNotification({
			date : new Date(new Date().getTime()),
			badge : -1
		});
	}
});


$.index.open();
