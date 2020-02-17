const express = require('express')
const path = require('path')
var port = process.env.PORT || 5005;
let app = express()
let server = require('http').createServer(app);
app.use(express.static(__dirname + '/'));

//////////////// ROUTES //////////////
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, 'random.html'));
});

server.listen(port);
