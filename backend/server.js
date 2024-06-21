const express = require("express");
const connectDB = require("./config/db");
const colors = require("colors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
PORT = process.env.PORT;

// app.get("/", (req, res) => {
//   res.send("Api is ready");
// });

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Deployment>>>>>>>>>>>>>

const __dirName1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirName1,"/frontend/build")))

    app.get('*',(req,res)=>{
      res.sendFile(path.resolve(__dirName1,"frontend","build","index.html"))
    })
} else {
  app.get("/", (req, res) => {
    res.send("Api is ready");
  });
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>Deployment>>>>>>>>>>>>>
app.use(notFound);
app.use(errorHandler);
const server = app.listen(PORT, () => {
  console.log(`chat app started at ${PORT}`.yellow.bold);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    const chat = newMessageReceived.chat;
    if (!chat.users) return console.log("chat user not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return;

      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
