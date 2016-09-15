viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/3-day', {
        templateUrl: '3-day-forecast/3-day.html',
        controller: 'ThreeDayCtrl'
    });
}]);

viewsModule.controller('ThreeDayCtrl', function($scope, $rootScope, weatherAppService, getWeatherConditions) {
    /* TODO */
    /*
    weatherAppService.forecast = 'threeDay';
    console.log(weatherAppService.forecast);
    */
    /*      */
    $rootScope.weatherClass = 'sunny';
    // Set scope variables for binding to template
    $scope.address = weatherAppService.address;
    $scope.location = weatherAppService.location;
    $scope.threeDay = weatherAppService.threeDay.data;
    console.log($scope.threeDay);

    $scope.submit = function(address) {
        // weatherAppService.forecast = 'threeDay';

        weatherAppService.submit(address, function(location) {
            // Set scope variables to new values on submit
            $scope.address = location;
            $scope.location = weatherAppService.location;
            // console.log($scope.location);
            $scope.threeDay = weatherAppService.threeDay.data;
            console.log($scope.threeDay);
        });
    };
});
