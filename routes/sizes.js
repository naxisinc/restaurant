const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Size = require('../models/sizes');
const { authenticate } = require('../middleware/authenticate');

// POST /sizes
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.rol !== 1) {
      return res.status(401).send();
    }
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
router.patch('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.rol !== 1) {
      return res.status(401).send();
    }
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

router.delete('/:id', authenticate, async (req, res) => {
  try {
    if (req.user.rol !== 1) {
      return res.status(401).send();
    }
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const size = await Size.findByIdAndRemove(id);
    res.status(200).send(size);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
