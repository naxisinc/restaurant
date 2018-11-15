const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Size = require('../models/sizes');
const { authorized } = require('../middleware/authorized');

// POST /sizes
router.post('/', authorized, async (req, res) => {
  try {
    const description = _.pick(req.body, ['description']);
    const size = new Size(description);
    await size.save();
    res.status(200).send(size);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /sizes
router.get('/', async (req, res) => {
  try {
    const sizes = await Size.find();
    res.status(200).send(sizes);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /sizes/id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const size = await Size.findById(id);
    if (!size) return res.status(404).send();
    res.status(200).send(size);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /sizes/id
router.patch('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const description = req.body.description;
    const size = await Size.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    if (!size) return res.status(404).send();
    res.status(200).send(size);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /sizes/id
router.delete('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const size = await Size.findByIdAndRemove(id);
    if (!size) return res.status(404).send();
    res.status(200).send(size);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
