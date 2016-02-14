var express = require('express');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var app = express();

// app.use(require('serve-static')(__dirname + '/../../public'));
app.use(express.static('static'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
    callbackURL: 'http://127.0.0.1:3000/auth/google/return',
    clientID: '1079494107459-m242b4357vefdnn8k0vmfa1u2rjge7m1.apps.googleusercontent.com',
    clientSecret: 'zMWW5F8wdHzHh7I6zcdb4k_4'
  },
  function(token, refreshToken, profile, done) {
    if (profile.emails[0].value.endsWith("@ucla.edu") || profile.emails[0].value.endsWith("@g.ucla.edu")) {
        done(null, {email: profile.emails[0].value});
    } else {{email: profile.emails[0].value}
        done(null, false);
    }    
  }
));
    app.get('/auth/google', passport.authenticate('google', { scope : ['email'] }));


app.get('/auth/google/return', 
  passport.authenticate('google', { failureRedirect: '/notucla.html' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/myProfile.html');
  });

app.get('/', isLoggedIn, function (req, res) {
    res.redirect("createProfile.html");
});

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});