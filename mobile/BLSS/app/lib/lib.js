/*jslint white:true plusplus:true nomen:true vars:true sloppy:true undef:false bitwise:true*/

var BluetoothLE = require('com.logicallabs.bluetoothle');
var centralErrorCallback, centralOffCallback,
centralOnCallback;
var centralStateChangeCallbackAdded;

function isAndroid() {
	return Ti.Platform.osname === 'android';
}
exports.isAndroid = isAndroid;

function isIOS() {
	return Ti.Platform.osname === 'iphone' || Ti.Platform.osname === 'ipad';
}
exports.isIOS = isIOS;

function log(text) {
	Ti.API.info(text);
}
exports.log = log;	

function addProperties(view, params) {
	var prop;
	
	for (prop in params) {
		if (params.hasOwnProperty(prop)) {
			view[prop] = params[prop];
		}
	}
}
exports.addProperties = addProperties;

function scale(dimension) {
	return Math.round(dimension * Ti.Platform.displayCaps.platformWidth / 320);
}
exports.scale = scale;

exports.createStatusLabel = function(params) {
	var result;
	
	result = Ti.UI.createLabel({
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP,
		height: scale(30), left: scale(10),
		right: scale(10), top: scale(10),
		color: 'white',
		font: {
			fontSize: scale(12)
		}
	});
	
	addProperties(result, params);

	return result;
};

exports.createDescriptionLabel = function(params) {
	var result;
	
	result = Ti.UI.createLabel({
		top: scale(10),
		left: scale(10), right: scale(10),
		font: {
			fontSize: scale(10)
		},
		color: 'white',
		textAlign: Ti.UI.TEXT_ALIGNMENT_CENTER,
		verticalAlign: Ti.UI.TEXT_VERTICAL_ALIGNMENT_TOP
	});

	addProperties(result, params);

	return result;
};

exports.createDefaultButton = function(params) {
	var result, prop;
	
	result = Ti.UI.createButton({
		width: scale(200), height: scale(40), top: scale(10),
		color: 'white',
		backgroundImage: '/images/button.png',
		backgroundLeftCap: 7,
		backgroundSelectedColor: '#8C92AC',
		font: {
			fontSize: scale(12)
		}
	});

	addProperties(result, params);
		
	return result;
};


