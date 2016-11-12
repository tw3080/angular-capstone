viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'components/home/home.html',
        controller: 'CurrentWeatherCtrl'
    });
}]);

viewsModule.controller('CurrentWeatherCtrl', function($scope, $rootScope, weatherAppService, getWeatherConditions) {
    // Set scope variables for binding to template
    // Location
    $scope.address = weatherAppService.address;
    $scope.location = weatherAppService.location;
    // Weather forecasts
    $scope.currentWeather = weatherAppService.currentWeather;
    $scope.tenDay = weatherAppService.tenDay.data;
    // Audio/css
    $scope.audioFile = weatherAppService.weatherSounds;
    $rootScope.weatherClass = weatherAppService.weatherClass;
    $scope.weatherCallback = function(location) {
        $scope.showWeather = weatherAppService.showWeather; // Show the weather conditions
        // Location
        $scope.address = location; // Set the current location to the searched address
        $scope.location = weatherAppService.location;
        // Weather forecasts
        $scope.currentWeather = weatherAppService.currentWeather;
        $scope.tenDay = weatherAppService.tenDay.data;
        // Audio/css
        $scope.audioFile = weatherAppService.weatherSounds;
        $rootScope.weatherClass = weatherAppService.weatherClass;
        console.log('weatherClass before submit: ' + $rootScope.weatherClass);
    };

    weatherAppService.initializeGeolocation($scope.weatherCallback);

    /* Uses the submit function from weatherAppService to geocode the address input by the user and gets the current weather/10-day forecast */
    $scope.submit = function(address) {
        weatherAppService.submit(address, $scope.weatherCallback);
        console.log('weatherClass after submit: ' + $rootScope.weatherClass);
    };
});
