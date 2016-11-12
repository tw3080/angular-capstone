weatherApp.directive('searchForm', function() {
    return {
        restrict: 'E',
        templateUrl: 'search-form.html',
        scope: {
            submit: '=submit'
        },
        link: function(scope, element, attrs) {
            scope.address = null;
        }
    };
});
