var viewsModule = require('../../views');

viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'components/home/home.html',
        controller: 'CurrentWeatherCtrl'
    });
}]);

viewsModule.controller('CurrentWeatherCtrl', function($scope, $rootScope, weatherAppService, getWeatherConditions) {
    $scope.isLoading = weatherAppService.isLoading;
    console.log($scope.isLoading);

    
    /* Get scope variable values from 'weatherAppService' for binding to template */
    $scope.showWeather = weatherAppService.showWeather; // Show the weather conditions
    // Location
    $scope.address = weatherAppService.address;
    $scope.location = weatherAppService.location;
    // Weather forecasts
    $scope.currentWeather = weatherAppService.currentWeather;
    $scope.tenDay = weatherAppService.tenDay.data;
    // Audio/css
    $scope.audioFile = weatherAppService.weatherSounds;
    $rootScope.weatherClass = weatherAppService.weatherClass;

    /* When the user searches for a new location, update the scope variables to reflect the change in location/weather */
    $scope.updateWeather = function(location) {
        $scope.isLoading = weatherAppService.isLoading;
        console.log($scope.isLoading);

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
    };

    /* Only get the user's geolocation if an address/location has not already been defined (basically, this means the location will only be detected when the app initially loads; this prevents the location detection from overriding the locations the user searches for) */
    if (typeof weatherAppService.address === 'undefined') {
        weatherAppService.initializeGeolocation($scope.updateWeather);
    }

    /* Uses the submit function from 'weatherAppService' to geocode the address input by the user and gets the current weather/10-day forecast */
    $scope.submit = function(address) {
        weatherAppService.submit(address, $scope.updateWeather);
    };
});
