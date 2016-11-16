weatherApp.directive('searchForm', function() {
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
