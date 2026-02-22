const asyncHandler = require("express-async-handler");

const Notification = require("../model/Notification");

const setNotifications = asyncHandler(async (req, res) => {
  const ModelType = req.body.type;
  const ModelId = req.params.id;
  const user = req.user._id;
  try {
    const notify = await Notification.create({
      onModel: ModelType,
      notify: ModelId,
      user: user,
    });
    res.status(201).json(notify);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const removeNotifications = asyncHandler(async (req, res) => {
  try {
    const data = await Notification.findByIdAndDelete(req.params.id);
    // console.log("delete ", data);
    res.status(200).json("deleted notifications");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getNotifications = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.user._id,
    }).populate("sender");

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const getNotificationsById = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.findOne({
      user: req.params.id,
    }).populate("user");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const getByMessageId = asyncHandler(async (req, res) => {
  try {
    const notifications = await Notification.findOne({
      notify: req.params.id,
    }).populate("notify");
    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = {
  setNotifications,
  getNotifications,
  removeNotifications,
  getNotificationsById,
  getByMessageId,
};
