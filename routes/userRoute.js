const express = require("express");
const { follow } = require("../controllers/mediaController");
// const { setNotifications, getNotifications, removeNotifications } = require('../controllers/notifyController');
const router = express.Router();
const {
  allUser,
  particularUser,
  groupUser,
  updateUser,
  loginUser,
  userById,
  suggestedUser,
  uploadPic,
  friendSearch,
  token,
  followingUser,
  followerUser,
  me
} = require("../controllers/userController");
const passport = require("passport");

// const { upload } = require('../middleware/profilePicUpload');
const auth = passport.authenticate("jwt", { session: false });

router.get("/", auth, allUser);
router.get("/me", auth, me);
router.get("/oneUser", auth, particularUser);
router.get("/", auth, groupUser);
router.get("/:id", auth, userById);
router.get("/freind/search", auth, friendSearch);
router.get("/suggesteduser/user", auth, suggestedUser);
router.post("/upload", auth, uploadPic);
router.put("/update/:id", auth, updateUser);
router.put("/addFollower/:id", auth, follow);
router.get("/loginUser/user", auth, loginUser);
router.get("/getUser/id/me", me);
router.get("/followers/getAll", auth, followerUser);
router.get("/following/getAll", auth, followingUser);
router.get("/:id/verify/:token", token);

module.exports = router;
