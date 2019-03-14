const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const VisitorsCounter = require("../models/visitorscounter");
const { authorized } = require("../middleware/authorized");

// POST /visitorscounter
router.post("/", authorized, async (req, res) => {
  try {
    const route = _.pick(req.body, ["route"]);
    const newRoute = new VisitorsCounter(route);
    await newRoute.save();
    res.status(200).send(newRoute);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /visitorscounter
router.get("/", async (req, res) => {
  try {
    const routes = await VisitorsCounter.find().sort({ _id: -1 });
    res.status(200).send(routes);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /visitorscounter/id
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const route = await VisitorsCounter.findById(id);
    if (!route) return res.status(404).send();
    res.status(200).send(route);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /visitorscounter/id
router.patch("/:id", authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const routeUpd = await VisitorsCounter.findByIdAndUpdate(
      id,
      { $inc: { counter: 1 } },
      { new: true }
    );
    if (!routeUpd) return res.status(404).send();
    res.status(200).send(routeUpd);
  } catch (e) {
    res.status(400).send(e);
  }
});

// DELETE /visitorscounter/id
router.delete("/:id", authorized, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const route = await VisitorsCounter.findByIdAndRemove(id);
    if (!route) return res.status(404).send();
    res.status(200).send(route);
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
