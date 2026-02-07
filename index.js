const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios").default;
const chatRoute = require("./routes/chatRoute");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const messageRoute = require("./routes/messageRoute");
const postRoute = require("./routes/postRoute");
const commentRoute = require("./routes/commentRoute");
const googleRoute = require("./routes/google-auth");
const notifcationRoute = require("./routes/notificationRoute");
const likeRoute = require("./routes/likeRoute");
const { passportAuth } = require("./middleware/passportAuth");
const { createServer } = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const {
  MONGO_URI,
  URL,
  PORT,
  SERVER_URL,
  KEY,
} = require("./config/serverConfig");
const session = require("cookie-session");
const users = new Map();
const app = express();
const httpServer = createServer(app);
const passport = require("passport");
const Notification = require("./model/Notification");

app.set("trust proxy", 1);
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to mongodb"))
  .catch((err) => {
    console.log("invalid", err);
  });

app.use(
  cors({
    origin: [URL, "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

app.use(
  session({
    secret: `${KEY}`,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cookieParser());
app.use(passport.initialize());
passportAuth(passport);

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

app.use("/api/auth", authRoute);
app.use("/api/auth/google", googleRoute);
app.use("/api/user", userRoute);
app.use("/api/like", likeRoute);
app.use("/api/chat", chatRoute);
app.use("/api/notification", notifcationRoute);
app.use("/api/message", messageRoute);

app.use("/api/post", postRoute);

app.use("/api/comment", commentRoute);

app.get("/", (req, res) => {
  res.send("Welcome to server of Talkology");
});

httpServer.listen(PORT, async () => {
  console.log(`Backend runnig on port ${PORT}`);
});
//Socket //

const io = new Server(httpServer, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  socket.on("login", function (data) {
    users.set(data.userId, socket.id);
    console.log("a user " + data.userId + " connected", users.size);
    // saving userId to object with socket ID
  });
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });
  socket.on("join room", (room) => {
    socket.join(room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("send_message", (messageRecieved) => {
    var chat = messageRecieved.chat;
    // console.log("message", messageRecieved);
    if (!chat.users) return console.log("Users are undefined");
    chat.users.forEach(async (user) => {
      if (user._id == messageRecieved.sender._id) return;
      // console.log(users.has(user._id));
      if (!users.has(user._id)) {
        await Notification.create({
          onModel: "Message",
          notify: messageRecieved._id,
          user: user._id,
          sender: messageRecieved.sender._id,
          content: messageRecieved.content,
        });
      }
      socket.in(user._id).emit("message recieved", messageRecieved);
    });
  });

  socket.on("new message delete", (message) => {
    var chat = message.chat;
    if (!chat.users) return console.log("Users are undefined");
    chat.users.forEach(async (user) => {
      if (user._id == message.sender._id) return;
      if (!users.has(user._id)) {
        const { data } = await axios.get(
          `${SERVER_URL}/api/notification/${user._id}`
        );
        if (data) {
          await Notification.findByIdAndDelete(data._id);
          // console.log("deleted");
        } else {
          console.log("no notification created for this user", user._id);
        }
      }

      socket.in(user._id).emit("message deleted", message);
    });
  });

  socket.on("removeUser", function (data) {
    users.delete(data.userId);
    console.log("a user " + data.userId + " disconnected", users.size);
  });
});

// end //
