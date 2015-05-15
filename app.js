var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var arDrone = require('ar-drone');
var client = arDrone.createClient();
var keypress = require('keypress');
var morgan = require('morgan');
var favicon = require('static-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//app.use(morgan('combined'));
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(favicon());
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(express.methodOverride());
app.use(cookieParser());
//app.use(app.router);
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to DB
var dbConfig = require('./models/db');
var mongoose = require('mongoose');
mongoose.connect(dbConfig.url);
var conn = mongoose.connection;

conn.on('error', console.error.bind(console, 'connection error:'));

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({ secret: 'mySecretKey' }));
app.use(passport.initialize());
app.use(passport.session());
// Using the flash middleware provided by connect-flash to store messages in session
// and displaying in templates
var flash = require('connect-flash');
app.use(flash());
// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

// development only
//if ('development' === app.get('env')) {app.use(express.errorHandler());}
////app.get('/', routes.index);
//app.get('/about', routes.about);
//app.get('/contact', routes.contact);

app.get('/takeoff', function (req, res) {
       //res.send("takeoff");
    client.takeoff();
});

app.get('/land', function (req, res) {
   
    client.stop();
    client.land();
  return;
 res.send("land");
});

app.get('/spinleft', function (req, res) {
  //res.send("spinleft");
    client.counterClockwise(0.5);
});

app.get('/spinright', function (req, res) {
    //res.send("spinright");
    client.clockwise(0.5);
});

app.get('/moveleft', function (req, res) {
    
    //res.send("moveleft");
});
app.get('/moveright', function (req, res) {
    //res.send("moveright");
});
app.get('/moveup', function (req, res) {
    //res.send("moveup");
});
app.get('/movedown', function (req, res) {
    //res.send("movedown");
});



///// catch 404 and forward to error handler
//app.use(function (req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function (err, req, res, next) {
//        res.status(err.status || 500);
//        res.render('error', {
//            message: err.message,
//            error: err
//        });
//    });
//}

//setInterval(function () {
//    //console.log('test');
//    require('dns').resolve('www.google.com', function (err) {
//        if (err)
//            console.log('no connection');
//        else
//            console.log('connected');
//});

//}, 1 * 2 * 1000);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
