const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
const crypto = require('crypto');
// const mongoose = require('mongoose');
const config = require('./database');

// function gfs() {
//   let gfs;
//   mongoose.connection.once('open', () => {
//     gfs = Grid(mongoose.connection.db, mongoose.mongo);
//     gfs.collection('uploads');
//   });
//   return gfs;
// }

// function aaa() {
//   let gfs = 'Hello World';
//   return gfs;
// }

function upload() {
  const storage = new GridFsStorage({
    url: config.database,
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

module.exports = { upload };
