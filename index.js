const express = require("express");
const cors = require("cors");
const dbConnect = require("./app/database/database");
const app = express()

require('dotenv').config();
dbConnect();

const port = process.env.PORT || 4500
const authRoute = require("./app/routers/auth");
const userRoute = require("./app/routers/user");
const profileRoute = require("./app/routers/profile");
const fs = require('fs');

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})


app.get('/uploads/:image', (req, res) => {
  const imagePath = req.params.image;
  
  const imageBuffer = fs.readFileSync(`uploads/${imagePath}`);
  console.log(imageBuffer);
  res.setHeader('Content-Type', 'image/jpeg');
  res.send(imageBuffer);
});


app.use(express.json(), cors());
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/profile", profileRoute);