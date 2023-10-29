const express = require("express");
const cors = require("cors");
const session = require('express-session');
const dbConnect = require("./app/database/database");
const configPassport = require("./app/config/config.passport");
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
app.use(configPassport.passport.initialize());
app.use(configPassport.passport.session());
app.use(express.static('public'));
app.set('view engine', 'ejs');

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