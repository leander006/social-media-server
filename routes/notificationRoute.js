const express = require("express");

const {
  setNotifications,
  getNotifications,
  removeNotifications,
  getNotificationsById,
  getByMessageId,
} = require("../controllers/notifyController");
const passport = require("passport");
const router = express.Router();
const auth = passport.authenticate("jwt", { session: false });

router.post("/:id", auth, setNotifications);
router.get("/", auth, getNotifications);
router.get("/:id", getNotificationsById);
router.delete("/:id", auth, removeNotifications);

module.exports = router;
