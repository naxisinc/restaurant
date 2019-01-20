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
const categories = require('./routes/categories');
const ingredients = require('./routes/ingredients');
const comments = require('./routes/comments');
const plates = require('./routes/plates');
const images = require('./routes/images');

app.use('/users', users);
app.use('/sizes', sizes);
app.use('/categories', categories);
app.use('/ingredients', ingredients);
app.use('/comments', comments);
app.use('/plates', plates);
app.use('/images', images);

// Start serve
app.listen(port, () => {
  console.log('server started on port: ' + port);
});
