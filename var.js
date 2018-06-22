window.VAR = {

    video: {},
    keys: {
        home: "h",
        away: "a",
        homeLess: "y",
        awayLess: "q",
        refresh: "r",
        cameraToggle: 'c',
        startTimer: 's'
    },
    knob: {},
    timeout: {},
    time: 0,
    home: 0,
    away: 0,

    init: function ()
    {
        // this.camera()
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

    recordFrame: function ()
    {

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
            case this.keys.cameraToggle:
                this.camera()
                window.location.reload()
            break;
            case this.keys.startTimer:
                this.startTimer()
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