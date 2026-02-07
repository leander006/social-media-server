const express = require("express");

const {
  createComment,
  getComment,
  getParticularComment,
  deleteComment,
} = require("../controllers/commentController");
const passport = require("passport");

const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

router.post("/:id", auth, createComment);
router.get("/allComment/:id", auth, getComment);
router.get("/:id", auth, getParticularComment);

router.delete("/delete/:id", auth, deleteComment);

module.exports = router;
