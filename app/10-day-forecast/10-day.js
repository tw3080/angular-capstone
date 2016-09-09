viewsModule.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/10-day', {
        templateUrl: '10-day-forecast/10-day.html'
    });
}]);
