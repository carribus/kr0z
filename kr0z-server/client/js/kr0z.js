(function() {
    this.log = createLogger()
    this.socket = null;
    this.gameElem = document.getElementById('game_container');
    this.consoleLog = document.getElementById('console_log');
    this.consoleInput = document.getElementById('console_input');

    this.consoleInput.focus();

    setupEventListeners();

    connectToServer("localhost");

    // create fake log
    this.consoleLog.innerHTML += "Welcome to kr0z :: Written by carribus (c) 2013<br/>";
    this.consoleLog.innerHTML += "-----------------------------------------------<br/><br/>";


    //
    // Private functions
    function createLogger() {
        return Logger(document.getElementById('log_container'));
    }

    function setupEventListeners() {
        var that = this;
        // connection listener
        addEventListener('connected',onConnected);

        // key press
        document.onkeypress = (function(e) {
            switch (e.keyCode) {
                case '`'.charCodeAt(0):
                    that.log.logElem.classList.toggle('hidden');
                    e.preventDefault();
                    break;

                default:
                    break;
            }
            //that.log.info('onKeyPressed(' + String.fromCharCode(e.keyCode) + ')[' + e.charCode + ']');
        });

        document.onkeydown = function(e) {
            switch (e.keyCode) {
                case 13:
                    e.preventDefault();
                    that.processInput();
                    break;

                default:
                    break;
            }
        }
    }

    function logResponse(data) {
        this.log.info('Response: ' + data);
        this.consoleLog.innerHTML += data + "</br>";
    }

    function logNotification(data) {
        this.log.warn('Notification: ' + data);
        this.consoleLog.innerHTML += '<span class="notification">** ' + data + '</span></br>';
    }

    /**
     * Called when user pressed ENTER or RETURN in the input box
     */
    this.processInput = function() {
        log.info("Input: " + this.consoleInput.value);
        sendMessage(this.consoleInput.value);
        this.consoleInput.value = '';
    }

    function updateInput() {
        this.gameElem.innerHTML = this.inputBuffer;
    }

    function sendMessage(msg) {
        var a = msg.split(" ");
        this.socket.emit('kr0z.command', {
            command: a.shift(),
            params: a.join()
        });
    }

    function onConnected() {
    }

    function connectToServer(host) {
        this.log.info('Connecting to http://' + host);
        this.socket = io.connect('http://' + host);
        var counter = 0;

        $this = this;

        this.socket.on('connect', function() {
            $this.log.info('Connection OK');
            var e = document.createEvent('CustomEvent');
            e.initEvent('connected', true, true);
            window.dispatchEvent(e);
        });

        this.socket.on('disconnect', function() {
            logNotification("!! Disconnected");
        });

        this.socket.on('news', function (data) {
            $this.log.info('Data In: ' + data);
            $this.socket.emit('my other event', { my: 'data' });
        });

        this.socket.on('kr0z.response', function (data) {
            logResponse(data);
        });

        this.socket.on('kr0z.notification', function(data) {
            logNotification(data);
        });
    };

})();

