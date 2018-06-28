window['libopenmpt'] = {};
libopenmpt.locateFile = function (filename) {
    return "//cdn.rawgit.com/deskjet/chiptune2.js/master/" + filename;
};
libopenmpt.onRuntimeInitialized = function () {
    var player;

    function init() {
        if (player == undefined) {
            player = new ChiptuneJsPlayer(new ChiptuneJsConfig(-1));
        }
        else {
            player.stop();
            playPauseButton();
        }
    }

    function setMetadata(filename) {
        var metadata = player.metadata();
        if (metadata['title'] != '') {
            document.getElementById('title').innerHTML = metadata['title'];
        }
        else {
            document.getElementById('title').innerHTML = filename;
        }
    }

    function afterLoad(path, buffer) {
        document.querySelectorAll('#pitch,#tempo').forEach(e => e.value = 1);
        player.play(buffer);
        setMetadata(path);
        pausePauseButton();
    }

    function loadURL(path) {
        init();
        player.load(path, afterLoad.bind(this, path));
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
            modurl = evt.target.getAttribute("data-modurl");
            loadURL(modurl);
        }, false);
    });

    document.querySelector('#play').addEventListener('click', pauseButton, false);

    document.querySelector('#pitch').addEventListener('input', function (e) {
        player.module_ctl_set('play.pitch_factor', e.target.value.toString());
    }, false);

    document.querySelector('#tempo').addEventListener('input', function (e) {
        player.module_ctl_set('play.tempo_factor', e.target.value.toString());
    }, false);
};
