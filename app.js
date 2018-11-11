const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/database');

const app = express();

// Connect To Database
mongoose.connect(
  config.uri,
  config.options
);

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Connected to database ' + config.uri);
});

// On Error
mongoose.connection.on('error', err => {
  console.log('Database error ' + err);
});

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
const ingredients = require('./routes/ingredients');

app.use('/users', users);
app.use('/sizes', sizes);
app.use('/ingredients', ingredients);

// Start serve
app.listen(port, () => {
  console.log('server started on port: ' + port);
});
