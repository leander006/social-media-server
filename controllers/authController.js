const User = require("../model/User");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Token = require("../model/Token");
const { BASE_URL, SESSION } = require("../config/serverConfig");
const { generateAccessToken, generateRefreshToken } = require("../config/authToken");

// register //

const registration = asyncHandler(async (req, res) => {
  const { username, email, password, name } = req.body;

  if (!username || !email || !password || !name) {
    return res.status(401).json({ error: "Please enter all  field" });
  }

  const userExist = await User.findOne({ username: username });
  const emailExist = await User.findOne({ email: email });

  try {
    if (userExist) {
      return res.status(400).send({ message: "Username Exists" });
    } else if (emailExist) {
      return res.status(400).send({ message: "Email Exists" });
    }

    const hashedPassword = await bcrypt.hash(
      req.body.password,
      parseInt(SESSION)
    );
    const newUser = new User({
      username: username,
      email: email,
      password: hashedPassword,
      name: name,
      profile: {
        public_id: "mp9mhqngt4ulnnkb6ssu",
        url: "https://res.cloudinary.com/dj-sanghvi-college/image/upload/v1697996657/noProfile_jjyqlm.jpg",
      },
    });

    const user = await newUser.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${BASE_URL}/users/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify email", url);
    console.log("sending emial....");
    res.status(200).send({ message: "An email send for verification" });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// login //

const login = asyncHandler(async (req, res) => {
  const { username } = req.body;
  console.log("username ", username);
  try {
    if (!username || !req.body.password) {
      return res.status(402).send({ message: "Please all field" });
    }
    const user = await User.findOne({ username });
    // console.log("user ", user);
    if (!user) {
      return res.status(400).send({ message: "User does not exits!" });
    }
    const validate = bcrypt.compareSync(req.body.password, user.password);
    //console.log("validate ", validate);
    if (!validate) {
      return res.status(402).send({ message: "Invalid password" });
    }
    //Send confirmation email//
    let tokens = await Token.findOne({ userId: user._id });
    if (user.isVerified === "false") {
      if (tokens) {
        return res
          .status(401)
          .send({ message: "Email not verified check your gmail!" });
      } else {
        const token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${BASE_URL}users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verify email", url);
        return res
          .status(402)
          .send({ message: "Email send check your gmail!" });
      }
    }
    if (user.isVerified === "true") {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);

      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 15 * 60 * 1000,
      });

      res.cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
      res.cookie("csrf_token", crypto.randomUUID(), {
        secure: true,
        sameSite: "None",
      }).status(200).json(user);
    }

  } catch (error) {
    res.status(501).send({ message: error.message });
    console.log(error);
  }
});

module.exports = {
  registration,
  login,
};
