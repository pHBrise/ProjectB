const express = require("express");
const cors = require("cors");
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const dbConnect = require("./app/database/database");
const app = express()

require('dotenv').config();
dbConnect();

const port = process.env.PORT || 4500
const authRoute = require("./app/routers/auth");
const userRoute = require("./app/routers/user");
const profileRoute = require("./app/routers/profile");
const productRoute = require("./app/routers/product");

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Passport setup
passport.use(
  new LocalStrategy((email, password, done) => {
    console.log(email)
    User.findOne({ email: email }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username.' });
      if (!bcrypt.compareSync(password, user.password))
        return done(null, false, { message: 'Incorrect password.' });
      return done(null, user);
    });
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});


app.get('/', (req, res) => {
  res.render(__dirname + '/app/view/index');
});

app.get('/home', (req, res) => {
  if (req.isAuthenticated()) {
    res.render(__dirname + '/app/view/home');
  } else {
    res.redirect('/');
  }
});

app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/profile", profileRoute);
app.use("/product", productRoute);