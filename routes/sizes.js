const express = require('express');
const router = express.Router();
const _ = require('lodash');

const Size = require('../models/sizes');
const { authenticate } = require('../middleware/authenticate');

// POST /sizes
router.post('/', authenticate, async (req, res) => {
  try {
    if (req.user.rol !== 1) {
      return res.status(401).send();
    }
    const body = _.pick(req.body, ['description']);
    const size = new Size(body);
    await size.save();
    res.status(200).send(size);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
