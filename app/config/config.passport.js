const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJwt = require("passport-jwt")
const JWTStrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const bcrypt = require("bcryptjs");
const userModel = require("../models/User");


// Passport setup


passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async (email, password, done) => {
    // Implement local authentication logic
    await userModel.findOne({ email: email }, (err, user) => {
        if (err) return done(err);
        if (!user) return done(null, false, { message: 'Incorrect username.' });
        if (!bcrypt.compareSync(password, user.password))
            return done(null, false, { message: 'Incorrect password.' });
        return done(null, user);
    });
}));

passport.use(new JWTStrategy({
    secretOrKey: process.env.SECRET_TOKEN,
    jwtFromRequest: ExtractJWT.fromAuthHeader()
}, async (payload, done) => {
    // Implement JWT authentication logic
    const user = await userModel.findOne({ _id: payload._id, secret_login: payload.secret_login })
    if (user) {
      req.user = user;
      next();
    } else return res.status(401).json({ message: 'Invalid user' });
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
});
