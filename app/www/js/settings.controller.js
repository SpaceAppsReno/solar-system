'use strict';

angular.module('settings.controller', [])

    .controller('SettingsCtrl', ['$ionicLoading', 'SettingsService', '$location', function($ionicLoading, SettingsService, $location) {
        var vm = this;

        vm.saveSettings = saveSettings;
        vm.cancel = cancel;

        console.log("SettingsService", SettingsService.settings);

        vm.settings = SettingsService.settings;

        function saveSettings() {
            console.log(SettingsService);
            SettingsService.settings.saveSettings(vm.settings.sun);
            $location.path('/app/map');
        }

        function cancel() {
            vm.settings = SettingsService.settings;
            $location.path('/app/map');
        }

    }])