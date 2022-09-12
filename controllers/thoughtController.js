const { User, Thought, Types } = require("../models");

const thoughtController = {
  getAllThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  getThoughtById(req, res) {
    Thought.findOne({ _id: req.params.id })
      .select("-__v")
      .then((thoughts) => {
        if (!thoughts) {
          return res.status(404).json({ message: "No thought was found with this ID" });
        }
        res.json(thoughts);
      })
      .catch((err) => {
        console.log(`ERROR: Failed to get one thought | ${err.message}`);
        res.status(500).json(err);
      });
  },
  createThought(req, res) {
    Thought.create(req.body)
      .then((thoughts) =>
        res.json({ message: "Created a new thought!", thoughts })
      )
      .catch((err) => {
        console.log(`ERROR: Failed to create a new thought! | ${err.message}`);
        res
          .status(500)
          .json({ message: "Failed to create a new thought!", err });
      });
  },

  deleteThought(req, res) {
    Thought.findOneAndDelete({ _id: req.params.id })
      .then((thoughts) => {
        if (!thoughts) {
          return res
            .status(404)
            .json({ message: "No thought was found with this ID" });
        }
        res.json({ message: "Thought deleted", thoughts });
      })
      .catch((err) => {
        console.log(`ERROR: Failed to delete thought! | ${err.message}`);
        res.status(500).json({ message: "Failed to delete thought!", err });
      });
  },
  updateThought(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.id },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thoughts) => {
        if (!thoughts) {
          return res
            .status(404)
            .json({ message: "No thought was found with this ID" });
        }
        res.json({ message: "Thought updated", thoughts });
      })
      .catch((err) => {
        console.log(`ERROR: Failed to update thought! | ${err.message}`);
        res.status(500).json({ message: "Failed to update thought!", err });
      });
  },

  createReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((newReaction) => {
        if (!newReaction) {
          res.status(404).json({ message: "No thought found with that ID!" });
          return;
        }
        res.json({ message: "Reacted to thought!", newReaction });
      })
      .catch((err) => {
        console.log(`ERROR: Failed to react to thought! | ${err.message}`);
        res
          .status(500)
          .json({ message: "Failed to react to thought!", err });
      });
  },

  deleteReaction(req, res) {
    Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { new: true }
    )
      .then((reactionDeleted) => {
        res.json({message: "Reaction deleted!", reactionDeleted});
      })
      .catch((err) => {
        console.log(`ERROR: Failed to delete reaction! | ${err.message}`);
        res
          .status(500)
          .json({ message: "Failed to delete reaction!", err });
      });
  },

};

module.exports = thoughtController;