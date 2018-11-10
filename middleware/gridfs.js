const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs = async (req, res, next) => {
  try {
    let gfs;
    mongoose.connection.once('open', () => {
      gfs = Grid(mongoose.connection.db, mongoose.mongo);
      gfs.collection('uploads');
    });
    req.gfs = gfs;
    next();
  } catch (e) {
    res.status(500).send();
  }
};

module.exports = { gfs };
