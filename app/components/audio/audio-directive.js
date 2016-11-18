weatherApp.directive('audioControl', function() {
    return {
        restrict: 'E',
        templateUrl: './components/audio/audio.html',
        scope: {
            audioFile: '=audioFile'
        },
        link: function(scope, element, attrs, weatherAppService) {
            // Watch for changes to scope.audioFile (this changes based on the weather conditions) and update the audio file which plays accordingly
            scope.$watch(function() { return scope.audioFile; }, function() {
                scope.audioOgg = 'assets/audio/' + scope.audioFile + '.ogg';
                scope.audioMp3 = 'assets/audio/' + scope.audioFile + '.mp3';
                // Only play the audio if the 'weather-audio' element exists; this prevents the console from throwing errors about the 'weather-audio' element not being defined before a location has been set
                if (document.getElementById('weather-audio')) {
                    document.getElementById('weather-audio').load();
                    document.getElementById('weather-audio').play();
                }
            });
            // Set the audio file according to the value of scope.audioFile
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
