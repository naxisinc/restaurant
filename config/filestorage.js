const path = require('path');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
// const Grid = require('gridfs-stream');
const crypto = require('crypto');
// const mongoose = require('mongoose');
const config = require('./database');

// const gfs = async () => {
//   try {
//     let res;
//     let gfs;

//     var conn = mongoose.createConnection(config.uri, config.options);
//     conn.once('open', async () => {
//       gfs = Grid(conn.db, mongoose.mongo);
//     });

//     res = gfs.files.find().toArray();
//     console.log(res);
//     return res;
//   } catch (e) {
//     return 10;
//   }
// };

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

module.exports = { upload };
