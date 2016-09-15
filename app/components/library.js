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
/* Accepts a location (latitude and longitude) as a parameter and returns the current, 3 day, and 10 day forecast for that location */
.factory('getWeatherConditions', ['$http', 'WUNDERGROUND_PREFIX', 'WUNDERGROUND_API_KEY', function($http, WUNDERGROUND_PREFIX, WUNDERGROUND_API_KEY) {
    return function(lat, lng) {
        // Initialize variables for storing response data
        var current, threeDay, tenDay;

        // Gets the current weather conditions
        return $http({
            method: 'GET',
            url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/conditions/q/' + lat + ',' + lng + '.json',
            dataType: 'jsonp',
            cache: true
        })
        .then(function(response) {
            current = response.data.current_observation;
            // Gets a three day forecast
            return $http({
                method: 'GET',
                url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/forecast/q/' + lat + ',' + lng + '.json',
                dataType: 'jsonp',
                cache: true
            });
        })
        .then(function(response) {
            threeDay = response.data.forecast.simpleforecast.forecastday;
            // Gets a ten day forecast
            return $http({
                method: 'GET',
                url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/forecast10day/q/' + lat + ',' + lng + '.json',
                dataType: 'jsonp',
                cache: true
            });
        })
        .then(function(response) {
            tenDay = response.data.forecast.simpleforecast.forecastday;
            return [current, threeDay, tenDay];
        });
    };
}])
.service('weatherAppService', ['geocodeLocation', 'getWeatherConditions', 'localStorageService', function(geocodeLocation, getWeatherConditions, localStorageService) {
    var weatherAppService = this;

    // Setting a local storage variable, for storing searched locations
    weatherAppService.cache = localStorageService;

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
            weatherAppService.lat = response.lat;
            weatherAppService.lng = response.lng;

            // Checks whether or not the lat/lng values input by the user are in local storage
            if ((weatherAppService.cache.get('lat') == response.lat) && (weatherAppService.cache.get('lng') == response.lng)) {
                // If the values are already in local storage, get the stored data rather than make another HTTP request
                var data = weatherAppService.cache.get('data');
                return JSON.parse(data);
            } else {
                // Else, if the values aren't in local storage, set new lat/lng values
                weatherAppService.cache.set('lat', response.lat);
                weatherAppService.cache.set('lng', response.lng);
            }

            // Get the weather forecasts based on the lat/lng input by the user
            var data = getWeatherConditions(weatherAppService.lat, weatherAppService.lng);
            return data;
        }).then(function(response) {
            console.log(response);
            // Store the response in local storage, to limit the number of HTTP requests
            weatherAppService.cache.set('data', JSON.stringify(response));

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
