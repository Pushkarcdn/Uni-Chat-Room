import express from "express";
import http from "http";
import { Server } from "socket.io";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import Messages from "./models/messages.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;
const port = process.env.PORT;

try {
  await mongoose.connect(mongoURI);
  console.log("Connected to MongoDB");
} catch (error) {
  console.log(error);
}

const app = express();
const server = http.createServer(app);

const io = new Server(server);

const __dirname = dirname(fileURLToPath(import.meta.url));

app.set("view engine", "ejs");
app.use(express.static(join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/messages", async (req, res) => {
  const messages = await Messages.find({});

  res.status(200).send(messages);
});

io.on("connection", (socket) => {
  const userName = socket.handshake.query.userName;

  // console.log(userName, " connected");

  // socket.on("disconnect", () => {
  //     console.log("A user disconnected");
  // });

  socket.on("message", async (userID, userName, message) => {
    const currentTime = new Date();
    let hours = currentTime.getHours();
    let duration = "AM";
    if (hours > 12) {
      hours -= 12;
      duration = "PM";
    }
    let minutes = currentTime.getMinutes().toString().padStart(2, "0");
    let time = `${hours}:${minutes} ${duration}`;

    const newMessage = await Messages.create({
      userID: userID,
      userName: userName,
      message: message,
      createdAt: currentTime,
    });

    // console.log(userID, userName, message);

    io.emit("message", userID, newMessage._id, userName, message, time);
  });

  socket.on("delete", async (messageID) => {
    await Messages.findByIdAndDelete(messageID);

    io.emit("updated", "Message Deleted");
  });
});

server.listen(port, () => {
  console.log("server running at " + port);
});
