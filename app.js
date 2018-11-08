const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');

// Connect To Database
const uri = config.database;
const options = {
  useNewUrlParser: true,
  useCreateIndex: true
};
mongoose.connect(
  uri,
  options
);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.database);
});

// On Error
mongoose.connection.on('error', err => {
  console.log('Database error ' + err);
});

const app = express();

// Port number
const port = process.env.PORT || 3000;

// CORS Middleware
app.use(
  cors({
    allowedHeaders: ['x-auth', 'Content-Type', 'Authorization'],
    exposedHeaders: ['x-auth']
  })
);

// Set Static Folder
app.use(express.static(path.join(__dirname, 'client/dist')));

// Body Parse Middleware
app.use(bodyParser.json());

const users = require('./routes/users');
const sizes = require('./routes/sizes');

app.use('/users', users);
app.use('/sizes', sizes);

// Start serve
app.listen(port, () => {
  console.log('server started on port: ' + port);
});
