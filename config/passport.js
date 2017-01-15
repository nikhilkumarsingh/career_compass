
var LocalStrategy    = require('passport-local').Strategy;

var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var fs = require('fs');
var User = require('../app/models/user.js');


var configAuth = require('./auth');
module.exports = function(passport) {


    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });


    passport.use('local-login', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
        },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();
        process.nextTick(function() {
            User.findOne({ 'email' :  email }, function(err, user) {
                if (err)
                    return done(err);
                if (!user)
                    return done(null, false, req.flash('loginMessage', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));

                else
                    return done(null, user);
            });
        });

    }));
    passport.use('local-signup', new LocalStrategy({

        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, email, password, done) {
        if (email)
            email = email.toLowerCase();
        process.nextTick(function() {
            console.log(req.user);
            if (!req.user) {
                User.findOne({ 'email' :  email }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {
                        return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                    } else {


                        var newUser            = new User();

                        newUser.email    = email;
                        newUser.password = newUser.generateHash(password);

                        newUser.save(function(err) {
                            if (err)
                                return done(err);

                            return done(null, newUser);
                        });
                    }

                });
            } else if ( !req.user.email ) {

                User.findOne({ 'local.email' :  email }, function(err, user) {
                    if (err)
                        return done(err);
                    
                    if (user) {
                        return done(null, false, req.flash('loginMessage', 'That email is already taken.'));

                    } else {
                        user = req.user;
                        user.email = email;
                        user.password = user.generateHash(password);
                        user.save(function (err) {
                            if (err)
                                return done(err);
                            
                            return done(null,user);
                        });
                    }
                });
            } else {

                return done(null, req.user);
            }

        });

    }));



    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,
        passReqToCallback : true

    },
    function(req, token, refreshToken, profile, done) {
        console.log(profile);
        process.nextTick(function() {


            if (!req.user) {

                User.findOne({ 'google.id' : profile.id }, function(err, user) {
                    if (err)
                        return done(err);

                    if (user) {


                        if (!user.google.token) {
                            user.google.token = token;
                            user.google.id = profile.id;
                            user.first_name  = profile.name.givenName;
                            user.last_name = profile.name.familyName;
                            user.email = (profile.emails[0].value || '').toLowerCase();
                            //user.google.photo = profile._json.image_url;
                            user.save(function(err) {
                                if (err)
                                    return done(err);
                                    
                                return done(null, user);
                            });
                        }

                        return done(null, user);
                    } else {
                        var newUser          = new User();

                        newUser.google.id    = profile.id;
                        newUser.google.token = token;
                        newUser.first_name  = profile.name.givenName;
                        newUser.last_name = profile.name.familyName;
                        newUser.email = (profile.emails[0].value || '').toLowerCase();
//                         newUser.google.photo = profile._json.image.url;


                        newUser.save(function(err) {
                            if (err)
                                return done(err);
                                
                            return done(null, newUser);
                        });
                    }
                });

            } else {

                var user               = req.user;

                user.google.id    = profile.id;
                user.google.token = token;
                user.first_name  = profile.name.givenName;
                user.last_name = profile.name.familyName;
                user.email = (profile.emails[0].value || '').toLowerCase();

                user.save(function(err) {
                    if (err)
                        return done(err);
                        
                    return done(null, user);
                });

            }

        });

    }));

};
