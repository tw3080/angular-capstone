require('angular');
require('angular-route');
require('angular-local-storage');
require('angular-animate');
require('./views');
require('./components/library');
require('./components/home/home');
require('./components/search/search-directive');
require('./components/audio/audio-directive');
require('./components/saved-cities/saved-cities-controller');
require('./components/saved-cities/saved-cities-directive');

var weatherApp = angular.module('weatherApp', ['weatherAppViews', 'ngRoute', 'ngAnimate', 'LocalStorageModule'])
    .config(function($routeProvider) {
        /* If the user tries to go to any route other than one which is already defined, redirect them to the home page */
        $routeProvider.otherwise({
            redirectTo: '/'
        });
    });
