const express = require("express");
const { like, bookmark } = require("../controllers/mediaController");
const {
  createPost,
  getPost,
  particularPost,
  deletePost,
  followingPost,
  likePost,
  bookmarkPost,
  uploadPost,
} = require("../controllers/postController");
const passport = require("passport");

// const { uploadPost } = require('../middleware/postPicUpload');
const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

router.post("/", auth, createPost);
router.post("/postUpload/postImg", auth, uploadPost);
router.get("/", auth, getPost);
router.get("/:id", auth, particularPost);
router.put("/bookmarkPost/:id", auth, bookmark);
router.delete("/delete/:id", auth, deletePost);
router.get("/following/Post", auth, followingPost);
router.get("/liked/Post", auth, likePost);
router.get("/bookmark/Post", auth, bookmarkPost);

module.exports = router;
