'use strict';
angular.module('PlanetService', [])

.factory('PlanetService', ['$http', '$log', '$q', function($http, $log, $q) {
    var Planets = function() {
        this.data = null;
        return this.fetchPlanets();
    };


    Planets.prototype.fetchPlanets = function() {
        var self = this;
        var deferred = $q.defer();

        if (!self.data) {
            $http.get('http://blss-api.herokuapp.com/list')
                .success(function(data) {
                    console.log("data", data);
                    self.data = data;
                    deferred.resolve(data);
                })
                .error(function(data, status, headers, config) {
                    $log.error("Unable to get planets: " + data);
                    deferred.reject(data, status, headers, config);
                });
        }

        return deferred.promise;
    };
    Planets.prototype.getPlanets = function() {
        return this.planets;
    };

    var planets = new Planets();

    return {
        planets: planets
    };

}])
;
