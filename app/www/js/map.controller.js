'use strict';

angular.module('map.controller', [])

    .controller('MapCtrl', ['$ionicLoading', '$http', 'PlanetService', function($ionicLoading, $http, PlanetService) {
        var vm = this;

        vm.map = null;

        vm.mapCreated = mapCreated;

        vm.centerOnMe = centerOnMe;


        function mapCreated(map) {
            vm.map = map;

            var sunLatLng = new google.maps.LatLng(39.545866, -119.819391);
            var sunIcon = {
                url: 'img/sun.png',
                size: new google.maps.Size(20, 20),
                origin: new google.maps.Point(0,0),
                anchor: new google.maps.Point(10, 10)
            };
            var sunMarker = new google.maps.Marker({
                position: sunLatLng,
                map: map,
                title: 'Sun',
                icon: sunIcon
            });
            var colors = {
                "mercury": "gray",
                "venus": "green",
                "earth": "blue",
                "mars": "red",
                "jupiter": "orange",
                "saturn": "yellow",
                "uranus": "blue",
                "neptune": "purple",
                "pluto": "black"
            };

            map.setCenter(new google.maps.LatLng(sunLatLng.lat(), sunLatLng.lng()));
            map.setZoom(13);

            PlanetService.planets.then(function(planets) {
                vm.planets = planets;

                console.log(planets);
                for (var ii in planets) {
                    var distance = Math.sqrt( Math.pow(planets[ii].orbital.center[1], 2) + Math.pow(planets[ii].orbital.center[0], 2) );
                    var bearing = Math.atan(planets[ii].orbital.center[1] * -1 / planets[ii].orbital.center[0]) / (Math.PI / 180);
                    var modifiedSunLatLng = google.maps.geometry.spherical.computeOffset(sunLatLng, distance, bearing);

                    var OrbitEllipse = new google.maps.Polygon.Ellipse(
                        modifiedSunLatLng,
                        planets[ii].orbital.semimajor_axis,
                        planets[ii].orbital.semiminor_axis,
                        planets[ii].orbital.rotation,
                        colors[planets[ii].slug],
                        2,
                        1,
                        colors[planets[ii].slug],
                        0
                    );
                    OrbitEllipse.setMap(map);

                    var planetLatLng = google.maps.geometry.spherical.computeOffset(modifiedSunLatLng, planets[ii].orbital.semimajor_axis, 180);
                    var planetMarker = new google.maps.Marker({
                        position: planetLatLng,
                        map: map,
                        title: planets[ii].name,
                        icon: sunIcon,
                        url: '#/app/planet/' + planets[ii].slug
                    });

                    google.maps.event.addListener(planetMarker, 'click', function() {
                        window.location.href = this.url;
                    });
                }

            });

            vm.centerOnMe();
        };

        function centerOnMe() {
            console.log("Centering");
            if (!vm.map) {
                return;
            }

            vm.loading = $ionicLoading.show({
                content: 'Getting current location...',
                showBackdrop: false
            });

            navigator.geolocation.getCurrentPosition(function (pos) {
                console.log('Got pos', pos);
                vm.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));

                $ionicLoading.hide()
            }, function (error) {
                alert('Unable to get location: ' + error.message);
            });
        };

    }])
    /*
    .controller('MapCtrl', function($scope, $ionicLoading) {
        $scope.map = null;



        $scope.$on('map', function(newVal) {
            console.log("newVal", newVal);
            $scope.centerOnMe();
        }, true);

    })
    */
;