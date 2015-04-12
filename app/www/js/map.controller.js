'use strict';

angular.module('map.controller', [])

    .controller('MapCtrl', ['$ionicLoading', 'PlanetService', '$scope', function($ionicLoading, PlanetService, $scope) {
        var vm = this;

        vm.map = null;

        vm.mapCreated = mapCreated;

        vm.centerOnMe = centerOnMe;

        $scope.$on('CenterOnMe', function() {
            vm.centerOnMe();
        });


        function mapCreated(map) {
            vm.map = map;

            var sunLatLng = new google.maps.LatLng(PlanetService.planets.sun.location.lat, PlanetService.planets.sun.location.lng);
            var sunIcon = {
                url: 'img/planets/sun.png',
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

            var colors = PlanetService.planets.colors;

            map.setCenter(new google.maps.LatLng(sunLatLng.lat(), sunLatLng.lng()));
            map.setZoom(13);

            PlanetService.planets.fetchPlanets();

            $scope.$on('planetsLoaded', function(event, planets) {
                vm.planets = planets;

                for (var ii in planets) {
                    var distance = Math.sqrt( Math.pow(planets[ii].orbital.center[1], 2) + Math.pow(planets[ii].orbital.center[0], 2) );
                    var bearing = Math.atan(planets[ii].orbital.center[0] * -1 / planets[ii].orbital.center[1]) / (Math.PI / 180);
                    var modifiedSunLatLng = google.maps.geometry.spherical.computeOffset(sunLatLng, distance, bearing);
                    planets[ii].modifiedSunLatLng = modifiedSunLatLng;

                    var planetRepresentation = colors[planets[ii].slug];
                    if (typeof planetRepresentation === 'undefined') {
                        planetRepresentation = colors["default"];
                    }

                    var OrbitEllipse = new google.maps.Polygon.Ellipse(
                        modifiedSunLatLng,
                        planets[ii].orbital.semimajor,
                        planets[ii].orbital.semiminor,
                        planets[ii].orbital.rotation,
                        planetRepresentation.color,
                        2,
                        1,
                        planetRepresentation.color,
                        0
                    );
                    OrbitEllipse.setMap(map);

                }

            });

            $scope.$on('positionsLoaded', function(event, positions) {
                vm.positions = positions;

                for (var ii in positions) {
                    var planetPosition = positions[ii];
                    var planetData = _.find(vm.planets, function(planet) { return planet.slug == positions[ii].slug});

                    var planetRepresentation = colors[positions[ii].slug];
                    if (typeof planetRepresentation === 'undefined') {
                        planetRepresentation = colors['default'];
                    }

                    var planetBearing = 90 - (planetPosition.polar.angle * 180 / Math.PI);
                    var planetLatLng = google.maps.geometry.spherical.computeOffset(planetData.modifiedSunLatLng, planetPosition.polar.radius, planetBearing);

                    var planetIcon = {
                        url: 'img/planets/' + planetRepresentation.icon,
                        size: new google.maps.Size(256, 256),
                        origin: new google.maps.Point(0, 0),
                        anchor: new google.maps.Point(10, 10),
                        scaledSize: new google.maps.Size(20, 20)
                    };

                    var planetMarker = new google.maps.Marker({
                        position: planetLatLng,
                        map: map,
                        title: positions[ii].name,
                        icon: planetIcon,
                        url: '#/app/planet/' + positions[ii].slug
                    });

                    google.maps.event.addListener(planetMarker, 'click', function () {
                        window.location.href = this.url;
                    });
                }
            });
        }

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
        }

    }])
;