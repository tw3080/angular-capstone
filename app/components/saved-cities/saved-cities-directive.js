var viewsModule = require('../../views');

viewsModule.directive('savedCities', function() {
    return {
        restrict: 'E',
        templateUrl: './components/saved-cities/saved-cities-template.html',
        scope: {
            submit: '=submit'
        },
        link: function(scope, element, attrs) {
            // TODO: Feel like I'm repeating myself too much by having to call getCityList 3 times?

            // Gets the list of saved cities
            scope.getCityList = function() {
                var cityList = [];
                var data = localStorage.getItem('city');

                if (data !== null) {
                    cityList = JSON.parse(data);
                }
                return cityList;
            };

            // Add a city to the saved cities list (which is stored in localstorage)
            scope.addCity = function() {
                var city = scope.city; // scope.city is bound to the city input field
                var cityList = scope.getCityList(); // Get the list of cities

                for (var i = 0; i < cityList.length; i++) {
                    // If the city has already been added, don't add it again, and notify the user
                    if (cityList[i].name == city) {
                        // TODO: Display error message here
                        console.log('duplicate city');
                        return;
                    }
                }

                // Otherwise, if the city hasn't been added, add it to the list
                cityList.push({
                    name: city
                });
                localStorage.setItem('city', JSON.stringify(cityList));
                console.log(cityList);
                // scope.$apply();
                scope.savedCities = scope.getCityList(); // Update the list of cities
                scope.city = ''; // Clear city input field
            };

            // Remove a city from the saved cities list
            scope.removeCity = function(city) {
                console.log('removing city');
                console.log(city);
                var cityList = scope.getCityList();

                cityList.splice(city, 1);
                localStorage.setItem('city', JSON.stringify(cityList));
                console.log(cityList);
                scope.savedCities = scope.getCityList(); // Update the list of cities
                /*
                for (var i = 0; i < cityList.length; i++) {
                    if (cityList[i] == city) {
                        cityList.splice(i, 1);
                        localStorage.setItem('city', JSON.stringify(cityList));
                    }
                }
                */
            };

            scope.savedCities = scope.getCityList(); // Get the list of cities on page load
            console.log(scope.savedCities);

            // Add a city to the 'savied cities' list; the list is stored in localstorage
            /*
            scope.addCity = function() {
                console.log('city added');
                scope.city = scope.city;

                if (localStorage.cities) {
                    cities = JSON.parse(localStorage.cities);
                } else {
                    cities = [];
                }

                cities.push(scope.city);
                localStorage.cities = JSON.stringify(cities);
                cities = JSON.parse(localStorage.cities);

                console.log(cities);
            };
            */

            // Remove a saved city
            /*
            scope.deleteCity = function(city) {
                cities = JSON.parse(localStorage.cities);

                for (var i = 0; i < cities.length; i++) {
                    if (cities[i] == city) {
                        cities.splice(i, 1);
                        localStorage.cities = JSON.stringify(cities);
                    }
                }
            };
            */
        }
    };
});
