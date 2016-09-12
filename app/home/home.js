viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home/home.html',
        controller: 'CurrentWeatherCtrl'
    });
}]);

viewsModule.controller('CurrentWeatherCtrl', function($scope, $rootScope, weatherAppService) {
    $rootScope.weatherClass = 'rainy';
    $scope.address = weatherAppService.address;
    $scope.location = weatherAppService.location;
    $scope.currentWeather = weatherAppService.currentWeather;

    $scope.submit = function(address) {
        weatherAppService.submit(address, function(location) {
            $scope.address = location;
            $scope.location = weatherAppService.location;
            // console.log($scope.location);
            $scope.currentWeather = weatherAppService.currentWeather;
        });
    };
    /*
    // TODO: Is this the best way to do this? Using $scope doesn't work...
    $rootScope.address = null;
    */

    // $rootScope.submit = function(address) {
    /*
    $scope.submit = function(address) {
        $scope.address = address;
        console.log($scope.address);
        geocodeLocation($scope.address).then(function(response) {
            $scope.lat = response.lat;
            $scope.lng = response.lng;
            return getWeatherConditions($scope.lat, $scope.lng);
        }).then(function(response) {
            console.log(response);
            // TODO: only rootScope stays when routes change?
            $rootScope.locationName = response.display_location.city;
            $rootScope.locationName += ', ';
            $rootScope.locationName += response.display_location.state;
        });
    };
    */
});
