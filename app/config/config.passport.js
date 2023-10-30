const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJwt = require("passport-jwt");
const JWTStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
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

const jwtFromRequest = (req) => {
    const token = req.header("Authorization");
    if (token) {
      const parts = token.split(' ');
      if (parts[0] === 'JWT') {
        return parts[1];
      }
    }
    return null;
  };


const opts = {}
opts.jwtFromRequest = jwtFromRequest;
opts.secretOrKey = process.env.SECRET_TOKEN;

passport.use(new JWTStrategy(opts, async (payload, done) => {
    // Implement JWT authentication logic
    console.log("payload")
    const user = await userModel.findOne({ _id: payload._id, secret_login: payload.secret_login })
    if (!user) {
        return done(null, false);
    }
    return done(null, user);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        done(err, user);
    });
});
