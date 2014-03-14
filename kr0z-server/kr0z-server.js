(function() {
    const NET_LISTEN_PORT = 8081;
    const CLIENT_PATH_ROOT = "/client";
    const CLIENT_INDEX_FILE = "/index.html";

    var app = require('http').createServer(handler)
        ,io = require('socket.io').listen(app)
        ,fs = require('fs')

    app.listen(NET_LISTEN_PORT);

    function handler(req, res) {
        var filename;
        if ( req.url == "/" ) {
            filename = __dirname + CLIENT_PATH_ROOT + CLIENT_INDEX_FILE;
        } else {
            filename = __dirname + CLIENT_PATH_ROOT + req.url;
        }

        fs.readFile(filename,
            function(err, data) {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error loading index.html");
                }

                res.writeHead(200);
                res.end(data);
            })
    }

    function handleMsg(socket, cmd, params) {
        switch ( cmd ) {
            case "say":
                socket.emit('kr0z.response', "You say '" + params + "'");
                break;

            case "shout":
                socket.emit('kr0z.response', "You shout '" + params.toUpperCase() + "' as loud as you can. Still, nobody seems to care...");
                break;

            case "/quit":
                socket.disconnect();
                break;

            default:
                break;
        }
    }

    io.sockets.on('connection', function(socket) {
        socket.emit('news', {hello: 'world'});

        socket.on('my other event', function(data) {
           console.log(data);
        });

        socket.on('kr0z.command', function(data) {
            console.log("Command: " + data.command);
            console.log("+ Param: " + data.params);
            handleMsg(socket, data.command, data.params);
        })

        socket.on('disconnect', function() {
            console.log("Disconnect detected");
        });
    });
})();