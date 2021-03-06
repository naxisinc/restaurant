const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/database");

const app = express();

// Connect To Database
mongoose.connect(config.uri, config.options);

// On Connection
mongoose.connection.on("connected", () => {
  console.log("Connected to database " + config.uri);
});

// On Error
mongoose.connection.on("error", err => {
  console.log("Database error " + err);
});

// Port number
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(
  cors({
    allowedHeaders: ["token", "Content-Type", "Authorization"],
    exposedHeaders: ["token"]
  })
);

// Set Static Folder
app.use(express.static(path.join(__dirname, "client/dist")));

// Body Parse Middleware
app.use(bodyParser.json());

const users = require("./routes/users");
const sizes = require("./routes/sizes");
const categories = require("./routes/categories");
const ingredients = require("./routes/ingredients");
const admincomments = require("./routes/admin/comments");
const comments = require("./routes/comments");
const plates = require("./routes/plates");
const images = require("./routes/images");
const visitorscounter = require("./routes/visitorscounter");
const devicecounter = require("./routes/devicecounter");

app.use("/users", users);
app.use("/sizes", sizes);
app.use("/categories", categories);
app.use("/ingredients", ingredients);
app.use("/admin/comments", admincomments);
app.use("/comments", comments);
app.use("/plates", plates);
app.use("/images", images);
app.use("/visitorscounter", visitorscounter);
app.use("/devicecounter", devicecounter);

// Start serve
app.listen(port, () => {
  console.log("server started on port: " + port);
});
