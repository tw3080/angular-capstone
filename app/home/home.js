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
            // TODO: Is it OK to nest promises like this?
            return getWeatherConditions($scope.lat, $scope.lng);
        }).then(function(response) {
            console.log(response);
            // TODO: Might be a better way to do this?
            $rootScope.locationName = response.display_location.city;
            $rootScope.locationName += ', ';
            $rootScope.locationName += response.display_location.state;
        });
    };
});
