const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Plate = require('../models/plates');
const { authorized } = require('../middleware/authorized');
const { gfs, upload } = require('../middleware/filestorage');

// POST /plates
router.post('/', authorized, upload().single('file'), async (req, res) => {
  try {
    const plate = new Plate({
      _ingredients: req.body._ingredients,
      img: req.file.id,
      description: req.body.description,
      category: req.body.category
    });
    await plate.save();
    res.status(200).send(plate);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /plates
router.get('/', async (req, res) => {
  try {
    const plates = await Plate.find();
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
    const plate = await Plate.findById(id);
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
      description: req.body.description
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
