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
            vm.planets = null;
            vm.positions = null;

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
                icon: sunIcon,
                zIndex: 100
            });

            var colors = PlanetService.planets.colors;

            map.setCenter(new google.maps.LatLng(sunLatLng.lat(), sunLatLng.lng()));
            map.setZoom(13);

            PlanetService.planets.fetchPlanets();

            $scope.$on('planetsLoaded', function(event, planets) {
                // this keeps the planets from being re-drawn when we come back from the details page
                // but a better way would probably be to clear the map and re-draw the markers
                if (vm.planets) {
                    return;
                }

                vm.planets = planets;
console.log("planets", planets);
                for (var ii in planets) {
                    var distance = Math.sqrt( Math.pow(planets[ii].orbital.center[1], 2) + Math.pow(planets[ii].orbital.center[0], 2) );
                    var bearing = Math.atan(planets[ii].orbital.center[1] * -1 / planets[ii].orbital.center[0]) / (Math.PI / 180);
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
                // this keeps the planets from being re-drawn when we come back from the details page
                // but a better way would probably be to clear the map and re-draw the markers
                if (vm.positions) {
                    return;
                }

                vm.positions = positions;
console.log("positions", positions);
                for (var ii in positions) {
                    var planetPosition = positions[ii];
                    var planetData = _.find(vm.planets, function(planet) { return planet.slug === planetPosition.slug; });

                    var planetRepresentation = colors[positions[ii].slug];
                    if (typeof planetRepresentation === 'undefined') {
                        planetRepresentation = colors['default'];
                    }

                    var planetBearing = 90 - (planetPosition.polar.azimuth * 180 / Math.PI);
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
                        title: planetPosition.name,
                        icon: planetIcon,
                        url: '#/app/planet/' + planetPosition.slug,
                        zIndex: 10
                    });

                    google.maps.event.addListener(planetMarker, 'click', function () {
                        window.location.href = this.url;
                    });

                    // now draw the moons & their orbits
                    if (typeof planetPosition.moons !== 'undefined') {
                        for (var jj in planetPosition.moons) {
                            var moonPosition = planetPosition.moons[jj];
                            var moonRepresentation = colors['satellite'];

                            var moonData = _.find(planetData.moons, function(moon) {return moon.slug === moonPosition.slug; });

                            var moonBearing = 90 - (moonPosition.polar.azimuth * 180 / Math.PI);
                            var moonLatLng = google.maps.geometry.spherical.computeOffset(planetLatLng, moonPosition.polar.radius, moonBearing);

                            var moonIcon = {
                                url: 'img/planets/' + moonRepresentation.icon,
                                size: null,
                                origin: new google.maps.Point(0, 0),
                                anchor: new google.maps.Point(5, 5),
                                scaledSize: new google.maps.Size(10, 10)
                            };

                            var moonMarker = new google.maps.Marker({
                                position: moonLatLng,
                                map: map,
                                title: moonPosition.name,
                                icon: moonIcon,
                                url: '#/app/planet/' + planetPosition.slug,
                                zIndex: 1
                            });

                            google.maps.event.addListener(moonMarker, 'click', function () {
                                window.location.href = this.url;
                            });

                            var moonEllipse = new google.maps.Polygon.Ellipse(
                                planetLatLng,
                                moonData.orbital.semimajor,
                                moonData.orbital.semiminor || moonData.orbital.semimajor,  // many of the moons do not have a semi-minor axis
                                moonData.orbital.rotation,
                                moonRepresentation.color,
                                2,
                                1,
                                moonRepresentation.color,
                                0
                            );
                            moonEllipse.setMap(map);
                        }
                    }
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