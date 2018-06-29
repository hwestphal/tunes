window.libopenmpt = {
    locateFile: function (filename) {
        return "//cdn.rawgit.com/deskjet/chiptune2.js/master/" + filename;
    },

    onRuntimeInitialized: function () {
        var player, analyzer, bufferLength, dataArray, canvasCtx;

        function init() {
            if (player === undefined) {
                player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1));
                analyzer = player.context.createAnalyser();
                analyzer.fftSize = 64;
                bufferLength = analyzer.frequencyBinCount;
                dataArray = new Uint8Array(bufferLength);
                analyzer.connect(player.context.destination);
                canvasCtx = document.getElementById('viz').getContext('2d');
                visualize();
            } else {
                player.stop();
                playPauseButton();
            }
        }

        function visualize() {
            var width = canvasCtx.canvas.width,
                height = canvasCtx.canvas.height,
                barWidth = (width / bufferLength) * 1.5,
                barHeight,
                x = 0,
                i;
            requestAnimationFrame(visualize);
            analyzer.getByteFrequencyData(dataArray);
            canvasCtx.clearRect(0, 0, width, height);
            for (i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2;
                canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ', 50, 50)';
                canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight);
                x += barWidth + 1;
            }
        }

        function setTitle(title) {
            document.getElementById('title').innerHTML = title;
        }

        function afterLoad(path, buffer) {
            player.play(buffer);
            player.currentPlayingNode.disconnect();
            player.currentPlayingNode.connect(analyzer);
            pausePauseButton();
        }

        function loadURL(path, title) {
            init();
            player.load(path, afterLoad.bind(this, path));
            setTitle(title);
        }

        function pauseButton() {
            player.togglePause();
            switchPauseButton();
        }

        function switchPauseButton() {
            var button = document.getElementById('pause')
            if (button) {
                button.id = "play_tmp";
            }
            button = document.getElementById('play')
            if (button) {
                button.id = "pause";
            }
            button = document.getElementById('play_tmp')
            if (button) {
                button.id = "play";
            }
        }

        function playPauseButton() {
            var button = document.getElementById('pause')
            if (button) {
                button.id = "play";
            }
        }

        function pausePauseButton() {
            var button = document.getElementById('play')
            if (button) {
                button.id = "pause";
            }
        }

        document.querySelectorAll('.song').forEach(function (e) {
            e.addEventListener('click', function (evt) {
                var target = evt.target;
                loadURL(target.getAttribute("data-modurl"), evt.target.textContent);
            }, false);
        });

        document.querySelector('#play').addEventListener('click', pauseButton, false);
    }
};
