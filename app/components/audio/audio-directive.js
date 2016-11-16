weatherApp.directive('audioControl', function() {
    return {
        restrict: 'E',
        templateUrl: './components/audio/audio.html',
        scope: {
            audioFile: '=audioFile'
        },
        link: function(scope, element, attrs, weatherAppService) {
            scope.$watch(function() { return scope.audioFile; }, function() {
                scope.audioOgg = 'assets/audio/' + scope.audioFile + '.ogg';
                scope.audioMp3 = 'assets/audio/' + scope.audioFile + '.mp3';
                // TODO: Get an error here if no location is set because of the ng-if in audio-control
                document.getElementById('weather-audio').load();
                document.getElementById('weather-audio').play();
            });
            scope.audioOgg = 'assets/audio/' + scope.audioFile + '.ogg';
            scope.audioMp3 = 'assets/audio/' + scope.audioFile + '.mp3';

            scope.paused = false;

            /* Play/pause audio when audio icon is clicked */
            scope.toggleAudio = function() {
                var audio = document.getElementById('weather-audio');
                var audioIcon = document.getElementById('audio-icon');

                if (audio.paused) {
                    scope.paused = false;
                    audio.play();
                } else {
                    scope.paused = true;
                    audio.pause();
                }
            };
        }
    };
});
