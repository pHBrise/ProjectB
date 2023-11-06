const express = require("express");
const cors = require("cors");
const session = require('express-session');
const dbConnect = require("./app/database/database");

const app = express()

require('dotenv').config();
dbConnect();

const port = process.env.PORT || 4500
const authRoute = require("./app/routers/auth");
const viewRoute = require("./app/routers/view");
const userRoute = require("./app/routers/user");
const profileRoute = require("./app/routers/profile");
const productRoute = require("./app/routers/product");

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

app.use(express.json(), cors());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'secret', resave: true, saveUninitialized: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use("", viewRoute);
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/profile", profileRoute);
app.use("/product", productRoute);