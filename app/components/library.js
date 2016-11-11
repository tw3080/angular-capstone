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
            return response.data.results[0].geometry.location;
        });
    };
}])
/* Accepts a location (latitude and longitude) as a parameter and returns the current, 3 day, and 10 day forecast for that location */
.factory('getWeatherConditions', ['$http', 'WUNDERGROUND_PREFIX', 'WUNDERGROUND_API_KEY', function($http, WUNDERGROUND_PREFIX, WUNDERGROUND_API_KEY) {
    return function(lat, lng) {
        // Initialize variables for storing response data
        var current, tenDay;

        // Gets the current weather conditions
        return $http({
            method: 'GET',
            url: WUNDERGROUND_PREFIX + WUNDERGROUND_API_KEY + '/conditions/q/' + lat + ',' + lng + '.json',
            dataType: 'jsonp',
            cache: true
        })
        .then(function(response) {
            current = response.data.current_observation;
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
            console.log(tenDay);
            return [current, tenDay];
        });
    };
}])
.service('weatherAppService', ['geocodeLocation', 'getWeatherConditions', 'localStorageService', function(geocodeLocation, getWeatherConditions, localStorageService) {
    var weatherAppService = this;

    weatherAppService.cache = localStorageService; // Local storage variable, for storing searched locations
    weatherAppService.weatherSounds = ''; // For setting weather sound file names, based on current weather
    weatherAppService.showWeather = false; // Determines whether or not to show weather data (is set to true after user submits a location)
    weatherAppService.location = {}; // Data about a location's name
    weatherAppService.currentWeather = {}; // Data about current weather conditions
    weatherAppService.tenDay = {}; // Data about ten day weather forecast

    weatherAppService.responseWeatherCondition = function(response) {
        weatherAppService.cache.set('data', JSON.stringify(response)); // Store the response in local storage, to limit the number of HTTP requests

        weatherAppService.location.name = response[0].display_location.city; // Updates the value of the location's name
        weatherAppService.currentWeather.data = response[0]; // Holds data for current weather
        weatherAppService.tenDay.data = response[1]; // Holds data for 10 day forecast

        // For changing sound files and css based on weather conditions: checks the value of weatherAppService.currentWeather.data.icon and matches it to a sound/css file; indexOf() returns -1 if the values don't match
        if (['clear', 'mostlysunny', 'partlycloudy', 'partlysunny', 'sunny', 'unknown'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            console.log('Weather icon: ' + weatherAppService.currentWeather.data.icon);
            weatherAppService.weatherSounds = 'sunnysounds';
            console.log('Weather sounds: ' + weatherAppService.weatherSounds);
            weatherAppService.weatherClass = 'sun';
            console.log('Weather class: ' + weatherAppService.weatherClass);
        } else if (['cloudy', 'hazy', 'mostlycloudy', 'sleat'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            console.log('Weather icon: ' + weatherAppService.currentWeather.data.icon);
            weatherAppService.weatherSounds = 'cloudysounds';
            console.log('Weather sounds: ' + weatherAppService.weatherSounds);
            weatherAppService.weatherClass = 'thunder';
            console.log('Weather class: ' + weatherAppService.weatherClass);
        } else if (['chancerain', 'chancesleat', 'rain', 'sleat'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            console.log('Weather icon: ' + weatherAppService.currentWeather.data.icon);
            weatherAppService.weatherSounds = 'rainsounds';
            console.log('Weather sounds: ' + weatherAppService.weatherSounds);
            weatherAppService.weatherClass = 'rain';
            console.log('Weather class: ' + weatherAppService.weatherClass);
        } else if (['chancetstorms', 'tstorms'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            console.log('Weather icon: ' + weatherAppService.currentWeather.data.icon);
            weatherAppService.weatherSounds = 'thundersounds';
            console.log('Weather sounds: ' + weatherAppService.weatherSounds);
            weatherAppService.weatherClass = 'thunder';
            console.log('Weather class: ' + weatherAppService.weatherClass);
        } else if (['chanceflurries', 'chancesnow', 'flurries', 'snow'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            console.log('Weather icon: ' + weatherAppService.currentWeather.data.icon);
            weatherAppService.weatherSounds = 'snowsounds';
            console.log('Weather sounds: ' + weatherAppService.weatherSounds);
            weatherAppService.weatherClass = 'snow';
            console.log('Weather class: ' + weatherAppService.weatherClass);
        }
    };

    // check for Geolocation support
    weatherAppService.initializeGeolocation = function(callback) {
        if (navigator.geolocation) {
          console.log('Geolocation is supported!');
          navigator.geolocation.getCurrentPosition(function(position) {
              console.log('position detected');

              weatherAppService.weatherClass = ''; // For switching css styles based on weather conditions
              weatherAppService.showWeather = true;
              console.log('show weather: ' + weatherAppService.showWeather);

              getWeatherConditions(position.coords.latitude, position.coords.longitude).then(function(response) {
                  weatherAppService.responseWeatherCondition(response);
                  callback(response);
              });
          });
        }
        else {
          console.log('Geolocation is not supported for this Browser/OS version yet.');
        }
    };

    // Geocodes the address input by the user, then gets the current weather conditions for that address
    weatherAppService.submit = function(address, callback) {
        weatherAppService.weatherClass = ''; // For switching css styles based on weather conditions
        weatherAppService.showWeather = true;
        weatherAppService.address = address; // Address input by the user is bound to the weatherAppService.address variable

        // Geocodes the address
        geocodeLocation(weatherAppService.address).then(function(response) {
            weatherAppService.lat = response.lat; // Latitude of address
            weatherAppService.lng = response.lng; // Longitude of address

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
            weatherAppService.responseWeatherCondition(response);

            callback(response);
        });
    };
}]);
