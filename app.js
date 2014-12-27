
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var arDrone = require('ar-drone');
var client = arDrone.createClient();
var keypress = require('keypress');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}


// make `process.stdin` begin emitting "keypress" events
keypress(process.stdin);
// listen for the "keypress" event
keypress(process.stdin);
if (process.stdin.setRawMode)
    process.stdin.setRawMode(true);
else
    require('tty').setRawMode(true);
process.stdin.on('keypress', function (c, key) {
    console.log(0, c, key);
  if (key && key.ctrl && key.name == 'c') {
        process.stdin.pause();
  }
});
process.stdin.on('mousepress', function (mouse) {
    console.log(mouse);
});
keypress.enableMouse(process.stdout);
process.on('exit', function () {
    //disable mouse on exit, so that the state is back to normal
    //for the terminal.
    keypress.disableMouse(process.stdout);
});
process.stdin.resume();
app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);

app.get('/takeoff', function (req, res) {
    client.takeoff();
});

app.get('/land', function (req, res) {
 //   res.send("land");
    client.stop();
    client.land();

});

app.get('/spinleft', function (req, res) {
 // res.send("spinleft");
    client.counterClockwise(0.5);
});

app.get('/spinright', function (req, res) {
  //  res.send("spinright");
    client.clockwise(0.5);
});

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
