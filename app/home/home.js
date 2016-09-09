viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home/home.html',
        controller: 'CurrentWeatherCtrl'
    });
}]);

viewsModule.controller('CurrentWeatherCtrl', function($scope, $rootScope, geocodeLocation, getWeatherConditions) {
    // TODO: Is this the best way to do this? Using $scope doesn't work...
    $rootScope.address = null;

    $rootScope.submit = function() {
        // TODO: Why are $scope and $rootScope interchangable here? (console log below)
        // console.log($scope.address);
        geocodeLocation($scope.address).then(function(response) {
            $scope.lat = response.lat;
            $scope.lng = response.lng;
            getWeatherConditions($scope.lat, $scope.lng);
        });
    };
});
