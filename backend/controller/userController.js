const asyncHandler = require("express-async-handler");
const User = require("../models/userSchema");
const generateToken = require("../config/generateToken");
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body.form;
  // console.log(name, email, password, pic, "09876543567890");
  // console.log(req.body, "------------------");
  if ((!name, !email, !password)) {
    res.status(400);
    throw new Error("Please Enter all the Fields");
  }

  const userexists = await User.findOne({ email });

  if (userexists) {
    res.status(400).json({ message: "User Already exists" });
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("User Registeration Failed");
  }
});

const login = asyncHandler(async (req, res) => {
  console.log(req.body,"dfgh"); // Log the entire req.body object to see its structure

  const { email, password } = req.body.form;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({
      message: "User Login failed",
    });
  }
});

// api/user/?search=praveen
const allUsers = asyncHandler(async (req, res) => {
  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keywords).find({ _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = {
  registerUser,
  login,
  allUsers,
};