function iosCentralStateChangeCallback(e) {
	switch (e.state) {
		case BluetoothLE.CENTRAL_MANAGER_STATE_UNKNOWN:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE state is resetting.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_RESETTING:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE is resetting.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_UNSUPPORTED:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE is not supported.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_UNAUTHORIZED:
			if (centralErrorCallback) {
				centralErrorCallback('Bluetooth LE is not authorized.');				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_POWERED_OFF:
			if (centralOffCallback) {
				centralOffCallback();				
			}
			break;
		case BluetoothLE.CENTRAL_MANAGER_STATE_POWERED_ON:
			if (centralOnCallback) {
				centralOnCallback();				
			}
			break;			
	}
}

function androidCentralStateChangeCallback(e) {
	switch (e.state) {
		case BluetoothLE.STATE_TURNING_OFF:
			log('Bluetooth is turning off.');
			if (centralOffCallback) {
				centralOffCallback();
			}
			break;
		case BluetoothLE.STATE_OFF:
			break;
		case BluetoothLE.STATE_TURNING_ON:
			break;
		case BluetoothLE.STATE_ON:
			if (centralOnCallback) {
				centralOnCallback();				
			}
			break;
	}
}

exports.initBluetoothCentral = function(params) {
	centralErrorCallback = params.errorCallback;
	centralOffCallback = params.offCallback;
	centralOnCallback = params.onCallback;

	if (!centralStateChangeCallbackAdded) {
		centralStateChangeCallbackAdded = true;
		if (isAndroid()) {
			BluetoothLE.addEventListener(
				'stateChanged', androidCentralStateChangeCallback);
		} else {
			BluetoothLE.addEventListener(
				'centralManagerStateChange', iosCentralStateChangeCallback);
		}
	}
	
	if (isAndroid()) {
		if (BluetoothLE.isSupported()) {
			log('Bluetooth is supported!');
			
			if (BluetoothLE.isEnabled()) {
				log('Bluetooth is already enabled!');
				params.onCallback();
			} else {
				log('Bluetooth is disbled; enabling now.');
	
				// This will eventually fire a stateChanged event with state set to
				// STATE_ON, at which point we start the scanning.
				BluetoothLE.enable();
			}
		} else {
			params.errorCallback('Bluetooth LE is not supported.');				
		}
	} else {
		BluetoothLE.initCentralManager({
			restoreIdentifier: params.restoreIdentifier,
			// If you set this to false, the user won't be notified if Bluetooth
			// is off -- and you will receive CENTRAL_MANAGER_STATE_POWERED_OFF
			// status event instead of CENTRAL_MANAGER_STATE_POWERED_ON. 
			showPowerAlert: true
		});
	}
};

exports.shutdownBluetoothCentral = function(params) {
	BluetoothLE.stopScan();
	if (isAndroid()) {
		BluetoothLE.disable();
	} else {
		BluetoothLE.releaseCentralManager();
	}
};

var BASE_UUID = '00000000-0000-1000-8000-00805F9B34FB';
exports.BASE_UUID = BASE_UUID;

function expandUUID(uuid) {
	var result;
	if (uuid.length === 4) {
		result = BASE_UUID.substring(0, 4) + uuid +
				BASE_UUID.substring(8, BASE_UUID.length);
	} else {
		result = uuid;
	}
	
	return result;
}

exports.expandUUID = expandUUID;

function uuidMatch(uuid1, uuid2) {
	return expandUUID(uuid1).toLowerCase() === expandUUID(uuid2).toLowerCase(); 
}
	
exports.uuidMatch = uuidMatch;

function getProximityString(beacon) {
	var result;
	
	switch(beacon.proximity) {
		case BluetoothLE.BEACON_PROXIMITY_UNKNOWN:
			result = 'unkown';
			break;
		case BluetoothLE.BEACON_PROXIMITY_IMMEDIATE:
			result = 'immediate';
			break;
		case BluetoothLE.BEACON_PROXIMITY_NEAR:
			result = 'near';
			break;
		case BluetoothLE.BEACON_PROXIMITY_FAR:
			result = 'far';
			break;
	}
	return result;
}

exports.getProximityString = getProximityString;

function printBeaconInfo(beacon) {
	Ti.API.info('    UUID: ' + beacon.UUID);
	Ti.API.info('    major: ' + beacon.major);
	Ti.API.info('    minor: ' + beacon.minor);
	Ti.API.info('    RSSI: ' + beacon.RSSI);
	Ti.API.info('    proximity: ' + getProximityString(beacon));
}

exports.printBeaconInfo = printBeaconInfo;

function createBeaconRow(beacon) {
	var result, topLabel, bottomLabel;
	
	function createLabel() {
		return Ti.UI.createLabel({
			left: scale(15),
			height: scale(20), width: '100%',
			color: 'white',
			font: {
				fontSize: scale(12)
			}
		});
	}	
	
	result = Ti.UI.createTableViewRow({
		height: scale(50), width: '100%'
	});
	
	topLabel = createLabel();
	topLabel.top = 0;
	topLabel.text = 'UUID/Major/minor: ' + beacon.UUID.slice(-4) + '/' +
			beacon.major + '/' + beacon.minor;
	
	bottomLabel = createLabel();
	bottomLabel.top = scale(20);
	bottomLabel.text = 'Proximity/RSSI/Accuracy: ' +
				getProximityString(beacon) + '/' +
				beacon.RSSI + '/' +
				beacon.accuracy.toFixed(2);
	
	result.add(topLabel);
	result.add(bottomLabel);
	
	return result;
}

exports.createBeaconRow = createBeaconRow;

function zeroPad(num, size) {
	var result;
	
	if (num === undefined) {
		return undefined;
	}
	
	if (num === null) {
		return null;
	}
	
	result = num.toString();
	if (size === undefined) {
		size = 2;
    }
    while (result.length < size) {
		result = '0' + result;
    }
    return result;
}

exports.zeroPad = zeroPad;

exports.dumpBuffer = function(buffer) {
	// buffer is expected to be a TiBuffer object
	var hexdump, i;

	hexdump = '';
	for (i=0; i<buffer.length; i++) {
		hexdump += '0x' + zeroPad(buffer[i].toString(16)) + ' ';
	}
	if (hexdump === '') {
		hexdump = '<empty>';
	}
	log('Buffer size: ' + buffer.length);
	log('Buffer as string: ' + buffer);
	log('Buffer as hex dump: ' + hexdump);
};

(function() {
	var resumeCount = 0;
	function onResume() {
		resumeCount++;
	}
	exports.onResume = onResume;
	
	function onPause() {
		resumeCount--;
	}
	exports.onPause = onPause; 
	
	exports.isInBackground = function() {
		return resumeCount < 1;
	};
	exports.isInForeground = function() {
		return resumeCount > 0;
	};
	
	Ti.App.addEventListener('resume', onResume);
	Ti.App.addEventListener('pause', onPause);
	
}());
