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
        return $http({
            method: 'GET',
            url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/conditions/q/' + lat + ',' + lng + '.json'
        })
        .then(function(response) {
            // console.log(response.data.current_observation);
            return response.data.current_observation;
        });
    };
}])
.service('weatherAppService', ['geocodeLocation', 'getWeatherConditions', function(geocodeLocation, getWeatherConditions) {
    var weatherAppService = this;

    // Object containing information on a location's name
    weatherAppService.location = {};
    // Object containing information on a location's current weather conditions
    weatherAppService.currentWeather = {};

    // Geocodes the address input by the user, then gets the current weather conditions for that address
    weatherAppService.submit = function(address, callback) {
        // The address input by the user is bound to the weatherAppService.address variable
        weatherAppService.address = address;
        // Geocodes the address
        geocodeLocation(weatherAppService.address).then(function(response) {
            weatherAppService.lat = response.lat;
            weatherAppService.lng = response.lng;
            // Returns the current weather conditions based on the lat/lng address
            return getWeatherConditions(weatherAppService.lat, weatherAppService.lng);
        }).then(function(response) {
            // TODO: Still confused about why this callback is necessary
            callback(response);
            console.log(response);
            // Updates the value of the location's name
            // TODO: Need to handle non-US areas
            weatherAppService.location.name = response.display_location.city;
            weatherAppService.location.name += ', ';
            weatherAppService.location.name += response.display_location.state;

            // Updates the values of the location's current weather conditions
            // TODO: Might want to display more information
            weatherAppService.currentWeather.lastObservation = response.observation_time;
            weatherAppService.currentWeather.weather = response.weather;
            weatherAppService.currentWeather.temperature = response.temperature_string;
            weatherAppService.currentWeather.wind = response.wind_string;
        });
    };
}]);
