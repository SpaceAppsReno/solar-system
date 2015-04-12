'use strict';

angular.module('details.controller', [])

    .controller('DetailCtrl', ['$ionicLoading', '$stateParams', 'PlanetService', function($ionicLoading, $stateParams, PlanetService) {
        console.log($stateParams)
        var vm = this;

        vm.planetName = $stateParams.planet;

        PlanetService.planets.then(function(planets) {
            vm.planet = _.find(planets, function(planet) { console.log("find", planet); return planet.slug == vm.planetName});

        });
    }])
;