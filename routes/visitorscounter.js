const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const VisitorsCounter = require("../models/visitorscounter");
const { authorized } = require("../middleware/authorized");

// POST /visitorscounter
// router.post("/", authorized, async (req, res) => {
//   try {
//     const route = _.pick(req.body, ["name"]);
//     const newRoute = new VisitorsCounter(route);
//     await newRoute.save();
//     res.status(200).send(newRoute);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// POST /visitorscounter
router.post("/", async (req, res) => {
  try {
    const route = req.body.route;
    const result = await VisitorsCounter.findOne({ name: route });
    if (result) {
      // Incrementa el contador de la ruta en cuestion
      let inc = await VisitorsCounter.findByIdAndUpdate(
        { _id: result._id },
        { $inc: { value: 1 } },
        { new: true }
      );
      res.status(200).send(inc);
    } else {
      // Se dispara cuando la ruta es visitada por primera vez
      const newRoute = new VisitorsCounter({ name: route });
      await newRoute.save();
      res.status(201).send();
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /visitorscounter
router.get("/", async (req, res) => {
  try {
    const counters = await VisitorsCounter.find();
    res.status(200).send(counters);
  } catch (e) {
    res.status(400).send(e);
  }
});

// // GET /visitorscounter/id
// router.get("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const counter = await VisitorsCounter.findById(id);
//     if (!counter) return res.status(404).send();
//     res.status(200).send(counter);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// PATCH /visitorscounter/id
// router.patch("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const counterUpd = await VisitorsCounter.findByIdAndUpdate(
//       id,
//       { $inc: { value: 1 } },
//       { new: true }
//     );
//     if (!counterUpd) return res.status(404).send();
//     res.status(200).send(counterUpd);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// DELETE /visitorscounter/id
// router.delete("/:id", authorized, async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const counter = await VisitorsCounter.findByIdAndRemove(id);
//     if (!counter) return res.status(404).send();
//     res.status(200).send(counter);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

module.exports = router;
