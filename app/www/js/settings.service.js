'use strict';
angular.module('SettingsService', [])

    .factory('SettingsService', ['$log', 'jp_WebStorage', function($log, jp_WebStorage) {

        var Settings = function() {
            console.log("jp_WebStorage", jp_WebStorage.local);
            jp_WebStorage.session.set('sessionKey', 'sessionVal');
            console.info('jp_WebStorage.session', jp_WebStorage.session.webStorage);
            console.info('jp_WebStorage.session.get', jp_WebStorage.session.get('sessionKey'));
            jp_WebStorage.session.remove('sessionKey');
            console.info('jp_WebStorage.session', jp_WebStorage.session.webStorage);

            jp_WebStorage.local.set('localKey', 'localVal');
            console.info('jp_WebStorage.local', jp_WebStorage.local.webStorage);
            console.info('jp_WebStorage.local.get', jp_WebStorage.local.get('localKey'));
            jp_WebStorage.local.remove('localKey');
            console.info('jp_WebStorage.local', jp_WebStorage.local.webStorage);


            this.sun = jp_WebStorage.local.get('sun');
            console.log(this.sun);

            if (this.sun === null) {
                this.sun = {
                    lat: 39.545866,
                    lng: -119.819391,
                    radius: {
                        scale: 9.8
                    }
                };
            }
            console.log(this.sun);

            return this;
        };

        Settings.prototype.saveSettings = function(sun) {
            this.sun = sun;
            jp_WebStorage.local.set('sun', sun);
        };

        var settings = new Settings();
        return {
            settings: settings
        };
    }])
;