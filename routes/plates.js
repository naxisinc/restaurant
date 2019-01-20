const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Plate = require('../models/plates');
const Ingredient = require('../models/ingredients');
const SizePlate = require('../models/sizeplate');
const Size = require('../models/sizes');
const { authorized } = require('../middleware/authorized');
const { gfs, upload } = require('../middleware/filestorage');

// POST /plates
router.post('/', authorized, upload().single('file'), async (req, res) => {
  try {
    const newplate = new Plate({
      _ingredients: JSON.parse(req.body._ingredients),
      _category: req.body._category,
      img: req.file.filename,
      description: req.body.description
    });
    const plate = await newplate.save();

    let details = JSON.parse(req.body.details);
    for (let i = 0; i < details.length; i++) {
      details[i]._plate = plate._id;
      const item = new SizePlate(details[i]);
      await item.save();
    }
    res.status(200).send(plate);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /plates
router.get('/', async (req, res) => {
  try {
    const plates = await Plate.find().lean();
    for (let i = 0; i < plates.length; i++) {
      let ingredients = plates[i]._ingredients;
      for (let j = 0; j < ingredients.length; j++) {
        plates[i]._ingredients[j] = await Ingredient.findOne({
          _id: ingredients[j]
        });
      }
      let details = await SizePlate.find({ _plate: plates[i]._id }).lean();
      for (let k = 0; k < details.length; k++) {
        details[k]._size = await Size.findOne({ _id: details[k]._size });
      }
      plates[i].details = details;
    }
    res.status(200).send(plates);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /plates/id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const plate = await Plate.findById(id).lean();
    plate.size_details = await SizePlate.find({ _plate: id });
    if (!plate) return res.status(404).send();
    res.status(200).send(plate);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /plates/id
router.patch('/:id', authorized, upload().single('file'), async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const plate = {
      _ingredients: req.body._ingredients,
      description: req.body.description,
      category: req.body.category
    };
    if (req.file) {
      plate.img = req.file.id;
      const current = await Plate.findById(id);
      await gfs().remove({ _id: current.img, root: 'uploads' });
    }
    const updated = await Plate.findByIdAndUpdate(id, plate, {
      new: true
    });
    if (!updated) return res.status(404).send();
    res.status(200).send(updated);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /plates/id
router.delete('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const plate = await Plate.findByIdAndRemove(id);
    await gfs().remove({ _id: plate.img, root: 'uploads' });
    if (!plate) return res.status(404).send();
    res.status(200).send(plate);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
