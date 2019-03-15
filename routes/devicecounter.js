const express = require("express");
const router = express.Router();
const _ = require("lodash");

const DeviceCounter = require("../models/devicecounter");

// POST /devicecounter
router.post("/", async (req, res) => {
  try {
    const type = _.pick(req.body, ["type"]);
    const newConn = new DeviceCounter(type);
    await newConn.save();
    res.status(200).send(newConn);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /devicecounter
router.get("/", async (req, res) => {
  try {
    const counters = await DeviceCounter.find().sort({ _id: -1 });
    res.status(200).send(counters);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
