'use strict';
angular.module('SettingsService', [])

    .factory('SettingsService', ['$log', 'jp_WebStorage', function($log, jp_WebStorage) {

        var Settings = function() {

            this.sun = jp_WebStorage.local.get('sun');
            console.log(this.sun);

            if (this.sun === null) {
                this.sun = {
                    name: 'Fleischmann Planetarium',
                    lat: 39.545866,
                    lng: -119.819391,
                    radius: {
                        scale: 9.8
                    }
                };
            }

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