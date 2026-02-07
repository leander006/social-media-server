const express = require("express");
const { like } = require("../controllers/likecontroller");
const passport = require("passport");
// const { setNotifications, getNotifications } = require('../controllers/notifyController');
const router = express.Router();

const auth = passport.authenticate("jwt", { session: false });


router.post("/:id", auth, like);

module.exports = router;
