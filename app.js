const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const config = require('./config/database');

const app = express();

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

let gfs;
mongoose.connection.once('open', () => {
  gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
});

const storage = new GridFsStorage({
  url: uri,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// @route POST /upload
// @desc Uploads file to DB
app.post('/upload', upload.single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
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

// @route GET /file/:id
// @desc Display just one file in JSON
app.get('/file', (req, res) => {
  gfs.files.findOne().toArray((err, files) => {
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
