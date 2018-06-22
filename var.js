window.VAR = {

    video: {},
    keys: {
        home: "h",
        away: "a",
        homeLess: "y",
        awayLess: "q",
        refresh: "r",
        startTimer: 's',
        replay: 'p'
    },
    knob: {},
    timeout: {},
    time: 0,
    home: 0,
    away: 0,
    buffer: 10000,
    replay: false,

    init: function ()
    {
        this.newCamera()
        this.initKnob()
        $('body').keydown(key => this.buttonPress(key))
    },

    camera: function ()
    {
        //-- Make video the size of the rest of the screen
        var video = document.getElementById('video');
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true }).then(function (stream) {
                video.src = window.URL.createObjectURL(stream);
                video.play();
            });
        }
    },

    newCamera: function ()
    {

        if (this.replay) { return true }
        let video = document.getElementById('video');
        let recording = document.getElementById("recording");

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            video.srcObject = stream;
            // downloadButton.href = stream;
            video.captureStream = video.captureStream || video.mozCaptureStream;
            return new Promise(resolve => video.onplaying = resolve);
        }).then(() => this.startRecording(
            video.captureStream(), this.buffer)
        )
        .then(recordedChunks => {

            //-- Once we have recorded, lets restart
            let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
            recording.src = URL.createObjectURL(recordedBlob);
            this.newCamera()
        })
        .catch(e => {
            console.log(e)
        });
    },

    startRecording: function (stream, lengthInMS)
    {
        let recorder = new MediaRecorder(stream);
        let data = [];

        recorder.ondataavailable = event => data.push(event.data);
        recorder.start();
        console.log(recorder.state + " for " + (lengthInMS / 1000) + " seconds...");

        let stopped = new Promise((resolve, reject) => {
            recorder.onstop = resolve;
            recorder.onerror = event => reject(event.name);
        });

        let recorded = this.wait(lengthInMS).then(
            () => recorder.state == "recording" && recorder.stop()
        );

        return Promise.all([
            stopped,
            recorded
        ])
        .then(() => data);

    },

    showReplay: function ()
    { 

        this.replay = true
        let video = document.getElementById('video');
        video.style.display = "none"

        $('.replay').show()

        let recording = document.getElementById("recording");
        recording.style.display = "block"
        recording.play()
        
    },

    stopReplay: function ()
    {
        this.replay = false
        let video = document.getElementById('video');
        video.style.display = "block"

        $('.replay').hide()

        let recording = document.getElementById("recording");
        recording.style.display = "none"
        recording.stop

        this.newCamera()
    },

    wait: function(delayInMS) 
    {
        return new Promise(resolve => setTimeout(resolve, delayInMS));
    },

    buttonPress: function (key)
    {
        if (key.key == this.keys.home) {
            
        }

        switch(key.key)
        {
            case this.keys.home:
                this.home++
            break
            case this.keys.away:
                this.away++
            break
            case this.keys.homeLess:
                this.home--
            break
            case this.keys.awayLess:
                this.away--
            break
            case this.keys.refresh:
                window.location.reload()
            break
            case this.keys.startTimer:
                this.startTimer()
            break
            case this.keys.replay:
                if (this.replay) {
                    this.stopReplay()
                } else {
                    this.showReplay()
                }
            break
        }
            
        $('.team-home').html(this.home)
        $('.team-away').html(this.away)
    },

    startTimer: function () 
    {
        this.timeout = setInterval(() => {
            this.updateTimer()
        }, 5000)
    },

    updateTimer: function () 
    {
        if (this.time == 45)
        {
            //-- STOP
            clearInterval(this.timeout)
            console.log('stop')
        }
        else
        {
            this.time++;
            $(".timer").val(this.time).trigger('change')
        }
        
    },

    initKnob: function ()
    {
        this.knob = $(".timer").knob({
            width: 150,
            height: 150
        });
    }

}

window.VAR.init()