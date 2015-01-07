var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function (passport) {
    
    /* GET  page. */
    router.get('/', function (req, res) {
        res.render('index', { year: new Date().getFullYear(), message: req.flash('message'), isAuth: isAuthenticated});
    });
    
    /* GET login page. */
    router.get('/login', function (req, res) {
        res.render('login', { message: req.flash('message') });
    });

    /* GET about page. */
    router.get('/about', function (req, res) {
        res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page.', isAuth: isAuthenticated });
   });
    
    /* GET contact page. */
    router.get('/contact', function (req, res) {
        res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page.' });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash : true
    }));
    
    /* GET Registration Page */
    router.get('/signup', function (req, res) {
        res.render('register', { message: req.flash('message') });
    });
    
    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true
    }));
    
    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user });
    });
    
    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.logout();
        res.redirect('/');
        req.isAuthenticated = false;
      //isAuthenticated = false;
    });
    
    return router;
}
