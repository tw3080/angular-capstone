weatherApp.directive('audioControl', function() {
    return {
        restrict: 'E',
        templateUrl: 'audio-control.html',
        scope: {
            audioFile: '=audioFile'
        },
        link: function(scope, element, attrs, weatherAppService) {
            scope.$watch(function() { return scope.audioFile; }, function() {
                scope.audioOgg = 'assets/audio/' + scope.audioFile + '.ogg';
                scope.audioMp3 = 'assets/audio/' + scope.audioFile + '.mp3';
                // TODO: The line below seems unnecessary?
                // document.getElementById('weather-audio').load().play();
            });
            scope.audioOgg = 'assets/audio/' + scope.audioFile + '.ogg';
            scope.audioMp3 = 'assets/audio/' + scope.audioFile + '.mp3';

            scope.paused = false;

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
