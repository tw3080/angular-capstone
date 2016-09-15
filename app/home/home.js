viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home/home.html',
        controller: 'CurrentWeatherCtrl'
    });
}]);

viewsModule.controller('CurrentWeatherCtrl', function($scope, $rootScope, weatherAppService, getWeatherConditions) {
    /* TODO */
    // weatherAppService.forecast = 'current';
    // console.log(weatherAppService.forecast);
    /*      */
    // Set scope variables for binding to template
    $rootScope.weatherClass = 'rainy';
    $scope.address = weatherAppService.address;
    $scope.location = weatherAppService.location;
    $scope.currentWeather = weatherAppService.currentWeather;

    $scope.submit = function(address) {
        // weatherAppService.forecast = 'current';

        weatherAppService.submit(address, function(location) {
            $scope.address = location;
            $scope.location = weatherAppService.location;
            // console.log($scope.location);
            $scope.currentWeather = weatherAppService.currentWeather;
        });
    };
});
