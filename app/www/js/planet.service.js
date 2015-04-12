'use strict';
angular.module('PlanetService', [])

.factory('PlanetService', ['$http', '$log', '$rootScope', '$timeout', function($http, $log, $rootScope, $timeout) {
    var Planets = function() {
        this.data = this.fetchPlanets();
        this.currentPositions = null;
        this.colors = {
            "mercury": {
                color: "gray",
                icon: "02-mercury-icon.png"
            },
            "venus": {
                color: "green",
                icon: "03-venus-icon.png"
            },
            "earth": {
                color: "blue",
                icon: "04-earth-icon.png"
            },
            "mars": {
                color: "red",
                icon: "06-mars-icon.png"
            },
            "jupiter": {
                color: "orange",
                icon: "07-jupiter-icon.png"
            },
            "saturn": {
                color: "yellow",
                icon: "08-saturn-icon.png"
            },
            "uranus": {
                color: "blue",
                icon: "09-uranus-icon.png"
            },
            "neptune": {
                color: "purple",
                icon: "10-neptune-icon.png"
            },
            "pluto": {
                color: "black",
                icon: "11-pluto-icon.png"
            },
            "default": {
                color: "black",
                icon: "default.png"
            }
        };

        this.sun = this.sunData();

        return this;
    };


    Planets.prototype.fetchPlanets = function() {
        var self = this;
        var sun = self.sunData();

        if (!self.data) {
            $http.get('http://blss-api.herokuapp.com/characteristics?factor=' + (sun.radius.actual / sun.radius.scale))
                .success(function(data) {
                    $rootScope.$broadcast("planetsLoaded", data);
                    self.fetchCurrentPositions();
                    return data;
                })
                .error(function(data, status, headers, config) {
                    $log.error("Unable to get planets: " + data);
                    $rootScope.$broadcast("errorLoadingPlanets", data);
                });
        } else {
            $rootScope.$broadcast("planetsLoaded", self.data);
        }
    };

    Planets.prototype.fetchCurrentPositions = function() {
        var self = this;
        var sun = self.sunData();

        if (!self.currentPositions) {
            $http.get('http://blss-api.herokuapp.com/realtime?factor=' + (sun.radius.actual / sun.radius.scale))
                .success(function(data) {
                    $rootScope.$broadcast("positionsLoaded", data);
                    return data;
                })
                .error(function(data, status, headers, config) {
                    $log.error("Unable to get planets: " + data);
                    $rootScope.$broadcast("errorLoadingPositions", data);
                });
        } else {
            $rootScope.$broadcast("positionsLoaded", self.currentPositions);
        }

        $timeout(function() {
            self.fetchCurrentPositions();
        }, 3600000);
    };

    Planets.prototype.sunData = function() {
        return {
            location: {
                lat: 39.545866,
                lng: -119.819391
            },
            radius: {
                actual: 1392684000,
                scale: 9.8
            }
        };
    };

    var planets = new Planets();

    return {
        planets: planets
    };

}])
;
