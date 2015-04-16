angular.module('CustomFilter', [])
    .filter('capitalize', function() {
        return function(input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
        }
    })
    .filter('toFixed', function() {
        return function(num, digits) {
            var precision = digits || 0;
            return (typeof num === 'undefined') ? false : num.toFixed(precision);
        };
    });