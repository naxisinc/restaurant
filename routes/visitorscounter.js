const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const VisitorsCounter = require("../models/visitorscounter");
const { authorized } = require("../middleware/authorized");

// POST /visitorscounter
router.post("/", authorized, async (req, res) => {
  try {
    const counterNew = _.pick(req.body, ["counterId"]);
    const newCounter = new VisitorsCounter(counterNew);
    await newCounter.save();
    res.status(200).send(newCounter);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /visitorscounter
router.get("/", async (req, res) => {
  try {
    const counters = await VisitorsCounter.find().sort({ _id: -1 });
    res.status(200).send(counters);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /visitorscounter/id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const counter = await VisitorsCounter.findById(id);
    if (!counter) return res.status(404).send();
    res.status(200).send(counter);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /visitorscounter/id
router.patch("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const counterUpd = await VisitorsCounter.findByIdAndUpdate(
      id,
      { $inc: { counter: 1 } },
      { new: true }
    );
    if (!counterUpd) return res.status(404).send();
    res.status(200).send(counterUpd);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /visitorscounter/id
router.delete("/:id", authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const counter = await VisitorsCounter.findByIdAndRemove(id);
    if (!counter) return res.status(404).send();
    res.status(200).send(counter);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
