angular.module('weatherLibrary', [])
/* Initialize constants */
.constant('GOOGLE_GEOCODE_PREFIX', 'https://maps.googleapis.com/maps/api/geocode/json')
.constant('GOOGLE_API_KEY', 'AIzaSyAjk0rA9cKg0qBwGHTTg2J3LrlFQZ9F19E')
.constant('WUNDERGROUND_PREFIX', '//api.wunderground.com/api/')
.constant('WUNDERGROUND_API_KEY', '1aa4dffd1250ef6b')
/* Accepts a location as a parameter, converts that location into geographic coordinates (latitude and longitude), then returns the lat/long for that location */
.factory('geocodeLocation', ['$http', 'GOOGLE_GEOCODE_PREFIX', 'GOOGLE_API_KEY', function($http, GOOGLE_GEOCODE_PREFIX, GOOGLE_API_KEY) {
    return function(location) {
        var params = {
            key: GOOGLE_API_KEY,
            address: location
        };
        return $http({
            method: 'GET',
            url: GOOGLE_GEOCODE_PREFIX,
            cache: true,
            params: params
        })
        .then(function(response) {
            // console.log(response.data.results[0].geometry.location);
            return response.data.results[0].geometry.location;
        });
    };
}])
/* Accepts a location (latitude/longitude) as a parameter and returns the current weather conditions at that location */
.factory('getWeatherConditions', ['$http', 'WUNDERGROUND_PREFIX', 'WUNDERGROUND_API_KEY', function($http, WUNDERGROUND_PREFIX, WUNDERGROUND_API_KEY) {
    return function(lat, lng) {
        // Initialize variables for storing response data
        var current, threeDay, tenDay;

        // Gets the current weather conditions
        return $http({
            method: 'GET',
            url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/conditions/q/' + lat + ',' + lng + '.json',
            cache: true
        })
        .then(function(response) {
            current = response.data.current_observation;
            // Gets a three day forecast
            return $http({
                method: 'GET',
                url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/forecast/q/' + lat + ',' + lng + '.json',
                cache: true
            });
        })
        .then(function(response) {
            // TODO: I get a console error here if I set threeDay to be anything except response.data.forecast, but everything works fine?
            threeDay = response.data.forecast;
            // Gets a ten day forecast
            return $http({
                method: 'GET',
                url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/forecast10day/q/' + lat + ',' + lng + '.json',
                cache: true
            });
        })
        .then(function(response) {
            // TODO
            tenDay = response.data.forecast;
            return [current, threeDay, tenDay];
        });
    };
}])
.service('weatherAppService', ['geocodeLocation', 'getWeatherConditions', function(geocodeLocation, getWeatherConditions) {
    var weatherAppService = this;

    weatherAppService.location = {}; // Data about a location's name
    weatherAppService.currentWeather = {}; // Data about current weather conditions
    weatherAppService.threeDay = {}; // Data about three day weather forecast
    weatherAppService.tenDay = {}; // Data about ten day weather forecast

    // TODO
    weatherAppService.forecast = '';

    // Geocodes the address input by the user, then gets the current weather conditions for that address
    weatherAppService.submit = function(address, callback) {
        // The address input by the user is bound to the weatherAppService.address variable
        weatherAppService.address = address;
        // Geocodes the address
        geocodeLocation(weatherAppService.address).then(function(response) {
            // console.log(weatherAppService.forecast);
            weatherAppService.lat = response.lat;
            weatherAppService.lng = response.lng;
            // Returns the current weather conditions based on the lat/lng address
            return getWeatherConditions(weatherAppService.lat, weatherAppService.lng, weatherAppService.forecast);
        }).then(function(response) {
            console.log(response);
            // Updates the value of the location's name
            // TODO: Need to handle non-US areas
            weatherAppService.location.name = response[0].display_location.city;
            weatherAppService.location.name += ', ';
            weatherAppService.location.name += response[0].display_location.state;
            // Set variables to hold the response data for each view's forecast
            weatherAppService.currentWeather.data = response[0];
            weatherAppService.threeDay.data = response[1];
            weatherAppService.tenDay.data = response[2];
            // TODO: Still confused about why this callback is necessary
            callback(response);
        });
    };
}]);
