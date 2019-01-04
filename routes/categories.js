const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Category = require('../models/categories');
const { authorized } = require('../middleware/authorized');

// POST /categories
router.post('/', authorized, async (req, res) => {
  try {
    const description = _.pick(req.body, ['description']);
    const category = new Category(description);
    await category.save();
    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.find().sort({ _id: -1 });
    res.status(200).send(categories);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /categories/id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const category = await Category.findById(id);
    if (!category) return res.status(404).send();
    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /categories/id
router.patch('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const description = req.body.description;
    const category = await Category.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    );
    if (!category) return res.status(404).send();
    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /categories/id
router.delete('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const category = await Category.findByIdAndRemove(id);
    if (!category) return res.status(404).send();
    res.status(200).send(category);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
