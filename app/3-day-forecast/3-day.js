viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/3-day', {
        templateUrl: '3-day-forecast/3-day.html'
    });
}]);
