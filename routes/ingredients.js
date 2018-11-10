const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');
const mongoose = require('mongoose');
var Grid = require('gridfs-stream');

// const config = require('../config/database');
const Ingredient = require('../models/ingredients');
const { upload } = require('../config/filestorage');
const { authenticate } = require('../middleware/authenticate');

// @route POST /upload
// @desc Uploads file to DB
router.post('/upload', upload().single('file'), (req, res) => {
  // res.json({ file: req.file });
  res.redirect('/');
});

// @route GET /files
// @desc Display all files in JSON
router.get('/files', async (req, res) => {
  try {
    console.log(gfs());
    res.send();
    // const gfs = app.gfs;
    // gfs.files.find().toArray((err, files) => {
    //   if (!files || files.length === 0) {
    //     return res.status(404).json({ err: 'No files exist' });
    //   }
    //   return res.json(files);
    // });
  } catch (e) {
    res.status(400).send(e);
  }
});

// // @route GET /files/:filename
// // @desc Display single file object
// app.get('/files/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if files
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: 'No file exists' });
//     }
//     res.json({ file });
//   });
// });

// // @route GET /image/:filename
// // @desc Display Image
// app.get('/image/:filename', (req, res) => {
//   gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
//     // Check if files
//     if (!file || file.length === 0) {
//       return res.status(404).json({ err: 'No file exists' });
//     }
//     if (file.contentType === 'image/png' || file.contentType === 'image/jpeg') {
//       const readstream = gfs.createReadStream(file.filename);
//       readstream.pipe(res);
//     } else {
//       res.json({ err: 'No an image' });
//     }
//   });
// });

// // POST /ingredients
// router.post('/', authenticate, async (req, res) => {
//   try {
//     if (req.user.rol !== 1) {
//       return res.status(401).send();
//     }
//     const description = _.pick(req.body, ['description']);
//     const ingredient = new Ingredient(description);
//     await ingredient.save();
//     res.status(200).send(ingredient);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// // GET /ingredients
// router.get('/', async (req, res) => {
//   try {
//     const ingredients = await Ingredient.find();
//     res.status(200).send(ingredients);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// // GET /ingredients/id
// router.get('/:id', async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const ingredient = await Ingredient.findById(id);
//     if (!ingredient) return res.status(404).send();
//     res.status(200).send(ingredient);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// // PATCH /ingredients/id
// router.patch('/:id', authenticate, async (req, res) => {
//   try {
//     if (req.user.rol !== 1) {
//       return res.status(401).send();
//     }
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const description = req.body.description;
//     const ingredient = await Ingredient.findByIdAndUpdate(
//       id,
//       { description },
//       { new: true }
//     );
//     if (!ingredient) return res.status(404).send();
//     res.status(200).send(ingredient);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// // DELETE /ingredients/id
// router.delete('/:id', authenticate, async (req, res) => {
//   try {
//     if (req.user.rol !== 1) {
//       return res.status(401).send();
//     }
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const ingredient = await Ingredient.findByIdAndRemove(id);
//     res.status(200).send(ingredient);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

module.exports = router;
