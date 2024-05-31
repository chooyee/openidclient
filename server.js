const express = require('express');
const session = require('express-session');
const passport = require('passport');
const context = require('./context/context.service');
const OpenIDConnectStrategy = require('passport-openidconnect').Strategy;

const app = express();

// Configuration for the OpenID Connect strategy
const oidcConfig = {
    issuer: 'https://login.microsoftonline.com/6e6b24ca-413a-41e4-b28b-3d7ffae2de5a/v2.0', // e.g., https://accounts.google.com
    authorizationURL: 'https://login.microsoftonline.com/6e6b24ca-413a-41e4-b28b-3d7ffae2de5a/oauth2/v2.0/authorize', // e.g., https://accounts.google.com/o/oauth2/v2/auth
    tokenURL: 'https://login.microsoftonline.com/6e6b24ca-413a-41e4-b28b-3d7ffae2de5a/oauth2/v2.0/token', // e.g., https://oauth2.googleapis.com/token
    userInfoURL: 'https://graph.microsoft.com/oidc/userinfo', // e.g., https://openidconnect.googleapis.com/v1/userinfo
    clientID: context.ClientId,
    clientSecret: context.ClientSecret,
    callbackURL: context.OICDCallbackURL,
    scope: 'openid profile email',
};

// Configure Passport to use OpenID Connect
passport.use(new OpenIDConnectStrategy(oidcConfig,
    (issuer, profile, context, idToken, accessToken, refreshToken, done) => {
        // In a real application, you would lookup the user in your database
        // and verify if the user exists or not
        return done(null, profile);
    }
));

// Serialize and deserialize user for session management
passport.serializeUser((user, done) => {
    console.log('serializeUser');
    console.log(typeof(user));
    console.log(user);
    done(null, user);
});

passport.deserializeUser((obj, done) => {
    console.log('deserializeUser');
    console.log(typeof(obj));
    console.log(obj);
    done(null, obj);
});



// Express middleware setup
app.use(session({ 
    secret: 'Gone to the Unseen',     
    resave: false, 
    saveUninitialized: true 
}));
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.get('/', (req, res) => {
    res.send('<a href="/auth">Login with OpenID Connect</a>');
});

app.get('/auth',
    passport.authenticate('openidconnect'));

app.get('/auth/callback',
    passport.authenticate('openidconnect', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/profile');

    });

app.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    }
    res.json(req.user);
});

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

// Start the server
app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
