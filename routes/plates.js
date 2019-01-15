const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Plate = require('../models/plates');
const SizePlate = require('../models/sizeplate');
const { authorized } = require('../middleware/authorized');
const { gfs, upload } = require('../middleware/filestorage');

// POST /plates
router.post('/', authorized, upload().single('file'), async (req, res) => {
  try {
    const newplate = new Plate({
      // _ingredients: [
      //   '5bf03ec2f9b32605502f7b78',
      //   '5bf03f07f9b32605502f7b7b',
      //   '5bf03f16f9b32605502f7b7e'
      // ],
      _ingredients: req.body._ingredients,
      img: req.file.id,
      description: req.body.description,
      category: req.body.category
    });
    const plate = await newplate.save();

    const size_details = [
      {
        _size: '5be473a0b24aee4178bf96c4', //kids
        _plate: plate._id,
        price: '9.99',
        calories: '50cal.',
        totalfat: '4g',
        totalcarbs: '6g'
      },
      {
        _size: '5be473cab24aee4178bf96c5', //small
        _plate: plate._id,
        price: '12.99',
        calories: '150cal.',
        totalfat: '6g',
        totalcarbs: '8g'
      },
      {
        _size: '5be473d9b24aee4178bf96c6', //medium
        _plate: plate._id,
        price: '14.99',
        calories: '200cal.',
        totalfat: '8g',
        totalcarbs: '10g'
      },
      {
        _size: '5be473e1b24aee4178bf96c7', //large
        _plate: plate._id,
        price: '16.99',
        calories: '250cal.',
        totalfat: '10g',
        totalcarbs: '12g'
      }
    ];

    for (let i = 0; i < size_details.length; i++) {
      const element = size_details[i];
      const item = new SizePlate(element);
      await item.save();
    }

    res.status(200).send();
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
