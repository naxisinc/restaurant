const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Ingredient = require('../models/ingredients');
const { authorized } = require('../middleware/authorized');
const { gfs, upload } = require('../middleware/filestorage');

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
    res.status(200).send(ingredient);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /ingredients/id
router.patch('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    // const ingredient = await Ingredient.findById(req.params.id);
    console.log(req.body);
    // console.log(ingredient);
    // if (ingredient.isModified('description')) {
    //   console.log('Was modified');
    // } else {
    //   console.log('Was NOT modified');
    // }
    res.send(req.body);
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
