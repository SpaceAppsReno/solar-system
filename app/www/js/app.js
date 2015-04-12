// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'app.controller' is found in app.controller.js
angular.module('starter', [
    'ionic',
    'app.controller',
    'map.directive',
    'map.controller',
    'details.controller',
    'settings.controller',
    'CustomFilter',
    'PlanetService',
    'SettingsService',
    'jp.WebStorage'
])

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "templates/menu.html",
        controller: 'AppCtrl as App'
    })

    .state('app.map', {
        url: "/map",
        views: {
            'menuContent': {
                templateUrl: "templates/map.html",
                controller: 'MapCtrl as Map'
            }
        }
    })
    .state('app.settings', {
        url: "/settings",
        views: {
            'menuContent': {
                templateUrl: "templates/settings.html",
                controller: "SettingsCtrl as Settings"
            }
        }
    })
    .state('app.details', {
        url: '/planet/:planet',
        views: {
            'menuContent': {
                templateUrl: 'templates/details.html',
                controller: 'DetailCtrl as Detail'
            }
        }
    });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/map');
})

.controller('AppCtrl', ['$scope', function($scope) {
        var vm = this;

        vm.centerOnMe = function() {
            $scope.$broadcast('CenterOnMe');
        }
    }
])
;
