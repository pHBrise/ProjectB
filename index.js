const express = require("express");
const cors = require("cors");
const dbConnect = require("./src/database/database");
const app = express()

require('dotenv').config();
dbConnect();

const port = process.env.PORT || 4500
const userRoute = require("./src/routers/userRouter");

app.get("/", (req, res) => res.send("Main page")); 

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})



app.use(express.json(), cors());
app.use("/user", userRoute);