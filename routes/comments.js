const express = require("express");
const router = express.Router();
const _ = require("lodash");
const { ObjectID } = require("mongodb");

const Comment = require("../models/comments");
const Plate = require("../models/plates");
const User = require("../models/user");
const { authenticate } = require("../middleware/authenticate");

// POST /comments
router.post("/", authenticate, async (req, res) => {
  try {
    const plateId = req.body._plate;
    const comment_rate = req.body.rate;
    const comment = new Comment({
      _creator: req.user._id,
      _plate: plateId,
      headline: req.body.headline,
      comment: req.body.comment,
      rate: comment_rate
    });
    await comment.save();
    await updatingPlateAvg(plateId, parseInt(comment_rate));
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

// GET /comments
router.get("/", async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).send(comments);
  } catch (e) {
    res.status(400).send(e);
  }
});

// // GET /comments/id
// // @desc Get comments by id
// router.get("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     if (!ObjectID.isValid(id)) return res.status(404).send();
//     const comment = await Comment.findById(id);
//     if (!comment) return res.status(404).send();
//     res.status(200).send(comment);
//   } catch (e) {
//     res.status(400).send(e);
//   }
// });

// GET /comments/_plate
// @desc Get comments by plateId
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    const comments = await Comment.find({ _plate: id }).lean();

    // Getting the user name from Users
    for (let i = 0; i < comments.length; i++) {
      comments[i]._creator = await User.findById(comments[i]._creator);
    }

    if (!comments) return res.status(404).send();
    res.status(200).send(comments);
  } catch (e) {
    res.status(400).send(e);
  }
});

// PATCH /comments/id
router.patch("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();

    let rol = req.user.rol;
    let query =
      req.user.rol === 1 ? { _id: id } : { _id: id, _creator: req.user._id };
    let body;
    if (rol === 1) {
      body = _.pick(req.body, ["reply"]);
    } else if (rol === 0) {
      body = _.pick(req.body, ["comment", "rate"]);
      const wholecomment = await Comment.findById(id);
      if (parseInt(body.rate) !== wholecomment.rate) {
        await updatingPlateAvg(wholecomment._plate, parseInt(body.rate));
      }
    }
    const comment = await Comment.findOneAndUpdate(
      query,
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
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) return res.status(404).send();
    let query =
      req.user.rol === 1 ? { _id: id } : { _id: id, _creator: req.user._id };
    const comment = await Comment.findOneAndRemove(query);
    if (!comment) return res.status(404).send();
    // Update Plate rating
    const average = await Comment.aggregate([
      { $match: { _plate: comment._plate } },
      {
        $group: {
          _id: "$_plate",
          avg: { $avg: "$rate" }
        }
      }
    ]);
    if (!average[0] || average[0].lenght === 0) {
      await Plate.findOneAndUpdate(
        { _id: comment._plate },
        { $set: { averagerate: 1 } }
      );
    } else {
      await Plate.findOneAndUpdate(
        { _id: comment._plate },
        { $set: { averagerate: average[0].avg.toFixed(2) } }
      );
    }
    res.status(200).send(comment);
  } catch (e) {
    res.status(400).send(e);
  }
});

async function updatingPlateAvg(plateId, rate) {
  try {
    const plate = await Plate.findOne({ _id: plateId }, { averagerate: 1 });
    const avgrate = plate.averagerate !== 0 ? plate.averagerate : rate;
    const avg = ((avgrate + rate) / 2).toFixed(1);
    await Plate.findOneAndUpdate(
      { _id: plateId },
      { $set: { averagerate: avg } }
    );
  } catch (e) {
    return Promise.reject();
  }
}

module.exports = router;
