viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/10-day', {
        templateUrl: '10-day-forecast/10-day.html',
        controller: 'TenDayCtrl'
    });
}]);

viewsModule.controller('TenDayCtrl', function($scope, $rootScope, weatherAppService, getWeatherConditions) {
    /* TODO */
    /*
    weatherAppService.forecast = 'tenDay';
    console.log(weatherAppService.forecast);
    */
    /*      */
    $rootScope.weatherClass = 'sunny';
    // Set scope variables for binding to template
    $scope.address = weatherAppService.address;
    $scope.location = weatherAppService.location;
    $scope.tenDay = weatherAppService.tenDay.data;
    console.log($scope.tenDay);

    $scope.submit = function(address) {
        // weatherAppService.forecast = 'tenDay';

        weatherAppService.submit(address, function(location) {
            $scope.address = location;
            $scope.location = weatherAppService.location;
            // console.log($scope.location);
            $scope.tenDay = weatherAppService.tenDay.data;
            console.log($scope.tenDay);
        });
    };
});
