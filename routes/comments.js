const express = require('express');
const router = express.Router();
const { ObjectID } = require('mongodb');

const Comment = require('../models/comments');
const { authenticate } = require('../middleware/authenticate');

// POST /comments
router.post('/', authorized, upload().single('file'), async (req, res) => {
  try {
    const comment = new Comment({
      description: req.body.description,
      img: req.file.id
    });
    await comment.save();
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
router.patch('/:id', authorized, upload().single('file'), async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const comment = {
      description: req.body.description
    };
    if (req.file) {
      comment.img = req.file.id;
      const current = await Comment.findById(id);
      await gfs().remove({ _id: current.img, root: 'uploads' });
    }
    const ingredientUpdated = await Comment.findByIdAndUpdate(id, comment, {
      new: true
    });
    res.status(200).send(ingredientUpdated);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /comments/id
router.delete('/:id', authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const comment = await Comment.findByIdAndRemove(id);
    await gfs().remove({ _id: comment.img, root: 'uploads' });
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
