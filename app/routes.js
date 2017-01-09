var express = require('express');
var Attributes = require('./../helper_scripts/survey.json');
var User       = require('../app/models/user');
module.exports = function(app, passport) {

    app.post('/complete', function (req, res) {

        User.findOne({'email' : req.user.email}, function (err, user) {

            user.age = req.body.Age;
            user.address = req.body.Address;
            user.first_name = req.body.first_name;
            user.last_name = req.body.last_name;
            user.complete = true;
            user.save(function (err) {

                res.redirect('/profile');
                res.send({});


            });


        })


    });


    app.use('/survey', express.static('public_html/survey'));
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });
    app.get('/connect/local', function(req, res) {
        console.log(req.user);
        res.render('connect-local.ejs', { user : req.user });
    });

    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    app.get('/signup', function(req, res) {
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });
    app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
    app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/connect-local',
            failureRedirect : '/login',
            failureFlash : true
    }));

        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/connect/local',
            failureRedirect : '/signup',
            failureFlash : true
        }));
        app.get('/connect/google', passport.authorize('google', { scope : ['profile', 'email'] }));

        app.get('/connect/google/callback',
            passport.authorize('google', {
                successRedirect : '/profile',
                failureRedirect : '/'
            }));
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/profile',
            failureRedirect : '/'
        }));


    app.post('/fetchSurvey', function (req, res) {

        res.send({survey : Attributes});

    });


};

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
