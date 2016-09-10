viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'home/home.html',
        controller: 'CurrentWeatherCtrl'
    });
}]);

viewsModule.controller('CurrentWeatherCtrl', function($scope, $rootScope, geocodeLocation, getWeatherConditions) {
    /*
    // TODO: Is this the best way to do this? Using $scope doesn't work...
    $rootScope.address = null;
    */

    // $rootScope.submit = function(address) {
    $scope.submit = function(address) {
        // TODO: Why are $scope and $rootScope interchangable here? (console log below)
        $scope.address = address;
        console.log($scope.address);
        geocodeLocation($scope.address).then(function(response) {
            $scope.lat = response.lat;
            $scope.lng = response.lng;
            // TODO: Is it OK to nest promises like this?
            return getWeatherConditions($scope.lat, $scope.lng);
        }).then(function(response) {
            console.log(response);
            $scope.locationName = response.display_location.city;
            $scope.locationName += ', ';
            $scope.locationName += response.display_location.state;
        });
    };
});
