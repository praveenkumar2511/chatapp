const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userSchema.js");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  console.log(userId, "dfghjk");
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroup = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(401).send({
      message: "Please fill all the details",
    });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than a two(2) members need to a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });

    const fetchGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fetchGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameTheGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updateChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateChat) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(updateChat);
  }
});

const removeGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removetogroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removetogroup) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(removetogroup);
  }
});
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const addtogroup = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!addtogroup) {
    res.status(400);
    throw new Error("Chat not found");
  } else {
    res.json(addtogroup);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroup,
  renameTheGroup,
  addToGroup,
  removeGroup,
};
