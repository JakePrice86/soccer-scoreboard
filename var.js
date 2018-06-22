window.VAR = {

    recorder: {},
    videoChunks: [],
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
    tick: 100,
    replay: false,
    teams: {
        home: 'England',
        away: 'Spain'
    },

    init: function ()
    {
        this.newCamera()
        this.initKnob()
        $('body').keydown(key => this.buttonPress(key))
        $('.team-home-name').html(this.teams.home)
        $('.team-away-name').html(this.teams.away)
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

        this.recorder = {}
        this.videoChunks = []

        let video = document.getElementById('video');
        let recording = document.getElementById("recording");

        console.log('Starting recording')

        navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
        }).then(stream => {
            video.srcObject = stream;
            video.captureStream = video.captureStream || video.mozCaptureStream;
            return new Promise(resolve => video.onplaying = resolve);
        }).then(() => this.startRecording(
            video.captureStream())
        )
        .catch(e => {
            console.log(e)
        });
    },

    startRecording: function (stream)
    {
        this.recorder = new MediaRecorder(stream);
        let data = [];
        
        this.recorder.ondataavailable = event => data.push(event.data);
        this.recorder.start();

        let stopped = new Promise((resolve, reject) => {
            this.recorder.onstop = resolve;
            this.recorder.onerror = event => reject(event.name);
        });

        this.recorder.ondataavailable = (e => {
            this.createReplayVideo(e)
        })

        return true
    },

    testReplay: function ()
    {
        this.recorder.requestData(blob => {
            console.log(blob)
        })
    },

    showReplay: function ()
    { 

        this.replay = true

        $('.replay').show()

        let recording = document.getElementById("recording");
        recording.style.display = "block"
        
        //-- Request our data
        this.recorder.requestData();
        
    },

    createReplayVideo: function (e)
    {
        this.videoChunks.push(e.data)
        let recordedBlob = new Blob(this.videoChunks, { type: "video/webm" });
        let recording = document.getElementById("recording");
        recording.src = URL.createObjectURL(recordedBlob);
        

        recording.addEventListener('durationchange', () => {
            recording.currentTime = 999999
            if (recording.readyState) {
                let time = parseInt(recording.duration, 10);
                if (time > 0)
                {
                    console.log('duration loaded', time)
                    recording.currentTime = 0
                    //-- process
                    if (time > 10) {
                        recording.currentTime = time - 10
                    }
                }
            }
        });

        //-- Stop recording
        this.recorder.stops
        
    },

    stopReplay: function ()
    {
        this.replay = false

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
        }, this.tick)
    },

    updateTimer: function () 
    {
        if (this.replay) { return true }

        //-- Check for times
        if (this.time == 45)
        {
            //-- STOP
            clearInterval(this.timeout)
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