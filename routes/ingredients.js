const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Ingredient = require('../models/ingredients');
const { authorized } = require('../middleware/authorized');
const { gfs, upload } = require('../middleware/filestorage');

// POST /ingredients
router.post('/', authorized, upload().single('file'), async (req, res) => {
  try {
    const newingredient = new Ingredient({
      description: req.body.description,
      img: req.file.id
    });
    const ingredient = await newingredient.save();
    res.status(200).send(ingredient);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /ingredients
router.get('/', async (req, res) => {
  try {
    const ingredients = await Ingredient.find().lean();
    let ingWithImg = ingredients.map(obj => {
      obj.img = 'No picture';
      return obj;
    });
    // console.log(ingWithImg);
    // res.status(200).send(ingredients);
    res.status(200).send(ingWithImg);
  } catch (e) {
    res.status(400).send(e);
  }
});

function streaming() {
  // return gfs().files.findOne({ _id: obj.img }, (err, file) => {
  //   // Check if file
  //   if (!file || file.length === 0) {
  //     obj.img = 'No picture';
  //     return obj;
  //   }
  //   // Check if image
  //   if (
  //     file.contentType === 'image/jpeg' ||
  //     file.contentType === 'image/png'
  //   ) {
  //     const readstream = gfs().createReadStream(file.filename);
  //     readstream.pipe(process.stdout);
  //     obj.img = 'rere';
  //     return obj;
  //   } else {
  //     obj.img = 'No picture';
  //     return obj;
  //   }
  // });
  // const file = await gfs().files.findOne({ _id: obj.img });
  // // Check if file
  // if (!file || file.length === 0) {
  //   obj.img = 'No picture';
  //   return obj;
  // }
  // // Check if image
  // if (
  //   file.contentType === 'image/jpeg' ||
  //   file.contentType === 'image/png'
  // ) {
  //   console.log('entreee');
  //   obj.img = 'rere';
  //   return obj;
  //   // const readstream = gfs().createReadStream(file.filename);
  //   // readstream.pipe(process.stdout);
  // } else {
  //   obj.img = 'No picture';
  //   return obj;
  // }
}

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
router.patch('/:id', authorized, upload().single('file'), async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const ingredient = {
      description: req.body.description
    };
    if (req.file) {
      ingredient.img = req.file.id;
      const current = await Ingredient.findById(id);
      await gfs().remove({ _id: current.img, root: 'uploads' });
    }
    const updated = await Ingredient.findByIdAndUpdate(id, ingredient, {
      new: true
    });
    if (!updated) return res.status(404).send();
    res.status(200).send(updated);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /ingredients/id
router.delete('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const ingredient = await Ingredient.findByIdAndRemove(id);
    await gfs().remove({ _id: ingredient.img, root: 'uploads' });
    if (!ingredient) return res.status(404).send();
    res.status(200).send(ingredient);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
