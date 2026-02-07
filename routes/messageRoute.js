const express = require("express");
const {
  sendMessage,
  allMessages,
  remove,
} = require("../controllers/messageController");
const passport = require("passport");
const router = express.Router();

const auth = passport.authenticate("jwt", { session: false });

router.post("/:chatId", auth, sendMessage);
router.get("/get/:chatId", auth, allMessages);
router.delete("/delete/:id", auth, remove);

module.exports = router;
