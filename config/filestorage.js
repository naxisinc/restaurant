const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Grid = require('gridfs-stream');
const config = require('./database');

function gfs() {
  let gfs = Grid(mongoose.connection.db, mongoose.mongo);
  gfs.collection('uploads');
  return gfs;
}

function upload() {
  const storage = new GridFsStorage({
    url: config.uri,
    file: (req, file) => {
      return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
          if (err) {
            return reject(err);
          }
          const filename =
            buf.toString('hex') + path.extname(file.originalname);
          const fileInfo = {
            filename: filename,
            bucketName: 'uploads'
          };
          resolve(fileInfo);
        });
      });
    }
  });
  return multer({ storage });
}

module.exports = { gfs, upload };
