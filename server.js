const express = require("express");
const bodyParser = require("body-parser");
var cors = require('cors');
const redis = require('redis');

const app = express();
const client = redis.createClient();
client.on('error', (err) => {
    console.log("Error " + err)
});
app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to ToDo Application" });
});

require("./app/routes/todo.routes.js")(app);

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
