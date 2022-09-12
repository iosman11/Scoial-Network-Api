const router = require('express').Router();

const {
  getAllThoughts,
  getThoughtById,
  createThought,
  deleteThought,
  updateThought,
  createReaction,
  deleteReaction
} = require('../../controllers/thoughtController');

// just get all the thoughts. Get & create
router
.route('/')
 .get(getAllThoughts)
 .post(createThought)

// get a thought by its id. Update & delete
router
.route('/:id')
.get(getThoughtById)
.delete(deleteThought)
.put(updateThought)



// create a new reaction per thought using its id
router
.route('/:thoughtId/reactions')
.post(createReaction)

// delete a reaction to A THOUGHT using its ID
router
.route('/:thoughtId/reactions/:reactionId')
.delete(deleteReaction)

module.exports = router;