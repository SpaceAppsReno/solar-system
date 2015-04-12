'use strict';

angular.module('details.controller', [])

    .controller('DetailCtrl', ['$ionicLoading', '$stateParams', 'PlanetService', '$scope', '$rootScope', function($ionicLoading, $stateParams, PlanetService, $scope, $rootScope) {
        var vm = this;

        vm.planetName = $stateParams.planet;

        var colors = PlanetService.planets.colors;

        var sunLatLng = new google.maps.LatLng(PlanetService.planets.sun.location.lat, PlanetService.planets.sun.location.lng);

        vm.planetRepresentation = colors[vm.planetName];

        PlanetService.planets.fetchPlanets();
        $scope.$on('planetsLoaded', function(event, planets) {
            vm.planet = _.find(planets, function(planet) { return planet.slug == vm.planetName; });

            var distance = Math.sqrt( Math.pow(vm.planet.orbital.center[1], 2) + Math.pow(vm.planet.orbital.center[0], 2) );
            var bearing = Math.atan(vm.planet.orbital.center[0] * -1 / vm.planet.orbital.center[1]) / (Math.PI / 180);
            var modifiedSunLatLng = google.maps.geometry.spherical.computeOffset(sunLatLng, distance, bearing);

            vm.planet.modifiedSunLatLng = modifiedSunLatLng;
        });

        $scope.$on('positionsLoaded', function(event, positions) {
            vm.position = _.find(positions, function(position) { return position.slug == vm.planetName; });

            var planetBearing = 90 - (vm.position.polar.angle * 180 / Math.PI);
            var planetLatLng = google.maps.geometry.spherical.computeOffset(vm.planet.modifiedSunLatLng, vm.position.polar.radius, planetBearing);

            vm.position.planetLatLng = planetLatLng;
        });
    }])
;