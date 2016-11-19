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
            console.log('Geocoded location: ', response.data.results[0].geometry.location);
            return response.data.results[0].geometry.location;
        });
    };
}])
/* Accepts a location (latitude and longitude) as a parameter and returns an actual address for that location; basically, does the opposite of what geocodeLocation() (above) does */
.factory('reverseGeocodeLocation', ['$http', 'GOOGLE_GEOCODE_PREFIX', 'GOOGLE_API_KEY', function($http, GOOGLE_GEOCODE_PREFIX, GOOGLE_API_KEY) {
    return function(lat, lng) {
        var params = {
            key: GOOGLE_API_KEY,
            latlng: lat + ',' + lng
        };

        return $http({
            method: 'GET',
            url: GOOGLE_GEOCODE_PREFIX,
            cache: true,
            params: params
        })
        .then(function(response) {
            console.log('Reverse geocode results: ', response.data.results[0].formatted_address);
            return response.data.results[0].formatted_address;
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
/* Uses the above factories to gather weather data and combine it for use across controllers/directives */
.service('weatherAppService', ['geocodeLocation', 'reverseGeocodeLocation', 'getWeatherConditions', 'localStorageService', function(geocodeLocation, reverseGeocodeLocation, getWeatherConditions, localStorageService) {
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
            weatherAppService.weatherSounds = 'sunnysounds';
            weatherAppService.weatherClass = 'sun';
        } else if (['cloudy', 'hazy', 'mostlycloudy', 'sleat'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            weatherAppService.weatherSounds = 'cloudysounds';
            weatherAppService.weatherClass = 'thunder';
        } else if (['chancerain', 'chancesleat', 'rain', 'sleat'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            weatherAppService.weatherSounds = 'rainsounds';
            weatherAppService.weatherClass = 'rain';
        } else if (['chancetstorms', 'tstorms'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            weatherAppService.weatherSounds = 'thundersounds';
            weatherAppService.weatherClass = 'thunder';
        } else if (['chanceflurries', 'chancesnow', 'flurries', 'snow'].indexOf(weatherAppService.currentWeather.data.icon) > -1) {
            weatherAppService.weatherSounds = 'snowsounds';
            weatherAppService.weatherClass = 'snow';
        }
    };

    // Get the user's geolocation
    weatherAppService.initializeGeolocation = function(callback) {
        // If geolocation is supported, get the user's geolocation
        if (navigator.geolocation) {
          console.log('Geolocation is supported!');
          navigator.geolocation.getCurrentPosition(function(position) {
              weatherAppService.weatherClass = ''; // For switching css styles based on weather conditions
              weatherAppService.showWeather = true; // Show the weather
              console.log('Position detected');

              /* Location detection can be unreliable or return inaccurate results, so if the location is being detected, the lat/lng need to be reverse geocoded into an address, then that address needs to be regular geocoded and passed to 'getWeatherConditions', because the Weather Underground API sometimes has issues returning correct results without the help of the Google geocoding API */
              // Reverse geocode the detected location
              reverseGeocodeLocation(position.coords.latitude, position.coords.longitude)
              // Then, the address needs to be regular geocoded back into lat/lng
              .then(function(response) {
                  return geocodeLocation(response);
              })
              // Then, the new lat/lng need to be passed as parameters to 'getWeatherConditions' in order to return the correct data about that location
              .then(function(response) {
                  weatherAppService.lat = response.lat;
                  weatherAppService.lng = response.lng;
                  return getWeatherConditions(weatherAppService.lat, weatherAppService.lng);
              })
              // Finally, use the new weather data to update the weather conditions
              .then(function(response) {
                  weatherAppService.responseWeatherCondition(response);
                  callback(response);
              });
          });
        }
        // If geolocation isn't supported, alert the user
        else {
            alert('Geolocation is not supported for this browser/OS version yet; please manually search for a location.');
        }
    };

    // Geocodes the address input by the user, then gets the current weather conditions for that address
    weatherAppService.submit = function(address, callback) {
        weatherAppService.weatherClass = ''; // For switching css styles based on weather conditions
        weatherAppService.showWeather = true; // Show the weather conditions
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
