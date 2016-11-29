var viewsModule = require('../../views');

viewsModule.directive('savedCities', function() {
    return {
        restrict: 'E',
        templateUrl: './components/saved-cities/saved-cities-template.html',
        scope: {
            submit: '=submit'
        },
        link: function(scope, element, attrs) {
            scope.city = '';
            scope.formInvalid = false; // If set to true, an error message asking the user to enter a location will display
            scope.duplicateCity = false; // If set to true, the city is already saved to the saved cities list

            // Gets the list of saved cities
            scope.getCityList = function() {
                scope.duplicateCity = false;

                var cityList = [];
                var data = localStorage.getItem('city');

                if (data !== null) {
                    cityList = JSON.parse(data);
                }
                return cityList;
            };

            scope.savedCities = scope.getCityList(); // Get the list of cities on page load

            // Add a city to the saved cities list (which is stored in localstorage)
            scope.addCity = function() {
                var city = scope.city; // scope.city is bound to the city input field
                var cityList = scope.getCityList(); // Get the list of cities

                if (cityList)

                for (var i = 0; i < cityList.length; i++) {
                    // If the city has already been added (NOT case sensitive), don't add it again, and notify the user
                    if (cityList[i].name.toUpperCase() == city.toUpperCase()) {
                        scope.duplicateCity = true;
                        scope.city = '';
                        return;
                    }
                }

                // Otherwise, if the form is valid and if the city hasn't been added, add the city to the list
                if (scope.savedCitiesForm.$valid) {
                    cityList.push({ // Add the city to the cityList array
                        name: city
                    });
                    localStorage.setItem('city', JSON.stringify(cityList)); // Add the city to local storage
                    scope.savedCities = scope.getCityList(); // Update and store the list of cities
                    scope.city = ''; // Clear city input field
                    scope.formInvalid = false; // Don't display the error message
                    // Else if the form is invalid and the length of the city list hasn't changed, show the error message
                } else if (!scope.savedCitiesForm.$valid && (cityList.length == scope.savedCities.length)) {
                    scope.formInvalid = true; // Display the error message
                }
            };

            /* Remove a city from the saved cities list */
            scope.removeCity = function(city) {
                var cityList = scope.getCityList();

                cityList.splice(city, 1); // Remove the city from the cityList array
                localStorage.setItem('city', JSON.stringify(cityList)); // Remove the city from local storage
                scope.savedCities = scope.getCityList(); // Update and store the list of cities
            };
        }
    };
});
