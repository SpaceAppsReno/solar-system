'use strict';

var WebStorageMOD = angular.module('jp.WebStorage', []);

WebStorageMOD.factory('jp_WebStorage', [function() {
    var local = new WebStorage('localStorage');
    var session = new WebStorage('sessionStorage');

    // available methods: set(key, val), get(key),  getAll(keyPrefix), remove(key), clear()
    // ex: jp_WebStorage.local.set('key', 'val')
    // ex: jp_WebStorage.session.get('key')
    return {
        local: local,
        session: session
    };
}]);