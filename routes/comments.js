const express = require('express');
const router = express.Router();
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const Comment = require('../models/comments');
const Plate = require('../models/plates');
const { authenticate } = require('../middleware/authenticate');

// POST /comments
router.post('/', authenticate, async (req, res) => {
  try {
    const plateId = req.body._plate;
    const comment_rate = req.body.rate;
    const comment = new Comment({
      _creator: req.user._id,
      _plate: plateId,
      comment: req.body.comment,
      rate: comment_rate
    });
    await comment.save();
    // Update the plate average rate
    // const plate_rate = await Plate.findOne(
    //   { _id: plateId },
    //   { averagerate: 1 }
    // );
    // const avg = (plate_rate.averagerate + comment_rate) / 2;
    // await Plate.findOneAndUpdate(
    //   { _id: plateId },
    //   { $set: { averagerate: avg } }
    // );
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).send(comments);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /comments/id
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const comment = await Comment.findById(id);
    if (!comment) return res.status(404).send();
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /comments/id
router.patch('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const body = _.pick(req.body, ['comment', 'rate']);
    const comment = await Comment.findOneAndUpdate(
      { _id: id, _creator: req.user._id },
      { $set: body },
      { new: true }
    );
    if (!comment) return res.status(404).send();
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /comments/id
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const comment = await Comment.findOneAndRemove({
      _id: id,
      _creator: req.user._id
    });
    if (!comment) return res.status(404).send();
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
