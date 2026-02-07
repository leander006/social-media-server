const express = require("express");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addMember,
  removeMember,
  deleteChat,
} = require("../controllers/chatController");
const passport = require("passport");
// const { setNotifications, getNotifications } = require('../controllers/notifyController');
const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

router.post("/:id", auth, accessChat);
router.get("/", auth, fetchChat);
router.post("/", auth, createGroupChat);
router.put("/rename/:id", auth, renameGroup);
router.put("/add/:id", auth, addMember);
router.put("/remove/:id", auth, removeMember);
router.delete("/delete/:id", auth, deleteChat);

module.exports = router;
