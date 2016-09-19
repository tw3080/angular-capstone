weatherApp.directive('audioControl', function() {
    return {
        // TODO: getting 'undefined' for scope here?
        restrict: 'E',
        templateUrl: 'audio-control.html',
        scope: {
            audioFile: '=audioFile'
        },
        link: function(scope, element, attrs, weatherAppService) {
            scope.$watch(function() { return scope.audioFile; }, function() {
                scope.audioOgg = 'components/audio/' + scope.audioFile + '.ogg';
                scope.audioMp3 = 'components/audio/' + scope.audioFile + '.mp3';
                document.getElementById('weather-audio').load().play();
                // console.log(scope.audioFile);
            });
            // console.log(scope.audioFile);
            scope.audioOgg = 'components/audio/' + scope.audioFile + '.ogg';
            scope.audioMp3 = 'components/audio/' + scope.audioFile + '.mp3';
        }
    };
});
