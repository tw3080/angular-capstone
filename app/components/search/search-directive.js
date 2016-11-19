var viewsModule = require('../../views');

// TODO: Might have to change 'viewsModule' back to 'weatherApp'?

viewsModule.directive('searchForm', function() {
    return {
        restrict: 'E',
        templateUrl: './components/search/search.html',
        scope: {
            submit: '=submit'
        },
        link: function(scope, element, attrs) {
            scope.address = null;
        }
    };
});
