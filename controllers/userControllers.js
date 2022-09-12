const { User, Thought } = require("../models");

const userController = {
  getAllUsers(req, res) {
    User.find()
      .select("-__v")
      .then((allUsers) => {
        res.json(allUsers);
      })
      .catch((err) => {
        console.log(`ERROR: Failed to get all users | ${err.message}`);
        res.status(500).json(err);
      });
  },

  getOneUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .populate("friends")
      .populate("thoughts")
      .then((oneUser) => {
        if (!oneUser) {
          return res
            .status(404)
            .json({ message: "No user was found with this ID" });
        }
        res.json({ message: `User has been found` });
      })
      .catch((err) => {
        console.log(`ERROR: Failed to get one user | ${err.message}`);
        res.status(500).json({ message: "Failed to get one user", err });
      });
  },

  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json({ message: "User has been created", user }))
      .catch((err) =>
        res.status(500).json({ message: "Failed to create user", err })
      );
  },

  deleteOneUser(req, res) {
    User.findOneAndDelete({ _id: req.params.userId })
      .select("-__v")
      .then((deleteUser) => {
        if (!deleteUser) {
          return res
            .status(404)
            .json({ message: "No user was found with this ID" });
        }
        res.json({ message: `User has been deleted` });
      })
      .catch((err) => {
        console.log(`ERROR: Failed to delete user | ${err.message}`);
        res.status(500).json({ message: "Failed to delete user", err });
      });
  },

  updateOneUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .select("-_v")
      .then((updateUser) => {
        if (!updateUser) {
          return res
            .status(404)
            .json({ message: "No user found with this ID" });
        }
        res.json({ message: "User has been updated" });
      })
      .catch((err) => {
        console.log(`ERROR: Failed to update user | ${err.message}`);
        res.status(500).json({ message: "Failed to update user", err });
      });
  },

  newFriend(req, res) {
    User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
    )
      .select("-__v")
      .then((friend) => {
        if (!friend) {
          res
            .status(404)
            .json({ message: "No such friend exists with that ID!" });
          return;
        }

        res.json({ message: "Friend has been added!", friend });
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to add new friend!", err });
      });
  },

  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    )
    .then((friendDeleted) => {
        if (!friendDeleted) {
          res
            .status(404)
            .json({ message: "No such friend exists with that ID!" });
          return;
        }

        res.json({ message: "Friend has been deleted!", friendDeleted });
      })
      .catch((err) => {
        res.status(500).json({ message: "Failed to delete friend!", err });
      });
  },
};

module.exports = userController;