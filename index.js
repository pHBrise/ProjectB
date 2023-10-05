const express = require("express");
const cors = require("cors");
const dbConnect = require("./app/database/database");
const app = express()

require('dotenv').config();
dbConnect();

const port = process.env.PORT || 4500
const userRoute = require("./app/routers/user");

app.get("/", (req, res) => {
  const secretKey = require("crypto").randomBytes(32).toString("hex");
  res.json({ message: "Hello from server!", secretKey });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})



app.use(express.json(), cors());
app.use("/user", userRoute);