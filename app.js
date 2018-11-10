const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const config = require('./config/database');

const app = express();

// Connect To Database
const conn = mongoose.createConnection(config.uri, config.options);

// On Connection
conn.on('connected', () => {
  console.log('Connected to database ' + config.uri);
});

// On Error
conn.on('error', err => {
  console.log('Database error ' + err);
});

let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

// @route GET /files
// @desc Display all files in JSON
app.get('/files', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      return res.status(404).json({ err: 'No files exist' });
    }
    return res.json(files);
  });
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
