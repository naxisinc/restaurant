const express = require('express');
const router = express.Router();
const { gfs } = require('../middleware/filestorage');

// @route GET /image/:filename
// @desc Display Image
router.get('/:filename', (req, res) => {
  gfs().files.findOne({ filename: req.params.filename }, (err, file) => {
    // Check if file
    if (!file || file.length === 0) return res.status(404).send();

    // Check if image
    if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
      // Reasd output to browser
      const readstream = gfs().createReadStream(file.filename);
      readstream.pipe(res);
    } else {
      res.status(404).send();
    }
  });
});

module.exports = router;
