require('./components/library');

var viewsModule = angular.module('weatherAppViews', ['ngRoute', 'weatherLibrary']);

module.exports = viewsModule;
