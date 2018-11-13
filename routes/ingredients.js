const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Ingredient = require('../models/ingredients');
const { authorized } = require('../middleware/authorized');
const { gfs, upload } = require('../config/filestorage');

// @route POST /upload
// @desc Uploads file to DB
router.post('/upload', authorized, upload().single('file'), (req, res) => {
  res.json({ file: req.file });
  // res.redirect('/');
});

// @route GET /files
// @desc Display all files in JSON
router.get('/files', async (req, res) => {
  try {
    gfs()
      .files.find()
      .toArray((err, files) => {
        // Check if files
        if (!files || files.length === 0) {
          return res.status(404).json({ err: 'No files exist' });
        }
        return res.json(files);
      });
  } catch (e) {
    res.status(400).send();
  }
});

// POST /ingredients
router.post('/', authorized, upload().single('file'), async (req, res) => {
  try {
    const ingredient = new Ingredient({
      description: req.body.description,
      _plates: req.body._idplate,
      img: req.file.id
    });
    await ingredient.save();
    res.status(200).send(ingredient);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find();
    res.status(200).send(ingredients);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /ingredients/id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const ingredient = await Ingredient.findById(id);
    if (!ingredient) return res.status(404).send();
    // gfs().files.findOne({ _id: ingredient.img }, (err, file) => {
    //   // Check if file
    //   if (!file || file.length === 0) {
    //     return res.status(404).send();
    //   }
    //   let ftype = file.contentType;
    //   if (ftype === 'image/jpeg' || ftype === 'image/png') {
    //     // Read output to browser
    //     const readstream = gfs().createReadStream(file._id);
    //     readstream.pipe(res);
    //   } else {
    //     res.status(404).send();
    //   }
    // });
    res.status(200).send(ingredient);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /ingredients/id
router.patch('/:id', authorized, async (req, res) => {
  try {
    const ingredient = await findById(req.params.id);
    console.log(ingredient);
    if (ingredient.isModified('description')) {
      console.log('Was modified');
    } else {
      console.log('Was NOT modified');
    }
    // const id = req.params.id;
    // if (!ObjectID.isValid(id)) return res.status(404).send();
    // // const description = req.body.description;
    // const ingredient = {};
    // const ingredient = await Ingredient.findByIdAndUpdate(
    //   id,
    //   { description },
    //   { new: true }
    // );
    // if (!ingredient) return res.status(404).send();
    // res.status(200).send(ingredient);
    res.send();
  } catch (e) {
    res.status(400).send(e);
  }
});

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
